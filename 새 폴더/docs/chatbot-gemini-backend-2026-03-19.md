# Chatbot Gemini backend switch (2026-03-19)

- Scope: legacy `jeju-web` chatbot servlet only
- Endpoint: `/api/chat`
- Provider: Google Gemini `generateContent` REST API
- API key: `GEMINI_API_KEY`
- Optional model override: `GEMINI_MODEL`
- Default model: `gemini-2.5-flash`
- Spring migration is intentionally untouched

## Request contract

- The frontend still posts a `messages` array with `system`, `user`, and `assistant` roles.
- The legacy servlet converts that payload into Gemini `systemInstruction` plus `contents`.

## Frontend compatibility

- The chatbot panel accepts OpenAI-style response shape: `choices[0].message.content`
- The chatbot panel accepts Gemini-style response shape: `candidates[0].content.parts[*].text`

This keeps the widget stable while the backend provider changes underneath it.
