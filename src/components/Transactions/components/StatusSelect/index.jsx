import * as React from "react";
import { styled, css } from "@mui/material/styles";
import { Button } from "@mui/material";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSignal } from "@preact/signals-react";
import {
  TRANSACTION_STATUS,
  TRANSACTION_STATUS_COLOR,
} from "../../../../utilities/constants";

const Status = styled(Select)`
  background-color: ${({ status }) =>
    TRANSACTION_STATUS_COLOR[status]} !important;
  color: #fdfdfd !important;
  border-radius: 25px;
  text-align: center;
`;

function StatusSelect({ current, options, onChange, ...props }) {
  //   const [age, setAge] = React.useState("");
  //   useSignal();
  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <FormControl
      sx={{ m: 1 }}
      {...props}
      size="small"
    >
      <InputLabel id="demo-select-small-label"></InputLabel>
      <Status
        status={current}
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={current}
        label="status"
        onChange={handleChange}
      >
        {options.map((el) => {
          return (
            <MenuItem
              key={el.key}
              value={el.key}
            >
              {el.value}
            </MenuItem>
          );
        })}
      </Status>
    </FormControl>
  );
}

export default StatusSelect;
