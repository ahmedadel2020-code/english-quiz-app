import React, { useCallback, useState } from "react";
import {
  styled,
  Typography,
  Card,
  Box,
  CardContent,
  CardActions,
} from "@mui/material";
import { MUIButtonOutlined } from "../UI/MUIButton";
import { StyledContainer } from "../UI/MUIContainer";
import QuizPage from "../QuizPage";

// override Material UI Card styles
const StyledCard = styled(Card)({
  margin: "auto",
  padding: "40px",
});

// override Material UI Typography styles
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
  // state to open QuizPage
  const [openQuizPage, setOpenQuizPage] = useState(false);

  // when Take test button clicked will open QuizPage
  const handleTakeTestButton = useCallback(async () => {
    setOpenQuizPage(true);
  }, []);

  return (
    <div>
      {openQuizPage ? (
        <QuizPage />
      ) : (
        <StyledContainer>
          <StyledCard>
            <Box sx={{ maxWidth: "700px", margin: "0 auto" }}>
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
                <Box sx={{ mt: 3 }}>
                  <ul>
                    <li>
                      All questions are multiple choice and there is only one
                      correct answer.
                    </li>
                    <li>
                      You can't go to the previous question if you clicked on
                      next Button
                    </li>
                    <li>
                      Try to take the test in an environment where you will not
                      be disturbed.
                    </li>
                    <li>
                      Your progress will be calculated as how many questions you
                      answered.
                    </li>
                    <li>
                      After click on finish button, you will see your Rank among
                      your peers
                    </li>
                  </ul>
                </Box>
              </CardContent>
              <CardActions sx={{ display: "flex", justifyContent: "center" }}>
                <MUIButtonOutlined onClick={handleTakeTestButton}>
                  Take Test
                </MUIButtonOutlined>
              </CardActions>
            </Box>
          </StyledCard>
        </StyledContainer>
      )}
    </div>
  );
};

export default Home;
