import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BannerCard } from "./BannerCard";
import { CardImageAlignment } from "@/lib/themes/types";
import { mockCharacterListItem } from "@/test/fixtures";

vi.mock("next/image");

function renderBanner(
  props: Partial<typeof mockCharacterListItem> = {},
  settings: { imageAlignment: CardImageAlignment } = { imageAlignment: CardImageAlignment.Left }
) {
  return render(<BannerCard {...mockCharacterListItem} {...props} settings={settings} />);
}

describe("BannerCard", () => {
  it("renders name, tagline and tags in the text block", () => {
    renderBanner();
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ex-court mage turned wandering debt collector. The Ashwood remembers her."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("mage")).toBeInTheDocument();
  });

  it("falls back to the first 3 tags as subtext when tagline is empty", () => {
    renderBanner(
      { tagline: null, tags: ["mage", "D&D 5e", "The Shattered Crown", "debt collector"] },
      { imageAlignment: CardImageAlignment.Left }
    );
    expect(screen.getByText("mage · D&D 5e · The Shattered Crown")).toBeInTheDocument();
  });

  it("renders thumbnail image when thumbnailUrl is set", () => {
    renderBanner({ thumbnailUrl: "https://example.com/mira.png" });
    expect(screen.getByRole("img", { name: "Mira Ashveil" })).toBeInTheDocument();
  });

  it("renders placeholder when thumbnailUrl is null", () => {
    renderBanner();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("places the image left by default", () => {
    const { container } = renderBanner();
    expect(container.firstElementChild?.classList.contains("flex-row-reverse")).toBe(false);
  });

  it("mirrors the layout when imageAlignment is right", () => {
    const { container } = renderBanner({}, { imageAlignment: CardImageAlignment.Right });
    expect(container.firstElementChild?.classList.contains("flex-row-reverse")).toBe(true);
  });
});
