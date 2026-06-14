// Test stub: the real "server-only" package throws when imported outside a
// server bundle. Under Vitest (Node) we alias it to this no-op so server libs
// can be unit-tested. Production builds still use the real package.
export {};
