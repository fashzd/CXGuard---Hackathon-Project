export type Decision = "ALLOW" | "BLOCK" | "HUMAN_REVIEW" | "QUARANTINE" | "ERROR";
export type RiskLevel = "Low" | "Medium" | "High" | "Critical";

export type LobsterTrapMetadata = {
  request_id: string | null;
  verdict: string | null;
  ingress_action: string | null;
  egress_action: string | null;
  matched_rule: string | null;
};

export type AuditEvent = {
  id: string;
  timestamp: string;
  agent_id: string;
  user_id: string;
  message: string;
  assistant_message: string;
  decision: Decision;
  risk_score: number;
  risk_level: RiskLevel;
  threat_type: string;
  matched_policy: string;
  detected_signals: string[];
  recommended_action: string;
  model_called: boolean;
  lobstertrap: LobsterTrapMetadata;
  raw_lobstertrap_response: unknown | null;
};

export type AttackPrompt = {
  id: string;
  label: string;
  category: string;
  message: string;
};

export type DemoScenario = {
  label: string;
  message: string;
  expected_outcome: string;
};

export type DemoPair = {
  safe: DemoScenario;
  attack: DemoScenario;
  generator: "gpt" | "fallback";
};

export type ChatRequestPayload = {
  agent_id: string;
  user_id: string;
  message: string;
};

export type RiskAssessment = Pick<
  AuditEvent,
  | "decision"
  | "risk_score"
  | "risk_level"
  | "threat_type"
  | "matched_policy"
  | "detected_signals"
  | "recommended_action"
>;
