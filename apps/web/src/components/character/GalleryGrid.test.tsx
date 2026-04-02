import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { GalleryGrid } from "./GalleryGrid";
import { renderWithQuery } from "@/test/utils";
import { mockCharacter } from "@/test/fixtures";

vi.mock("./Lightbox", () => ({
  Lightbox: ({
    index,
    artworks,
    onClose,
  }: {
    index: number;
    artworks: { title: string | null }[];
    onClose: () => void;
  }) => (
    <div data-testid="lightbox" data-index={index}>
      <button onClick={onClose} aria-label="Close" />
      <span>{artworks[index]?.title}</span>
    </div>
  ),
}));

const slug = "mira-ashveil";

describe("GalleryGrid", () => {
  it("renders artwork thumbnails as buttons with correct aria-labels", () => {
    renderWithQuery(<GalleryGrid slug={slug} />, [[["character", slug], mockCharacter]]);
    expect(screen.getByRole("button", { name: "Mira in the Ashwood" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "The Tower Burning" })).toBeInTheDocument();
  });

  it("shows empty state when character has no artworks", () => {
    const data = { ...mockCharacter, artworks: [] };
    renderWithQuery(<GalleryGrid slug={slug} />, [[["character", slug], data]]);
    expect(screen.getByText("No artwork yet.")).toBeInTheDocument();
  });

  it("renders nothing when data is not in cache", () => {
    const { container } = renderWithQuery(<GalleryGrid slug={slug} />, []);
    expect(container).toBeEmptyDOMElement();
  });

  it("clicking a thumbnail opens the Lightbox", () => {
    renderWithQuery(<GalleryGrid slug={slug} />, [[["character", slug], mockCharacter]]);
    expect(screen.queryByTestId("lightbox")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mira in the Ashwood" }));
    expect(screen.getByTestId("lightbox")).toBeInTheDocument();
  });

  it("lightbox opens at the correct index", () => {
    renderWithQuery(<GalleryGrid slug={slug} />, [[["character", slug], mockCharacter]]);
    fireEvent.click(screen.getByRole("button", { name: "The Tower Burning" }));
    expect(screen.getByTestId("lightbox")).toHaveAttribute("data-index", "1");
  });

  it("closing the lightbox removes it from the DOM", () => {
    renderWithQuery(<GalleryGrid slug={slug} />, [[["character", slug], mockCharacter]]);
    fireEvent.click(screen.getByRole("button", { name: "Mira in the Ashwood" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByTestId("lightbox")).not.toBeInTheDocument();
  });
});
