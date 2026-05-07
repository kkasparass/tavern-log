import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TransitionProvider, useTransition } from "./TransitionProvider";
import { DEFAULT_THEME } from "@/lib/themes/presets";

const mockPush = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

function PhaseDisplay() {
  const { phase, hoveredCharacter, activeTransition } = useTransition();
  return (
    <>
      <div data-testid="phase">{phase}</div>
      <div data-testid="hovered">{hoveredCharacter ? "set" : "null"}</div>
      <div data-testid="transition">{activeTransition ?? "null"}</div>
    </>
  );
}

function Controls() {
  const { setHoveredCharacter, clearHoveredCharacter, navigate, preview, onCoverComplete, onUncoverComplete } =
    useTransition();
  return (
    <>
      <button onClick={() => setHoveredCharacter(DEFAULT_THEME)}>set-hovered</button>
      <button onClick={clearHoveredCharacter}>clear-hovered</button>
      <button onClick={() => navigate("/target", "floral-bloom")}>navigate-transition</button>
      <button onClick={() => navigate("/target", null)}>navigate-immediate</button>
      <button onClick={() => preview("floral-bloom")}>preview</button>
      <button onClick={onCoverComplete}>cover-complete</button>
      <button onClick={onUncoverComplete}>uncover-complete</button>
    </>
  );
}

function TestTree() {
  return (
    <TransitionProvider>
      <PhaseDisplay />
      <Controls />
    </TransitionProvider>
  );
}

describe("TransitionProvider", () => {
  beforeEach(() => vi.clearAllMocks());

  it("starts in idle phase with null hovered and transition", () => {
    render(<TestTree />);
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("hovered")).toHaveTextContent("null");
    expect(screen.getByTestId("transition")).toHaveTextContent("null");
  });

  it("setHoveredCharacter transitions idle → hover-preview", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("set-hovered"));
    expect(screen.getByTestId("phase")).toHaveTextContent("hover-preview");
    expect(screen.getByTestId("hovered")).toHaveTextContent("set");
  });

  it("setHoveredCharacter during covering does not change phase", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    await userEvent.click(screen.getByText("set-hovered"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
  });

  it("clearHoveredCharacter in hover-preview → idle", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("set-hovered"));
    await userEvent.click(screen.getByText("clear-hovered"));
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("hovered")).toHaveTextContent("null");
  });

  it("clearHoveredCharacter during covering is ignored", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    await userEvent.click(screen.getByText("clear-hovered"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
  });

  it("navigate with null transitionId calls router.push immediately and stays idle", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-immediate"));
    expect(mockPush).toHaveBeenCalledWith("/target");
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
  });

  it("navigate with transitionId transitions to covering and sets activeTransition", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    expect(screen.getByTestId("phase")).toHaveTextContent("covering");
    expect(screen.getByTestId("transition")).toHaveTextContent("floral-bloom");
  });

  it("onCoverComplete in navigate mode calls router.push and transitions to uncovering", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    await userEvent.click(screen.getByText("cover-complete"));
    expect(mockPush).toHaveBeenCalledWith("/target");
    expect(screen.getByTestId("phase")).toHaveTextContent("uncovering");
  });

  it("onCoverComplete in preview mode does not call router.push and transitions to uncovering", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("preview"));
    await userEvent.click(screen.getByText("cover-complete"));
    expect(mockPush).not.toHaveBeenCalled();
    expect(screen.getByTestId("phase")).toHaveTextContent("uncovering");
  });

  it("onUncoverComplete transitions to idle and clears state", async () => {
    render(<TestTree />);
    await userEvent.click(screen.getByText("navigate-transition"));
    await userEvent.click(screen.getByText("cover-complete"));
    await userEvent.click(screen.getByText("uncover-complete"));
    expect(screen.getByTestId("phase")).toHaveTextContent("idle");
    expect(screen.getByTestId("hovered")).toHaveTextContent("null");
    expect(screen.getByTestId("transition")).toHaveTextContent("null");
  });

  it("onCoverComplete and onUncoverComplete are stable across re-renders", async () => {
    const captured: { cover: unknown; uncover: unknown }[] = [];

    function CaptureFns() {
      const { onCoverComplete, onUncoverComplete, setHoveredCharacter } = useTransition();
      captured.push({ cover: onCoverComplete, uncover: onUncoverComplete });
      return <button onClick={() => setHoveredCharacter(DEFAULT_THEME)}>rerender</button>;
    }

    render(
      <TransitionProvider>
        <CaptureFns />
      </TransitionProvider>
    );

    await userEvent.click(screen.getByText("rerender"));

    expect(captured.length).toBeGreaterThanOrEqual(2);
    expect(captured[0]!.cover).toBe(captured[captured.length - 1]!.cover);
    expect(captured[0]!.uncover).toBe(captured[captured.length - 1]!.uncover);
  });

  it("useTransition throws outside provider", () => {
    function BadConsumer() {
      useTransition();
      return null;
    }
    expect(() => render(<BadConsumer />)).toThrow("useTransition must be used inside TransitionProvider");
  });
});
