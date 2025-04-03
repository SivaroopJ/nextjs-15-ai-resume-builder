import { render, screen } from "@testing-library/react";
import Navbar from "@/app/(main)/Navbar";
import { useTheme } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

jest.mock("@clerk/nextjs", () => ({
    UserButton: (props: any) => <div {...props}>UserButton</div>,
    ClerkProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  }));
  

describe("Navbar", () => {
  it("renders the logo and title", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "light" });
    render(
      <ClerkProvider>
        <Navbar />
      </ClerkProvider>
    );

    expect(screen.getByAltText("Logo")).toBeInTheDocument();
    expect(screen.getByText("AI Resume Builder")).toBeInTheDocument();
  });

  it("renders UserButton with dark theme appearance", () => {
    (useTheme as jest.Mock).mockReturnValue({ theme: "dark" });
    render(
      <ClerkProvider>
        <Navbar />
      </ClerkProvider>
    );

    expect(screen.getByText("Billing")).toBeInTheDocument();
  });
});
