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
} from "@mui/material";
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Tooltip,
} from "chart.js";
import Loading from "../UI/Loading";

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

Chart.register(LinearScale, CategoryScale, BarElement, Tooltip);

const RankPage = ({ score }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [error, setError] = useState(null);
  const [usersRanks, setUsersRanks] = useState([]);

  const handleSendRank = useCallback(async () => {
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
    setIsLoading(false);
  }, [score]);

  useEffect(() => {
    handleSendRank();
  }, [handleSendRank]);

  const handleCloseSnackBar = useCallback((reason) => {
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
      <StyledContainer>
        <StyledCard>
          <Box sx={{ margin: "0 auto" }}>
            <Box>
              <StyledTypography>Your Rank is {usersRanks[0]}%</StyledTypography>
            </Box>
            <Box>
              <Bar
                data={{
                  labels: usersRanks.map((user, index) => {
                    if (index === 0) {
                      return "You";
                    } else {
                      return `User ${index}`;
                    }
                  }),
                  datasets: [
                    {
                      label: "Rank",
                      data: usersRanks,
                      backgroundColor: usersRanks.map((user, index) => {
                        if (index === 0) {
                          return "#667eea";
                        } else {
                          return "#e5e5e5";
                        }
                      }),
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    yAxis: {
                      beginAtZero: true,
                      max: 100,
                    },
                  },
                }}
                height={500}
              />
            </Box>
          </Box>
        </StyledCard>
      </StyledContainer>
    </div>
  );
};

export default RankPage;
