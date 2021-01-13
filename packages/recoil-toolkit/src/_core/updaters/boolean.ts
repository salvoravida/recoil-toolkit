export const not = (s: boolean) => !s;
export const and = <T>(value: T) => (s: boolean) => s && !!value;
export const or = <T>(value: T) => (s: boolean) => s || !!value;

// alias
export const toggle = not;
