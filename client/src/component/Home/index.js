import React, { useCallback, useState } from "react";
import {
  styled,
  Container,
  Typography,
  Card,
  Box,
  CardContent,
  CardActions,
} from "@mui/material";
import MUIButton from "../UI/MUIButton";
import QuizPage from "../QuizPage";

const StyledCard = styled(Card)({
  margin: "40px auto",
  padding: "40px",
});
const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  textTransform: "uppercase",
  color: "#6789b6",
  marginTop: "10px",
  "& span": {
    color: theme.palette.primary.main,
    paddingRight: "5px",
    fontWeight: "bold",
  },
}));

const Home = () => {
  const [words, setWords] = useState([]);
  const [openQuizPage, setOpenQuizPage] = useState(false);

  const handleFetchWords = useCallback(() => {
    setOpenQuizPage(true);
    fetch("http://localhost:5000/api/words")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setWords(data.wordList);
      });
  }, []);
  return (
    <Container>
      <StyledCard>
        {openQuizPage ? (
          <QuizPage words={words} />
        ) : (
          <Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
            <CardContent>
              <Typography
                variant="h4"
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                English Quiz
              </Typography>
              <StyledTypography>
                <span>10</span>Questions
              </StyledTypography>
              <Typography sx={{ mt: 3, textAlign: "center" }}>
                All questions are multiple choice and there is only one correct
                answer. Try to take the test in an environment where you will
                not be disturbed.
              </Typography>
            </CardContent>
            <CardActions sx={{ display: "flex", justifyContent: "center" }}>
              <MUIButton onClick={handleFetchWords}>Take Test</MUIButton>
            </CardActions>
          </Box>
        )}
      </StyledCard>
    </Container>
  );
};

export default Home;
