import { ImageResponse } from "next/og"
import { profile, experience } from "./data/profile"

export const alt = `${profile.name} — ${profile.title}`
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

/**
 * Link previews were falling back to a blank card: twitter.card was set to
 * summary_large_image with no image to show. This renders one at build time.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "#07090b",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        <div style={{ display: "flex", color: "#46e58a", fontSize: 30, marginBottom: 28 }}>
          umar@darsot.ca:~$
        </div>
        <div style={{ display: "flex", color: "#cfe8d8", fontSize: 88, fontWeight: 700, letterSpacing: "-0.02em" }}>
          {profile.name}
        </div>
        <div style={{ display: "flex", color: "#46e58a", fontSize: 40, marginTop: 20 }}>
          {profile.title}
        </div>
        <div style={{ display: "flex", color: "#74907f", fontSize: 28, marginTop: 28 }}>
          {experience
            .slice(0, 3)
            .map((e) => e.company)
            .join("  ·  ")}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            color: "#74907f",
            fontSize: 26,
            borderTop: "2px solid #ffffff1f",
            paddingTop: 26,
          }}
        >
          darsot.ca — type `help`
        </div>
      </div>
    ),
    size,
  )
}
