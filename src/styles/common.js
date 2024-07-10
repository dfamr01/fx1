import { styled, css } from "@mui/material/styles";
import { Box, Button, Paper } from "@mui/material";

export const PageWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const PaperWrapper = styled(Paper)`
  display: flex;
  flex-direction: column;
  /* height: 80%; */
  border-radius: 10px;
  padding: 15px;
`;

export const ElementsWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  max-height: 100%;
`;

export const AcceptActionButton = styled(Button)`
  width: 150px;
  background-color: ${({ disabled }) =>
    disabled ? "#dbd8d8 !important" : "#3c3c3c"};
  padding: 10px 5px;
  &:focus,
  &:active {
    background-color: #2a2a2a;
  }
  &:hover {
    background-color: #636363;
  }
  margin: 15px;
  color: white;
`;

export const EditActionButton = styled(Button)`
  width: 150px;
  background-color: ${({ disabled }) =>
    disabled ? "#dbd8d8 !important" : "#3c3c3c"};
  padding: 10px 5px;
  &:focus,
  &:active {
    background-color: #2a2a2a;
  }
  &:hover {
    background-color: #636363;
  }
  margin: 15px;
  color: white;
`;

export const CancelActionButton = styled(Button)`
  width: 150px;
  border-color: #3c3c3c73;
  padding: 10px 5px;
  &:focus,
  &:active {
    border-color: #3c3c3c8f;
  }
  &:hover {
    border-color: #3c3c3c83;
  }

  margin: 15px;
  color: black;
`;

export const CircularProgressWrap = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const CustomScrollBars = css`
  /* Track */
  ::-webkit-scrollbar {
    width: 12px; /* Set the width of the scrollbar */
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #888; /* Color of the scrollbar handle */
    border-radius: 6px; /* Rounded corners for the handle */
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #555; /* Color of the handle on hover */
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #f1f1f1; /* Color of the scrollbar track */
  }

  /* Handle when scrolling */
  ::-webkit-scrollbar-thumb:active {
    background-color: #333; /* Color of the handle when scrolling */
  }
`;
