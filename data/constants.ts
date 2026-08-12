// Static site data. Image assets live under /public/assets and are referenced
// by absolute URL path (URL-safe, lowercase-kebab filenames).

/* `color` keeps the logo in its own colours at the larger display size;
   `noTint` keeps its own colours at the standard size. Others render as
   black marks. */
export type Brand = { name: string; logo: string; color?: boolean; noTint?: boolean };
/* `img` is the 1600w WebP and `small` the 800w one, offered together as a
   srcset so a card in the four-across row does not download the same file
   the feature does. `imgSq` is gone: it was declared for months and read
   by nothing. */
export type Project = {
  title: string;
  /* TWO CROPS, NOT ONE IMAGE AT TWO SIZES. `img`/`small` are the wide
     establishing shots that fill a full-bleed band on /work; `card`/
     `cardSmall` are tighter framings that survive being drawn 300px wide
     in the homepage grid. Sources live in Portfolio/ and
     Portfolio/Dashboard/ respectively; `npm run images` builds both. */
  img: string;
  small: string;
  card: string;
  cardSmall: string;
  /* ---- Both optional, and both are SLOTS AWAITING ARTWORK. ----------
     The /work page is built to carry them and renders correctly without
     them, so they can be filled in one at a time rather than all at once.

     `logo`   the show's own wordmark, transparent PNG or SVG, drawn over
              its key art. Until one exists the art is left clean — the
              title is already set below it, and a placeholder would only
              be a second thing to remove later.

     `channels` where the show can be watched. `logo` per channel is
              optional too: a channel with a name and no logo sets its
              name; one with both shows the mark. NOTHING here is
              invented — the array is empty until real distribution is
              supplied, because a fabricated broadcaster on a portfolio
              page is a claim about the business, not a placeholder. */
  logo?: string;
  /* Nudge for a wordmark that reads small at the shared cap. The marks
     span 1.2:1 to 3.2:1, and a box cap is bound by HEIGHT on the squarer
     ones — so Zappy Zoo and Groovy end up with far less area than the
     wide GiggleBellies lockup at the identical cap. This scales the cap
     itself rather than transforming the image, because `data-reveal`
     already animates its transform. Default 1. */
  logoScale?: number;
  channels?: Channel[];
  /* The two places you can go and listen or watch. These are the only
     LINKS on a band — the `channels` list beside them is a statement of
     where a show is distributed, not a set of destinations. */
  links?: { youtube?: string; spotify?: string };
};

/* A platform a show streams on. `logo` and `href` are both optional and
   both fill in later: a channel with neither renders as its name, one
   with a logo shows the mark, one with an href becomes a link. Nothing
   here is guessed — a URL that goes to the wrong place is worse than a
   name that goes nowhere, so only links we actually know are set. */
export type Channel = { name: string; logo?: string; href?: string };
export type ServiceDetailItem = { name: string; desc: string };
export type Service = {
  slug: string;
  number: string;
  title: string;
  eyebrow: string;
  tagline: string;
  desc: string;
  intro: string;
  features: string[];
  detail: ServiceDetailItem[];
};
/* `status` marks a venture that isn't open yet — stating the date reads as
   confidence; implying it already exists does not.
   `href` may be internal ("/services") or an absolute URL; absolute ones
   open in a new tab. */
export type Venture = {
  title: string;
  tagline: string;
  desc: string;
  status?: string;
  href?: string;
};
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  img: string;
  linkedin: string;
  /* Optional per-photo framing for the square card. `zoom` is a plain scale
     factor so the card's hover zoom can multiply it. */
  imgStyle?: { zoom?: number; objectPosition?: string };
};

/* Network-scale figures, single-sourced: every page that shows stats
   (homepage hero, /about-us) pulls the numbers from here and supplies
   its own labels. */
export const stats = {
  views: { n: "50", suffix: "B+" },
  subscribers: { n: "80", suffix: "M+" },
  channels: { n: "90", suffix: "+" },
  years: { n: "10", suffix: "+" },
} as const;

/* The studio's own contact details, single-sourced for the same reason
   the stats above are: they render in the footer on every page and again
   on the contact page, and a number that is current in one place and
   stale in the other is worse than either on its own.

   `tel` is the dialable form and `phone` the readable one — they differ
   by spacing alone, which a tel: href must not carry. The address is
   split at the line it is meant to break on rather than at a comma, so
   the break is a decision made here and not by whatever width the card
   happens to be. */
export const contact = {
  email: "hello@monaldigital.com",
  phone: "+91 82006 96551",
  tel: "+918200696551",
  address: [
    "Monal Digital, Karan Tower, Gas Godam Road",
    "Haldwani, Uttarakhand, India 263139",
  ],
} as const;

/* Listed in display order — three per row on desktop. */
export const brands: Brand[] = [
  {
    name: "Lunar X",
    logo: "/assets/brands/lunar-x.png",
    noTint: true,
  },
  {
    name: "Hera",
    logo: "/assets/brands/hera.png",
    color: true,
  },
  {
    name: "Tata Play",
    logo: "/assets/brands/tata-play.png",
    color: true,
  },
  {
    name: "Vaibhav Studios",
    logo: "/assets/brands/vaibhav-studios.png",
    color: true,
  },
  {
    name: "Economics Explained",
    logo: "/assets/brands/economics-explained.png",
    color: true,
  },
  {
    name: "The Boldeye",
    logo: "/assets/brands/the-boldeye.png",
  },
  {
    name: "Freebird Animation Studios",
    logo: "/assets/brands/freebird-animation.png",
    color: true,
  },
  {
    name: "Lenny's Studios",
    logo: "/assets/brands/lenny-studio.jpg",
    color: true,
  },
];

/* THE ORDER IS THE LAYOUT. ContentLibrary reads this array by position:
   [0] is the feature, [1] and [2] fill the column beside it, and [3..6]
   run four across underneath. Reordering here reorders the section, so
   the flagship title belongs first. */
const shot = (slug: string) => ({
  img: `/assets/projects/showcase/${slug}-1600.webp`,
  small: `/assets/projects/showcase/${slug}-800.webp`,
  card: `/assets/projects/showcase/${slug}-card-1600.webp`,
  cardSmall: `/assets/projects/showcase/${slug}-card-800.webp`,
});

/* All seven shows have a wordmark now. `npm run images` builds each from
   Portfolio/Logos/ — trimmed, fitted to a box and converted. */
const logo = (slug: string) => `/assets/projects/showcase/${slug}-logo.webp`;

/* Named once so a platform cannot end up spelled two ways across seven
   shows, and so adding its logo or link is a single edit rather than a
   hunt through the array. */
/* Tata Play already has a real, background-stripped mark on this site —
   it is one of the partners on the homepage wall — so it is the one
   non-YouTube platform that can show artwork rather than its name. */
const TATA_PLAY: Channel = { name: "Tata Play", logo: "/assets/brands/tata-play-logo.webp" };
const PRIME_VIDEO: Channel = { name: "Amazon Prime Video" };
const AMAZON: Channel = { name: "Amazon" };

export const projects: Project[] = [
  {
    title: "Monal Kids",
    ...shot("monal-kids"),
    logo: logo("monal-kids"),
    links: {
      youtube: "https://www.youtube.com/@MonalKidsHindi",
      spotify: "https://open.spotify.com/artist/2oEWxoTZOcDMxF2Dhwpuwk",
    },
  },
  {
    title: "Wands And Wings",
    ...shot("wands-and-wings"),
    logo: logo("wands-and-wings"),
    logoScale: 1.25,
    links: {
      youtube: "https://www.youtube.com/@wandsandwings",
      spotify: "https://open.spotify.com/artist/6xIRu1LP8SWPWGcXyEVY72",
    },
    channels: [PRIME_VIDEO],
  },
  {
    title: "Zappy Toons",
    ...shot("zappy-toons"),
    logo: logo("zappy-toons"),
    links: {
      youtube: "https://www.youtube.com/@zappytoons",
      spotify: "https://open.spotify.com/artist/0pQbu3dqsmMiHhrSIXxzER",
    },
    channels: [TATA_PLAY],
  },
  {
    title: "Zappy Zoo",
    ...shot("zappy-zoo"),
    logo: logo("zappy-zoo"),
    logoScale: 1.25,
    links: {
      youtube: "https://www.youtube.com/@zappyzoo",
      spotify: "https://open.spotify.com/artist/0bGItc2gKpPNPjITfx9WsS",
    },
  },
  {
    title: "Wands And Wings Junior",
    ...shot("wands-and-wings-jr"),
    logo: logo("wands-and-wings-jr"),
    logoScale: 1.25,
    links: {
      youtube: "https://www.youtube.com/@WandsandWingsJunior",
      spotify: "https://open.spotify.com/artist/2YBem7fhYh4O4GMwzuv4aj",
    },
  },
  {
    title: "Groovy The Martian",
    ...shot("groovy-the-martian"),
    logo: logo("groovy-the-martian"),
    logoScale: 1.25,
    links: {
      youtube: "https://www.youtube.com/@GroovyTheMartian",
      spotify: "https://open.spotify.com/artist/6BrD3d9Eqa7buSKXUwSKIf",
    },
  },
  {
    title: "The GiggleBellies",
    ...shot("gigglebellies"),
    logo: logo("gigglebellies"),
    links: {
      youtube: "https://www.youtube.com/channel/UCotX63w9fF1eTCjda7Ux3Rw",
      spotify: "https://open.spotify.com/artist/5jahGHlIOiusgm19oJJujD",
    },
    channels: [AMAZON],
  },
];

export const services: Record<string, Service> = {
  pre: {
    slug: "pre-production",
    number: "01",
    title: "Pre-Production Services",
    eyebrow: "Pre-Production",
    tagline: "Ideas become worlds.",
    desc: "Story development, character design, concept art, scripts, storyboards, and visual development.",
    intro:
      "Every great frame begins long before the first render. Pre-production is where ideas are shaped, tested, and locked, building a rock-solid creative blueprint so production runs without surprises.",
    features: [
      "Concept Art",
      "Storyboarding",
      "Scriptwriting",
      "Animatic Production",
      "Character Design",
      "Environment & Prop Design",
    ],
    detail: [
      {
        name: "Concept Art",
        desc: "We translate the script and creative brief into the project's first visual language, exploring characters, environments, props, and color palettes until the world's look and mood is unmistakably defined.",
      },
      {
        name: "Storyboarding",
        desc: "Scene by scene, we draw the film as a sequence of panels that lock camera angles, staging, and the flow of action, turning the script into a clear visual roadmap the whole team can follow.",
      },
      {
        name: "Scriptwriting",
        desc: "We craft narrative, dialogue, and action lines written specifically for the screen and tuned for pacing, performance, and the rhythm of visual and audio storytelling.",
      },
      {
        name: "Animatic Production",
        desc: "Storyboard panels are edited together with scratch audio, dialogue, and precise timing to create the film's first moving 'rough cut' that proves pacing and story beats before a single frame is animated.",
      },
      {
        name: "Character Design",
        desc: "We develop each character's final look, including expressions, turnarounds, and model sheets, giving animators a consistent, production-ready reference for every angle and emotion.",
      },
      {
        name: "Environment & Prop Design",
        desc: "From sweeping locations to the smallest hand-held object, we design every background and prop the characters touch, keeping style, scale, and detail consistent across the entire world.",
      },
    ],
  },
  production: {
    slug: "production",
    number: "02",
    title: "Production Services",
    eyebrow: "Production",
    tagline: "Worlds come alive.",
    desc: "Modeling, rigging, animation, lighting, rendering, and production management.",
    intro:
      "This is where the blueprint comes alive. Frame by frame, our production team animates, builds, and choreographs every shot, turning designs and storyboards into fully realized motion.",
    features: [
      "Full and Partial Production Services",
      "2D Traditional Animation",
      "3D / CGI Animation",
      "Motion Graphics",
      "Rigging (Character Setup)",
      "Layout & Camera Posing",
      "Visual Effects (VFX)",
    ],
    detail: [
      /* First on purpose: this one frames how the six below can be
         bought — whole pipeline or single stage — so it reads as the
         answer to "what can I hire you for" before the list of what
         those stages are. */
      {
        name: "Full and Partial Production Services",
        desc: "Whether you need a complete production partner or support for a specific stage of your pipeline, our team scales to fit. We take on full productions from concept through final delivery, as well as targeted support across development, storyboarding, design, 2D and 3D animation, compositing, editing, and post-production. It's the same team and the same pipeline behind our own original worlds — working to your brief, your style, and your schedule.",
      },
      {
        name: "2D Traditional Animation",
        desc: "Hand-drawn, frame-by-frame animation where every drawing is crafted in sequence, the timeless craft that gives motion its weight, warmth, and expressive character.",
      },
      {
        name: "3D / CGI Animation",
        desc: "We bring digital 3D characters to life, driving rigs and models with believable performance, weight, and timing inside fully realized virtual scenes.",
      },
      {
        name: "Motion Graphics",
        desc: "We bring design into motion, animating typography, logos, icons, and abstract shapes into polished commercial and explainer videos that communicate with clarity and energy.",
      },
      {
        name: "Rigging (Character Setup)",
        desc: "We build each character's digital skeleton and control system, giving animators an intuitive, reliable rig to pose and perform 2D or 3D characters efficiently.",
      },
      {
        name: "Layout & Camera Posing",
        desc: "Before animation begins, we stage characters and cameras within the environment, composing every shot's framing, angle, and blocking to lock the visual storytelling.",
      },
      {
        name: "Visual Effects (VFX)",
        desc: "We craft and integrate digital effects such as fire, water, explosions, magic, and particle systems that blend seamlessly into animated or live-action footage and amplify its impact.",
      },
    ],
  },
  distribution: {
    slug: "distribution-growth",
    number: "03",
    title: "Distribution & Growth Services",
    eyebrow: "Distribution & Growth",
    tagline: "Stories find audiences.",
    desc: "YouTube strategy, channel management, audience development, publishing, analytics, and monetization.",
    intro:
      "Great stories deserve great audiences. This is where finished content meets the world. We grow channels, build loyal viewers, and turn views into sustainable, long-term revenue.",
    features: [
      "YouTube Strategy",
      "Channel Management",
      "Audience Development",
      "Publishing & Distribution",
      "Analytics & Insights",
      "Monetization",
    ],
    detail: [
      {
        name: "YouTube Strategy",
        desc: "We craft a tailored growth roadmap for each channel, covering content positioning, packaging, upload cadence, and format strategy designed to win attention and keep audiences coming back.",
      },
      {
        name: "Channel Management",
        desc: "We run the day-to-day of your channels end to end, from titles, thumbnails, and metadata to scheduling and community, keeping every brand consistent, healthy, and on-trend.",
      },
      {
        name: "Audience Development",
        desc: "We turn casual viewers into loyal fans, building durable audiences across regions and languages through localization, programming, and audience-first content decisions.",
      },
      {
        name: "Publishing & Distribution",
        desc: "We get content where the audience is across YouTube, OTT, broadcast, and social, managing rights, formats, and release windows for maximum reach.",
      },
      {
        name: "Analytics & Insights",
        desc: "We read the data behind every view, using retention, traffic, and audience signals to sharpen creative and compound growth over time.",
      },
      {
        name: "Monetization",
        desc: "We build sustainable revenue across ads, partnerships, licensing, and brand deals, turning popular content into lasting, diversified income.",
      },
    ],
  },
};

/* Tagline states the promise; desc must add something the tagline can't —
   a capability, a reach, a proof point. Never a paraphrase of the tagline. */
export const ventures: Venture[] = [
  {
    title: "Monal Kids",
    tagline: "Where every story begins.",
    desc: "Original stories, beloved characters and worlds children return to—again and again.",
    href: "https://www.youtube.com/@MonalKidsHindi",
  },
  {
    title: "Monal AI",
    tagline: "A trusted companion for curious minds.",
    desc: "Helping children learn, explore and ask questions in a safe, thoughtful way.",
    status: "Coming 2027",
  },
  {
    title: "Monal Games",
    tagline: "Play that sparks discovery.",
    desc: "Games designed to reward curiosity, creativity and problem-solving—not just screen time.",
    status: "Coming 2027",
  },
  {
    title: "Monal Preschool",
    tagline: "Where wonder takes root.",
    desc: "Early childhood experiences inspired by nature, imagination and joyful learning.",
    status: "Coming 2028",
  },
  {
    title: "Monal Academy",
    tagline: "Creating tomorrow's storytellers.",
    desc: "Training artists, animators and creators who will shape the future of children's entertainment.",
    href: "https://relianceacademyhld.com/",
  },
  {
    title: "Monal Consultancy",
    tagline: "Helping children's brands grow.",
    desc: "Strategy, production and distribution for creators who want to reach families around the world.",
    href: "/services",
  },
];

export const team: TeamMember[] = [
  {
    name: "Ajay Singh Bisht",
    role: "Founder & CEO",
    bio: "Building animation studios, digital brands, and children's media ecosystems.",
    img: "/assets/team/ajay-singh-bisht.jpeg",
    linkedin: "https://www.linkedin.com/in/iajaysinghbisht",
  },
  {
    name: "Anand Upadhyay",
    role: "Head of Production",
    bio: "Leading teams, pipelines, and creative execution from concept to delivery.",
    img: "/assets/team/anand-upadhyay.webp",
    linkedin: "https://www.linkedin.com/company/monaldigital",
  },
  {
    name: "Nitin Thirpola",
    role: "Creative Director",
    bio: "Crafting memorable characters, stories, and visual experiences.",
    img: "/assets/team/nitin-thirpola.webp",
    linkedin: "https://www.linkedin.com/in/nitin-thirpola-4b074b215",
  },
  {
    name: "Akshay Kumar Singh",
    role: "Operations & Growth",
    bio: "Ensuring projects, teams, and partnerships scale efficiently.",
    img: "/assets/team/akshay-kumar-singh.webp",
    linkedin: "https://www.linkedin.com/in/akshay-singh-70283b24b",
  },
  {
    name: "Kavindra Kaphaliya",
    role: "Senior Animator",
    bio: "Bringing characters to life with expressive, detail-rich animation.",
    img: "/assets/team/kavindra-kaphaliya.webp",
    linkedin: "https://www.linkedin.com/in/kavindra-kafaliya-49a767167",
  },
  {
    name: "Pratistha Saraf",
    role: "Digital Marketer",
    bio: "Growing our audience and brand presence across every channel.",
    img: "/assets/team/pratistha-saraf.webp",
    linkedin: "https://www.linkedin.com/in/pratisthasaraf26",
  },
  {
    name: "Khushi Rathore",
    role: "Human Resources",
    bio: "Building a happy, thriving team and a great place to create.",
    img: "/assets/team/khushi-rathore.webp",
    imgStyle: { zoom: 1.5, objectPosition: "center 50%" },
    linkedin: "https://www.linkedin.com/in/khushi-rathor-888838215",
  },
  {
    name: "Kunal Mali",
    role: "Software Developer",
    bio: "Engineering the platforms and tools that power the studio.",
    img: "/assets/team/kunal-mali.webp",
    imgStyle: { objectPosition: "center 25%" },
    linkedin: "https://www.linkedin.com/in/kunal-mali2",
  },
];
