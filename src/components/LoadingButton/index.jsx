import { css, styled } from "@mui/material/styles";
import { Button, Typography, CircularProgress } from "@mui/material";

const CircularProgressWrap = styled(CircularProgress)`
  --dim: 21px;
  height: var(--dim) !important;
  width: var(--dim) !important;
`;

const CaptionWrap = styled(Typography)`
  margin-bottom: 0.15em;
  margin-top: 0.15em;
  line-height: normal;
`;

const LoadingCaption = styled(Typography)`
  margin-bottom: 0.15em;
  margin-top: 0.15em;
  line-height: normal;

  ${({ show_spinner }) =>
    show_spinner &&
    css`
      padding-left: 6px;
    `}
`;

function LoadingButton({
  disabled,
  isLoading,
  loadingCaption,
  showSpinner = true,
  caption,
  inputProps = {},
  ...props
}) {
  return (
    <Button
      {...props}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <>
          {showSpinner && (
            <CircularProgressWrap
              style={inputProps.spinner}
              color="inherit"
            />
          )}
          {loadingCaption && (
            <LoadingCaption
              show_spinner={+showSpinner}
              variant="button"
              gutterBottom
              style={inputProps.loadingCaption}
            >
              {loadingCaption}
            </LoadingCaption>
          )}
        </>
      ) : (
        <>
          <CaptionWrap
            style={inputProps.caption}
            variant="button"
            gutterBottom
          >
            {caption}
          </CaptionWrap>
        </>
      )}
    </Button>
  );
}

export default LoadingButton;
