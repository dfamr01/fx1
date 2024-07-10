import { useSignal } from "@preact/signals-react";
import { signal, computed, effect, batch } from "@preact/signals-core";

import WithSideBar from "../../../layouts/WithSideBar/index.jsx";
import { styled } from "@mui/material/styles";
import { connect } from "react-redux";
import { getUserProfile } from "../../../redux/userProfile/selectors.js";
import { Button, CircularProgress, Typography } from "@mui/material";
import {
  AddButtonWrap,
  ContentWrapper,
  PageWrapper,
  Title,
} from "../shared.js";
import { DO_NOT_DISTURB } from "../../../utilities/constants.js";
import { theme } from "../../../styles/theme.js";
import NewDoNotDisturb from "./components/NewDoNotDisturb/index.jsx";
import DoNotDisturbAlert from "./components/DoNotDisturbAlert/index.jsx";
import {
  useGetUserAccountFromDBThunkQuery,
  useUpdateUserAccountDBThunkMutation,
} from "../../../redux/userAccount/reducers.js";
import { cloneDeep, omit } from "lodash";
import { CircularProgressWrap } from "../../../styles/common.js";
import { successHandler } from "../../../components/Toast/index.jsx";
import { ACCOUNT_MENU } from "../common.jsx";

const AddButton = styled(Button)`
  /* color: inherit; */
`;

function DoNotDisturb({ isMobile, userProfile }) {
  const newDoNotDisturb = useSignal({});
  const addDoNotDisturbFlag = useSignal(false);
  const editAccounts = useSignal({});

  const { uid } = userProfile;
  const { data, error, isLoading, isFetching } =
    useGetUserAccountFromDBThunkQuery({ uid });

  const [
    updateUserAccountDBThunk, // This is the mutation trigger
    { isLoading: isUpdating }, // This is the destructured mutation result
  ] = useUpdateUserAccountDBThunkMutation();
  const { doNotDisturbs = [] } = data || {};

  function addDoNotDisturb(value) {
    newDoNotDisturb.value = value;
    addDoNotDisturbFlag.value = true;
  }
  function cancelAddDoNotDisturb() {
    addDoNotDisturbFlag.value = false;
  }

  function onToggleAvailability(index) {
    const newDoNotDisturbs = cloneDeep(doNotDisturbs);
    newDoNotDisturbs[index].isActive = !doNotDisturbs[index].isActive;

    updateUserAccountDBThunk({ uid, data: { doNotDisturbs: newDoNotDisturbs } })
      .unwrap()
      .then(() => {})
      .finally(() => {});
  }

  async function onSubmitNewDoNotDisturb(newDoNotDisturb) {
    const newDoNotDisturbs = [...doNotDisturbs];
    newDoNotDisturbs.unshift(newDoNotDisturb);

    cancelAddDoNotDisturb();

    updateUserAccountDBThunk({
      uid,
      data: { doNotDisturbs: newDoNotDisturbs },
    })
      .unwrap()
      .then((res) => {
        successHandler("הוסף בהצלחה");
      })
      .catch((err) => {
        // addDoNotDisturb(newDoNotDisturb);
      });
  }

  function onEditAlert(editDoNotDisturb, index) {
    editAccounts.value = { ...editAccounts.value, [index]: editDoNotDisturb };
  }

  function onEditDoNotDisturbSubmit(editedDoNotDisturb, index) {
    const newDoNotDisturbs = [...doNotDisturbs];

    newDoNotDisturbs[index] = editedDoNotDisturb;
    editAccounts.value = omit(editAccounts.value, index);

    updateUserAccountDBThunk({
      uid,
      data: { doNotDisturbs: newDoNotDisturbs },
    })
      .unwrap()
      .then(() => {
        successHandler("נשמר בהצלחה");
      })
      .catch((err) => {
        // onEditAlert(editedDoNotDisturb, index);
      });
  }

  function onEditDoNotDisturbCancel(index) {
    editAccounts.value = omit(editAccounts.value, index);
  }

  async function onDelete(deleteEl, index) {
    const newDoNotDisturbs = [...doNotDisturbs];

    newDoNotDisturbs.splice(index, 1);
    return updateUserAccountDBThunk({
      uid,
      data: { doNotDisturbs: newDoNotDisturbs },
    }).unwrap();
  }

  return (
    <PageWrapper>
      <Title
        variant="h6"
        noWrap
      >
        הגדרות זמינות
      </Title>

      <ContentWrapper style={{ maxWidth: "540px" }}>
        {!uid ? (
          <CircularProgressWrap>
            <CircularProgress />
          </CircularProgressWrap>
        ) : (
          <>
            <AddButtonWrap>
              <AddButton
                variant="contained"
                onClick={() => addDoNotDisturb(DO_NOT_DISTURB.value)}
              >
                <Typography>{"הוספת לא להפריע"}</Typography>
              </AddButton>
            </AddButtonWrap>

            {addDoNotDisturbFlag.value && (
              <NewDoNotDisturb
                doNotDisturbInit={newDoNotDisturb.value}
                disabled={isUpdating}
                onSubmit={onSubmitNewDoNotDisturb}
                onCancel={cancelAddDoNotDisturb}
              />
            )}

            {isLoading || !data ? (
              <CircularProgressWrap>
                <CircularProgress />
              </CircularProgressWrap>
            ) : (
              doNotDisturbs?.map((el, index) => {
                const edit = editAccounts.value[index];

                if (edit) {
                  return (
                    <NewDoNotDisturb
                      key={el.uuid}
                      edit={true}
                      disabled={isUpdating}
                      doNotDisturbInit={edit}
                      onSubmit={(newEl) =>
                        onEditDoNotDisturbSubmit(newEl, index)
                      }
                      onCancel={() => onEditDoNotDisturbCancel(index)}
                    />
                  );
                }

                return (
                  <DoNotDisturbAlert
                    key={el.uuid}
                    disableToggle={isUpdating}
                    input={el}
                    onToggleAvailability={() => onToggleAvailability(index)}
                    onEdit={() => onEditAlert(el, index)}
                    onDelete={() => onDelete(el, index)}
                  />
                );
              })
            )}
          </>
        )}
      </ContentWrapper>
    </PageWrapper>
  );
}

function mapStateToProps(state) {
  return {
    userProfile: getUserProfile(state),
  };
}

const Component = connect(mapStateToProps)(DoNotDisturb);

export default Component;
