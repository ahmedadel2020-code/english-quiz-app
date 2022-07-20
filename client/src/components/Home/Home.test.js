import { render, fireEvent, waitFor, screen } from "../../../utils/unitTests";
import { rest } from "msw";
import { setupServer } from "msw/node";

import QuizPage from "../QuizPage";
import Home from ".";

const server = setupServer(
  rest.get("/api/words", (req, res, ctx) => {
    return res(
      ctx.json({ wordList: [{ id: 1, word: "slowly", pos: "adverb" }] })
    );
  })
);

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
    fireEvent.click(screen.getByText("Take Test"));

    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);
    await waitFor(() => screen.getByText("slowly"));
    expect(screen.getByText("slowly")).toBeInTheDocument();
  });
});
