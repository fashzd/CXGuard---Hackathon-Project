# AGENTS.md

## Project Identity

This repository contains `CXGuard`, a hackathon MVP for the `Agent Security & AI Governance` track. CXGuard is a Lobster Trap-powered security gateway and governance dashboard for AI customer support agents.

The previous internal name `SupportShield AI` may appear in earlier notes or prompts. In this repository, the product name is `CXGuard`.

## Non-Negotiable Architecture

All customer support chat traffic must follow this exact request path:

`Customer support UI -> /api/shield/chat -> Lobster Trap (http://localhost:8080) -> OpenAI-compatible forwarder (http://localhost:8000) -> OpenAI API`

Rules:

- The frontend must never call OpenAI directly.
- `app/api/shield/chat/route.ts` must never call OpenAI directly.
- `app/api/shield/chat/route.ts` must send chat completion requests to `${LOBSTERTRAP_URL}/v1/chat/completions`.
- Lobster Trap is the primary inline inspection and policy enforcement layer.
- The local classifier is only a fallback for UI normalization and dashboard metadata. It must not replace Lobster Trap.
- The OpenAI API key must never be exposed in client-side code, browser storage, logs, or rendered responses.

## Required Components

- `Next.js + TypeScript + Tailwind` app for the product UI
- `Node/Express` OpenAI-compatible forwarder in `forwarder.ts`
- Protected support chat experience
- Attack simulator
- Security dashboard
- Audit log viewer with export actions
- README with end-to-end setup and demo flow

## Security Constraints

- Treat Lobster Trap as required infrastructure, not an optional scanner.
- Handle both allowed responses and blocked/error responses from Lobster Trap without crashing.
- Normalize every interaction into a consistent security event shape for UI display.
- Preserve audit-ready metadata such as decision, risk score, threat type, matched policy, signals, and whether a model call occurred.
- Provide a helpful error state if Lobster Trap is unreachable.
- Do not log secrets or raw API keys.
- Do not fabricate successful assistant responses when a request is blocked, quarantined, or escalated.

## UX Requirements

- Product name must be `CXGuard`.
- The UI should make it obvious that traffic is routed through Lobster Trap.
- The UI and README should point users to the Lobster Trap dashboard at `http://localhost:8080/_lobstertrap/`.
- The app should feel like a polished enterprise security product, not a toy chatbot.
- The dashboard should make decisions, incidents, and governance evidence easy to scan during a live demo.

## Build Commands

- Install dependencies: `npm install`
- Start the OpenAI-compatible forwarder: `npm run forwarder`
- Start Lobster Trap: `./lobstertrap serve --backend http://localhost:8000 --audit-log ./audit.jsonl`
- Start the app locally: `npm run dev`
- Production build check: `npm run build`

## Definition Of Done

The project is done when all of the following are true:

- The forwarder runs locally on `http://localhost:8000`.
- Lobster Trap can run locally on `http://localhost:8080` and proxy to the forwarder.
- The Next.js app runs and shows the four core experiences:
  `Protected Chat`, `Attack Simulator`, `Security Dashboard`, and `Audit Log`.
- A normal support question can flow through Lobster Trap and return an assistant answer.
- Risky prompts produce visible security decisions and dashboard incidents.
- The UI remains usable even if Lobster Trap is offline, with a clear recovery message.
- Audit events persist in browser `localStorage`.
- JSON and CSV export actions work.
- The README explains setup, routing, Lobster Trap’s role, and the demo flow clearly.
- The implementation makes it obvious that Lobster Trap is the inline security gateway at the center of CXGuard.
