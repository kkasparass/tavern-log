import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CharacterCard } from "./CharacterCard";
import { TransitionProvider, useTransition } from "@/components/transitions/TransitionProvider";
import { mockCharacterListItem } from "@/test/fixtures";

vi.mock("next/image");
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const withThumbnail = { ...mockCharacterListItem, thumbnailUrl: "https://example.com/mira.png" };

function HoverDisplay() {
  const { previewTheme, phase } = useTransition();
  return (
    <>
      <div data-testid="theme">{previewTheme ? "set" : "null"}</div>
      <div data-testid="bg">{previewTheme?.colors.bg ?? "null"}</div>
      <div data-testid="phase">{phase}</div>
    </>
  );
}

function renderCard(props = mockCharacterListItem) {
  return render(
    <TransitionProvider>
      <CharacterCard {...props} />
      <HoverDisplay />
    </TransitionProvider>
  );
}

describe("CharacterCard", () => {
  it("renders name, tagline and tags in overlay", () => {
    renderCard();
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
    renderCard({ ...mockCharacterListItem, tagline: null });
    expect(screen.getByText("mage · D&D 5e · The Shattered Crown")).toBeInTheDocument();
  });

  it("renders no subtext line when tagline and tags are empty", () => {
    renderCard({ ...mockCharacterListItem, tagline: null, tags: [] });
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(screen.queryByText(/mage/)).not.toBeInTheDocument();
  });

  it("renders tags in overlay", () => {
    renderCard();
    expect(screen.getByText("mage")).toBeInTheDocument();
    expect(screen.getByText("The Shattered Crown")).toBeInTheDocument();
  });

  it("links to the character page", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/characters/mira-ashveil");
  });

  it("renders thumbnail image when thumbnailUrl is set", () => {
    renderCard(withThumbnail);
    expect(screen.getByRole("img", { name: "Mira Ashveil" })).toBeInTheDocument();
  });

  it("renders placeholder when thumbnailUrl is null", () => {
    renderCard();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("sets previewTheme on mouseenter", async () => {
    renderCard();
    await userEvent.hover(screen.getByRole("link"));
    expect(screen.getByTestId("theme")).toHaveTextContent("set");
    expect(screen.getByTestId("bg")).toHaveTextContent("#1a1a2e");
  });

  it("clears previewTheme on mouseleave", async () => {
    renderCard();
    await userEvent.hover(screen.getByRole("link"));
    await userEvent.unhover(screen.getByRole("link"));
    expect(screen.getByTestId("theme")).toHaveTextContent("null");
  });

  it("passes the resolved theme to TransitionLink — legacy theme has no transition, so click routes immediately", async () => {
    renderCard();
    await userEvent.hover(screen.getByRole("link"));
    await userEvent.click(screen.getByRole("link"));
    // hover fires first (hover-preview), but navigate() pushed immediately — no covering
    expect(mockPush).toHaveBeenCalledWith("/characters/mira-ashveil");
    expect(screen.queryByTestId("phase")).toHaveTextContent("hover-preview");
  });
});
