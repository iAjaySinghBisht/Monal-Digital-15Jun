import CreatureMaker from "./CreatureMaker";
import InfiniteZoom from "./InfiniteZoom";
import LivingWordmark from "./LivingWordmark";
import LogoFamily from "./LogoFamily";
import RevealSting from "./RevealSting";
import type { Toy } from "@/data/play";

/** Single place that maps a registry entry to its component, used by both the
 *  /play/<toy> pages and the chromeless /embed/<toy> routes. */
export default function ToyBySlug({ toy, embedded = false }: { toy: Toy; embedded?: boolean }) {
  const shared = { intro: toy.intro, aspect: toy.aspect };
  switch (toy.slug) {
    case "wordmark":
      return <LivingWordmark {...shared} embedded={embedded} />;
    case "creature":
      return <CreatureMaker {...shared} embedded={embedded} />;
    case "zoom":
      return <InfiniteZoom {...shared} embedded={embedded} />;
    case "reveal":
      return <RevealSting {...shared} embedded={embedded} />;
    case "family":
      return <LogoFamily {...shared} />;
  }
}
