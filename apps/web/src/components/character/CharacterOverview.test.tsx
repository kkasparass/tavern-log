import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CharacterOverview } from "./CharacterOverview";
import { renderWithQuery } from "@/test/utils";
import { mockCharacter } from "@/test/fixtures";

const slug = "mira-ashveil";
const cacheEntry = [[["character", slug], mockCharacter]] as const;

describe("CharacterOverview", () => {
  it("renders bio, personality and tags from cache", () => {
    renderWithQuery(<CharacterOverview slug={slug} />, cacheEntry);
    expect(screen.getByText(mockCharacter.bio!)).toBeInTheDocument();
    expect(screen.getByText(mockCharacter.personality!)).toBeInTheDocument();
    expect(screen.getByText("mage")).toBeInTheDocument();
    expect(screen.getByText("retired")).toBeInTheDocument();
  });

  it("omits sections for null bio and personality", () => {
    const data = { ...mockCharacter, bio: null, personality: null };
    renderWithQuery(<CharacterOverview slug={slug} />, [[["character", slug], data]]);
    expect(screen.queryByText("Bio")).not.toBeInTheDocument();
    expect(screen.queryByText("Personality")).not.toBeInTheDocument();
  });

  it("renders nothing when data is not in cache", () => {
    const { container } = renderWithQuery(<CharacterOverview slug={slug} />, []);
    expect(container).toBeEmptyDOMElement();
  });
});
