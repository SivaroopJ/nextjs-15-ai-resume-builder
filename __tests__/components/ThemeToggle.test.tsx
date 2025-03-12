import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "@/components/ThemeToggle";

// Mock `useTheme` from next-themes
const setThemeMock = jest.fn();

jest.mock("next-themes", () => ({
  useTheme: () => ({
    setTheme: setThemeMock,
  }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    setThemeMock.mockClear();
  });

  it("renders theme toggle button", () => {
    render(<ThemeToggle />);
    expect(screen.getByRole("button", { name: /toggle theme/i })).toBeInTheDocument();
  });

  it("shows dropdown options on click", async () => {
    render(<ThemeToggle />);
    const button = screen.getByRole("button", { name: /toggle theme/i });

    await userEvent.click(button);

    expect(screen.getByText("Light")).toBeInTheDocument();
    expect(screen.getByText("Dark")).toBeInTheDocument();
    expect(screen.getByText("System")).toBeInTheDocument();
  });

  it("sets theme to light when 'Light' is clicked", async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    await userEvent.click(screen.getByText("Light"));
    expect(setThemeMock).toHaveBeenCalledWith("light");
  });

  it("sets theme to dark when 'Dark' is clicked", async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    await userEvent.click(screen.getByText("Dark"));
    expect(setThemeMock).toHaveBeenCalledWith("dark");
  });

  it("sets theme to system when 'System' is clicked", async () => {
    render(<ThemeToggle />);
    await userEvent.click(screen.getByRole("button", { name: /toggle theme/i }));
    await userEvent.click(screen.getByText("System"));
    expect(setThemeMock).toHaveBeenCalledWith("system");
  });
});
