import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ViewText from "./ViewText";
import { MAX_VIEW_LENGTH } from "@/lib/qr";

const renderAt = (search: string) =>
  render(
    <MemoryRouter initialEntries={[`/view${search}`]}>
      <ViewText />
    </MemoryRouter>,
  );

describe("ViewText", () => {
  it("shows the text from the link", () => {
    renderAt("?text=hello%20world");
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });

  it("shows a message when there is no text", () => {
    renderAt("");
    expect(screen.getByText(/No text content found/i)).toBeInTheDocument();
  });

  it("always shows the safety warning", () => {
    renderAt("?text=hi");
    expect(screen.getByRole("note")).toHaveTextContent(/Anyone can make a QR code/i);
  });

  it("renders HTML as plain text and never creates elements from it", () => {
    const attack = '<img src=x onerror="alert(1)"><script>alert(2)</script>';
    const { container } = renderAt(`?text=${encodeURIComponent(attack)}`);
    expect(screen.getByText(attack)).toBeInTheDocument();
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("script")).toBeNull();
  });

  it("does not turn text into clickable links", () => {
    const { container } = renderAt(`?text=${encodeURIComponent("https://evil.example")}`);
    const links = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href"));
    expect(links).toEqual(["/"]); // only the "generate your own" button
  });

  it("caps very long text and tells the reader", () => {
    renderAt(`?text=${"a".repeat(MAX_VIEW_LENGTH + 50)}`);
    expect(screen.getByText("a".repeat(MAX_VIEW_LENGTH))).toBeInTheDocument();
    expect(screen.getByText(/Only the first part/i)).toBeInTheDocument();
  });

  it("asks search engines not to index the page", () => {
    renderAt("?text=hi");
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toMatch(/noindex/);
  });
});
