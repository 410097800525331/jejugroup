import { Plus, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { useAuth } from "@/contexts/AuthContext";

type SupportActor = {
  id?: string;
  role?: string;
  roles?: string[];
  isLocalAdmin?: boolean;
};

type AttachmentItem = {
  id: number;
  uploadedByUserId: string;
  originalFilename: string;
  storedFilename: string;
  storageKey: string;
  contentType: string;
  fileSizeBytes: number;
  createdAt: string;
  updatedAt: string;
  canEdit?: boolean;
  canDelete?: boolean;
};

type AttachmentApiItem = {
  id?: number | string;
  uploadedByUserId?: string;
  originalFilename?: string;
  storedFilename?: string;
  storageKey?: string;
  contentType?: string;
  fileSizeBytes?: number | string;
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
  ticketStatus?: "pending" | "completed" | string;
}

type Draft = {
  originalFilename: string;
  storedFilename: string;
  storageKey: string;
  contentType: string;
  fileSizeBytes: string;
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
    throw new Error(extractMessage(payload, response.status === 403 ? "소유자 또는 관리자만 첨부 메타데이터를 관리할 수 있어." : "요청을 처리하지 못했어."));
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

const normalizeBytes = (value?: number) => {
  if (!Number.isFinite(value ?? NaN) || (value ?? 0) < 0) return "크기 정보 없음";
  const size = value ?? 0;
  if (size === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(units.length - 1, Math.floor(Math.log(size) / Math.log(1024)));
  const scaled = size / 1024 ** index;
  return `${scaled >= 10 || index === 0 ? Math.round(scaled) : scaled.toFixed(1)} ${units[index]}`;
};

const isAdminUser = (user: SupportActor | null) => {
  const roles = user?.roles ?? [];
  return Boolean(user?.isLocalAdmin || user?.role?.toUpperCase() === "ADMIN" || roles.some((role) => role.toUpperCase() === "ADMIN"));
};

const isOwnerOrAdmin = (user: SupportActor | null, ticketOwnerId?: string | null) =>
  Boolean(user?.id && ticketOwnerId && user.id === ticketOwnerId) || isAdminUser(user);

const normalizeAttachment = (item: AttachmentApiItem): AttachmentItem => ({
  id: Number(item.id ?? Date.now()),
  uploadedByUserId: String(item.uploadedByUserId ?? ""),
  originalFilename: String(item.originalFilename ?? ""),
  storedFilename: String(item.storedFilename ?? ""),
  storageKey: String(item.storageKey ?? ""),
  contentType: String(item.contentType ?? ""),
  fileSizeBytes: Number(item.fileSizeBytes ?? 0),
  createdAt: String(item.createdAt ?? ""),
  updatedAt: String(item.updatedAt ?? item.createdAt ?? ""),
  canEdit: typeof item.canEdit === "boolean" ? item.canEdit : undefined,
  canDelete: typeof item.canDelete === "boolean" ? item.canDelete : undefined,
});

const emptyDraft = (): Draft => ({
  originalFilename: "",
  storedFilename: "",
  storageKey: "",
  contentType: "",
  fileSizeBytes: "",
});

const COMPLETED_STATUS_KEYWORDS = ["answered", "resolved", "closed", "completed", "done", "complete", "close"];

export default function InquirySupportAttachments({ ticketId, ticketOwnerId, ticketTitle, ticketStatus }: Props) {
  const { user } = useAuth();
  const canManage = isOwnerOrAdmin(user, ticketOwnerId);
  const isCompletedStatus = COMPLETED_STATUS_KEYWORDS.some((keyword) => String(ticketStatus ?? "").toLowerCase().includes(keyword));
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingDraft, setEditingDraft] = useState<Draft>(emptyDraft);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadAttachments = async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const payload = await requestJson<unknown>(`/api/customer-center/support/tickets/${encodeURIComponent(String(ticketId))}/attachments`);
      setAttachments(extractArrayPayload<AttachmentApiItem>(payload, ["attachments", "items", "data"]).map(normalizeAttachment));
    } catch (error) {
      setAttachments([]);
      setLoadError(error instanceof Error ? error.message : "첨부 메타데이터를 불러오지 못했어.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setDraft(emptyDraft());
    setEditingId(null);
    setEditingDraft(emptyDraft());
    setSubmitError(null);
    void loadAttachments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticketId]);

  const canEditItem = (item: AttachmentItem) =>
    (typeof item.canEdit === "boolean" ? item.canEdit : undefined) ?? (typeof item.canDelete === "boolean" ? item.canDelete : undefined) ?? canManage;

  const createPayload = (source: Draft) => {
    const fileSizeBytes = Number(source.fileSizeBytes);
    return {
      originalFilename: source.originalFilename.trim(),
      storedFilename: source.storedFilename.trim(),
      storageKey: source.storageKey.trim(),
      contentType: source.contentType.trim(),
      fileSizeBytes: Number.isFinite(fileSizeBytes) && fileSizeBytes >= 0 ? fileSizeBytes : 0,
    };
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) {
      setSubmitError("소유자 또는 관리자만 첨부 메타데이터를 등록할 수 있어.");
      return;
    }

    const payload = createPayload(draft);
    if (!payload.originalFilename || !payload.storedFilename || !payload.storageKey || !payload.contentType) {
      setSubmitError("파일명, 저장명, 저장키, content type을 모두 입력해줘.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await requestJson<unknown>(`/api/customer-center/support/tickets/${encodeURIComponent(String(ticketId))}/attachments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setDraft(emptyDraft());
      await loadAttachments();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "첨부 메타데이터를 저장하지 못했어.");
    } finally {
      setSubmitting(false);
    }
  };

  const beginEdit = (item: AttachmentItem) => {
    setEditingId(item.id);
    setEditingDraft({
      originalFilename: item.originalFilename,
      storedFilename: item.storedFilename,
      storageKey: item.storageKey,
      contentType: item.contentType,
      fileSizeBytes: String(item.fileSizeBytes),
    });
    setSubmitError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingDraft(emptyDraft());
    setSubmitError(null);
  };

  const handleUpdate = async (attachmentId: number) => {
    if (!canManage) {
      setSubmitError("소유자 또는 관리자만 첨부 메타데이터를 수정할 수 있어.");
      return;
    }

    const payload = createPayload(editingDraft);
    if (!payload.originalFilename || !payload.storedFilename || !payload.storageKey || !payload.contentType) {
      setSubmitError("파일명, 저장명, 저장키, content type을 모두 입력해줘.");
      return;
    }

    setBusyId(attachmentId);
    setSubmitError(null);

    try {
      await requestJson<unknown>(
        `/api/customer-center/support/tickets/${encodeURIComponent(String(ticketId))}/attachments/${encodeURIComponent(String(attachmentId))}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      cancelEdit();
      await loadAttachments();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "첨부 메타데이터를 수정하지 못했어.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (attachmentId: number) => {
    if (!canManage) {
      setSubmitError("소유자 또는 관리자만 첨부 메타데이터를 삭제할 수 있어.");
      return;
    }

    if (!window.confirm("이 첨부 메타데이터를 삭제할까?")) return;

    setBusyId(attachmentId);
    setSubmitError(null);

    try {
      await requestJson<unknown>(
        `/api/customer-center/support/tickets/${encodeURIComponent(String(ticketId))}/attachments/${encodeURIComponent(String(attachmentId))}`,
        { method: "DELETE" },
      );
      if (editingId === attachmentId) cancelEdit();
      await loadAttachments();
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "첨부 메타데이터를 삭제하지 못했어.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="rounded-3xl border border-orange-100 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-orange-500">첨부</p>
          <h3 className="mt-1 text-lg font-extrabold text-slate-900">attachments metadata</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{ticketTitle ? `“${ticketTitle}”` : "선택한 문의"}의 첨부 메타데이터만 관리해.</p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{attachments.length}개</div>
      </div>

      <div
        className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
          canManage ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-amber-100 bg-amber-50 text-amber-800"
        }`}
      >
        {canManage
          ? "소유자 또는 관리자 권한이 확인돼. 첨부 메타데이터를 바로 등록, 수정, 삭제할 수 있어."
          : "소유자 또는 관리자만 첨부 메타데이터를 관리할 수 있어."}
      </div>
      <p className="mt-3 text-xs font-semibold leading-5 text-slate-400">
        {isCompletedStatus
          ? "처리 완료 상태여도 메타데이터 관리는 가능해."
          : "binary 업로드/다운로드는 제외하고 메타데이터만 다뤄."}
      </p>

      <form onSubmit={handleCreate} className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
        <label className="mb-3 block text-sm font-bold text-slate-700" htmlFor={`support-attachment-${ticketId}`}>
          새 첨부 메타데이터 등록
        </label>
        <div className="grid gap-3 md:grid-cols-2">
          <input
            id={`support-attachment-${ticketId}`}
            value={draft.originalFilename}
            onChange={(event) => setDraft((current) => ({ ...current, originalFilename: event.target.value }))}
            placeholder="original filename"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            disabled={!canManage || submitting}
          />
          <input
            value={draft.storedFilename}
            onChange={(event) => setDraft((current) => ({ ...current, storedFilename: event.target.value }))}
            placeholder="stored filename"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            disabled={!canManage || submitting}
          />
          <input
            value={draft.storageKey}
            onChange={(event) => setDraft((current) => ({ ...current, storageKey: event.target.value }))}
            placeholder="storage key"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100 md:col-span-2"
            disabled={!canManage || submitting}
          />
          <input
            value={draft.contentType}
            onChange={(event) => setDraft((current) => ({ ...current, contentType: event.target.value }))}
            placeholder="content type"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            disabled={!canManage || submitting}
          />
          <input
            type="number"
            min={0}
            step={1}
            value={draft.fileSizeBytes}
            onChange={(event) => setDraft((current) => ({ ...current, fileSizeBytes: event.target.value }))}
            placeholder="file size bytes"
            className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            disabled={!canManage || submitting}
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2">
          <button
            type="submit"
            disabled={!canManage || submitting}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-black text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <Plus size={16} />
            {submitting ? "저장 중" : "메타데이터 등록"}
          </button>
        </div>
        {submitError ? <p className="mt-3 text-sm font-bold text-red-600">{submitError}</p> : null}
      </form>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm font-medium text-slate-400">
            첨부 메타데이터를 불러오는 중이야.
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{loadError}</div>
        ) : attachments.length > 0 ? (
          attachments.map((item) => {
            const isEditing = editingId === item.id;

            return (
              <article key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-black text-slate-900">{item.originalFilename || "파일명 없음"}</p>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-black text-slate-500">
                        {item.contentType || "content type 없음"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {normalizeBytes(item.fileSizeBytes)} · {normalizeDate(item.updatedAt || item.createdAt)}
                    </p>
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

                <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 px-3 py-2">
                    <dt className="text-xs font-bold text-slate-400">stored filename</dt>
                    <dd className="mt-1 font-semibold text-slate-700">{item.storedFilename || "정보 없음"}</dd>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2">
                    <dt className="text-xs font-bold text-slate-400">storage key</dt>
                    <dd className="mt-1 break-all font-semibold text-slate-700">{item.storageKey || "정보 없음"}</dd>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2">
                    <dt className="text-xs font-bold text-slate-400">업로드 사용자</dt>
                    <dd className="mt-1 font-semibold text-slate-700">{item.uploadedByUserId || "정보 없음"}</dd>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-2">
                    <dt className="text-xs font-bold text-slate-400">binary 상태</dt>
                    <dd className="mt-1 font-semibold text-slate-700">업로드/다운로드는 제외</dd>
                  </div>
                </dl>

                {isEditing ? (
                  <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/60 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <input
                        value={editingDraft.originalFilename}
                        onChange={(event) => setEditingDraft((current) => ({ ...current, originalFilename: event.target.value }))}
                        className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      />
                      <input
                        value={editingDraft.storedFilename}
                        onChange={(event) => setEditingDraft((current) => ({ ...current, storedFilename: event.target.value }))}
                        className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      />
                      <input
                        value={editingDraft.storageKey}
                        onChange={(event) => setEditingDraft((current) => ({ ...current, storageKey: event.target.value }))}
                        className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100 md:col-span-2"
                      />
                      <input
                        value={editingDraft.contentType}
                        onChange={(event) => setEditingDraft((current) => ({ ...current, contentType: event.target.value }))}
                        className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      />
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={editingDraft.fileSizeBytes}
                        onChange={(event) => setEditingDraft((current) => ({ ...current, fileSizeBytes: event.target.value }))}
                        className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-300 focus:ring-4 focus:ring-orange-100"
                      />
                    </div>
                    <div className="mt-3 flex items-center justify-end gap-2">
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
                ) : null}
              </article>
            );
          })
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm font-medium text-slate-400">
            아직 첨부 메타데이터가 없어. binary 없이 메타데이터만 남길 수 있어.
          </div>
        )}
      </div>
    </section>
  );
}

