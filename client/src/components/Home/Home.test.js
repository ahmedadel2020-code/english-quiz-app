import { render, fireEvent, screen } from "../../../utils/unitTests";
import { rest } from "msw";
import { setupServer } from "msw/node";

import QuizPage from "../QuizPage";
import Home from ".";

// mock request to our endpoint words
const server = setupServer(
  rest.get("/api/words", (req, res, ctx) => {
    return res(
      ctx.json({ wordList: [{ id: 1, word: "slowly", pos: "adverb" }] })
    );
  })
);

// listen to requests before all test and after all tests will close server
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("Home Component", () => {
  test("check if there is button", () => {
    render(<Home />);
    const takeTestButton = screen.getByText("Take Test");
    expect(takeTestButton).toBeInTheDocument();
  });

  test("Render Quiz Component when the button clicked", async () => {
    render(<Home />);
    window.onload = async () => {
      fireEvent.click(screen.getByText("Take Test"));
    };

    render(<QuizPage />);

    const verbBtn = await screen.findByText("Verb");
    expect(verbBtn).toBeInTheDocument();
  });
});
