import React, { useCallback, useEffect, useState } from "react";
import {
  LinearProgress,
  Box,
  Stack,
  Typography,
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
  Container,
  Snackbar,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { MUIButtonContained } from "../UI/MUIButton";
import RankPage from "../RankPage";
import Loading from "../UI/Loading";

const StyledContainer = styled(Container)({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "22px",
  color: theme.palette.primary.main,
  marginBottom: "20px",
}));

const StyledCard = styled(Card)({
  margin: "auto",
  padding: "40px",
  maxWidth: "700px",
});

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  textTransform: "none",
  borderRadius: "5px !important",
  border: "1px solid !important",
  "&.Mui-selected, &.Mui-selected:hover": {
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

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
  const [error, setError] = useState(null);
  const [words, setWords] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [checkAnswer, setCheckAnswer] = useState(false);
  const [disableChoices, setDisableChoices] = useState(false);
  const [openRankPage, setOpenRankPage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const dialogResponsive = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const getWords = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/words");
        if (!response.ok) {
          throw new Error("Something went wrong, can't fetch words");
        }
        const data = await response.json();
        setWords(data.wordList);
      } catch (error) {
        setError(error.message);
        setOpenSnackBar(true);
      }
      setIsLoading(false);
    };
    getWords();
  }, []);

  const handleSelectedAnswer = useCallback(
    (e, newAnswer) => {
      setOpenAlert(true);
      setDisableChoices(true);
      setAnsweredQuestions((prev) => prev + 1);
      setSelectedAnswer(newAnswer);
      if (words[activeQuestion].pos === e.target.value) {
        setCheckAnswer(true);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        setCheckAnswer(false);
      }
      if (activeQuestion === words.length - 1) {
        setProgress((prevProgress) => prevProgress + 10);
      }
    },
    [activeQuestion, words]
  );

  const handleNextQuestion = useCallback(() => {
    const calculateProgress = (answeredQuestions / words.length) * 100;
    setSelectedAnswer("");
    setOpenAlert(false);
    setDisableChoices(false);
    setActiveQuestion((prevActiveQuestion) => prevActiveQuestion + 1);
    setProgress((prevProgress) =>
      prevProgress >= 100 ? 0 : calculateProgress
    );
  }, [answeredQuestions, words.length]);

  const handleFinishQuiz = useCallback(() => {
    const totalScore = (correctAnswers / words.length) * 100;
    setScore(totalScore);
    if (activeQuestion === words.length - 1) {
      setOpenRankPage(true);
    } else {
      setOpenDialog(true);
    }
  }, [words.length, activeQuestion, correctAnswers]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleCloseQuiz = useCallback(() => {
    setOpenRankPage(true);
    setOpenDialog(false);
  }, []);

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
