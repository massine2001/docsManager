export function formatDate(dateString: string | undefined) {
  if (!dateString) return "Date inconnue";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMonthYear(dateString: string | undefined) {
  if (!dateString) return "Date inconnue";
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
  });
}

export function getExt(name: string | undefined): string {
  if (!name) return "";
  const parts = name.split(".");
  return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}
