import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoadingButton from "@/components/LoadingButton";

// Mock lucide icon to avoid SVG rendering issues
jest.mock("lucide-react", () => ({
  Loader2: () => <svg data-testid="loader-icon" />,
}));

describe("LoadingButton", () => {
  it("renders children when not loading", () => {
    render(<LoadingButton loading={false}>Submit</LoadingButton>);
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.queryByTestId("loader-icon")).not.toBeInTheDocument();
  });

  it("shows loader when loading", () => {
    render(<LoadingButton loading={true}>Submit</LoadingButton>);
    expect(screen.getByTestId("loader-icon")).toBeInTheDocument();
  });

  it("disables the button when loading is true", () => {
    render(<LoadingButton loading={true}>Submit</LoadingButton>);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("disables the button when disabled prop is true", () => {
    render(
      <LoadingButton loading={false} disabled={true}>
        Submit
      </LoadingButton>
    );
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeDisabled();
  });

  it("applies custom className", () => {
    render(
      <LoadingButton loading={false} className="custom-class">
        Submit
      </LoadingButton>
    );
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toHaveClass("custom-class");
  });

  it("calls onClick when clicked and not loading", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <LoadingButton loading={false} onClick={handleClick}>
        Click Me
      </LoadingButton>
    );
    await user.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalled();
  });
});
