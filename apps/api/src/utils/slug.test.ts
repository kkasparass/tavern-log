import { describe, it, expect } from "vitest";
import { toSlug } from "./slug";

describe("toSlug", () => {
  it("lowercases the input", () => {
    expect(toSlug("Mira Ashveil")).toBe("mira-ashveil");
  });

  it("replaces spaces with hyphens", () => {
    expect(toSlug("the last spell")).toBe("the-last-spell");
  });

  it("collapses multiple spaces into one hyphen", () => {
    expect(toSlug("a  b")).toBe("a-b");
  });

  it("strips non-alphanumeric characters", () => {
    expect(toSlug("Crow's Foot")).toBe("crows-foot");
  });

  it("preserves existing hyphens", () => {
    expect(toSlug("D&D 5e")).toBe("dd-5e");
  });

  it("handles a plain alphanumeric string unchanged", () => {
    expect(toSlug("nara")).toBe("nara");
  });
});
