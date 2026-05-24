export const OPEN_AGENT_ASSISTANT = 'open-agent-assistant';

export function openAgentAssistant() {
  window.dispatchEvent(new CustomEvent(OPEN_AGENT_ASSISTANT));
}
