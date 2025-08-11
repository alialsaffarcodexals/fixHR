// Similar to other test files, the `.js` extension prevents ts-jest from
// resolving the module during testing. Importing the TypeScript module without
// the extension keeps the path valid for both the compiler and at runtime.
import { calculateFortnightly } from '../../common';

describe('Payroll rounding', () => {
  it('divides by 26 and rounds to 3 decimals', () => {
    // 44,245.750 divided by 26 fortnights equals 1701.759615..., which rounds
    // to 1701.760 when keeping three decimal places.
    expect(calculateFortnightly(44245.750)).toBe('1701.760');
    expect(calculateFortnightly(96336.340)).toBe('3705.244');
  });
});

