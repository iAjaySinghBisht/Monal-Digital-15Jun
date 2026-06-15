// Styling map applied to compiled MDX so post bodies match the Monal Digital
// "bento" design language (Onest type, ink/muted palette, soft accents).

export const mdxComponents = {
  h2: (props) => (
    <h2
      className="font-display text-[clamp(1.6rem,3.2vw,2.2rem)] tracking-tight text-ink mt-14 mb-5"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="font-display text-[clamp(1.3rem,2.4vw,1.6rem)] tracking-tight text-ink mt-10 mb-4"
      {...props}
    />
  ),
  p: (props) => (
    <p className="text-ink/75 text-[1.075rem] leading-[1.8] my-5" {...props} />
  ),
  a: (props) => (
    <a
      className="text-royal font-medium underline decoration-royal/30 underline-offset-4 hover:decoration-royal transition"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="my-5 space-y-2.5 text-ink/75 text-[1.075rem] leading-[1.7]" {...props} />
  ),
  ol: (props) => (
    <ol
      className="my-5 space-y-2.5 text-ink/75 text-[1.075rem] leading-[1.7] list-decimal pl-5 marker:text-royal marker:font-semibold"
      {...props}
    />
  ),
  li: ({ children, ...rest }) => (
    <li className="pl-1.5 marker:text-royal" {...rest}>
      {children}
    </li>
  ),
  blockquote: (props) => (
    <blockquote
      className="my-8 border-l-[3px] border-sun pl-6 py-1 font-display text-[clamp(1.25rem,2.6vw,1.7rem)] leading-snug tracking-tight text-ink"
      {...props}
    />
  ),
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  hr: () => <hr className="rule-fade my-12" />,
  code: (props) => (
    <code
      className="rounded-md bg-cloud px-1.5 py-0.5 text-[0.92em] font-medium text-ink"
      {...props}
    />
  ),
};
