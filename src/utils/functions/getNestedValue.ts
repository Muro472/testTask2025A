export const getNestedValue = <T extends object, P extends string>(
  obj: T,
  path: P
): any => {
  return path
    .split(".")
    .reduce((o, key) => (o ? (o as any)[key] : undefined), obj);
};
