import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PortraitCard } from "./PortraitCard";
import { mockCharacterListItem } from "@/test/fixtures";

vi.mock("next/image");

const withThumbnail = { ...mockCharacterListItem, thumbnailUrl: "https://example.com/mira.png" };

function renderPortrait(props = mockCharacterListItem) {
  return render(<PortraitCard {...props} settings={{}} />);
}

describe("PortraitCard", () => {
  it("renders name, tagline and tags in overlay", () => {
    renderPortrait();
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ex-court mage turned wandering debt collector. The Ashwood remembers her."
      )
    ).toBeInTheDocument();
    // tagline replaces the old system label, so 'D&D 5e' appears only as a tag
    expect(screen.getAllByText("D&D 5e")).toHaveLength(1);
  });

  it("falls back to the first 3 tags as subtext when tagline is empty", () => {
    renderPortrait({ ...mockCharacterListItem, tagline: null });
    expect(screen.getByText("mage · D&D 5e · The Shattered Crown")).toBeInTheDocument();
  });

  it("renders no subtext line when tagline and tags are empty", () => {
    renderPortrait({ ...mockCharacterListItem, tagline: null, tags: [] });
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(screen.queryByText(/mage/)).not.toBeInTheDocument();
  });

  it("renders tags in overlay", () => {
    renderPortrait();
    expect(screen.getByText("mage")).toBeInTheDocument();
    expect(screen.getByText("The Shattered Crown")).toBeInTheDocument();
  });

  it("renders thumbnail image when thumbnailUrl is set", () => {
    renderPortrait(withThumbnail);
    expect(screen.getByRole("img", { name: "Mira Ashveil" })).toBeInTheDocument();
  });

  it("renders placeholder when thumbnailUrl is null", () => {
    renderPortrait();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
