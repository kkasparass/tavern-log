import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CharacterCard } from "./CharacterCard";
import { TransitionProvider, useTransition } from "@/components/transitions/TransitionProvider";
import { mockCharacterListItem, bannerCardListItem, compactCardListItem, polaroidCardListItem } from "@/test/fixtures";

vi.mock("next/image");
const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

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

function withCardTemplate(
  template: string,
  settings: Record<string, unknown> = {}
) {
  return {
    ...mockCharacterListItem,
    theme: { ...mockCharacterListItem.theme, card: { template, settings } },
  };
}

describe("CharacterCard", () => {
  it("links to the character page", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/characters/mira-ashveil");
  });

  it("renders the stored card template", () => {
    renderCard(withCardTemplate("compact", { showTags: false }));
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    // compact template with showTags: false hides the tag pills
    expect(screen.queryByText("mage")).not.toBeInTheDocument();
  });

  it("renders the nested theme shape with card settings end-to-end", () => {
    // banner fixture: new-shape theme + card settings imageAlignment: "right"
    const { container } = renderCard(bannerCardListItem);
    expect(container.querySelector(".flex-row-reverse")).not.toBeNull();
  });

  it("falls back to the portrait template for an unknown template id", () => {
    renderCard(withCardTemplate("hologram"));
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it.each([
    ["portrait", mockCharacterListItem],
    ["banner", bannerCardListItem],
    ["compact", compactCardListItem],
    ["polaroid", polaroidCardListItem],
  ])("sets and clears previewTheme on hover for the %s template", async (_label, character) => {
    renderCard(character);
    await userEvent.hover(screen.getByRole("link"));
    expect(screen.getByTestId("theme")).toHaveTextContent("set");
    expect(screen.getByTestId("bg")).toHaveTextContent("#1a1a2e");
    await userEvent.unhover(screen.getByRole("link"));
    expect(screen.getByTestId("theme")).toHaveTextContent("null");
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
