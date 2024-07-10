import { useSignal, useComputed } from "@preact/signals-react";
import WithSideBar from "../../../layouts/WithSideBar/index.jsx";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import { getAuthIsLoggedIn } from "../../../redux/auth/selectors.js";
import { getUserProfile } from "../../../redux/userProfile/selectors.js";
import { Avatar, Button, Typography } from "@mui/material";
import AmountInput from "../../../components/AmountInput/index.jsx";
import {
  DEPOSIT_OPTIONS,
  DEPOSIT_OPTIONS_AVAILABLE,
  DEPOSIT_OPTIONS_IMG,
} from "../../../utilities/constants.js";
import { ContentWrapper, PageWrapper, SettingTitle, Title } from "../shared.js";
import { CURRENCIES } from "../../../utilities/currency.js";
import SelectCurrency from "../../../components/AmountInput/SelectCurrency/index.jsx";
import { theme } from "../../../styles/theme.js";
import {
  useGetUserAccountFromDBThunkQuery,
  useUpdateUserAccountDBThunkMutation,
} from "../../../redux/userAccount/reducers.js";
import { cloneDeep } from "lodash";
import { debounceFunction } from "../../../utilities/utils.js";
import { successHandler } from "../../../components/Toast/index.jsx";
import { ACCOUNT_MENU } from "../common.jsx";

const AmountInputWrap = styled(AmountInput)`
  padding: 5px 5px;
  #simple-select {
    margin-bottom: 16px;
  }
`;

const SelectCurrencyWrap = styled(SelectCurrency)`
  #simple-select {
    margin-bottom: 16px;
  }
`;

const DepositOptionWrap = styled("div")`
  padding: 0 10px 10px;
  display: flex;
  justify-content: flex-end;
`;

const DepositOptionButton = styled(Button)`
  margin: 5px 5px;
  width: 58px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-direction: column;
  align-items: center;
  color: inherit;
  box-shadow: ${({ disable }) => (!disable ? "0px 0px 3px #7f0d7b" : "unset")};
  background-color: ${({ disable }) => (!disable ? "#b20bf708" : "unset")};
`;

const DepositOption = styled("div")`
  border-radius: 5px;
`;

const AmountWrap = styled("div")`
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const TitleCurrency = styled("div")`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
`;

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column-reverse;
`;

function Account({ isMobile, userProfile }) {
  const currency = useSignal(CURRENCIES.ILS);

  const { uid } = userProfile;

  const [
    updateUserAccountDBThunk, // This is the mutation trigger
    { isLoading: isUpdating, isError: isUpdateError, error: errorUpdate }, // This is the destructured mutation result
  ] = useUpdateUserAccountDBThunkMutation();

  const { data, error, isLoading, isFetching } =
    useGetUserAccountFromDBThunkQuery({ uid });

  const { depositOptionsLimits = {}, depositOptions = {} } = data || {};

  function setCurrency(selectedCurrency) {
    currency.value = selectedCurrency;
  }

  const { isAgent } = userProfile;
  function handleMinimumChange(amount, key) {
    //same value dont do anything
    if (
      depositOptionsLimits[currency.value.key][key].min === amount.floatValue
    ) {
      return;
    }

    const newDepositOptionsLimits = cloneDeep(depositOptionsLimits);
    const min = amount.floatValue || 0;
    newDepositOptionsLimits[currency.value.key][key].min = min;

    updateUserAccountDBThunk({
      uid,
      data: { depositOptionsLimits: newDepositOptionsLimits },
    })
      .unwrap()
      .then(() => {
        successHandler("נשמר בהצלחה");
      });
  }

  function depositOptionClick(key) {
    const newDepositOptions = cloneDeep(depositOptions);
    newDepositOptions[key].isAvailable = !depositOptions[key].isAvailable;

    updateUserAccountDBThunk({
      uid,
      data: { depositOptions: newDepositOptions },
    })
      .unwrap()
      .then(() => {});
  }

  return (
    <PageWrapper>
      <Title
        variant="h6"
        noWrap
      >
        הגדרות הפקדה
      </Title>
      <ContentWrapper style={{ alignItems: "center" }}>
        <DepositOptionWrap>
          {Object.values(DEPOSIT_OPTIONS_AVAILABLE).map(({ key, value }) => {
            const disabled = !depositOptions[key]?.isAvailable;
            return (
              <DepositOptionButton
                style={{ opacity: disabled ? 0.5 : 1 }}
                disable={+disabled}
                key={key}
                onClick={() => depositOptionClick(key)}
              >
                <DepositOption>
                  <Avatar src={DEPOSIT_OPTIONS_IMG[key].iconImage} />
                </DepositOption>
                <Typography style={{ textAlign: "center" }}>
                  {DEPOSIT_OPTIONS[key].value}
                </Typography>
              </DepositOptionButton>
            );
          })}
        </DepositOptionWrap>

        <TitleCurrency>
          <SelectCurrencyWrap
            variant={"filled"}
            style={{ height: 40, marginRight: 10 }}
            selectedCurrency={currency.value}
            setSelectedCurrency={setCurrency}
          />
          <SettingTitle
            variant="h6"
            noWrap
            dir="auto"
          >
            הגדרות מינימום הפקדה
          </SettingTitle>
        </TitleCurrency>

        <Wrapper>
          {Object.values(DEPOSIT_OPTIONS).map(({ key, value }) => {
            const disabled = !depositOptions[key]?.isAvailable;
            if (disabled) {
              return null;
            }

            const minAmount = depositOptionsLimits[currency.value.key][key].min;

            return (
              <AmountWrap key={key}>
                <Avatar src={DEPOSIT_OPTIONS_IMG[key].iconImage} />
                <AmountInputWrap
                  dir={"auto"}
                  min={0}
                  hideCurrencySelector={true}
                  label={`מינימום הפקדה ${value}`}
                  amount={minAmount}
                  setAmount={(value) =>
                    debounceFunction(
                      () => handleMinimumChange(value, key),
                      1000
                    )
                  }
                  currencySymbol={currency.value.symbol}
                  variant={"filled"}
                />
              </AmountWrap>
            );
          })}
        </Wrapper>
      </ContentWrapper>
    </PageWrapper>
  );
}

function mapStateToProps(state) {
  return {
    isLoggedIn: getAuthIsLoggedIn(state),
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(Account);

export default Component;
