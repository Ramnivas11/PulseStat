/**
 * Minimal stub declarations for @prisma/client.
 * These exist so `tsc` passes BEFORE `prisma generate` runs.
 * Running `npm install` (or `npx prisma generate`) replaces these
 * with the real generated client in node_modules/@prisma/client.
 *
 * DO NOT import from this file directly - import from "@prisma/client".
 */
declare module "@prisma/client" {
  export class PrismaClient {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $transaction(fn: (tx: any) => Promise<any>): Promise<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  export namespace Prisma {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type TransactionClient = any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type EventWhereInput = any;
  }

  export type PlanKey = string;
}
