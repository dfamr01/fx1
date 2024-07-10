import { CircularProgressWrap } from "../../styles/common";
import { CircularProgress } from "@mui/material";

function LoadingSpinner({}) {
  return (
    <CircularProgressWrap>
      <CircularProgress />
    </CircularProgressWrap>
  );
}

export default LoadingSpinner;
