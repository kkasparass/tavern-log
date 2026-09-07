import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CompactCard } from "./CompactCard";
import { mockCharacterListItem } from "@/test/fixtures";

vi.mock("next/image");

function renderCompact(
  props: Partial<typeof mockCharacterListItem> = {},
  settings: { showTags: boolean } = { showTags: true }
) {
  return render(<CompactCard {...mockCharacterListItem} {...props} settings={settings} />);
}

describe("CompactCard", () => {
  it("renders name and tagline", () => {
    renderCompact();
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ex-court mage turned wandering debt collector. The Ashwood remembers her."
      )
    ).toBeInTheDocument();
  });

  it("falls back to the first 3 tags as subtext when tagline is empty", () => {
    renderCompact({ tagline: null });
    expect(screen.getByText("mage · D&D 5e · The Shattered Crown")).toBeInTheDocument();
  });

  it("shows tag pills when showTags is true", () => {
    renderCompact();
    expect(screen.getByText("mage")).toBeInTheDocument();
    expect(screen.getByText("D&D 5e")).toBeInTheDocument();
  });

  it("hides tag pills when showTags is false", () => {
    renderCompact({}, { showTags: false });
    expect(screen.queryByText("mage")).not.toBeInTheDocument();
  });

  it("renders thumbnail image when thumbnailUrl is set", () => {
    renderCompact({ thumbnailUrl: "https://example.com/mira.png" });
    expect(screen.getByRole("img", { name: "Mira Ashveil" })).toBeInTheDocument();
  });

  it("renders placeholder when thumbnailUrl is null", () => {
    renderCompact();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
