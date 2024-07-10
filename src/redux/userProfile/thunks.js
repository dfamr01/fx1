import { userProfileDB } from "../../apis/user/userProfile.db";
import { dispatch } from "../../utilities/store/store";
import { updateUserProfile } from "./reducers";

export async function updateUserProfileThunk(uid, data) {
  const res = await userProfileDB.update({ uid, data });
  dispatch(updateUserProfile(data));
  return res;
}
