import { describe, it, expect } from 'vitest';
import { multiply } from '../utils/math';

describe('Fungsi Perkalian', () => {
  it('seharusnya mengalikan dua angka dengan benar', () => {
    expect(multiply(2, 3)).toBe(6);
    expect(multiply(-2, 3)).toBe(-6);
    expect(multiply(0, 3)).toBe(0);
  });
});
