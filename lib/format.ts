export function formatDateKorean(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y}. ${Number(m)}. ${Number(d)}.`;
}

export function formatDateShort(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}. ${Number(d)}.`;
}
