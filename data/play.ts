/* The /play section's registry.
 *
 * One entry per toy: drives the hub cards, the section sub-nav, the embed
 * routes and the sitemap, so adding a toy means adding it here and nowhere else.
 */

export type ToySlug = "wordmark" | "creature" | "zoom" | "family" | "reveal";

export type Toy = {
  slug: ToySlug;
  /** Card + nav label. Written for a curious ten-year-old. */
  name: string;
  /** One line on the hub card. */
  blurb: string;
  /** The sentence under the toy's own heading. */
  intro: string;
  /** Pastel tile behind the hub card's preview. */
  tint: string;
  /** Aspect ratio of the toy's screen, as a CSS aspect-ratio value. */
  aspect: string;
  /** Whether /embed/<slug> is offered. */
  embeddable: boolean;
};

export const TOYS: readonly Toy[] = [
  {
    slug: "wordmark",
    name: "Living wordmark",
    blurb: "Make the colours inside the MONAL letters flow like water.",
    intro:
      "Our logo is one frozen frame of a fractal. Move the sliders and the colours start moving again — the letters stay exactly where they are.",
    tint: "bg-lav",
    aspect: "705 / 170",
    embeddable: true,
  },
  {
    slug: "creature",
    name: "Creature maker",
    blurb: "Drag around to hatch your own fractal creature, then save it.",
    intro:
      "Every creature here is one number in disguise. Drag to change it and a completely different animal appears. Find one you like and take it home as a picture.",
    tint: "bg-mint",
    aspect: "4 / 3",
    embeddable: true,
  },
  {
    slug: "zoom",
    name: "All the way down",
    blurb: "Fall into the logo forever. It never actually ends.",
    intro:
      "Zoom into the edge of our logo and you find the whole logo again, smaller. This loop is seamless: the end is mathematically identical to the beginning.",
    tint: "bg-sky",
    aspect: "16 / 9",
    embeddable: true,
  },
  {
    slug: "family",
    name: "The family",
    blurb: "Eight cousins of our logo, all from the same formula.",
    intro:
      "Change one number in the formula and the logo becomes a different creature entirely. Here are eight of them. Tap one to take it to the creature maker.",
    tint: "bg-peach",
    aspect: "1 / 1",
    embeddable: false,
  },
  {
    slug: "reveal",
    name: "The reveal",
    blurb: "Watch chaos settle into our logo in six seconds.",
    intro:
      "This is the intro sting we use on films. It starts as noise, spirals inward, and lands exactly on the logo's own number.",
    tint: "bg-pink",
    aspect: "16 / 9",
    embeddable: true,
  },
];

export const toyBySlug = (slug: string): Toy | undefined =>
  TOYS.find((t) => t.slug === slug);

export const EMBEDDABLE_TOYS = TOYS.filter((t) => t.embeddable);

/** Copy shared by the hub hero and the section metadata. */
export const PLAY_TAGLINE = "Our logo is a fractal. Come and play with it.";
export const PLAY_DESCRIPTION =
  "Five toys built from the same piece of maths as the Monal Digital logo. Cycle its colours, hatch your own creature, or fall into it forever — no download, works on a phone.";
