import { RiskAssessment } from "@/lib/types";

type Rule = {
  threat_type: string;
  policy: string;
  decision: RiskAssessment["decision"];
  risk_score: number;
  signals: string[];
  patterns: RegExp[];
  recommended_action: string;
};

const rules: Rule[] = [
  {
    threat_type: "secret_extraction",
    policy: "Protect Secrets And Credentials",
    decision: "BLOCK",
    risk_score: 97,
    signals: ["secret request", "credential exposure", "sensitive file path"],
    patterns: [/\.env/i, /api key/i, /openai_api_key/i, /token/i, /password/i, /secret/i],
    recommended_action: "Block the request and review secret access controls."
  },
  {
    threat_type: "prompt_injection",
    policy: "Protect System Instructions",
    decision: "BLOCK",
    risk_score: 92,
    signals: ["instruction override", "system prompt extraction"],
    patterns: [
      /ignore all previous instructions/i,
      /developer mode/i,
      /bypass/i,
      /override system/i,
      /jailbreak/i,
      /reveal (your )?(hidden )?system prompt/i
    ],
    recommended_action: "Block the request and preserve the trace for prompt-injection review."
  },
  {
    threat_type: "external_exfiltration",
    policy: "Prevent External Exfiltration",
    decision: "BLOCK",
    risk_score: 94,
    signals: ["external destination", "data exfiltration request"],
    patterns: [/send .* to /i, /email to/i, /pastebin/i, /webhook/i, /external url/i, /attacker@/i],
    recommended_action: "Block the request and investigate the destination and requested payload."
  },
  {
    threat_type: "unsafe_tool_action",
    policy: "Prevent Destructive Actions",
    decision: "BLOCK",
    risk_score: 91,
    signals: ["destructive action", "unsafe command"],
    patterns: [/delete records/i, /delete account/i, /drop database/i, /run command/i, /curl \| bash/i],
    recommended_action: "Block the request and require security review before any tool action."
  },
  {
    threat_type: "pii_request",
    policy: "Protect Customer PII",
    decision: "QUARANTINE",
    risk_score: 84,
    signals: ["customer data request", "pii exposure"],
    patterns: [/last customer/i, /email/i, /phone number/i, /address/i, /ssn/i, /credit card/i, /customer data/i],
    recommended_action: "Quarantine the request and require manual validation before disclosure."
  },
  {
    threat_type: "refund_abuse",
    policy: "High-Value Refund Control",
    decision: "HUMAN_REVIEW",
    risk_score: 68,
    signals: ["refund escalation", "policy override request"],
    patterns: [/refund/i, /\$\d{3,}/i, /outside the return window/i, /override refund policy/i, /approve refund/i],
    recommended_action: "Escalate the request to a human reviewer for refund approval."
  },
  {
    threat_type: "admin_impersonation",
    policy: "Prevent Role Impersonation",
    decision: "HUMAN_REVIEW",
    risk_score: 73,
    signals: ["privilege claim", "role impersonation"],
    patterns: [/i am admin/i, /as administrator/i, /root access/i, /manager override/i, /system administrator/i],
    recommended_action: "Require manual verification of the claimed elevated role."
  }
];

function riskLevelFromScore(score: number): RiskAssessment["risk_level"] {
  if (score >= 90) return "Critical";
  if (score >= 75) return "High";
  if (score >= 50) return "Medium";
  return "Low";
}

export function classifyRisk(message: string): RiskAssessment {
  const normalized = message.trim();

  for (const rule of rules) {
    const matched = rule.patterns.some((pattern) => pattern.test(normalized));
    if (matched) {
      return {
        decision: rule.decision,
        risk_score: rule.risk_score,
        risk_level: riskLevelFromScore(rule.risk_score),
        threat_type: rule.threat_type,
        matched_policy: rule.policy,
        detected_signals: rule.signals,
        recommended_action: rule.recommended_action
      };
    }
  }

  return {
    decision: "ALLOW",
    risk_score: 12,
    risk_level: "Low",
    threat_type: "normal_support",
    matched_policy: "Standard Customer Support",
    detected_signals: ["benign support request"],
    recommended_action: "Allow the request and monitor normally."
  };
}
