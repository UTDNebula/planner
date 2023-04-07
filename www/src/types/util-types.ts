// UnwrapArray<number[]> -> number
export type UnwrapArray<T> = T extends (infer U)[] ? U : T;
