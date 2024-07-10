import { useSignal } from "@preact/signals-react";
import dayjs from "dayjs";

import { styled } from "@mui/material/styles";
import { Button, Divider, Typography } from "@mui/material";
import { theme } from "../../../../../styles/theme.js";
import { DO_NOT_DISTURB, DAYS } from "../../../../../utilities/constants.js";
import TimePickerStyled from "../../../../../components/TimePickerStyled/index.jsx";
import {
  CancelActionButton,
  AcceptActionButton,
} from "../../../../../styles/common.js";
import { isEqual } from "lodash";
import { isArraysEqual } from "../../../../../utilities/utils.js";

const Wrap = styled("div")`
  padding: 10px 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  background-color: ${theme.color.grayLight};
  border-radius: 10px;
`;

const DayWrap = styled(Button)`
  margin: 5px;
  width: 58px;
  display: flex;
  height: fit-content;
  flex-direction: column;
  align-items: center;
  color: inherit;

  background-color: ${({ disable }) =>
    disable ? theme.color.disable : theme.color.purpleLight};
  &:focus,
  &:active,
  &:hover {
    background-color: ${({ disable }) =>
      disable ? theme.color.disable : theme.color.purpleLight};
  }
`;

const Day = styled(Typography)``;

const TimeWrapper = styled("div")`
  width: 100%;
  display: flex;
`;

const Time = styled("div")`
  color: inherit;
  flex-direction: column;
`;

const TimeText = styled(Typography)`
  font-weight: bold;
  width: 100%;
  text-align: start;
`;

const HourText = styled(Typography)`
  font-weight: 500;
  text-align: end;
`;

const TimePickerWrap = styled("div")`
  display: flex;
`;

const TimePickerStyledWrap = styled(TimePickerStyled)`
  min-width: 70px !important;
  max-width: 70px;
  input {
    cursor: pointer !important;
  }
`;

const ActionButtonWrap = styled("div")`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const ButtonText = styled(Typography)`
  font-weight: 500;
  text-align: center;
  color: inherit;
`;

function NewDoNotDisturb({
  doNotDisturbInit,
  disabled,
  edit,
  onSubmit,
  onCancel,
}) {
  const doNotDisturb = useSignal(doNotDisturbInit);
  function setDay(day) {
    const index = doNotDisturb.value.days.indexOf(day);
    let days = [...doNotDisturb.value.days];

    if (index >= 0) {
      days.splice(index, 1);
    } else {
      days.push(day);
    }

    doNotDisturb.value = {
      ...doNotDisturb.value,
      days: days,
    };
  }

  function onClickSave(event) {
    onSubmit(doNotDisturb.value);
  }

  function onClickCancel(key) {}

  function onChangeTimeStart(newTime) {
    doNotDisturb.value = {
      ...doNotDisturb.value,
      hours: {
        start: newTime,
        end: doNotDisturb.value.hours.end,
      },
    };
  }

  function onChangeTimeEnd(newTime) {
    doNotDisturb.value = {
      ...doNotDisturb.value,
      hours: {
        start: doNotDisturb.value.hours.start,
        end: newTime,
      },
    };
  }

  function deepEqual() {
    const isArraysEqualRes = isArraysEqual(
      doNotDisturbInit.days,
      doNotDisturb.value.days,
    );
    let equal = isArraysEqualRes;
    equal &&= isEqual(doNotDisturb.value.hours, doNotDisturbInit.hours);
    equal &&= isEqual(doNotDisturb.value.isActive, doNotDisturbInit.isActive);
    equal &&= isEqual(doNotDisturb.value.uuid, doNotDisturbInit.uuid);
    return equal;
  }

  const disabledSave = edit && deepEqual();

  return (
    <Wrap>
      {Object.values(DO_NOT_DISTURB.value.days).map((el) => {
        const isDisabled = !doNotDisturb.value.days.includes(el)
          ? "true"
          : undefined;

        return (
          <DayWrap
            disable={isDisabled}
            key={el}
            onClick={() => setDay(el)}
          >
            <Day>{DAYS[el].value}</Day>
          </DayWrap>
        );
      })}

      <Divider
        style={{
          marginTop: 15,
          marginBottom: 15,
          width: "100%",
        }}
      />

      <TimeWrapper>
        <Time>
          <TimeText dir="auto">הזן זמנים</TimeText>
          <HourText>
            {`${dayjs(doNotDisturb.value.hours.start).format(
              "HH:mm",
            )} ~ ${dayjs(doNotDisturb.value.hours.end).format("HH:mm")}`}
          </HourText>

          <TimePickerWrap>
            <TimePickerStyledWrap
              label={"התחל"}
              defaultValue={doNotDisturb.value.hours.start}
              onAccept={onChangeTimeStart}
            />

            <div style={{ paddingLeft: 10 }}>
              <TimePickerStyledWrap
                label={"סיים"}
                defaultValue={doNotDisturb.value.hours.end}
                onAccept={onChangeTimeEnd}
              />
            </div>
          </TimePickerWrap>
        </Time>
      </TimeWrapper>

      <ActionButtonWrap>
        <CancelActionButton
          variant="outlined"
          onClick={onCancel}
        >
          <ButtonText>בטל</ButtonText>
        </CancelActionButton>
        <AcceptActionButton
          disabled={disabled || disabledSave}
          onClick={onClickSave}
        >
          <ButtonText>שמור</ButtonText>
        </AcceptActionButton>
      </ActionButtonWrap>
    </Wrap>
  );
}

export default NewDoNotDisturb;
