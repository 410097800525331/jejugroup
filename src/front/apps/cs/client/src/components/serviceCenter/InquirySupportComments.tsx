import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/contexts/AuthContext";

type SupportActor = {
  id?: string;
  role?: string;
  roles?: string[];
  isLocalAdmin?: boolean;
};

type CommentItem = {
  id: number;
  authorName: string;
  authorRole: string;
  content: string;
  internal: boolean;
  createdAt: string;
  updatedAt: string;
  canEdit?: boolean;
  canDelete?: boolean;
};

type CommentApiItem = {
  id?: number | string;
  authorUserId?: string;
  authorRole?: string;
  authorName?: string;
  content?: string;
  body?: string;
  isInternal?: boolean;
  internal?: boolean;
  createdAt?: string;
  updatedAt?: string;
  canEdit?: boolean;
  canDelete?: boolean;
  [key: string]: unknown;
};

interface Props {
  ticketId: number | string;
  ticketOwnerId?: string | null;
  ticketTitle?: string;
}

type Draft = {
  content: string;
  internal: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);

const extractMessage = (payload: unknown, fallback: string) => {
  if (isRecord(payload)) {
    if (typeof payload.message === "string" && payload.message.trim()) return payload.message;
    if (typeof payload.error === "string" && payload.error.trim()) return payload.error;
  }

  return fallback;
};

const extractArrayPayload = <T,>(payload: unknown, keys: string[]): T[] => {
  if (Array.isArray(payload)) return payload as T[];
  if (!isRecord(payload)) return [];

  for (const key of keys) {
    const value = payload[key];
    if (Array.isArray(value)) return value as T[];
    if (isRecord(value) && Array.isArray(value.items)) return value.items as T[];
    if (isRecord(value) && Array.isArray(value.data)) return value.data as T[];
  }

  if (Array.isArray(payload.data)) return payload.data as T[];
  if (isRecord(payload.data) && Array.isArray(payload.data.items)) return payload.data.items as T[];
  return [];
};

const requestJson = async <T,>(url: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const raw = response.status === 204 ? "" : await response.text();
  let payload: unknown = null;
  if (raw) {
    try {
      payload = JSON.parse(raw) as unknown;
    } catch {
      payload = raw;
    }
  }

  if (!response.ok) {
    throw new Error(extractMessage(payload, response.status === 403 ? "소유자 또는 관리자만 댓글을 관리할 수 있습니다." : "요청을 처리하지 못했습니다."));
  }

  return payload as T;
};

const normalizeDate = (value?: string) => {
  if (!value) return "날짜 없음";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(parsed)
    .replace(/\.\s/g, ".")
    .replace(/\.$/, "");
};

const isAdminUser = (user: SupportActor | null) => {
  const roles = user?.roles ?? [];
  return Boolean(user?.isLocalAdmin || user?.role?.toUpperCase() === "ADMIN" || roles.some((role) => role.toUpperCase() === "ADMIN"));
};

const isOwnerOrAdmin = (user: SupportActor | null, ticketOwnerId?: string | null) =>
  Boolean(user?.id && ticketOwnerId && user.id === ticketOwnerId) || isAdminUser(user);

const normalizeComment = (item: CommentApiItem): CommentItem => ({
  id: Number(item.id ?? Date.now()),
  authorName: String(item.authorName ?? item.authorUserId ?? "작성자"),
  authorRole: String(item.authorRole ?? ""),
  content: String(item.content ?? item.body ?? ""),
  internal: Boolean(item.isInternal ?? item.internal),
  createdAt: String(item.createdAt ?? ""),
  updatedAt: String(item.updatedAt ?? item.createdAt ?? ""),
  canEdit: typeof item.canEdit === "boolean" ? item.canEdit : undefined,
  canDelete: typeof item.canDelete === "boolean" ? item.canDelete : undefined,
});

export default function InquirySupportComments({ ticketId, ticketOwnerId, ticketTitle }: Props) {
  const { user } = useAuth();
  const canManage = isOwnerOrAdmin(user, ticketOwnerId);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>({ content: "", internal: false });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<Draft>({ content: "", internal: false });
  const [busyId, setBusyId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const payload = await requestJson<unknown>(`/api/customer-center/support/tickets/${encodeURIComponent(String(ticketId))}/comments`);
      setComments(extractArrayPayload<CommentApiItem>(payload, ["comments", "items", "data"]).map(normalizeComment));
    } catch (error) {
      setComments([]);
      setLoadError(error instanceof Error ? error.message : "댓글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDraft({ content: "", internal: false });
    setEditingId(null);
    setEditingDraft({ content: "", internal: false });
    setSubmitError(null);
    void loadComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const canEditItem = (item: CommentItem) =>
    (typeof item.canEdit === "boolean" ? item.canEdit : undefined) ?? (typeof item.canDelete === "boolean" ? item.canDelete : undefined) ?? canManage;

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) {
      setSubmitError("소유자 또는 관리자만 댓글을 등록할 수 있습니다.");
      return;
    }

    const content = draft.content.trim();
    if (!content) {
      setSubmitError("댓글 내용을 입력해 주세요.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await requestJson<unknown>(`/api/customer-center/support/tickets/${encodeURIComponent(String(ticketId))}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, isInternal: draft.internal }),
      });
      setDraft({ content: "", internal: false });
      await loadComments();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "댓글을 저장하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const beginEdit = (item: CommentItem) => {
    setEditingId(item.id);
    setEditingDraft({ content: item.content, internal: item.internal });
    setSubmitError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDraft({ content: "", internal: false });
    setSubmitError(null);
  };

  const handleUpdate = async (commentId: number) => {
    if (!canManage) {
      setSubmitError("소유자 또는 관리자만 댓글을 수정할 수 있습니다.");
      return;
    }

    const content = editingDraft.content.trim();
    if (!content) {
      setSubmitError("댓글 내용을 입력해 주세요.");
      return;
    }

    setBusyId(commentId);
    setSubmitError(null);

    try {
      await requestJson<unknown>(
        `/api/customer-center/support/tickets/${encodeURIComponent(String(ticketId))}/comments/${encodeURIComponent(String(commentId))}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content, isInternal: editingDraft.internal }),
        },
      );
      cancelEdit();
      await loadComments();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "댓글을 수정하지 못했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!canManage) {
      setSubmitError("소유자 또는 관리자만 댓글을 삭제할 수 있습니다.");
      return;
    }

    if (!window.confirm("이 댓글을 삭제하시겠습니까?")) return;

    setBusyId(commentId);
    setSubmitError(null);

    try {
      await requestJson<unknown>(
        `/api/customer-center/support/tickets/${encodeURIComponent(String(ticketId))}/comments/${encodeURIComponent(String(commentId))}`,
        { method: "DELETE" },
      );
      if (editingId === commentId) cancelEdit();
      await loadComments();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "댓글을 삭제하지 못했습니다.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-orange-500">댓글</p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">댓글 관리</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{ticketTitle ? `“${ticketTitle}”` : "선택한 문의"}의 소통 기록입니다.</p>
        </div>
        <div className="rounded-full bg-orange-50 px-3 py-1 text-xs font-black text-orange-600">{comments.length}개</div>
      </div>

      <div
        className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
          canManage ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-800"
        }`}
      >
        {canManage
          ? "소유자 또는 관리자 권한이 확인되었습니다. 댓글을 바로 등록, 수정, 삭제할 수 있습니다."
          : "소유자 또는 관리자만 댓글을 관리할 수 있습니다."}
      </div>

      <form onSubmit={handleCreate} className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
        <label className="mb-3 block text-sm font-bold text-slate-700" htmlFor={`support-comment-${ticketId}`}>
          새 댓글 작성
        </label>
        <textarea
          id={`support-comment-${ticketId}`}
          value={draft.content}
          onChange={(event) => setDraft((current) => ({ ...current, content: event.target.value }))}
          placeholder="댓글을 입력해 주세요. binary 업로드는 없고 텍스트만 저장합니다."
          className="min-h-[120px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100"
          disabled={!canManage || submitting}
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={draft.internal}
              onChange={(event) => setDraft((current) => ({ ...current, internal: event.target.checked }))}
              disabled={!canManage || submitting}
              className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-200 disabled:cursor-not-allowed"
            />
            내부 댓글로 저장
          </label>
          <button
            type="submit"
            disabled={!canManage || submitting}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Plus size={16} />
            {submitting ? "저장 중" : "댓글 등록"}
          </button>
        </div>
        {submitError ? <p className="mt-3 text-sm font-bold text-red-600">{submitError}</p> : null}
      </form>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm font-medium text-slate-400">댓글을 불러오는 중입니다.</div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{loadError}</div>
        ) : comments.length > 0 ? (
          comments.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <article key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-black text-slate-900">{item.authorName}</p>
                      {item.authorRole ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-500">{item.authorRole}</span> : null}
                      {item.internal ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-black text-amber-700">내부</span> : null}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{normalizeDate(item.updatedAt || item.createdAt)}</p>
                  </div>

                  {canEditItem(item) ? (
                    <div className="flex flex-shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => beginEdit(item)}
                        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:border-orange-200 hover:text-orange-600"
                      >
                        <Pencil size={14} />
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDelete(item.id)}
                        disabled={busyId === item.id}
                        className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        삭제
                      </button>
                    </div>
                  ) : null}
                </div>

                {isEditing ? (
                  <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                    <textarea
                      value={editingDraft.content}
                      onChange={(event) => setEditingDraft((current) => ({ ...current, content: event.target.value }))}
                      className="min-h-[120px] w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                    />
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600">
                        <input
                          type="checkbox"
                          checked={editingDraft.internal}
                          onChange={(event) => setEditingDraft((current) => ({ ...current, internal: event.target.checked }))}
                          className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-200"
                        />
                        내부 댓글로 표시
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-slate-300"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleUpdate(item.id)}
                          disabled={busyId === item.id}
                          className="rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                          저장
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-700">{item.content || "내용이 없습니다."}</p>
                )}
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm font-medium text-slate-400">
            아직 댓글이 없습니다. 첫 메시지를 남겨 주세요.
          </div>
        )}
      </div>
    </section>
  );
}
