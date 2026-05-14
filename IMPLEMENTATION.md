# IMPLEMENTATION.md

## Product Goals

CXGuard is a hackathon MVP that demonstrates how enterprises can secure AI customer support agents with an inline security gateway. The product must:

- protect AI-driven support interactions from prompt injection, PII leakage, secret extraction, refund abuse, admin impersonation, exfiltration, and unsafe actions
- route every interaction through Lobster Trap before any model response is returned
- provide governance-friendly visibility through incidents, metrics, and audit logs
- stay demo-ready even when infrastructure is partially unavailable

## Core Architecture

Runtime path:

`Customer support UI -> Next.js API route (/api/shield/chat) -> Lobster Trap (:8080) -> OpenAI-compatible forwarder (:8000) -> OpenAI API`

Responsibilities:

- `Next.js UI`: user interaction, simulator, metrics, audit review
- `Next.js API route`: validation, trace headers, Lobster Trap call, response normalization
- `Lobster Trap`: prompt and response inspection, policy enforcement, inline decisions
- `OpenAI-compatible forwarder`: trusted server-side bridge to the real OpenAI API
- `Local classifier`: deterministic fallback metadata generator for the UI only

## Planned Modules

- `package.json`: scripts and dependencies
- `forwarder.ts`: Express-based OpenAI-compatible chat completions bridge
- `app/page.tsx`: single-page CXGuard experience with four sections
- `app/api/shield/chat/route.ts`: Lobster Trap routing and normalized event generation
- `app/api/audit/route.ts`: optional helper endpoint for exports or health-style audit access if useful
- `lib/types.ts`: shared event and dashboard types
- `lib/samplePrompts.ts`: safe prompts and attack simulator presets
- `lib/clientRiskClassifier.ts`: deterministic keyword/regex classifier
- `lib/auditStore.ts`: client-side localStorage event persistence helpers
- `lib/csv.ts`: CSV export serializer
- `.env.example`: documented local configuration
- `README.md`: setup, architecture, demo flow, and constraints

## Implementation Phases

### Phase 1: Project Scaffold

- Initialize a Next.js + TypeScript + Tailwind app structure
- Add dependencies and scripts
- Define shared types and sample prompt data
- Configure environment variable expectations

### Phase 2: Security Plumbing

- Build `forwarder.ts` with `/health` and `/v1/chat/completions`
- Implement `app/api/shield/chat/route.ts`
- Add trace headers and normalized response mapping
- Handle both successful and blocked Lobster Trap responses
- Add resilient fallback classification for metadata

### Phase 3: Product Experience

- Build the CXGuard header and connection status cards
- Build the protected chat interface
- Build the attack simulator with one-click attack scenarios
- Build the latest decision side panel
- Build the security dashboard cards, alert feed, breakdowns, and incident details
- Build the audit log table with filters and export actions

### Phase 4: Persistence And Demo Readiness

- Persist audit events in localStorage
- Keep in-memory state synchronized with localStorage
- Add CSV and JSON export functionality
- Add clear empty, loading, and infrastructure-error states

### Phase 5: Documentation And Verification

- Write `.env.example`
- Update `README.md` with setup and demo steps
- Run `npm install`
- Run `npm run build`
- Fix type or import issues

## Key Implementation Decisions

- Product naming in the UI and docs must use `CXGuard`.
- Lobster Trap must be visibly central in both code and product messaging.
- The fallback classifier should be deterministic and easy to explain during judging.
- The dashboard should use simple Tailwind-based visuals instead of external chart libraries to keep the MVP reliable.
- localStorage is the persistence layer for the MVP; no database is required.

## Acceptance Criteria

- `npm run forwarder` starts the OpenAI-compatible forwarder locally.
- Lobster Trap can be started with:
  `./lobstertrap serve --backend http://localhost:8000 --audit-log ./audit.jsonl`
- `npm run dev` starts the app locally.
- A normal support message returns an assistant answer when Lobster Trap and the forwarder are available.
- Attack simulator prompts generate visible dashboard events and audit entries.
- Blocked or risky prompts surface clear decisions such as `BLOCK`, `HUMAN_REVIEW`, or `QUARANTINE`.
- Dashboard metrics update based on captured events.
- Audit events persist across refreshes using localStorage.
- JSON and CSV export flows work.
- The app provides a helpful error when Lobster Trap is unreachable.
- The README clearly explains that Lobster Trap is the inline inspection and policy enforcement layer, while the local classifier is only a fallback.
