import React, { useCallback, useState } from "react";
import {
  styled,
  Container,
  Typography,
  Card,
  Box,
  CardContent,
  CardActions,
  Snackbar,
  Alert,
} from "@mui/material";
import { MUIButtonOutlined } from "../UI/MUIButton";
import QuizPage from "../QuizPage";
import Loading from "../UI/Loading";

const StyledContainer = styled(Container)({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});

const StyledCard = styled(Card)({
  margin: "auto",
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
  const [openQuizPage, setOpenQuizPage] = useState(false);
  
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
                  All questions are multiple choice and there is only one
                  correct answer. Try to take the test in an environment where
                  you will not be disturbed.
                </Typography>
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
