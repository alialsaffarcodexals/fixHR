export function calculateFortnightly(annualBHD: string | number): string {
  const v = typeof annualBHD === 'string' ? parseFloat(annualBHD) : annualBHD;
  const fortnightly = v / 26.0;
  return fortnightly.toFixed(3);
}

