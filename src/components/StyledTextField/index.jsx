import React from "react";
import { TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { theme } from "../../styles/theme.js";
import { styled } from "@mui/material/styles";
import { isString } from "lodash";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const TypographyWrapper = styled(Typography)`
  bottom: -25px;
  padding: 0 5px;
  position: absolute;
`;

function StyledTextField({
  onChange,
  onBlur,
  key,
  name,
  defaultValue,
  value,
  disabled,
  required,
  label,
  hasError,
  error,
  className,
  type,
  variant,
  InputProps,
  autoComplete,
  ...props
}) {
  return (
    <Wrapper
      className={className}
      {...props}
    >
      <TextField
        variant={variant}
        inputProps={{
          autoComplete,
        }}
        InputProps={InputProps}
        disabled={disabled}
        key={key}
        defaultValue={defaultValue}
        value={value}
        type={type}
        onBlur={onBlur}
        onChange={onChange}
        name={name}
        required={required}
        label={label}
        error={!!hasError || !!error}
        autoComplete={autoComplete}
      ></TextField>

      <TypographyWrapper
        dir={"auto"}
        variant="caption"
        gutterBottom
        style={{
          visibility: error ? "visible" : "hidden",
          color: theme.color.error,
        }}
      >
        {isString(error) ? error : ""}
      </TypographyWrapper>
    </Wrapper>
  );
}

export default React.memo(StyledTextField);
