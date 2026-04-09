import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Lightbox } from "./Lightbox";

describe("Lightbox", () => {
  it("renders the image with the correct src", () => {
    render(<Lightbox src="https://example.com/image.jpg" onClose={vi.fn()} />);
    // alt="" gives the img role=presentation, so we query by element type
    const img = document.querySelector("img");
    expect(img).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("calls onClose when the backdrop is clicked", async () => {
    const onClose = vi.fn();
    const { container } = render(
      <Lightbox src="https://example.com/image.jpg" onClose={onClose} />
    );
    await userEvent.click(container.firstChild as HTMLElement);
    expect(onClose).toHaveBeenCalled();
  });

  it("does not call onClose when the image itself is clicked", async () => {
    const onClose = vi.fn();
    render(<Lightbox src="https://example.com/image.jpg" onClose={onClose} />);
    const img = document.querySelector("img")!;
    await userEvent.click(img);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    render(<Lightbox src="https://example.com/image.jpg" onClose={onClose} />);
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
