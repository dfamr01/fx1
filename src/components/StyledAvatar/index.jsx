import React from "react";
import Avatar from "@mui/material/Avatar";
import PropTypes from "prop-types";

const COLOR_ARRAY = [
  "gray",
  "red",
  "green",
  "blue",
  "pink",
  "black",
  "gold",
  "aquamarine",
  "bisque",
  "blueviolet",
  "brown",
  "burlywood",
  "cadetblue",
  "chartreuse",
  "chocolate",
  "coral",
  "crimson",
  "darkorchid",
  "darkgray",
  "DarkMagenta",
  "DarkGreen",
  "DarkOrange",
  "DarkRed",
  "DarkSalmon",
  "DarkSeaGreen",
  "DarkSlateBlue",
  "DarkSlateGray",
  "DarkViolet",
  "DeepPink",
  "DeepSkyBlue",
  "DodgerBlue",
  "FireBrick",
  "ForestGreen",
  "Fuchsia",
  "GoldenRod",
  "IndianRed",
  "Indigo",
  "LightCoral",
  "LightPink",
  "LightSalmon",
  "LightSeaGreen",
  "LightSkyBlue",
  "Maroon",
  "MidnightBlue",
  "PaleVioletRed",
  "PowderBlue",
  "Turquoise",
];

function getInitials(name, maxInitials) {
  if (!name) {
    return "";
  }

  if (maxInitials > 1) {
    const nameSplit = name.split(" ");
    if (nameSplit.length <= 1) {
      const firstLetter = nameSplit[0][0];
      return firstLetter;
    }
    const firstLetter = nameSplit[0][0];
    const secondLetter = nameSplit[1][0];

    return `${firstLetter}${secondLetter}`;
  }

  return `${name[0]}`;
}

function stringToColor(string) {
  let hash = 0;

  /* eslint-disable no-bitwise */
  for (let i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  const selector = hash % COLOR_ARRAY.length;
  return COLOR_ARRAY[selector];
}

// const StyledInputBase = styled(InputBase)(({theme}) => ({
//     color: 'inherit',
//     '& .MuiInputBase-input': {
//         padding: theme.spacing(1, 1, 1, 0),
//         // vertical padding + font size from searchIcon
//         paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//         transition: theme.transitions.create('width'),
//         width: '100%',
//         [theme.breakpoints.up('md')]: {
//             width: '20ch',
//         },
//     },
// }));

function StyledAvatar({
  disabled,
  className,
  children,
  maxInitials = 2,
  name,
  text,
  color,
  round = true,
  src,
  ...props
}) {
  const style = {};

  let nameInitials;
  let selectedColor = color || "gray";

  if (name) {
    nameInitials = getInitials(name, maxInitials);
  }

  if (!src && nameInitials) {
    selectedColor = stringToColor(nameInitials);
  }

  // no image
  if (!src) {
    style.backgroundColor = selectedColor;
  }

  if (disabled) {
    style.filter = "brightness(65%)";
  }

  return (
    <>
      <Avatar
        {...props}
        className={className}
        style={style}
        src={src}
        variant={round ? "round" : "square"}
      >
        {text || (nameInitials && <div>{text || nameInitials}</div>)}
      </Avatar>
      {children}
    </>
  );
}

StyledAvatar.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  maxInitials: PropTypes.number,
  name: PropTypes.string,
  text: PropTypes.string,
  color: PropTypes.string,
  round: PropTypes.bool,
  src: PropTypes.string,
};
export default React.memo(StyledAvatar);
