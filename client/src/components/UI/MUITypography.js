import { Typography, styled } from "@mui/material";

// override MUI Typography styles

export const StyledTypography = styled(Typography)(({ theme }) => ({
  textAlign: "center",
  fontWeight: "bold",
  fontSize: "22px",
  color: theme.palette.primary.main,
  marginBottom: "20px",
}));
