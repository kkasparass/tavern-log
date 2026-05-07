import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransitionLink } from "./TransitionLink";
import { TransitionProvider } from "./TransitionProvider";
import { TransitionId } from "@/lib/themes/types";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

function renderLink(transitionId: TransitionId | null) {
  return render(
    <TransitionProvider>
      <TransitionLink href="/characters/mira-ashveil" transitionId={transitionId}>
        Go to Mira
      </TransitionLink>
    </TransitionProvider>
  );
}

describe("TransitionLink", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders children", () => {
    renderLink("floral-bloom");
    expect(screen.getByText("Go to Mira")).toBeInTheDocument();
  });

  it("renders as an anchor with correct href", () => {
    renderLink("floral-bloom");
    expect(screen.getByRole("link")).toHaveAttribute("href", "/characters/mira-ashveil");
  });

  it("accepts a className prop", () => {
    render(
      <TransitionProvider>
        <TransitionLink href="/target" transitionId={null} className="my-class">
          Link
        </TransitionLink>
      </TransitionProvider>
    );
    expect(screen.getByRole("link")).toHaveClass("my-class");
  });

  it("with transitionId: does not call router.push immediately on click (uses covering phase)", async () => {
    renderLink("floral-bloom");
    await userEvent.click(screen.getByText("Go to Mira"));
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("with null transitionId: calls router.push directly on click", async () => {
    renderLink(null);
    await userEvent.click(screen.getByText("Go to Mira"));
    expect(mockPush).toHaveBeenCalledWith("/characters/mira-ashveil");
  });

  it("prevents default browser navigation on click", async () => {
    renderLink("floral-bloom");
    const link = screen.getByRole("link");
    const clickEvent = new MouseEvent("click", { bubbles: true, cancelable: true });
    link.dispatchEvent(clickEvent);
    expect(clickEvent.defaultPrevented).toBe(true);
  });
});
