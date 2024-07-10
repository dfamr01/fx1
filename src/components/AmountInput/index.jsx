import React from "react";
import PropTypes from "prop-types";
import { NumericFormat } from "react-number-format";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SelectCurrency from "./SelectCurrency/index.jsx";
import { styled } from "@mui/material/styles";
import NumericInput from "../NumericInput/index.jsx";

const AmountWrapper = styled(Box)`
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

const NumericFormatCustom = React.forwardRef(
  function NumericFormatCustom(props, ref) {
    const { currencySymbol, onChange, min, max, ...other } = props;

    return (
      <NumericFormat
        min={min}
        max={max}
        {...other}
        getInputRef={ref}
        onValueChange={(values) => {
          onChange({
            target: {
              name: props.name,
              value: values.value,
              floatValue: values.floatValue,
              formattedValue: values.formattedValue,
            },
          });
        }}
        thousandSeparator
        valueIsNumericString
        prefix={currencySymbol}
      />
    );
  },
);

NumericFormatCustom.propTypes = {
  name: PropTypes.string.isRequired,
  currencySymbol: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

function AmountInput({
  dir = "",
  label,
  variant = "outlined",
  amount,
  setAmount,
  positiveOnly = true,
  min,
  max,
  currency,
  currencySymbol,
  setCurrency,
  hideCurrencySelector = false,
  error,
  ...props
}) {
  // const [selectedCurrency, setSelectedCurrency] = React.useState(currency);

  const handleChange = (event) => {
    const value = event.target;
    if (
      (min != undefined && value.floatValue < min) ||
      (max != undefined && value.floatValue > max)
    ) {
      return;
    }
    setAmount(event.target);
  };

  return (
    <AmountWrapper {...props}>
      <NumericInput
        dir={dir}
        error={error}
        label={label}
        value={amount}
        onChange={handleChange}
        name="numberformat"
        InputProps={{
          inputComponent: NumericFormatCustom,
          inputProps: {
            currencySymbol: currencySymbol || currency?.symbol,
            min,
            max,
          },
        }}
        variant={variant}
      />
      {!hideCurrencySelector && (
        <SelectCurrency
          selectedCurrency={currency}
          setSelectedCurrency={setCurrency}
        />
      )}
    </AmountWrapper>
  );
}

AmountInput.propTypes = {
  dir: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.string,
  amount: PropTypes.any,
  setAmount: PropTypes.func.isRequired,
  currency: PropTypes.object,
  setCurrency: PropTypes.func,
  error: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  hideCurrencySelector: PropTypes.bool,
  currencySymbol: PropTypes.string,
};

const amountInput = React.memo(AmountInput);
export default amountInput;
