import QuizPage from ".";
import { render, fireEvent, screen } from "../../../utils/unitTests";
import { rest } from "msw";
import { setupServer } from "msw/node";
import RankPage from "../RankPage";

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

describe("QuizPage Component", () => {
  test("check if there is progress bar", async () => {
    render(<QuizPage />);
    const progressBar = await screen.findByRole("progressbar");
    expect(progressBar).toBeInTheDocument();
  });

  test("check if there is a progressPercentage", async () => {
    render(<QuizPage />);
    const progressPercentage = await screen.findByRole("progressParagraph");
    expect(progressPercentage).toBeInTheDocument();
  });

  test("check if there is a word", () => {
    render(<QuizPage />);
    window.onload = async () => {
      const wordTypography = await screen.findByText("slowly");
      expect(wordTypography).toHaveTextContent("slowly");
    };
  });

  test("check if there is 4 buttons for choices", async () => {
    render(<QuizPage />);
    const verbBtn = await screen.findByText("Verb");
    const adverbBtn = await screen.findByText("Adverb");
    const adjectiveBtn = await screen.findByText("Adjective");
    const nounBtn = await screen.findByText("Noun");

    expect(verbBtn).toBeInTheDocument();
    expect(adverbBtn).toBeInTheDocument();
    expect(adjectiveBtn).toBeInTheDocument();
    expect(nounBtn).toBeInTheDocument();
  });

  test("check if there is next and finish button", async () => {
    render(<QuizPage />);
    const nextBtn = await screen.findByText("Next");
    const finishBtn = await screen.findByText("Finish");

    expect(nextBtn).toBeInTheDocument();
    expect(finishBtn).toBeInTheDocument();
  });

  test("click on any button to select answer", () => {
    render(<QuizPage />);
    window.onload = async () => {
      const adverbBtn = await screen.findByText("Adverb");
      fireEvent.click(adverbBtn);
      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
    };
  });

  test("check if next button is disabled in the last question", () => {
    render(<QuizPage />);
    window.onload = async () => {
      const nextBtn = await screen.findByText("Next");
      expect(nextBtn).toBeDisabled();
    };
  });

  test("check if the dialog open when click on Finish button if there is questions left", async () => {
    render(<QuizPage />);
    const finishBtn = await screen.findByText("Finish");

    fireEvent.click(finishBtn);
    const dialogElement = await screen.findByRole("dialog");

    expect(dialogElement).toBeInTheDocument();

    const cancelButton = await screen.findByText("Cancel");
    fireEvent.click(cancelButton);
    expect(finishBtn).toBeInTheDocument();
  });

  test("check if Rank page is rendered when click on finish button", () => {
    render(<QuizPage />);

    window.onload = async () => {
      const finishButton = await screen.findByText("Finish");
      fireEvent.click(finishButton);
      render(<RankPage score={90} />);
      const paragraph = await screen.findByRole("paragraph");
      expect(paragraph).toBeInTheDocument();
    };
  });

  test("check if Rank page is rendered when click on Yes button on dialog", async () => {
    render(<QuizPage />);
    const finishBtn = await screen.findByText("Finish");

    fireEvent.click(finishBtn);

    window.onload = async () => {
      const yesButton = await screen.findByText("Yes");
      fireEvent.click(yesButton);
      render(<RankPage score={90} />);
      const paragraph = await screen.findByRole("paragraph");
      expect(paragraph).toBeInTheDocument();
    };
  });
});
