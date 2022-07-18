import React, { useCallback, useState } from "react";
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
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { MUIButtonContained } from "../UI/MUIButton";
import RankPage from "../RankPage";

const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: "bold",
  color: theme.palette.primary.main,
  marginBottom: "20px",
}));

const StyledCard = styled(Card)({
  margin: "auto",
  padding: "40px",
  maxWidth: "500px",
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

const QuizPage = ({ words }) => {
  const [activeQuestion, setActiveQuestion] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [checkAnswer, setCheckAnswer] = useState(false);
  const [disableChoices, setDisableChoices] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(0);
  const [openRankPage, setOpenRankPage] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const dialogResponsive = useMediaQuery(theme.breakpoints.down("md"));
  const totalQuestions = words.length;

  const handleSelectedAnswer = useCallback(
    (e, newAnswer) => {
      setOpenAlert(true);
      setDisableChoices(true);
      setAnsweredQuestions((prev) => prev + 1);
      setSelectedAnswer(newAnswer);
      if (words[activeQuestion].pos === e.target.value) {
        setCheckAnswer(true);
      } else {
        setCheckAnswer(false);
      }
      if (activeQuestion === totalQuestions - 1) {
        setProgress((prevProgress) => prevProgress + 10);
      }
    },
    [activeQuestion, words, totalQuestions]
  );

  const handleNextQuestion = useCallback(() => {
    const calculateProgress = (answeredQuestions / totalQuestions) * 100;
    setSelectedAnswer("");
    setOpenAlert(false);
    setDisableChoices(false);
    setActiveQuestion((prevActiveQuestion) => prevActiveQuestion + 1);
    setProgress((prevProgress) =>
      prevProgress >= 100 ? 0 : calculateProgress
    );
  }, [answeredQuestions, totalQuestions]);

  const handleFinishQuiz = useCallback(() => {
    if (activeQuestion === totalQuestions - 1) {
      setOpenRankPage(true);
    } else {
      setOpenDialog(true);
    }
  }, [totalQuestions, activeQuestion]);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const handleCloseQuiz = useCallback(() => {
    setOpenRankPage(true);
    setOpenDialog(false);
  }, []);

  return (
    <div>
      {openRankPage ? (
        <RankPage />
      ) : (
        <StyledCard>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 1 }}
          />
          <StyledTypography>{progress}%</StyledTypography>
          <Collapse in={openAlert}>
            <Alert severity={checkAnswer ? "success" : "error"} sx={{ mb: 2 }}>
              {checkAnswer ? "Correct Answer" : "Wrong Answer"}
            </Alert>
          </Collapse>
          <Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
            <StyledTypography>{words[activeQuestion].word}</StyledTypography>
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
            <MUIButtonContained onClick={handleFinishQuiz}>
              Finish
            </MUIButtonContained>
            <MUIButtonContained
              onClick={handleNextQuestion}
              disabled={activeQuestion === totalQuestions - 1}
            >
              Next
            </MUIButtonContained>
          </Stack>
        </StyledCard>
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
            <Button variant="outlined" onClick={handleCloseQuiz}>
              Yes
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizPage;
