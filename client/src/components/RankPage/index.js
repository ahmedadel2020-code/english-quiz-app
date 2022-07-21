import React, { useCallback, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Container,
  styled,
  Card,
  Snackbar,
  Alert,
  Typography,
  Stack,
} from "@mui/material";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import Loading from "../UI/Loading";
import { MUIButtonOutlined } from "../UI/MUIButton";
import QuizPage from "../QuizPage";

const StyledContainer = styled(Container)({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});

const StyledCard = styled(Card)(({ theme }) => ({
  padding: "20px 40px",
  [theme.breakpoints.up("md")]: {
    marginTop: "40px",
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "22px",
  color: theme.palette.primary.main,
  marginBottom: "20px",
}));

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const RankPage = ({ score }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [openQuizPage, setOpenQuizPage] = useState(false);
  const [error, setError] = useState(null);
  const [usersRanks, setUsersRanks] = useState([]);

  useEffect(() => {
    const getRanks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/rank", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            score: score,
          }),
        });
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await response.json();
        setUsersRanks(data.ranks);
      } catch (error) {
        setError(error.message);
        setOpenSnackBar(true);
      }
    };
    getRanks();
    setIsLoading(false);
  }, [score]);

  let merged = usersRanks.map((user, i) => {
    if (i === 0) {
      return { background: "#667eea", datapoint: usersRanks[i], label: "You" };
    } else {
      return {
        background: "#e5e5e5",
        datapoint: usersRanks[i],
        label: `User ${i}`,
      };
    }
  });

  const dataSort = merged.sort((b, a) => a.datapoint - b.datapoint);
  const newData = [];
  const newBackgroundColors = [];
  const newLabel = [];
  for (let i = 0; i < dataSort.length; i++) {
    newData.push(dataSort[i].datapoint);
    newBackgroundColors.push(dataSort[i].background);
    newLabel.push(dataSort[i].label);
  }

  const handleCloseSnackBar = useCallback((reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  }, []);

  const handleTryAgainButton = useCallback(() => {
    setOpenQuizPage(true);
  }, []);

  return (
    <div>
      {openQuizPage ? (
        <QuizPage />
      ) : (
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
          <StyledContainer>
            <StyledCard>
              <Box sx={{ margin: "0 auto" }}>
                <Box>
                  <StyledTypography role="testing-paragraph">
                    Your Rank among your peers is {usersRanks[0]}%
                  </StyledTypography>
                </Box>
                <Box>
                  <Bar
                    data={{
                      labels: newLabel,
                      datasets: [
                        {
                          label: "Your Rank",
                          data: newData,
                          backgroundColor: newBackgroundColors,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        y: {
                          max: 100,
                        },
                      },
                    }}
                    height={400}
                  />
                </Box>
              </Box>
            </StyledCard>
            <Stack direction="row" justifyContent="center">
              <MUIButtonOutlined
                sx={{
                  mt: 5,
                }}
                onClick={handleTryAgainButton}
              >
                Try again
              </MUIButtonOutlined>
            </Stack>
          </StyledContainer>
        </div>
      )}
    </div>
  );
};

export default RankPage;
