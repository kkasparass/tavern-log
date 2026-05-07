import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DecorationSlot } from "./DecorationSlot";

vi.mock("@/lib/themes/decorations", () => ({
  getDecoration: vi.fn(),
}));

import { getDecoration } from "@/lib/themes/decorations";
const mockGetDecoration = vi.mocked(getDecoration);

function StubComponent() {
  return <div data-testid="decoration">stub decoration</div>;
}

describe("DecorationSlot", () => {
  it("renders nothing when decorationSet is null", () => {
    const { container } = render(<DecorationSlot slot="header-top" decorationSet={null} />);
    expect(container).toBeEmptyDOMElement();
    expect(mockGetDecoration).not.toHaveBeenCalled();
  });

  it("renders nothing when getDecoration returns null", () => {
    mockGetDecoration.mockReturnValue(null);
    const { container } = render(<DecorationSlot slot="background" decorationSet="forest" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the component returned by getDecoration", async () => {
    mockGetDecoration.mockReturnValue(StubComponent);
    render(<DecorationSlot slot="header-top" decorationSet="forest" />);
    expect(await screen.findByTestId("decoration")).toBeInTheDocument();
  });

  it("calls getDecoration with the correct set and slot", () => {
    mockGetDecoration.mockReturnValue(null);
    render(<DecorationSlot slot="tabs-top" decorationSet="forest" />);
    expect(mockGetDecoration).toHaveBeenCalledWith("forest", "tabs-top");
  });

  it("renders nothing for 'none' decoration set when getDecoration returns null", () => {
    mockGetDecoration.mockReturnValue(null);
    const { container } = render(<DecorationSlot slot="page-edge-left" decorationSet="none" />);
    expect(container).toBeEmptyDOMElement();
  });
});
