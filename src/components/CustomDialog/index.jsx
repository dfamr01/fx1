import PropTypes from "prop-types";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const Wrapper = styled("div")`
  padding: 20px;
  @media only screen and (max-width: 600px) {
    padding: 20px 10px;
  }
`;

const DialogTitleWrap = styled(DialogTitle)`
  padding: 5px 24px;
`;

export default function CustomDialog({
  children,
  open,
  setOpen,
  showCloseButton = true,
  caption,
  captionStyle,
  ...props
}) {
  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
    >
      {showCloseButton && (
        <IconButton
          style={{ position: "absolute", top: "0", right: "0" }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
      )}

      <Wrapper {...props}>
        {caption && (
          <DialogTitleWrap
            style={{ ...{ textAlign: "center" }, ...captionStyle }}
          >
            {caption}
          </DialogTitleWrap>
        )}
        {children && <>{children}</>}
      </Wrapper>
    </Dialog>
  );
}

CustomDialog.propTypes = {
  children: PropTypes.any,
  open: PropTypes.bool.isRequired,
  showCloseButton: PropTypes.bool,
  setOpen: PropTypes.func.isRequired,
  caption: PropTypes.string,
  captionStyle: PropTypes.object,
};
