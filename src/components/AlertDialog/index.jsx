import * as React from "react";
import PropTypes from "prop-types";
import { styled, css } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const CancelButton = styled(Button)`
  margin-right: auto;
`;

export default function AlertDialog({
  open,
  setOpen,
  //   children,
  showCloseButton = true,
  caption,
  title,
  onConfirm,
  confirmButtonCaption = "אשר",
  cancelButtonCaption = "בטל",
  inputProps = {
    caption: {},
    title: {},
  },
}) {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {showCloseButton && (
          <IconButton
            style={{ position: "absolute", top: "0", right: "0" }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        )}
        {!!title && (
          <DialogTitle
            id="alert-dialog-title"
            style={inputProps.caption}
          >
            {title}
          </DialogTitle>
        )}
        <DialogContent>
          {!!caption && (
            <DialogContentText
              style={inputProps.caption}
              id="alert-dialog-description"
            >
              {caption}
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <CancelButton onClick={handleClose}>
            {cancelButtonCaption}
          </CancelButton>
          <Button
            variant="contained"
            onClick={onConfirm}
            autoFocus
          >
            {confirmButtonCaption}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

AlertDialog.propTypes = {
  children: PropTypes.any,
  open: PropTypes.bool.isRequired,
  showCloseButton: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  caption: PropTypes.string,
  captionStyle: PropTypes.object,
};
