// function to create create mock contexts and possibly other stuff.
// an example can be found in `auth.guard.spec.ts`
export function createMock<T>(params?: Partial<Record<keyof T, any>>): T {
  return {
    ...params,
  } as T;
}
