import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { CURRENCIES, setCurrency } from "../../../utilities/currency.js";
import PropTypes from "prop-types";

function SelectCurrency({
  variant = "standard",
  style = {},
  selectedCurrency,
  setSelectedCurrency,
  ...props
}) {
  const handleChange = (event) => {
    const currency = CURRENCIES[event.target.value];
    setCurrency(currency);
    setSelectedCurrency(currency);
  };

  return (
    <FormControl
      // displayEmpty
      // inputProps={{'aria-label': 'Without label'}}
      sx={{ m: 1, minWidth: "auto", margin: 0 }}
      variant={variant}
      {...props}
    >
      {/*<InputLabel id="demo-simple-select-autowidth-label">Age</InputLabel>*/}
      <Select
        style={style}
        labelId="simple-select-label"
        id="simple-select"
        value={selectedCurrency?.key}
        onChange={handleChange}
        autoWidth
      >
        {Object.values(CURRENCIES).map((option) => (
          <MenuItem
            key={option.key}
            value={option.key}
          >
            {option.symbol}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

SelectCurrency.propTypes = {
  props: PropTypes.any,
  style: PropTypes.object,
  variant: PropTypes.string,
  selectedCurrency: PropTypes.object,
  setSelectedCurrency: PropTypes.func.isRequired,
};

export default SelectCurrency;
