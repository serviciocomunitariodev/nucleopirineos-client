import useMultimediaQuery from "@/hooks/useMultimediaQuery";

type LogoProps = {
  sortOrder?: number;
  className?: string;
};

const DEFAULT_CLASS = "h-full w-full object-contain";

const FALLBACKS: Record<number, string> = {
  1: "/logo-nucleo.png",
  2: "/icon-nucleo.png",
};

export default function Logo({ sortOrder = 1, className }: LogoProps) {
  const logoQuery = useMultimediaQuery({ section: "LOGO" });

  const logos = (logoQuery.data ?? []).slice().sort((a, b) => a.sortOrder - b.sortOrder);
  const logoItem = sortOrder === 1 ? logos[0] : logos.find((l) => l.sortOrder === sortOrder);
  const logoUrl = logoItem?.imageUrl;

  const fallback = FALLBACKS[sortOrder];

  return (
    <img
      src={logoUrl ?? fallback ?? ""}
      alt="Logo Nucleo Pirineos"
      className={className ?? DEFAULT_CLASS}
      onError={(event) => {
        const image = event.currentTarget;
        if (!fallback || image.src === fallback) return;
        image.src = fallback;
      }}
    />
  );
}