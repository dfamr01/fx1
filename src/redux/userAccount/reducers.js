import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { userAccountDB } from "../../apis/user/userAccount.db";
import { errorHandler } from "../../components/Toast/index";
import { sleep } from "../../utilities/utils";

const getUserAccountFromDBThunk = async ({ uid, suid }) => {
  try {
    if (!uid && !suid) {
      return { data: {} };
    }
    // return { doNotDisturbs: [] };
    const data = (await userAccountDB.get({ uid, suid })) || {};
    return { data };
  } catch (error) {
    errorHandler(error);
    return { error };
  }
};

// const getUserAccountFromDBThunk = ({ uid, suid }) => {
//     try {
//         if (!uid) {
//             return {};
//         }
//         return { doNotDisturbs: [] };
//         // const data = await userAccountDB.get({ uid, suid })
//         // return { data };
//     } catch (error) {
//         errorHandler(error);
//         return { error };
//     }
// }

const updateUserAccountDBThunk = async ({ uid, data }) => {
  try {
    if (!uid || !data) {
      errorHandler("מזהה לקוח חסר");

      return { error: "missing uid" };
    }

    const res = await userAccountDB.update({ uid, data });

    return { data };
  } catch (error) {
    errorHandler(error);
    return { error };
  }
};

const apis = createApi({
  reducerPath: "userAccount",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["UserAccount"],
  endpoints: (builder) => ({
    getUserAccountFromDBThunk: builder.query({
      async queryFn({ uid, suid }) {
        const res = await getUserAccountFromDBThunk({ uid, suid });
        return res;
      },
      providesTags: ["UserAccount"],
    }),
    updateUserAccountDBThunk: builder.mutation({
      queryFn: updateUserAccountDBThunk,
      async onQueryStarted(
        { uid, suid, data, skipOptimistic },
        { dispatch, queryFulfilled }
      ) {
        // optimistic update

        if (skipOptimistic) {
          const { data } = await queryFulfilled;

          const patchResult = dispatch(
            apis.util.updateQueryData(
              "getUserAccountFromDBThunk",
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
            "getUserAccountFromDBThunk",
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
      // invalidatesTags: ['UserAccount'], // no need to invalidate no need to refetch
    }),
  }),
});

export const {
  useGetUserAccountFromDBThunkQuery,
  useUpdateUserAccountDBThunkMutation,
} = apis;
export const { middleware: userAccountMiddleware } = apis;
export default apis.reducer;
