import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Eyebrow } from "@/components/Decor";

export default function NotFound() {
  return (
    <>
      <Header />
      <section className="min-h-[70vh] grid place-items-center bg-paper px-6 text-center">
        <div>
          <Eyebrow dot="bg-royal">404</Eyebrow>
          <h1 className="mt-6 font-display text-[clamp(2rem,6vw,3.5rem)] tracking-tight text-ink">
            That page has wandered off.
          </h1>
          <p className="mt-4 text-muted">
            The page you&apos;re after doesn&apos;t exist (or moved).
          </p>
          <Link href="/" className="btn btn-dark mt-8">
            Back home
          </Link>
        </div>
      </section>
      <Footer />
    </>
  );
}
