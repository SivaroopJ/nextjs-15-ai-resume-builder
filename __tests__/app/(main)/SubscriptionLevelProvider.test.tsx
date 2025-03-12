import { render, screen } from "@testing-library/react";
import SubscriptionLevelProvider, { useSubscriptionLevel } from "@/app/(main)/SubscriptionLevelProvider";
import { SubscriptionLevel } from "@/lib/subscription";

// ✅ Mock enum since SubscriptionLevel is only a type
enum MockSubscriptionLevel {
  FREE = "free",
  PRO = "pro",
  PREMIUM = "premium",
}

function TestComponent() {
  const level = useSubscriptionLevel();
  return <div data-testid="subscription-level">{level}</div>;
}

describe("SubscriptionLevelProvider", () => {
  it("provides the subscription level to child components", () => {
    render(
      <SubscriptionLevelProvider userSubscriptionLevel={MockSubscriptionLevel.PREMIUM as SubscriptionLevel}>
        <TestComponent />
      </SubscriptionLevelProvider>
    );

    const subscriptionDiv = screen.getByTestId("subscription-level");
    expect(subscriptionDiv).toHaveTextContent(MockSubscriptionLevel.PREMIUM);
  });

  it("throws error if useSubscriptionLevel is used outside the provider", () => {
    // Suppress expected error logs from React
    const consoleError = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      "useSubscriptionLevel must be used within a SubscriptionLevelProvider"
    );

    consoleError.mockRestore();
  });
});
