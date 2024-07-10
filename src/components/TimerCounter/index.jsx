import { styled } from "@mui/material/styles";
import { useSignal } from "@preact/signals-react";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { theme } from "../../styles/theme";

const TimerWrap = styled(Box)`
  display: flex;
`;

const CounterCaption = styled(Typography)`
  padding: 0 5px;
  color: ${theme.color.grayDark};
`;

const Caption = styled(Typography)`
  font-weight: bold;
  color: #c51839;
`;

function TimerCounter({
  className,
  timerSec,
  caption = "",
  removeOnZero = false,
  isActive,
  onDone = () => {},
}) {
  const timerCounter = useSignal(timerSec);

  useEffect(() => {
    timerCounter.value = timerSec;
    if (timerCounter.value <= 0) {
      onDone();
      return;
    }
    const interval = setInterval(() => {
      timerCounter.value = timerCounter.value - 1;
      if (timerCounter.value <= 0) {
        clearInterval(interval);
        onDone();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSec]);

  if (removeOnZero && timerCounter.value <= 0) {
    return;
  }

  return (
    <TimerWrap className={className}>
      <CounterCaption>
        {dayjs.duration(timerCounter.value, "s").format("HH:mm:ss")}
      </CounterCaption>
      <Caption>{caption}</Caption>
    </TimerWrap>
  );
}
export default TimerCounter;
