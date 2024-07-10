import PropTypes from "prop-types";
import * as React from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import { MultiSectionDigitalClock } from "@mui/x-date-pickers";

function TimePickerStyled({
  className,
  sx,
  label,
  defaultValue,
  closeOnSelect = true,
  onChange,
  onAccept,
  ...props
}) {
  function onAcceptClick(newValue) {
    onAccept(newValue.toISOString());
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["MobileTimePicker"]}>
        <MobileTimePicker
          className={className}
          label={label}
          openTo="hours"
          views={["hours", "minutes"]}
          format="HH:mm"
          defaultValue={dayjs(defaultValue)}
          ampm={false}
          closeOnSelect={closeOnSelect}
          onAccept={onAcceptClick}
          sx={sx}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

TimePickerStyled.propTypes = {
  className: PropTypes.string,
};
export default React.memo(TimePickerStyled);
