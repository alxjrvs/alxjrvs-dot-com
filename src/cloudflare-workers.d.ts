// The slice of the Workers runtime module src/worker.ts uses. The full
// @cloudflare/workers-types would clash with the DOM types the pages use.
declare module "cloudflare:workers" {
  /** the Worker's bindings (wrangler.jsonc), for the pages */
  export const env: Record<string, unknown>;
  export abstract class WorkerEntrypoint<Env = unknown> {
    protected env: Env;
    protected ctx: unknown;
    constructor(ctx: unknown, env: Env);
    fetch?(request: Request): Response | Promise<Response>;
  }
}
