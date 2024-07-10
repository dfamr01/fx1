import { createAction } from "@reduxjs/toolkit";

import { SIGN_OUT } from "./constants";
export const signOut = createAction(SIGN_OUT);

// export function signOut(id, title) {
//     return {
//         type: SIGN_OUT,
//         payload: { id, title },
//     }
// }
