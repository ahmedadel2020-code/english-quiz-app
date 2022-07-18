import { Button, styled } from "@mui/material";

const MUIButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: "5px",
  margin: 5,
  textTransform: "none",
  "&:hover": {
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },
}));

export default MUIButton;
