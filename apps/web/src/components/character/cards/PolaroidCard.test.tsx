import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PolaroidCard } from "./PolaroidCard";
import { mockCharacterListItem } from "@/test/fixtures";

vi.mock("next/image");

function renderPolaroid(
  props: Partial<typeof mockCharacterListItem> = {},
  settings: { rotation: number; frameColor: string } = { rotation: -3, frameColor: "#f5f0e6" }
) {
  return render(<PolaroidCard {...mockCharacterListItem} {...props} settings={settings} />);
}

describe("PolaroidCard", () => {
  it("renders name, tagline and tags on the frame", () => {
    renderPolaroid();
    expect(screen.getByText("Mira Ashveil")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Ex-court mage turned wandering debt collector. The Ashwood remembers her."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("mage")).toBeInTheDocument();
  });

  it("applies the rotation and frame colour to the frame element", () => {
    const { container } = renderPolaroid();
    const frame = container.firstElementChild as HTMLElement;
    expect(frame.style.transform).toBe("rotate(-3deg)");
    expect(frame.style.backgroundColor).toBe("rgb(245, 240, 230)");
  });

  it("clamps rotation to ±6 degrees", () => {
    const { container } = renderPolaroid({}, { rotation: 45, frameColor: "#ffffff" });
    expect((container.firstElementChild as HTMLElement).style.transform).toBe("rotate(6deg)");
  });

  it("applies the frame colour to the frame background", () => {
    const { container } = renderPolaroid({}, { rotation: 0, frameColor: "#ff0000" });
    expect((container.firstElementChild as HTMLElement).style.backgroundColor).toBe(
      "rgb(255, 0, 0)"
    );
  });

  it("renders thumbnail image when thumbnailUrl is set", () => {
    renderPolaroid({ thumbnailUrl: "https://example.com/mira.png" });
    expect(screen.getByRole("img", { name: "Mira Ashveil" })).toBeInTheDocument();
  });

  it("renders placeholder when thumbnailUrl is null", () => {
    renderPolaroid();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
