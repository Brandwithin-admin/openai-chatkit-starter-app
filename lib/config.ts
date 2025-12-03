import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Where should I start?",
    prompt: "“Guide me on where to start inside Thriving Practitioners based on my needs as a natural health practitioner. Provide a simple pathway and link me to the most relevant resources, blogs, and pages from the Thriving Practitioners website.",
    icon: "circle-question",
  },
  {
    label: "How can I get discovered in AI search?",
    prompt: "Explain the exact steps a natural health practitioner should take to get discovered in AI search. Use Thriving Practitioners’ frameworks: AEO, Micro Pages, website clarity, client questions, comparison pages, structured authority signals, and ethical content. Reference and link to the relevant pages or blog posts on the Thriving Practitioners website that cover AI visibility, Answer Engine Optimisation, and modern search behaviour.",
    icon: "circle-question",
  },
  {
    label: "Show me helpful resources.",
    prompt: "Show me the most helpful resources, blogs, and trainings available on the Thriving Practitioners website. Curate them based on common practitioner needs: content creation, visibility, AI search, practice growth, ethical marketing, website improvement, and clarity of niche. Include short explanations of why each resource is useful.",
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
