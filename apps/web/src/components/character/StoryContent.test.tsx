import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StoryContent } from "./StoryContent";
import { renderWithQuery } from "@/test/utils";
import { mockStory } from "@/test/fixtures";

const slug = "mira-ashveil";
const storySlug = "the-last-spell";
const cacheKey = ["story", slug, storySlug];

describe("StoryContent", () => {
  it("renders the story title and content", () => {
    renderWithQuery(<StoryContent slug={slug} storySlug={storySlug} />, [[cacheKey, mockStory]]);
    expect(screen.getByRole("heading", { name: "The Last Spell" })).toBeInTheDocument();
    expect(screen.getByText(/The tower was already burning/)).toBeInTheDocument();
  });

  it("strips script tags from rendered HTML", () => {
    const malicious = { ...mockStory, content: "<p>Safe content</p><script>alert(1)</script>" };
    renderWithQuery(<StoryContent slug={slug} storySlug={storySlug} />, [[cacheKey, malicious]]);
    expect(screen.getByText("Safe content")).toBeInTheDocument();
    expect(document.querySelector("script")).not.toBeInTheDocument();
  });

  it("renders nothing when data is not in cache", () => {
    const { container } = renderWithQuery(<StoryContent slug={slug} storySlug={storySlug} />, []);
    expect(container).toBeEmptyDOMElement();
  });
});
