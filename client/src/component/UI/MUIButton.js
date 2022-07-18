import { Button, styled } from "@mui/material";

export const MUIButtonOutlined = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  minWidth: "64px",
  padding: "5px 15px",
  borderRadius: "5px",
  textTransform: "none",
  "&:hover": {
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
  "&:disabled": {
    color: "#858585",
    background: theme.colorLightGrey,
    cursor: "default",
  },
}));

export const MUIButtonContained = styled(Button)(({ theme }) => ({
  color: "white",
  minWidth: "64px",
  padding: "5px 15px",
  borderRadius: "5px",
  textTransform: "none",
  backgroundColor: theme.palette.primary.main,
  "&:hover": {
    color: "white",
    backgroundColor: theme.palette.secondary.main,
  },
  "&:disabled": {
    color: "#858585",
    background: theme.palette.otherColors.colorLightGrey,
    cursor: "default",
  },
}));
