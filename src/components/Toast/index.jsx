import React from "react";
import { css, styled } from "@mui/material/styles";
import { Alert, Snackbar } from "@mui/material";
import { isFunction, isObject } from "lodash";

let setStateRef;

const AlertWrap = styled(Alert)`
  white-space: pre-wrap;
  text-align: end;
`;

export function errorHandler(err, errorMessage = "") {
  if (isFunction(err)) {
    err = err.toString();
  }
  console.error(err);
  let message = err;
  if (isObject(message)) {
    message = err.message;
  }

  if (isObject(errorMessage)) {
    message += JSON.stringify(err.message);
  } else {
    message += errorMessage;
  }

  setStateRef((prev) => {
    return {
      ...prev,
      open: true,
      severity: "error",
      message: message,
    };
  });
}

export function successHandler(message) {
  setStateRef((prev) => {
    return {
      ...prev,
      open: true,
      severity: "success",
      message: message,
    };
  });
}

export function infoHandler(message) {
  setStateRef((prev) => {
    return {
      ...prev,
      open: true,
      severity: "info",
      message: message,
    };
  });
}

function Toast({ autoHideDuration = 5000 }) {
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });
  setStateRef = setState;
  const { vertical, horizontal, open, severity, message } = state;
  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <Snackbar
      // severity={'error'}
      // severity={severity}
      autoHideDuration={autoHideDuration}
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      // message={message}
      key={vertical + horizontal}
    >
      <AlertWrap
        onClose={handleClose}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {message}
      </AlertWrap>
    </Snackbar>
  );
}

export default Toast;
