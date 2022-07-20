import React from "react";
import { render, screen, waitFor } from "../../../utils/unitTests";
import { rest } from "msw";
import { setupServer } from "msw/node";
import RankPage from ".";

jest.mock("react-chartjs-2", () => ({
  Bar: () => null,
}));

const server = setupServer(
  rest.post("/api/rank", async (req, res, ctx) => {
    return res(ctx.json({ ranks: ["80.00", "12.00"] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("RankPage Component", () => {
  test("check if there is a chart", () => {
    render(<RankPage score={90} />);
    window.onload = async () => {
      await waitFor(() => screen.getByRole("img"));
      expect(screen.getByRole("img")).toBeInTheDocument();
    };
  });
  test("check if there is a rank Typography", () => {
    render(<RankPage score={90} />);
    window.onload = async () => {
      await waitFor(() => screen.getByRole("paragraph"));
      expect(screen.getByRole("paragraph")).toBeInTheDocument();
      expect(screen.getByRole("paragraph")).toEqual("Your Rank is 80.00%");
    };
  });
});
