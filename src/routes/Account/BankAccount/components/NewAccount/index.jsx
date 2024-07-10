import { useSignal } from "@preact/signals-react";
import dayjs from "dayjs";

import { signal, computed, effect, batch } from "@preact/signals-core";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import {
  Box,
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { getAuthIsLoggedIn } from "../../../../../redux/auth/selectors.js";
import { getUserProfile } from "../../../../../redux/userProfile/selectors.js";
import { theme } from "../../../../../styles/theme.js";
import StyledTextField from "../../../../../components/StyledTextField/index.jsx";
import { isEqual } from "lodash";
import {
  hasError,
  validateNumericInput,
} from "../../../../../utilities/utils.js";
import { BANKS } from "../../../../../utilities/constants.js";
import { ContentWrapper } from "../../../shared.js";
import {
  CancelActionButton,
  AcceptActionButton,
} from "../../../../../styles/common.js";
import NumericInput from "../../../../../components/NumericInput/index.jsx";

const Wrap = styled("div")`
  padding: 10px 10px;
  margin-top: 10px;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  background-color: ${theme.color.grayLight};
  border-radius: 10px;
`;

const RowWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TextFieldWrapper = styled(StyledTextField)`
  margin: 10px;
`;

const NumericInputWrap = styled(NumericInput)`
  margin: 10px;
`;

const ActionButtonWrap = styled("div")`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 0 5px;
`;

const ButtonText = styled(Typography)`
  font-weight: 500;
  text-align: center;
  color: inherit;
`;

function NewBankAccount({ accountInit, disabled, onSubmit, onCancel }) {
  const bankAccount = useSignal(accountInit);
  const errorDetails = useSignal({});

  function updateError({ name, value, required, hasError, errorText }) {
    errorDetails.value = {
      ...errorDetails.value,
      [name]: !!hasError || errorText || (required && !value),
    };
  }

  function onChange({ target: { name, value, required } }) {
    bankAccount.value = {
      ...bankAccount.value,
      [name]: value,
    };

    updateError({ name, value, required });
  }

  function onSubmitClick(e) {
    e.preventDefault();
    onSubmit(bankAccount.value);
  }

  let submitConstraints = [
    !disabled,
    bankAccount.value.bankKey,
    bankAccount.value.branchId,
    bankAccount.value.accountNumber,
    !isEqual(accountInit, bankAccount.value),
  ];

  const disableSubmit =
    submitConstraints.filter((el) => !el).length ||
    hasError(errorDetails.value);

  const bankId = bankAccount.value?.bankKey
    ? BANKS[bankAccount.value.bankKey]?.bankId
    : "";

  return (
    <form onSubmit={onSubmitClick}>
      <Wrap>
        <ContentWrapper>
          <RowWrapper>
            <TextFieldWrapper
              label="מספר בנק"
              value={bankId}
              disabled={true}
              InputProps={{
                readOnly: true,
              }}
            />

            <FormControl sx={{ width: 227, m: "10px" }}>
              <InputLabel id="bank-select-label">בנק</InputLabel>

              <Select
                label="bank-label"
                labelId="bank-select-label"
                id="bank-select"
                value={bankAccount.value.bankKey}
                onChange={onChange}
                autoWidth
                name={"bankKey"}
              >
                {Object.values(BANKS).map((option) => (
                  <MenuItem
                    key={option.key}
                    value={option.key}
                  >
                    {option.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </RowWrapper>

          <RowWrapper>
            <NumericInputWrap
              type="number"
              label="מספר חשבון"
              value={bankAccount.value.accountNumber}
              name={"accountNumber"}
              onChange={onChange}
            />

            <NumericInputWrap
              type="number"
              label="סניף"
              value={bankAccount.value.branchId}
              name={"branchId"}
              onChange={onChange}
            />
          </RowWrapper>
        </ContentWrapper>
        <ActionButtonWrap>
          <CancelActionButton
            variant="outlined"
            onClick={onCancel}
          >
            <ButtonText>בטל</ButtonText>
          </CancelActionButton>
          <AcceptActionButton
            disabled={!!disableSubmit}
            type="submit"
          >
            <ButtonText>שמור</ButtonText>
          </AcceptActionButton>
        </ActionButtonWrap>
      </Wrap>
    </form>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(NewBankAccount);

export default Component;
