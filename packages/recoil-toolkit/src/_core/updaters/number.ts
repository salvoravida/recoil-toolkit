export const inc = (s: number) => s + 1;
export const dec = (s: number) => s - 1;
export const decAbs = (s: number) => (s > 0 ? s - 1 : 0);

// alias
export const show = inc;
export const hide = decAbs;
