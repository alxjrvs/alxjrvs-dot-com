import { describe, expect, test } from "bun:test";
import { fetchCampaigns, KITH, parseCampaigns } from "./kith";

const feed = {
  campaigns: [
    {
      slug: "umbra",
      name: "The Age of Umbra",
      state: "RUNNING",
      system: "Daggerheart",
      tagline: "A Light in the Dark.",
      url: `${KITH}/games/umbra`,
      imageUrl: `${KITH}/media/a.jpg/card`,
      next: 1_795_483_800,
    },
    {
      slug: "colossus",
      name: "Colossus",
      state: "FORMING",
      system: "Daggerheart",
      tagline: "Reach for the Sky.",
      description: "A colossus walks the drylands.",
      url: `${KITH}/games/colossus`,
      imageUrl: null,
      next: null,
    },
    {
      slug: "coast",
      name: "The Eldridge Coast",
      state: "RUNNING",
      url: `${KITH}/games/coast`,
      next: 1_795_000_000,
    },
  ],
};

describe("parseCampaigns", () => {
  test("puts the ones signing up first, then whichever plays next", () => {
    const out = parseCampaigns(feed);
    expect(out.map((c) => c.slug)).toEqual(["colossus", "coast", "umbra"]);
    expect(out[0]).toEqual({
      slug: "colossus",
      name: "Colossus",
      open: true,
      system: "Daggerheart",
      tagline: "Reach for the Sky.",
      description: "A colossus walks the drylands.",
      url: `${KITH}/games/colossus`,
      image: undefined,
      next: undefined,
    });
    expect(out[2]?.next?.toISOString()).toBe("2026-11-24T01:30:00.000Z");
  });

  test("drops what isn't running or signing up, and links nowhere but Kith", () => {
    const out = parseCampaigns({
      campaigns: [
        { slug: "done", name: "Done", state: "CONCLUDED", url: `${KITH}/games/done` },
        {
          slug: "x",
          name: "X",
          state: "RUNNING",
          url: "https://evil.example/",
          imageUrl: "javascript:alert(1)",
        },
        { name: "No slug", state: "RUNNING" },
        "junk",
      ],
    });
    expect(out).toEqual([
      {
        slug: "x",
        name: "X",
        open: false,
        system: undefined,
        tagline: undefined,
        description: undefined,
        url: KITH,
        image: undefined,
        next: undefined,
      },
    ]);
    expect(parseCampaigns(null)).toEqual([]);
    expect(parseCampaigns({ campaigns: "no" })).toEqual([]);
  });
});

describe("fetchCampaigns", () => {
  test("asks Kith's feed through the binding", async () => {
    let asked = "";
    const out = await fetchCampaigns({
      fetch: async (r) => {
        asked = r.url;
        return Response.json(feed);
      },
    });
    expect(asked).toBe(`${KITH}/api/hub/campaigns`);
    expect(out).toHaveLength(3);
  });

  test("shows nothing when Kith fails", async () => {
    const quiet = console.error;
    console.error = () => {};
    try {
      expect(
        await fetchCampaigns({ fetch: async () => new Response("no", { status: 500 }) }),
      ).toEqual([]);
      expect(
        await fetchCampaigns({
          fetch: async () => {
            throw new Error("down");
          },
        }),
      ).toEqual([]);
    } finally {
      console.error = quiet;
    }
  });
});
