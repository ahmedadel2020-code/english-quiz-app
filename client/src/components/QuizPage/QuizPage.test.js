import QuizPage from ".";
import { render, fireEvent, screen, waitFor } from "../../../utils/unitTests";
import { rest } from "msw";
import { setupServer } from "msw/node";
import RankPage from "../RankPage";

const server = setupServer(
  rest.post("/api/rank", (req, res, ctx) => {
    return res(ctx.json({ ranks: ["90.00", "12.00"] }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("QuizPage Component", () => {
  test("check if there is progress bar", () => {
    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  test("check if there is a progressPercentage", () => {
    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);
    const progressTypography = screen.getByRole("progressbar");
    expect(progressTypography).toBeInTheDocument();
  });

  test("check if there is a word", () => {
    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);
    const wordTypography = screen.getByText("slowly");
    expect(wordTypography).toBeInTheDocument();
  });

  test("check if there is 4 buttons for choices", () => {
    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);
    const verbButton = screen.getByText("Verb");
    const adverbButton = screen.getByText("Adverb");
    const adjectiveButton = screen.getByText("Adjective");
    const nounButton = screen.getByText("Noun");

    expect(verbButton).toBeInTheDocument();
    expect(adverbButton).toBeInTheDocument();
    expect(adjectiveButton).toBeInTheDocument();
    expect(nounButton).toBeInTheDocument();
  });

  test("check if there is next and finish button", () => {
    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);
    const nextButton = screen.getByText("Next");
    const finishButton = screen.getByText("Finish");

    expect(nextButton).toBeInTheDocument();
    expect(finishButton).toBeInTheDocument();
  });

  test("click on any button to select answer", () => {
    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);
    const adverbButton = screen.getByText("Adverb");
    fireEvent.click(adverbButton);
    const alertElement = screen.getByRole("alert");

    expect(alertElement).toBeInTheDocument();
  });

  test("check if next button is disabled in the last question", () => {
    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);
    const nextButton = screen.getByText("Next");
    expect(nextButton).toBeDisabled();
  });

  test("check if the dialog open when click on Finish button if there is questions left", () => {
    render(
      <QuizPage
        words={[
          { id: 1, word: "slowly", pos: "adverb" },
          { id: 1, word: "slowly", pos: "adverb" },
        ]}
      />
    );
    const finishButton = screen.getByText("Finish");

    fireEvent.click(finishButton);
    const dialogElement = screen.getByRole("dialog");

    expect(dialogElement).toBeInTheDocument();

    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);
    expect(finishButton).toBeInTheDocument();
  });

  test("check if Rank page is rendered when click on finish button", () => {
    render(<QuizPage words={[{ id: 1, word: "slowly", pos: "adverb" }]} />);

    window.onload = async () => {
      const finishButton = screen.getByText("Finish");
      fireEvent.click(finishButton);
      render(<RankPage score={90} />);
      await waitFor(() => screen.getByRole("paragraph"));
      expect(screen.getByRole("paragraph")).toBeInTheDocument();
    };
  });

  test("check if Rank page is rendered when click on Yes button on dialog", () => {
    render(
      <QuizPage
        words={[
          { id: 1, word: "slowly", pos: "adverb" },
          { id: 1, word: "slowly", pos: "adverb" },
        ]}
      />
    );
    const finishButton = screen.getByText("Finish");

    fireEvent.click(finishButton);

    window.onload = async () => {
      const yesButton = screen.getByText("Yes");
      fireEvent.click(yesButton);
      render(<RankPage score={90} />);
      await waitFor(() => screen.getByRole("paragraph"));
      expect(screen.getByRole("paragraph")).toBeInTheDocument();
    };
  });
});
