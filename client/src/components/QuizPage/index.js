import React, { useCallback, useEffect, useState } from "react";
import {
  LinearProgress,
  Box,
  Stack,
  styled,
  Card,
  ToggleButtonGroup,
  ToggleButton,
  Alert,
  Collapse,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
  useMediaQuery,
  Button,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { MUIButtonContained } from "../UI/MUIButton";
import { StyledContainer } from "../UI/MUIContainer";
import { StyledTypography } from "../UI/MUITypography";
import RankPage from "../RankPage";
import Loading from "../UI/Loading";

// override Material UI Card styles
const StyledCard = styled(Card)({
  margin: "auto",
  padding: "40px",
  maxWidth: "700px",
});

// override Material UI ToggleButton styles
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "5px !important",
  border: "1px solid !important",
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

// override Material UI ToggleButtonGroup styles
const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
  gap: "20px",
  "&:disabled": {
    color: "#858585",
    background: theme.palette.otherColors.colorLightGrey,
    cursor: "default",
  },
}));

const QuizPage = () => {
  // state for error in our call to API
  const [error, setError] = useState(null);
  // state to save words array
  const [words, setWords] = useState([]);
  // state to save the selected button name to compare it with the correct answer
  const [selectedAnswer, setSelectedAnswer] = useState("");
  // state to for the current question being displayed
  const [activeQuestion, setActiveQuestion] = useState(0);
  // state for progress bar percentage
  const [progress, setProgress] = useState(0);
  // state to save the number of answered questions
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  // state to save the number of correct answers
  const [correctAnswers, setCorrectAnswers] = useState(0);
  // state to save our total score
  const [score, setScore] = useState(0);
  // state for snack bar
  const [openSnackBar, setOpenSnackBar] = useState(false);
  // state for loading while fetching
  const [isLoading, setIsLoading] = useState(false);
  // state to open alert or close it
  const [openAlert, setOpenAlert] = useState(false);
  // state to check if the answer is correct to display the alert
  const [checkAnswer, setCheckAnswer] = useState(false);
  // state to disable buttons after user select answer
  const [disableChoices, setDisableChoices] = useState(false);
  // state to open rank page
  const [openRankPage, setOpenRankPage] = useState(false);
  // state to open or close dialog
  const [openDialog, setOpenDialog] = useState(false);

  // handle responsive dialog
  const theme = useTheme();
  const dialogResponsive = useMediaQuery(theme.breakpoints.down("md"));

  // once component is rendered will make a request to our endpoint
  // then fetch words data
  useEffect(() => {
    const getWords = async () => {
      // loading
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/words");
        if (!response.ok) {
          throw new Error("Something went wrong, can't fetch words");
        }
        const data = await response.json();
        // set words to our state
        setWords(data.wordList);
      } catch (error) {
        setError(error.message);
        // if there is error will open a snackbar
        setOpenSnackBar(true);
      }
      setIsLoading(false);
    };
    getWords();
  }, []);

  // function to handle selected answer by user
  const handleSelectedAnswer = useCallback(
    (e, newAnswer) => {
      // open alert to show user if his answer is correct or not
      setOpenAlert(true);
      // disable choices
      setDisableChoices(true);
      // increment the answered questions
      setAnsweredQuestions((prev) => prev + 1);
      // select the button that user clicked on
      setSelectedAnswer(newAnswer);
      // if the answer is correct will increment the correct answers and display alert
      // to show that this answer is correct
      if (words[activeQuestion].pos === e.target.value) {
        setCheckAnswer(true);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        // display alert that the answer was not correct
        setCheckAnswer(false);
      }
      if (activeQuestion === words.length - 1) {
        // handle the progress bar when user is on the last question
        setProgress((prevProgress) => prevProgress + 10);
      }
    },
    [activeQuestion, words]
  );

  // function to handle when user click on next button
  const handleNextQuestion = useCallback(() => {
    // calculate progress percentage
    const calculateProgress = (answeredQuestions / words.length) * 100;
    setSelectedAnswer("");
    setOpenAlert(false);
    setDisableChoices(false);
    // increment the index of question
    setActiveQuestion((prevActiveQuestion) => prevActiveQuestion + 1);
    // set progress state percentage
    setProgress((prevProgress) =>
      prevProgress >= 100 ? 0 : calculateProgress
    );
  }, [answeredQuestions, words.length]);

  // function to handle when user click on finish button
  const handleFinishQuiz = useCallback(() => {
    // calculate total score
    const totalScore = (correctAnswers / words.length) * 100;
    setScore(totalScore);
    // if the user finish the last question will open rank page
    if (activeQuestion === words.length - 1) {
      setOpenRankPage(true);
    } else {
      // open dialog and ask user if he want to continue or not
      setOpenDialog(true);
    }
  }, [words.length, activeQuestion, correctAnswers]);

  // function to close dialog
  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  // function to handle when user click on yes button in Dialog to finish the quiz
  // user will go to rank page if click on Yes button, then will close the dialog
  const handleCloseQuiz = useCallback(() => {
    setOpenRankPage(true);
    setOpenDialog(false);
  }, []);

  // function to close the alert
  const handleCloseSnackBar = useCallback((event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  }, []);

  return (
    <div>
      <Loading loading={isLoading} />
      <Snackbar
        open={openSnackBar}
        autoHideDuration={10000}
        onClose={handleCloseSnackBar}
      >
        {error && (
          <Alert severity="error" onClose={handleCloseSnackBar}>
            {error}
          </Alert>
        )}
      </Snackbar>
      {openRankPage ? (
        <RankPage score={score} />
      ) : (
        <StyledContainer>
          <StyledCard>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ mb: 1 }}
            />
            <StyledTypography
              role="progressParagraph"
              sx={{ fontSize: "17px" }}
            >
              {progress}%
            </StyledTypography>
            <Collapse in={openAlert}>
              <Alert
                severity={checkAnswer ? "success" : "error"}
                sx={{ mb: 2 }}
              >
                {checkAnswer ? "Correct Answer" : "Wrong Answer"}
              </Alert>
            </Collapse>
            <Box sx={{ maxWidth: "700px", margin: "0 auto" }}>
              <StyledTypography role="testWord">
                {words.length > 1 ? words[activeQuestion].word : ""}
              </StyledTypography>
              <StyledToggleButtonGroup
                value={selectedAnswer}
                exclusive
                onChange={handleSelectedAnswer}
                fullWidth
                disabled={disableChoices}
              >
                <StyledToggleButton value="verb">Verb</StyledToggleButton>
                <StyledToggleButton value="adjective">
                  Adjective
                </StyledToggleButton>
                <StyledToggleButton value="noun">Noun</StyledToggleButton>
                <StyledToggleButton value="adverb">Adverb</StyledToggleButton>
              </StyledToggleButtonGroup>
            </Box>
            <Stack
              direction="row"
              spacing={2}
              justifyContent={{ xs: "center", md: "flex-end" }}
              sx={{ mt: 5 }}
            >
              <Button
                variant="outlined"
                onClick={handleFinishQuiz}
                sx={{ textTransform: "none" }}
              >
                Finish
              </Button>
              <MUIButtonContained
                onClick={handleNextQuestion}
                disabled={activeQuestion === words.length - 1}
              >
                Next
              </MUIButtonContained>
            </Stack>
          </StyledCard>
        </StyledContainer>
      )}
      <Dialog
        fullScreen={dialogResponsive}
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{"Are you sure you want to end this quiz?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You didn't complete all of the Questions, do you still want to exit
            this quiz?
          </DialogContentText>
          <DialogActions>
            <MUIButtonContained onClick={handleCloseDialog}>
              Cancel
            </MUIButtonContained>
            <Button
              variant="outlined"
              onClick={handleCloseQuiz}
              sx={{ textTransform: "none" }}
            >
              Yes
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizPage;
