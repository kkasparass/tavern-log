import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PageLayout } from "./PageLayout";

describe("PageLayout", () => {
  it("renders children", () => {
    render(
      <PageLayout>
        <div>content</div>
      </PageLayout>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("renders leftWing when provided", () => {
    render(
      <PageLayout leftWing={<div>left decoration</div>}>
        <div>content</div>
      </PageLayout>
    );
    expect(screen.getByText("left decoration")).toBeInTheDocument();
  });

  it("renders rightWing when provided", () => {
    render(
      <PageLayout rightWing={<div>right decoration</div>}>
        <div>content</div>
      </PageLayout>
    );
    expect(screen.getByText("right decoration")).toBeInTheDocument();
  });

  it("renders with no wings without crashing", () => {
    render(
      <PageLayout>
        <div>content</div>
      </PageLayout>
    );
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("uses capped grid columns by default", () => {
    const { container } = render(
      <PageLayout>
        <div />
      </PageLayout>
    );
    expect((container.firstChild as HTMLElement).style.gridTemplateColumns).toContain(
      "var(--content-max-w)"
    );
  });

  it("omits content-max-w cap when fullWidth is set", () => {
    const { container } = render(
      <PageLayout fullWidth>
        <div />
      </PageLayout>
    );
    expect((container.firstChild as HTMLElement).style.gridTemplateColumns).not.toContain(
      "var(--content-max-w)"
    );
  });
});
