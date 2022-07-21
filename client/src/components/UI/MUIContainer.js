import { Container, styled } from "@mui/material";

// override MUI Container styles

export const StyledContainer = styled(Container)({
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
});
