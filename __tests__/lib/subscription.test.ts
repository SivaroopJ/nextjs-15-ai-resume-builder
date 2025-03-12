import { getUserSubscriptionLevel } from "@/lib/subscription";
import prisma from "@/lib/prisma";
import { env } from "@/env";

jest.mock("@/lib/prisma", () => ({
  __esModule: true,
  default: {
    userSubscription: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/env", () => ({
  env: {
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY: "price_pro",
    NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY: "price_pro_plus",
  },
}));

const mockFindUnique = prisma.userSubscription.findUnique as jest.Mock;

describe("getUserSubscriptionLevel", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("returns 'free' if no subscription is found", async () => {
    mockFindUnique.mockResolvedValue(null);

    const level = await getUserSubscriptionLevel("user123");
    expect(level).toBe("free");
  });

  it("returns 'free' if subscription is expired", async () => {
    mockFindUnique.mockResolvedValue({
      stripeCurrentPeriodEnd: new Date(Date.now() - 1000), // expired
    });

    const level = await getUserSubscriptionLevel("user123");
    expect(level).toBe("free");
  });

  it("returns 'pro' if active and stripePriceId matches pro", async () => {
    mockFindUnique.mockResolvedValue({
      stripeCurrentPeriodEnd: new Date(Date.now() + 1000), // valid
      stripePriceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY,
    });

    const level = await getUserSubscriptionLevel("user123");
    expect(level).toBe("pro");
  });

  it("returns 'pro_plus' if active and stripePriceId matches pro_plus", async () => {
    mockFindUnique.mockResolvedValue({
      stripeCurrentPeriodEnd: new Date(Date.now() + 1000), // valid
      stripePriceId: env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY,
    });

    const level = await getUserSubscriptionLevel("user123");
    expect(level).toBe("pro_plus");
  });

  it("throws error for unknown stripePriceId", async () => {
    mockFindUnique.mockResolvedValue({
      stripeCurrentPeriodEnd: new Date(Date.now() + 1000),
      stripePriceId: "invalid_id",
    });

    await expect(getUserSubscriptionLevel("user123")).rejects.toThrow(
      "Invalid subscription"
    );
  });
});
