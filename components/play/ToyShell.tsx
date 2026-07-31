"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useCopy } from "./usePlayLink";

/* The frame every toy sits in: a dark rounded "screen", an action bar, and a
 * light panel of controls underneath. The dark screen is deliberate — the logo's
 * palette is neon and needs ink behind it, and the site already uses black
 * sections (see the About hero), so it reads as part of the same family. */

function ActionButton({
  children,
  onClick,
  tone = "quiet",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: "quiet" | "loud";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-11 rounded-full px-5 text-[14px] font-semibold transition-colors disabled:opacity-40 ${
        tone === "loud"
          ? "bg-ink text-white hover:bg-royal"
          : "border border-line bg-paper text-ink hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}

export default function ToyShell({
  title,
  intro,
  slug,
  aspect,
  screen,
  actions,
  onSave,
  saveLabel = "Save as picture",
  embeddable = true,
  children,
}: {
  title: string;
  intro: string;
  slug: string;
  aspect: string;
  screen: ReactNode;
  /** Toy-specific buttons, shown before the shared ones. */
  actions?: ReactNode;
  onSave?: () => void | Promise<void>;
  saveLabel?: string;
  embeddable?: boolean;
  children: ReactNode;
}) {
  const { copy, copied } = useCopy();
  const [showEmbed, setShowEmbed] = useState(false);
  const [embedCode, setEmbedCode] = useState("");
  const [saving, setSaving] = useState(false);

  /* Built on the client because it depends on the current query string, which
     is where a toy's settings live. */
  useEffect(() => {
    if (!showEmbed) return;
    const url = `${window.location.origin}/embed/${slug}${window.location.search}`;
    const [w, h] = aspect.split("/").map((n) => Number(n.trim()));
    const ratio = w && h ? (h / w) * 100 : 56.25;
    setEmbedCode(
      `<div style="position:relative;width:100%;padding-top:${ratio.toFixed(3)}%">\n` +
        `  <iframe src="${url}" title="${title} — Monal Digital"\n` +
        `    style="position:absolute;inset:0;width:100%;height:100%;border:0"\n` +
        `    loading="lazy" allowfullscreen></iframe>\n` +
        `</div>`,
    );
  }, [showEmbed, slug, aspect, title]);

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    try {
      await onSave();
    } catch (err) {
      console.error("play/ToyShell save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-8">
      <header className="max-w-2xl">
        <h1 className="font-display text-[clamp(2.1rem,5.4vw,3.4rem)] leading-[0.98] tracking-[-0.035em]">
          {title}
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">{intro}</p>
      </header>

      {/* The screen */}
      <div
        className="relative overflow-hidden rounded-[28px] bg-black"
        style={{ aspectRatio: aspect }}
      >
        {screen}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2.5">
        {actions}
        {onSave && (
          <ActionButton onClick={handleSave} tone="loud" disabled={saving}>
            {saving ? "Saving…" : saveLabel}
          </ActionButton>
        )}
        <ActionButton onClick={() => copy(window.location.href)}>
          {copied ? "Link copied" : "Copy link"}
        </ActionButton>
        {embeddable && (
          <ActionButton onClick={() => setShowEmbed((v) => !v)}>
            {showEmbed ? "Hide embed code" : "Embed"}
          </ActionButton>
        )}
      </div>

      {embeddable && showEmbed && (
        <div className="rounded-2xl border border-line bg-mist p-5">
          <p className="mb-3 text-[13px] text-muted">
            Paste this anywhere. It keeps the settings you have right now.
          </p>
          <textarea
            readOnly
            value={embedCode}
            rows={5}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full resize-none rounded-xl border border-line bg-paper p-3.5 font-mono text-[12.5px] leading-relaxed text-ink"
          />
          <div className="mt-3">
            <ActionButton onClick={() => copy(embedCode)}>
              {copied ? "Copied" : "Copy code"}
            </ActionButton>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="card p-6 sm:p-8">{children}</div>
    </div>
  );
}
