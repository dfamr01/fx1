import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { transactionDB } from "../../apis/transactions/transaction.db";
import { errorHandler } from "../../components/Toast/index";
import { sleep } from "../../utilities/utils";
import { userProfileDB } from "../../apis/user/userProfile.db";

const getTransactionsFromDBThunk = ({
  uid,
  agentUid,
  agentSuid,
  fromDate,
  toDate,
  status,
  type,
}) => {
  try {
    if (!agentUid && !uid) {
      return [];
    }
    const res = transactionDB.getAllAgentTransactions({
      uid,
      agentUid,
      agentSuid,
      fromDate,
      toDate,
      status,
      type,
    });
    return res;
  } catch (error) {
    errorHandler(error);
    return [];
  }
};

const usersProfile = new Map();

async function getMissingUsersProfile(users) {
  const promises = [];
  users.forEach((value, key) => {
    promises.push(userProfileDB.get({ uid: key }));
  });
  const usersRes = await Promise.all(promises);
  return usersRes;
}

async function updateTransactionsUsers(transactions = []) {
  const transactionsWithUsersProfile = [];

  const usersToGet = new Map();
  if (!transactions?.length) {
    return [];
  }

  transactions.forEach((el) => {
    if (!usersProfile.has(el.uid)) {
      usersToGet.set(el.uid, el.uid);
    }
  });

  const missingUsers = await getMissingUsersProfile(usersToGet);
  missingUsers.forEach((el) => {
    usersProfile.set(el.uid, el);
  });

  transactions.forEach((el) => {
    const userProfile = usersProfile.get(el.uid) || {
      uid: el.uid,
    };
    transactionsWithUsersProfile.push({ ...el, userProfile: userProfile });
  });

  return transactionsWithUsersProfile;
}

const updateTransactionDBThunk = async ({ uid, data }) => {
  try {
    if (!uid || !data) {
      errorHandler("מזהה לקוח חסר");

      return { error: "missing uid" };
    }

    const res = await transactionsDB.update({ uid, data });

    return { data };
  } catch (error) {
    errorHandler(error);
    return { error };
  }
};

const apis = createApi({
  reducerPath: "transactions",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Transactions"],
  endpoints: (builder) => ({
    getTransactionsFromDBThunk: builder.query({
      queryFn({ uid, agentUid, agentSuid, fromDate, toDate, status, type }) {
        const [unsubscribe, eventEmitter] = getTransactionsFromDBThunk({
          uid,
          agentUid,
          agentSuid,
          fromDate,
          toDate,
          status,
          type,
        });

        return {
          data: {
            isFetching: true,
            data: [],
            unsubscribe,
            eventEmitter,
          },
        };
      },
      async onQueryStarted(
        { uid, agentUid, agentSuid, fromDate, toDate, status, type },
        { dispatch, queryFulfilled }
      ) {
        try {
          const updateRedux = (updateData) => {
            dispatch(
              apis.util.updateQueryData(
                "getTransactionsFromDBThunk",
                {
                  uid,
                  agentUid,
                  agentSuid,
                  fromDate,
                  toDate,
                  status,
                },
                (draft) => {
                  Object.assign(draft, updateData);
                  return draft;
                }
              )
            );
          };
          const callback = async (transactionsRes) => {
            const updatedTransactions = await updateTransactionsUsers(
              transactionsRes
            );
            updateRedux({
              isFetching: false,
              data: updatedTransactions,
            });
          };
          const { data } = await queryFulfilled;
          const { eventEmitter, unsubscribe } = data;
          if (!eventEmitter || !unsubscribe) {
            updateRedux({
              isFetching: false,
              eventEmitter,
              unsubscribe,
            });
          } else {
            eventEmitter?.on("data", callback);
          }
        } catch (err) {
          errorHandler(err);
        }
      },
      providesTags: ["Transactions"],
    }),
    updateTransactionDBThunk: builder.mutation({
      queryFn: updateTransactionDBThunk,
      async onQueryStarted(
        { uid, suid, data, skipOptimistic },
        { dispatch, queryFulfilled }
      ) {
        // optimistic update

        if (skipOptimistic) {
          const { data } = await queryFulfilled;

          const patchResult = dispatch(
            apis.util.updateQueryData(
              "getTransactionsFromDBThunk",
              { uid, suid },
              (draft) => {
                Object.assign(draft, data);
                return draft;
              }
            )
          );
          return;
        }

        const patchResult = dispatch(
          apis.util.updateQueryData(
            "getTransactionsFromDBThunk",
            { uid, suid },
            (draft) => {
              Object.assign(draft, data);
              return draft;
            }
          )
        );

        try {
          await queryFulfilled;
        } catch ({ error }) {
          patchResult.undo();
          throw new Error(error);
        }
      },
      // invalidatesTags: ['Transactions'], // no need to invalidate no need to refetch
    }),
  }),
});

export const {
  useGetTransactionsFromDBThunkQuery,
  useUpdateTransactionDBThunkMutation,
} = apis;
export const { middleware: transactionsMiddleware } = apis;
export default apis.reducer;
