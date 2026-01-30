import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const outfit = await fetch(
    new URL("https://fonts.googleapis.com/css2?family=Outfit:wght@600", "https://fonts.googleapis.com")
  ).then((res) => res.text());

  const fontUrl = outfit.match(/src: url\((.+?)\)/)?.[1];
  const fontData = fontUrl
    ? await fetch(fontUrl).then((res) => res.arrayBuffer())
    : undefined;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f2f0ec",
          borderRadius: 6,
          fontFamily: "Outfit",
          fontSize: 28,
          fontWeight: 600,
          color: "#282c20",
          lineHeight: 1,
          textAlign: "center",
          paddingLeft: 1,
        }}
      >
        O
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Outfit",
              data: fontData,
              style: "normal",
              weight: 600,
            },
          ]
        : [],
    }
  );
}
