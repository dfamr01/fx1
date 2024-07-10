import { userDB } from "../../apis/user/user.db";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "user",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    //***************SINGLE ITEM FETCHING*************** */
    getUserFromDBThunk: builder.query({
      async queryFn(uid) {
        try {
          if (uid) {
            return {};
          }
          const data = await userDB.get({ uid });

          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ["User"],
    }),
  }),
});

export const { useGetUserFromDBThunkQuery } = userApi;
