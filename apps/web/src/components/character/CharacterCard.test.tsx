import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CharacterCard } from "./CharacterCard";
import { TransitionProvider, useTransition } from "@/components/transitions/TransitionProvider";
import { mockCharacterListItem } from "@/test/fixtures";

vi.mock("next/image");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

function HoverDisplay() {
  const { hoveredCharacter } = useTransition();
  return <div data-testid="hovered">{hoveredCharacter ? "set" : "null"}</div>;
}

function renderCard() {
  return render(
    <TransitionProvider>
      <CharacterCard {...mockCharacterListItem} />
      <HoverDisplay />
    </TransitionProvider>
  );
}

describe("CharacterCard", () => {
  it("renders name and system", () => {
    renderCard();
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    // 'D&D 5e' appears twice: once as the system label, once as a tag
    expect(screen.getAllByText("D&D 5e")).toHaveLength(2);
  });

  it("renders tags", () => {
    renderCard();
    expect(screen.getByText("mage")).toBeInTheDocument();
    expect(screen.getByText("retired")).toBeInTheDocument();
  });

  it("links to the character page", () => {
    renderCard();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/characters/mira-ashveil");
  });

  it("sets hovered character on mouseenter", async () => {
    renderCard();
    await userEvent.hover(screen.getByRole("link"));
    expect(screen.getByTestId("hovered")).toHaveTextContent("set");
  });

  it("clears hovered character on mouseleave", async () => {
    renderCard();
    await userEvent.hover(screen.getByRole("link"));
    await userEvent.unhover(screen.getByRole("link"));
    expect(screen.getByTestId("hovered")).toHaveTextContent("null");
  });
});
