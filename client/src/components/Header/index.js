import React from "react";
import { AppBar, Toolbar, styled, Typography } from "@mui/material";

const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "center",
});

const Header = () => {
  return (
    <AppBar position="static">
      <StyledToolbar>
        <Typography variant="h6">English Quiz</Typography>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;
