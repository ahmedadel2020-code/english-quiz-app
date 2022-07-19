import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Container, Modal, styled } from "@mui/material";

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: theme.palette.primary.main,
}));

const StyledContainer = styled(Container)({
  borderColor: "white",
  borderRadius: "5px",
  textAlign: "center",
  backgroundColor: "white",
  width: "180px !important",
  margin: "0 auto",
  display: "grid !important",
  justifyContent: "center",
  alignItems: "center",
  height: "200px !important",
});

const Loading = ({ loading }) => {
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    setLoadingState(loading);
  }, [loading]);

  return (
    <StyledModal open={loadingState}>
      <StyledContainer>
        <CircularProgress
          thickness={3.1}
          size={50}
          sx={{ margin: "0 auto", mt: "1.5rem", mb: "-2.5rem" }}
        />
        <b>PLEASE WAIT</b>
      </StyledContainer>
    </StyledModal>
  );
};

export default Loading;
