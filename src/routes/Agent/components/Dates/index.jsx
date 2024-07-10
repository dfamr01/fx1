import { css, styled } from "@mui/material/styles";
import { Button, Typography, Box, CircularProgress } from "@mui/material";
import { SELECTED_DATE } from "../../../../utilities/constants";

const DatesWrap = styled(Box)`
  display: flex;
  flex-direction: row-reverse;
  button:first-of-type {
    margin-right: 0;
  }
`;

const Date = styled(Button)`
  border-radius: 25px;
  margin-right: 15px;
  background-color: #3d78ac;
  ${({ selected }) =>
    selected &&
    css`
      background-color: #2a2a2a;
    `}
  &:focus,
  &:active {
    background-color: #2a2a2a;
  }
`;

function DateSelector({ selected, options, onSelected, ...props }) {
  return (
    <DatesWrap {...props}>
      {Object.values(options).map(({ key, value }) => {
        return (
          <Date
            selected={+(selected === key)}
            key={key}
            name={key}
            variant="contained"
            onClick={onSelected}
          >
            {value}
          </Date>
        );
      })}
    </DatesWrap>
  );
}

export default DateSelector;
