import { useEffect, useRef, useState } from "react";
import { ACCEPTED_IMAGES } from "../../utilities/constants.js";
import { styled } from "@mui/material/styles";
import StyledImage from "../StyledAvatar/index.jsx";
import PropTypes from "prop-types";
import React from "react";

const StyledImageWrap = styled(StyledImage)`
  cursor: pointer;
`;

const StyledFileUpload = styled("input")`
  display: none;
`;

function ImageInput({
  onChange,
  disabled,
  resetRef,
  accept = ACCEPTED_IMAGES,
  src = "",
  ...props
}) {
  const [imageBase64Url, setImageBase64Url] = useState(src);
  const coverPhotoRef = useRef(null);
  useEffect(() => {
    if (resetRef) {
      resetRef.current = () => setImageBase64Url(src);
    }
  }, [src]);

  function onImageClick() {
    if (disabled) {
      return;
    }
    coverPhotoRef.current.click();
  }

  function onImageChanged({ target: { files } }) {
    const file = files[0];
    if (!file) {
      return false;
    }
    onChange(file);
    setImageBase64Url(window.URL.createObjectURL(file));
  }

  return (
    <>
      <StyledImageWrap
        disabled={disabled}
        {...props}
        onClick={onImageClick}
        src={imageBase64Url || src}
      />
      <StyledFileUpload
        type="file"
        accept={accept}
        className="hide"
        ref={coverPhotoRef}
        onChange={onImageChanged}
      />
    </>
  );
}

ImageInput.prototype = {
  onChange: PropTypes.func.isRequired,
  src: PropTypes.string,
  accept: PropTypes.string,
  props: PropTypes.any,
};
export default ImageInput;
