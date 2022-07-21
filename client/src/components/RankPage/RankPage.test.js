import React from "react";
import { render, screen } from "../../../utils/unitTests";
import { rest } from "msw";
import { setupServer } from "msw/node";
import RankPage from ".";
import QuizPage from "../QuizPage";

jest.mock("react-chartjs-2", () => ({
  Bar: () => null,
}));

const words = rest.get("/api/words", (req, res, ctx) => {
  return res(
    ctx.json({
      wordList: [{ id: 1, word: "slowly", pos: "adverb" }],
    })
  );
});
const rank = rest.post("/api/rank", (req, res, ctx) => {
  return res(ctx.json(["90.00", "12.00"]));
});
const handlers = [words, rank];

const server = new setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("RankPage Component", () => {
  test("check if there is a chart", () => {
    render(<RankPage score={90} />);
    window.onload = async () => {
      const chart = await screen.findByRole("img");
      expect(chart).toBeInTheDocument();
    };
  });
  test("check if there is a rank Typography", () => {
    render(<RankPage score={90} />);
    window.onload = async () => {
      const paragraph = await screen.findByRole("paragraph");
      expect(paragraph).toBeInTheDocument();
      expect(paragraph).toEqual("Your Rank is 80.00%");
    };
  });

  test("check if there is try again button", () => {
    render(<RankPage score={90} />);
    window.onload = async () => {
      const tryAgainBtn = await screen.findByRole("button");
      expect(tryAgainBtn).toBeInTheDocument();
    };
  });

  test("when click on try again should render QuizPage", async () => {
    render(<QuizPage />);
    const verbBtn = await screen.findByText("Verb");
    expect(verbBtn).toBeInTheDocument();
  });
});
