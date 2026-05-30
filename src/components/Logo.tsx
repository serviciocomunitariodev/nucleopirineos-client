import useMultimediaQuery from "@/hooks/useMultimediaQuery";

export default function Logo() {
  const logoQuery = useMultimediaQuery({ section: "LOGO" });

  const logoUrl = logoQuery.data
    ?.slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)[0]
    ?.imageUrl;

  return (
    <img
      src={logoUrl ?? "/logo-nucleo.jpeg"}
      alt="Logo Nucleo Pirineos"
      className="h-full w-full object-contain"
      onError={(event) => {
        const image = event.currentTarget;
        if (image.src.includes("/logo-nucleo.jpeg")) {
          return;
        }

        image.src = "/logo-nucleo.jpeg";
      }}
    />
  );
}