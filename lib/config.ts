import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Where should I start inside Thriving Practitioners?",
    prompt: "Where should I start inside Thriving Practitioners?",
    icon: "circle-question",
  },
  {
    label: "How can I get discovered in AI search?",
    prompt: "How can I get discovered in AI search?",
    icon: "circle-question",
  },
  {
    label: "Show me resources or trainings that can help me today.",
    prompt: "Show me resources or trainings that can help me today.",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Ask anything...";

export const GREETING =
  "How can I support you in growing your practice today?";

export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: theme === "dark" ? "#f1f5f9" : "#0f172a",
      level: 1,
    },
  },
  radius: "round",
});
