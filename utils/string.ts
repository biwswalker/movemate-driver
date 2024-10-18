export function censorText(text: string | undefined, visibleChars: number = 3) {
  if (typeof text !== "string") {
    return text;
  }
  if (text === "") {
    return text;
  }
  if (text.length <= visibleChars) {
    return text;
  }
  const visiblePart: string = text.substring(0, visibleChars);
  const censoredPart: string = "*".repeat(text.length - visibleChars);
  return visiblePart + censoredPart;
}
