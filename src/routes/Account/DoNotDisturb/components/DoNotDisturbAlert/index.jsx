import { connect } from "react-redux";
import { useSignal } from "@preact/signals-react";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import { Button, Divider, Switch, Typography } from "@mui/material";
import { getAuthIsLoggedIn } from "../../../../../redux/auth/selectors.js";
import { getUserProfile } from "../../../../../redux/userProfile/selectors.js";
import { theme } from "../../../../../styles/theme.js";
import { DAYS } from "../../../../../utilities/constants.js";
import CloseButton from "../../../../../components/CloseButton/index.jsx";
import { successHandler } from "../../../../../components/Toast/index.jsx";

const Wrap = styled("div")`
  padding: 10px 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  background-color: ${theme.color.grayLight};
  border-radius: 10px;
`;

const TitleDaysWrap = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
`;

const TitleDaysInnerWrap = styled("div")`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
`;

const SwitchWrapper = styled("div")`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  justify-content: space-between;
`;

const Title = styled(Typography)`
  font-weight: bold;
  user-select: none;
`;

const DayWrap = styled("div")`
  display: flex;
  justify-content: flex-start;
  flex-direction: row-reverse;
  align-items: center;
`;

const Day = styled(Typography)`
  color: gray;
  user-select: none;
`;

const VerticalDivider = styled(Typography)`
  padding: 0 5px;
  font-size: 1.3rem;
  user-select: none;
`;

const TimeWrapper = styled("div")`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Time = styled("div")`
  color: inherit;
  flex-direction: column;
  padding: 0 10px;
`;

const HourText = styled(Typography)`
  font-weight: 500;
  text-align: end;
`;

const EditButton = styled(Button)`
  font-weight: 500;
  text-align: end;
`;

const DeleteButton = styled(Button)`
  font-weight: 500;
  text-align: end;
  color: red;
`;

function RenderDays({ doNotDisturb }) {
  if (doNotDisturb.days.length === 7) {
    return <Day>כל יום</Day>;
  }

  return (
    <TitleDaysInnerWrap>
      {Object.values(doNotDisturb.days).map((el, index) => {
        // const isDisabled = !doNotDisturb.value.days.includes(el) ? "true" : undefined;

        const isLastElement = doNotDisturb.days.length - 1 === index;
        return (
          <DayWrap key={el}>
            <Day>{DAYS[el].value}</Day>
            {!isLastElement && <VerticalDivider>|</VerticalDivider>}
          </DayWrap>
        );
      })}
    </TitleDaysInnerWrap>
  );
}

function DoNotDisturbAlert({
  className,
  input,
  disableToggle,
  onToggleAvailability,
  onEdit,
  onDelete,
}) {
  const deleteFlag = useSignal(false);

  function onEditClick(e) {
    onEdit(input);
  }

  function onDeleteClick(e) {
    deleteFlag.value = true;
    onDelete(input)
      .then(() => {
        successHandler("נמחק בהצלחה");
      })
      .finally(() => {
        deleteFlag.value = false;
      });
  }

  return (
    <Wrap
      className={className}
      style={{ opacity: deleteFlag.value ? 0.6 : 1 }}
    >
      {/* <CloseButton onClick={onDelete} /> */}
      <TitleDaysWrap>
        <SwitchWrapper>
          <Title>לא להפריע</Title>
          <Switch
            disabled={disableToggle}
            checked={input.isActive}
            onChange={onToggleAvailability}
          />
        </SwitchWrapper>

        <RenderDays doNotDisturb={input} />
      </TitleDaysWrap>

      <Divider
        style={{
          margin: "10px 0",
          width: "100%",
        }}
      />

      <TimeWrapper>
        <Time>
          <HourText>
            {`${dayjs(input.hours.start).format("HH:mm")} ~ ${dayjs(
              input.hours.end,
            ).format("HH:mm")}`}
          </HourText>
        </Time>
        <div>
          <DeleteButton
            disabled={deleteFlag.value}
            onClick={onDeleteClick}
          >
            מחיקה
          </DeleteButton>
          <EditButton
            disabled={deleteFlag.value}
            onClick={onEditClick}
          >
            ערוך
          </EditButton>
        </div>
      </TimeWrapper>
    </Wrap>
  );
}

export default DoNotDisturbAlert;
