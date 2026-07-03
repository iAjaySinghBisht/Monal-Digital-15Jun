// Static site data. Image assets live under /public/assets and are referenced
// by absolute URL path (URL-safe, lowercase-kebab filenames).

export type Brand = { name: string; logo: string };
export type Project = { title: string; img: string; imgSq?: string };
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
export type Venture = { title: string; tagline: string; desc: string };
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  img: string;
  linkedin: string;
};

export const brands: Brand[] = [
  {
    name: "Lunar-X",
    logo: "https://lunar-x.com/images/logo/lunar-x.png",
  },
  {
    name: "Adruto",
    logo: "https://static.wixstatic.com/media/2d3abb_30370966b975496da23f0022befbb3c4~mv2.png/v1/fill/w_201,h_64,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/adruto%20logo%20(2).png",
  },
  {
    name: "The Boldeye",
    logo: "https://theboldeye.com/cdn/shop/files/Logo-01_05431799-1466-4a4c-b629-711baef09aab_410x.png?v=1734161385",
  },
];

export const projects: Project[] = [
  {
    title: "Zappy Toons",
    img: "/assets/projects/zappy-toons.webp",
    imgSq: "/assets/projects/zappy-toons-sq.webp",
  },
  {
    title: "Zappy Zoo",
    img: "/assets/projects/zappy-zoo.webp",
    imgSq: "/assets/projects/zappy-zoo-sq.webp",
  },
  {
    title: "Wands And Wings",
    img: "/assets/projects/wands-and-wings.webp",
  },
  {
    title: "Wands And Wings Junior",
    img: "/assets/projects/wands-and-wings-jr.webp",
  },
  {
    title: "Groovy The Martian",
    img: "/assets/projects/groovy-the-martian.webp",
  },
  {
    title: "Gigglebellies",
    img: "/assets/projects/gigglebellies.webp",
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
      "Voice Casting & Recording",
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
      {
        name: "Voice Casting & Recording",
        desc: "We find the right voices and direct talent through recording sessions, capturing performance-driven dialogue early so animation can be timed perfectly to the actors' delivery.",
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
      "2D Traditional Animation",
      "3D / CGI Animation",
      "Motion Graphics",
      "Rigging (Character Setup)",
      "Layout & Camera Posing",
      "Visual Effects (VFX)",
    ],
    detail: [
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

export const ventures: Venture[] = [
  {
    title: "Monal Kids Videos",
    tagline: "Stories kids press play on.",
    desc: "2D, 3D, and live-action videos, songs, shows, stories, and movies for children.",
  },
  {
    title: "Monal AI",
    tagline: "A friendly, safe companion.",
    desc: "A safe AI companion designed to help children learn, explore, ask questions, and grow.",
  },
  {
    title: "Monal Games",
    tagline: "Play that teaches.",
    desc: "Fun, educational, and age-appropriate games that inspire curiosity and creativity.",
  },
  {
    title: "Monal Preschool",
    tagline: "Where learning begins.",
    desc: "Early learning experiences rooted in creativity, care, curiosity, and culture.",
  },
  {
    title: "Monal Academy",
    tagline: "Skills for the next generation.",
    desc: "Training the next generation of artists, animators, creators, and storytellers.",
  },
  {
    title: "Monal Consultancy Services",
    tagline: "Brands that grow.",
    desc: "Helping kids' content brands grow through YouTube strategy, content planning, production, distribution, and channel management.",
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
];
