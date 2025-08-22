import Color from "color";

export function safeColor(
  input: string | undefined | null,
  fallback = "transparent"
) {
  try {
    if (!input || input.trim() === "") {
      return "transparent";
    }
    return Color(input).hex();
  } catch {
    return "transparent";
  }
}
