import { useEffect, useState } from "react";
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import { css, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { BANKS_DEPOSIT } from "../../../../utilities/constants.js";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import he from "dayjs/locale/he";
import { heIL } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import { hasError, OpenWhatsapp } from "../../../../utilities/utils.js";
import localStorage from "../../../../utilities/localStorage.js";
import {
  SHOW_DEPOSIT_BIRTHDAY,
  SHOW_ID_DEPOSIT,
  validateCashDeposit,
} from "../../helpers.js";

const Title = styled(Typography)`
  font-size: 17px;
  color: gray;
  margin-bottom: 5px;
`;

const BanksWrap = styled("div")`
  display: flex;
  margin-bottom: 15px;
  justify-content: space-evenly;
  flex-direction: row-reverse;
`;

const BanksTitle = styled(Typography)`
  font-weight: bold;
`;

const BankButton = styled(Button)`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: inherit;
  ${({ is_active }) =>
    is_active &&
    css`
      outline: 4px auto -webkit-focus-ring-color;
      //color: black;
      font-weight: bold;
    `}
`;

const CodeInputWrap = styled("div")`
  display: flex;
  justify-content: flex-end;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const DateInputWrap = styled("div")`
  display: flex;
  justify-content: flex-end;
`;

const DepositButton = styled(Button)`
  margin-left: auto;
  display: flex;
  margin-top: 20px;
`;

const IdInputWrap = styled("div")`
  display: flex;
  justify-content: flex-end;

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Works for Firefox */

  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const minDate = dayjs().subtract(90, "years");
const maxDate = dayjs().subtract(15, "years");

const DEPOSIT_DEFAULT_PARAMS = {
  code: "",
  id: "",
  birthday: null,
};

async function getInitialDepositParams() {
  const res = await localStorage.getItem("depositParams");
  return res || DEPOSIT_DEFAULT_PARAMS;
}

function CashDepositModal({
  createTransaction,
  phoneNumber,
  amount,
  text,
  open,
  setOpen,
}) {
  const [bankSelected, setBankSelected] = useState({});
  const [depositParams, setDepositParams] = useState(DEPOSIT_DEFAULT_PARAMS);
  const [errors, setErrors] = useState(
    validateCashDeposit({ depositParams, bankSelected })
  );
  const showId = SHOW_ID_DEPOSIT.includes(bankSelected.key);
  const showBirthday = SHOW_DEPOSIT_BIRTHDAY.includes(bankSelected.key);

  useEffect(() => {
    async function setInitialDepositParams() {
      const res = await getInitialDepositParams();
      setDepositParams({
        ...res,
        birthday: new dayjs(res.birthday, "DD/MM/YYYY"),
      });
    }

    setInitialDepositParams();
  }, []);

  function onClickBank(bank) {
    setBankSelected(bank);
  }

  async function onClickDeposit() {
    createTransaction();
    localStorage.setItem("depositParams", {
      ...depositParams,
      code: "",
      birthday: depositParams.birthday.format("DD/MM/YYYY"),
    });

    const bankMsg = `בנק: ${bankSelected.value}\n`;
    const idMsg = showId ? `תעודת זהות: ${depositParams.id}\n` : "";
    const birthdayMsg = showBirthday
      ? `תאריך לידה: ${depositParams.birthday.format("DD/MM/YYYY")}\n`
      : "";
    const codeMsg = `קוד: ${depositParams.code}\n`;
    const message = `${text}${amount}. \n עם הפרטים הבאים:\n${bankMsg}${idMsg}${birthdayMsg}${codeMsg}`;
    const messageEncoded = encodeURIComponent(message);
    OpenWhatsapp(phoneNumber, messageEncoded);
    // whatsappInstance.initialize();
    setOpen(false);
  }

  function onChange({ target: { name, value } }) {
    setDepositParams((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  }

  const disableDeposit = hasError(
    validateCashDeposit({ depositParams, bankSelected, errors })
  );

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      caption={"הפקדה באמצעות קוד בנקאי"}
    >
      <Title dir={"auto"}>
        הזן לכאן את הפרטים הרצויים למשיכה באמצעות קוד ללא כרטיס
      </Title>

      <Box sx={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <BanksTitle
          variant="subtitle2"
          gutterBottom
          dir={"auto"}
        >
          בחר בנק
        </BanksTitle>

        <Grid
          item
          xs={12}
        >
          <BanksWrap>
            {Object.values(BANKS_DEPOSIT).map((el) => {
              return (
                <BankButton
                  is_active={bankSelected.key == el.key ? "true" : undefined}
                  key={el.key}
                  onClick={() => onClickBank(el)}
                >
                  <Avatar src={el.iconImage} />
                  {el.value}
                </BankButton>
              );
            })}
          </BanksWrap>
        </Grid>
        {bankSelected?.key && (
          <Grid
            sx={{ justifyContent: "flex-end" }}
            container
            spacing={2}
          >
            <Grid
              item
              xs={12}
            >
              <CodeInputWrap>
                <TextField
                  value={depositParams.code}
                  name={"code"}
                  dir={"auto"}
                  type="number"
                  required
                  id="outlined-required"
                  label="קוד"
                  onChange={onChange}
                />
              </CodeInputWrap>
            </Grid>
            {showBirthday && (
              <Grid
                item
                xs={6}
              >
                <DateInputWrap>
                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale={he}
                    localeText={
                      heIL.components.MuiLocalizationProvider.defaultProps
                        .localeText
                    }
                  >
                    <DatePicker
                      onError={(error) =>
                        setErrors((prev) => {
                          return {
                            ...prev,
                            birthdayError: error,
                          };
                        })
                      }
                      onChange={(value) =>
                        onChange({
                          target: { name: "birthday", value },
                        })
                      }
                      value={depositParams.birthday}
                      openTo="year"
                      minDate={minDate}
                      maxDate={maxDate}
                      format="DD/MM/YYYY"
                      label={"תאריך לידה"}
                      views={["year", "month", "day"]}
                    />
                  </LocalizationProvider>
                </DateInputWrap>
              </Grid>
            )}
            {showId && (
              <Grid
                item
                xs={6}
                md={6}
              >
                <IdInputWrap>
                  <TextField
                    dir={"auto"}
                    type="number"
                    required
                    name="id"
                    label="תעודת זהות"
                    value={depositParams.id}
                    onChange={onChange}
                  />
                </IdInputWrap>
              </Grid>
            )}
          </Grid>
        )}
        <DepositButton
          onClick={onClickDeposit}
          variant="contained"
          disabled={disableDeposit}
        >
          הפקד
        </DepositButton>
      </Box>
    </CustomDialog>
  );
}

export default CashDepositModal;
