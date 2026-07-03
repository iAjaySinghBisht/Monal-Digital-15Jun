import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import UiAnimations from "@/components/UiAnimations";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Monal Digital — let's build something worth watching together.",
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: "Contact Us — Monal Digital",
    description:
      "Get in touch with Monal Digital — let's build something worth watching together.",
    url: "/contact-us",
  },
};

export default function ContactUsPage() {
  return (
    <>
      <UiAnimations />
      <ContactForm />
    </>
  );
}
