import React from "react";
import { render, screen } from "../../../utils/unitTests";
import { rest } from "msw";
import { setupServer } from "msw/node";
import RankPage from ".";
import QuizPage from "../QuizPage";

// mock our chart
jest.mock("react-chartjs-2", () => ({
  Bar: () => null,
}));

// mock request to our endpoint words
const words = rest.get("/api/words", (req, res, ctx) => {
  return res(
    ctx.json({
      wordList: [{ id: 1, word: "slowly", pos: "adverb" }],
    })
  );
});

// mock request to our endpoint rank
const rank = rest.post("/api/rank", (req, res, ctx) => {
  return res(ctx.json(["90.00", "12.00"]));
});
const handlers = [words, rank];

const server = new setupServer(...handlers);

// listen to requests before all test and after all tests will close server
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
