import { screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CharacterGrid } from "./CharacterGrid";
import { renderWithQuery } from "@/test/utils";
import { mockCharacterListItem, naraCharacterListItem } from "@/test/fixtures";

vi.mock("next/link");
vi.mock("next/image");

const twoCharacters = [mockCharacterListItem, naraCharacterListItem];

describe("CharacterGrid", () => {
  it("renders character cards from pre-populated query cache", () => {
    renderWithQuery(<CharacterGrid />, [[["characters"], twoCharacters]]);
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(screen.getByText("Nara Solis")).toBeInTheDocument();
  });

  it("filter by system hides non-matching cards", () => {
    renderWithQuery(<CharacterGrid />, [[["characters"], twoCharacters]]);
    const [systemSelect] = screen.getAllByRole("combobox");
    fireEvent.change(systemSelect, { target: { value: "D&D 5e" } });
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(screen.queryByText("Nara Solis")).not.toBeInTheDocument();
  });

  it("filter by tag hides non-matching cards", () => {
    renderWithQuery(<CharacterGrid />, [[["characters"], twoCharacters]]);
    const [, tagSelect] = screen.getAllByRole("combobox");
    fireEvent.change(tagSelect, { target: { value: "scoundrel" } });
    expect(screen.getByText("Nara Solis")).toBeInTheDocument();
    expect(screen.queryByText("Mira Ashveil")).not.toBeInTheDocument();
  });
});
