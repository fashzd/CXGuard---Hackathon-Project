import { AuditEvent } from "@/lib/types";

function escapeCsv(value: unknown) {
  const stringified = String(value ?? "");
  return `"${stringified.replace(/"/g, '""')}"`;
}

export function auditEventsToCsv(events: AuditEvent[]) {
  const header = [
    "Time",
    "User",
    "Message",
    "Decision",
    "Risk",
    "Risk Level",
    "Threat",
    "Policy",
    "Model Called"
  ];

  const rows = events.map((event) => [
    event.timestamp,
    event.user_id,
    event.message,
    event.decision,
    event.risk_score,
    event.risk_level,
    event.threat_type,
    event.matched_policy,
    event.model_called
  ]);

  return [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\n");
}
