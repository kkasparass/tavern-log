import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CharacterGrid } from "./CharacterGrid";
import { TransitionProvider } from "@/components/transitions/TransitionProvider";
import { renderWithQuery } from "@/test/utils";
import { mockCharacterListItem, naraCharacterListItem } from "@/test/fixtures";

vi.mock("next/image");
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const twoCharacters = [mockCharacterListItem, naraCharacterListItem];

function renderGrid(data = twoCharacters) {
  return renderWithQuery(
    <TransitionProvider>
      <CharacterGrid />
    </TransitionProvider>,
    [[["characters"], data]]
  );
}

describe("CharacterGrid", () => {
  it("renders character cards from pre-populated query cache", () => {
    renderGrid();
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(screen.getByText("Nara Solis")).toBeInTheDocument();
  });

  it("filter by tag hides non-matching cards", () => {
    renderGrid();
    const [tagSelect] = screen.getAllByRole("combobox");
    fireEvent.click(tagSelect);
    fireEvent.click(screen.getByRole("option", { name: "scoundrel" }));
    expect(screen.getByText("Nara Solis")).toBeInTheDocument();
    expect(screen.queryByText("Mira Ashveil")).not.toBeInTheDocument();
  });

  it("renders only the tag filter (no system filter)", () => {
    renderGrid();
    expect(screen.getAllByRole("combobox")).toHaveLength(1);
    expect(screen.queryByText("All systems")).not.toBeInTheDocument();
  });
});
