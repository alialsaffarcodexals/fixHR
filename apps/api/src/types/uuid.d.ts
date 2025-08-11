// Minimal type declaration for the `uuid` package used in tests. The actual
// `uuid` package ships type definitions when `@types/uuid` is installed, but
// in this project the types are omitted. Declaring the module here keeps the
// TypeScript compiler and Jest happy without pulling in additional
// dependencies.
declare module 'uuid' {
  export function v4(): string;
}


