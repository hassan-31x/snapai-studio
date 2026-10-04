import { ImageResponse } from "next/og";
export const alt = "Stillframe: your product, a whole new perspective";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#fafbfc",
        color: "#1d222b",
        width: "100%",
        height: "100%",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 32, display: "flex" }}>Stillframe</div>
      <div
        style={{
          fontSize: 72,
          lineHeight: 1.1,
          letterSpacing: -3,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>Your product.</div>
        <div>A whole new perspective.</div>
      </div>
      <div style={{ fontSize: 24, color: "#69707c" }}>
        Your independent creative studio.
      </div>
    </div>,
    size,
  );
}
