export function formatZAR(amount: number | null | undefined): string {
  if (amount == null) return 'From R-';
  const grouped = amount.toLocaleString('en-ZA', { maximumFractionDigits: 0 }).replace(/,/g, ' ');
  return `R${grouped}`;
}

export function formatDateZA(input: string | Date): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  return date.toLocaleDateString('en-ZA', { day: '2-digit', month: 'long', year: 'numeric' });
}
