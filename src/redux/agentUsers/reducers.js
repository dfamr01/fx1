import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { errorHandler } from "../../components/Toast/index";
import { agentUsersDB } from "../../apis/user/agentUsers.db";

const getAgentUsersCountFromDBThunk = async ({ agentUid, agentSuid }) => {
  try {
    if (!agentUid || !agentSuid) {
      return [];
    }
    const res = await agentUsersDB.getAgentUserCountSubscribe({
      agentUid,
      agentSuid,
    });
    return res;
  } catch (error) {
    errorHandler(error);
    return [];
  }
};

const updateAgentUserDBThunk = async ({ uid, data }) => {
  // try {
  //   if (!uid || !data) {
  //     errorHandler("מזהה לקוח חסר");
  //     return { error: "missing uid" };
  //   }
  //   const res = await agentUsersDB.update({ uid, data });
  //   return { data };
  // } catch (error) {
  //   errorHandler(error);
  //   return { error };
  // }
};

const apis = createApi({
  reducerPath: "agentUsers",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["AgentUsers"],
  endpoints: (builder) => ({
    getAgentUsersCountFromDBThunk: builder.query({
      async queryFn({ agentUid, agentSuid }) {
        const [unsubscribe, eventEmitter] = await getAgentUsersCountFromDBThunk(
          {
            agentUid,
            agentSuid,
          }
        );

        return {
          data: {
            isFetching: true,
            data: null,
            unsubscribe,
            eventEmitter,
          },
        };
      },
      async onQueryStarted(
        { agentUid, agentSuid },
        { dispatch, queryFulfilled }
      ) {
        try {
          const callback = async (dataRes) => {
            dispatch(
              apis.util.updateQueryData(
                "getAgentUsersCountFromDBThunk",
                {
                  agentUid,
                  agentSuid,
                },
                (draft) => {
                  Object.assign(draft, {
                    isFetching: false,
                    data: dataRes,
                  });
                  return draft;
                }
              )
            );
          };
          const { data } = await queryFulfilled;
          const { eventEmitter, unsubscribe } = data;
          eventEmitter?.on("data", callback);
        } catch (err) {
          errorHandler(err);
        }
      },
      providesTags: ["AgentUsers"],
    }),
    updateAgentUserDBThunk: builder.mutation({
      queryFn: updateAgentUserDBThunk,
      async onQueryStarted(
        { uid, suid, data, skipOptimistic },
        { dispatch, queryFulfilled }
      ) {
        // optimistic update

        if (skipOptimistic) {
          const { data } = await queryFulfilled;

          const patchResult = dispatch(
            apis.util.updateQueryData(
              "getAgentUsersCountFromDBThunk",
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
            "getAgentUsersCountFromDBThunk",
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
      // invalidatesTags: ['AgentUsers'], // no need to invalidate no need to refetch
    }),
  }),
});

export const {
  useGetAgentUsersCountFromDBThunkQuery,
  useUpdateAgentUserDBThunkMutation,
} = apis;
export const { middleware: agentUsersMiddleware } = apis;
export default apis.reducer;
