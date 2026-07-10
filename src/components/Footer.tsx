interface FooterProps {
  tagline?: string;
}

export default function Footer({ tagline }: FooterProps) {
  return (
    <footer className="w-full mb-24 flex flex-col items-center text-center px-[20px] py-[24px] border-t border-outline-variant/30">
      {tagline && (
        <p className="font-body-sm text-on-surface-variant mb-2">{tagline}</p>
      )}
      <div className="flex gap-4">
        <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">
          Terms
        </a>
        <a className="text-on-surface-variant hover:text-primary transition-colors font-body-sm" href="#">
          Privacy
        </a>
      </div>
      <p className="font-label-bold text-on-surface-variant/50 mt-4">
        Dowry is illegal, but your attitude? That&apos;s tax-free. © 2024 Rishta Rate
      </p>
    </footer>
  );
}
