import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CardImage } from "./CardImage";

vi.mock("next/image");

describe("CardImage", () => {
  it("renders next/image for remote URLs", () => {
    render(<CardImage src="https://example.com/mira.png" alt="Mira" />);
    expect(screen.getByRole("img", { name: "Mira" })).toBeInTheDocument();
  });

  it("renders a plain img for blob: URLs", () => {
    render(<CardImage src="blob:https://example.com/abc-123" alt="Mira" />);
    const img = screen.getByRole("img", { name: "Mira" });
    expect(img.getAttribute("src")).toBe("blob:https://example.com/abc-123");
  });

  it("passes the className through for both paths", () => {
    const { container: viaImage } = render(
      <CardImage src="https://example.com/mira.png" alt="Mira" className="w-full" />
    );
    expect(viaImage.querySelector("img")?.className).toContain("w-full");

    const { container: viaPlain } = render(
      <CardImage src="blob:https://example.com/x" alt="Nara" className="w-full" />
    );
    expect(viaPlain.querySelector("img")?.className).toContain("w-full");
  });
});
