export interface TransactionContext {
  // Opaque transaction context provided by the underlying database adapter (Drizzle/Prisma/Mock)
  [key: string]: unknown;
}

export interface PlatformDatabase {
  /**
   * Executes a callback within an isolated database transaction.
   * If the callback throws, the transaction is rolled back.
   */
  transaction<T>(fn: (tx: TransactionContext) => Promise<T>): Promise<T>;
  
  /**
   * Provides access to the underlying query builder for reads.
   */
  select(): unknown;
}
