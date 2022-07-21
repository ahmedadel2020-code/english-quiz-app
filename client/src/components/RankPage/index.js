import React, { useCallback, useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Box, styled, Card, Snackbar, Alert, Stack } from "@mui/material";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
} from "chart.js";
import Loading from "../UI/Loading";
import { MUIButtonOutlined } from "../UI/MUIButton";
import { StyledContainer } from "../UI/MUIContainer";
import { StyledTypography } from "../UI/MUITypography";
import QuizPage from "../QuizPage";

const StyledCard = styled(Card)(({ theme }) => ({
  padding: "20px 40px",
  [theme.breakpoints.up("md")]: {
    marginTop: "40px",
  },
}));

// register our chart js
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

const RankPage = ({ score }) => {
  // state for loading while fetch ranks
  const [isLoading, setIsLoading] = useState(false);
  // state to open or close snackBar
  const [openSnackBar, setOpenSnackBar] = useState(false);
  // state to open quiz page when user click on try again button
  const [openQuizPage, setOpenQuizPage] = useState(false);
  // state to handle errors in our API
  const [error, setError] = useState(null);
  // state to store our Ranks array
  const [usersRanks, setUsersRanks] = useState([]);

  // once component is rendered will make a request with score in the body to our endpoint
  // then fetch Ranks
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
        // if there is error while fetching
        if (!response.ok) {
          throw new Error("Something went wrong!");
        }
        const data = await response.json();
        // set our ranks array
        setUsersRanks(data.ranks);
      } catch (error) {
        // if there is error will open the snackBar
        setError(error.message);
        setOpenSnackBar(true);
      }
    };
    getRanks();
    setIsLoading(false);
  }, [score]);

  // will loop over our userRanks Array then return array of objects
  // the array will contain background and datapoint for each user to insert them in our Chart
  const merged = usersRanks.map((user, i) => {
    // if the index is 0 then this rank is for our User, so will give him
    // a label and background color
    if (i === 0) {
      return { background: "#667eea", datapoint: usersRanks[i], label: "You" };
    } else {
      // will set backgroundColor for other users with there datapoint
      return {
        background: "#e5e5e5",
        datapoint: usersRanks[i],
        label: `User ${i}`,
      };
    }
  });

  // sort the merged array by it's datapoint descending
  const dataSort = merged.sort((b, a) => a.datapoint - b.datapoint);
  const newData = [];
  const newBackgroundColors = [];
  const newLabel = [];

  // loop over our dataSort array and make array for data, backgroundColor and label
  for (let i = 0; i < dataSort.length; i++) {
    newData.push(dataSort[i].datapoint);
    newBackgroundColors.push(dataSort[i].background);
    newLabel.push(dataSort[i].label);
  }

  // function to close snackBar
  const handleCloseSnackBar = useCallback((reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackBar(false);
  }, []);

  // function to handle when user click on try again button to open quiz page

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
