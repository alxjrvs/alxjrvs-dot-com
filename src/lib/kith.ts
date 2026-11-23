// The Campaigns section's data: the tables running or signing up on Kith.town,
// Alex's TTRPG community, read from Kith's public feed
// (https://kith.town/api/hub/campaigns, src/hub/public-campaigns.ts in
// alxjrvs/kith). That feed is what Kith shows somebody who isn't signed in,
// with no people in it, so nothing here can show more than kith.town does.
//
// The words on each card (names, taglines, systems) are written in Kith's own
// CMS, the way every other word here is written in EmDash. It's read when the
// home page renders, so a new campaign or a filled table shows up as soon as
// the cached page is renewed (astro.config.ts: a minute). If Kith is down, or
// slower than 8 seconds, the section is left out rather than the page
// waiting on it. The feed takes 1.5 to 3 seconds to build, and a cached page
// is renewed behind the visitor, so it's the renewal that waits, not them.

export const KITH = "https://kith.town";
const FEED = `${KITH}/api/hub/campaigns`;
const TIMEOUT_MS = 8000;

export interface Campaign {
  slug: string;
  name: string;
  /** signing up (FORMING) or under way (RUNNING) */
  open: boolean;
  /** "Daggerheart" */
  system?: string | undefined;
  tagline?: string | undefined;
  /** its pitch, as one plain paragraph */
  description?: string | undefined;
  /** its page on kith.town */
  url: string;
  /** its art, 1200x630 */
  image?: string | undefined;
  /** the next session, if one is on the calendar */
  next?: Date | undefined;
}

type Fetcher = (request: Request) => Promise<Response>;

const text = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;
const onKith = (v: unknown): string | undefined => {
  const s = text(v);
  return s?.startsWith(`${KITH}/`) ? s : undefined;
};
const https = (v: unknown): string | undefined => {
  const s = text(v);
  return s && /^https:\/\//.test(s) ? s : undefined;
};

/** The feed's JSON, checked field by field: anything odd is dropped, never shown. */
export function parseCampaigns(json: unknown): Campaign[] {
  const list = (json as { campaigns?: unknown } | null)?.campaigns;
  if (!Array.isArray(list)) return [];
  const out: Campaign[] = [];
  for (const raw of list) {
    if (!raw || typeof raw !== "object") continue;
    const c = raw as Record<string, unknown>;
    const name = text(c.name);
    const slug = text(c.slug);
    if (!name || !slug || (c.state !== "RUNNING" && c.state !== "FORMING")) continue;
    out.push({
      slug,
      name,
      open: c.state === "FORMING",
      system: text(c.system),
      tagline: text(c.tagline),
      description: text(c.description),
      url: onKith(c.url) ?? KITH,
      image: https(c.imageUrl),
      next:
        typeof c.next === "number" && Number.isFinite(c.next) ? new Date(c.next * 1000) : undefined,
    });
  }
  // the ones taking players first, then whichever plays next
  const when = (c: Campaign) => c.next?.getTime() ?? Number.POSITIVE_INFINITY;
  return out.sort(
    (a, b) => Number(b.open) - Number(a.open) || when(a) - when(b) || a.name.localeCompare(b.name),
  );
}

/**
 * Kith's campaigns, or none when it can't say. `kith` is the Worker's service
 * binding to Kith (wrangler.jsonc `services`); without one (a local dev
 * server) it goes over the internet.
 */
export async function fetchCampaigns(kith?: { fetch: Fetcher } | undefined): Promise<Campaign[]> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const request = new Request(FEED, { headers: { Accept: "application/json" } });
    const go: Fetcher = kith ? (r) => kith.fetch(r) : (r) => fetch(r);
    const late = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("Kith took too long")), TIMEOUT_MS);
    });
    const response = await Promise.race([go(request), late]);
    if (!response.ok) return [];
    return parseCampaigns(await response.json());
  } catch (error) {
    console.error("campaigns from Kith", error);
    return [];
  } finally {
    clearTimeout(timer);
  }
}
