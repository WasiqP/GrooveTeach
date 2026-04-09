/**
 * Parse pasted CSV text: one student per line, `Name` or `Name, email`.
 * Skips an optional header row when the first line looks like "name,email".
 */
export function parseStudentCsvRows(text: string): { name: string; email?: string }[] {
  const lines = text.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return [];
  let start = 0;
  const first = lines[0].toLowerCase();
  if (first.includes('name') && (first.includes('email') || first.includes('e-mail'))) {
    start = 1;
  }
  const out: { name: string; email?: string }[] = [];
  for (let i = start; i < lines.length; i++) {
    const parts = lines[i].split(',').map((s) => s.trim().replace(/^"|"$/g, ''));
    const name = parts[0];
    if (!name) continue;
    out.push({ name, email: parts[1] || undefined });
  }
  return out;
}
