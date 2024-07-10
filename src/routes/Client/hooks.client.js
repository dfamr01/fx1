import { useEffect, useRef } from "react";
import { agentUsersDB } from "../../apis/user/agentUsers.db";
import { useSignal, useComputed } from "@preact/signals-react";
import { userProfileDB } from "../../apis/user/userProfile.db";
import { getMinMaxDnD } from "../../utilities/date";

const savedUserAgent = {};

export function useClient({ uid }) {
  const agent = useSignal(savedUserAgent[uid] || {});

  const isFetchingAgent = useSignal(false);
  const agentNotFound = useSignal(false);

  useEffect(() => {
    if (!isFetchingAgent.value && uid && !savedUserAgent[uid]) {
      isFetchingAgent.value = true;
      agentUsersDB
        .getUserAgent({
          uid,
        })
        .then((res) => {
          const { agentSuid } = res || {};
          if (!agentSuid) {
            agentNotFound.value = true;
            return;
          }
          userProfileDB.get({ suid: agentSuid }).then((agentRes) => {
            const { data } = agentRes;
            if (!data) {
              agentNotFound.value = true;
              return;
            }
            savedUserAgent[uid] = data;
            agent.value = data;
          });
        })
        .finally(() => {
          isFetchingAgent.value = false;
        });
    }
  }, [uid]);

  return { agent, agentNotFound };
}

export function useClientDnD({ doNotDisturbs }) {
  const calcTimeoutRef = useRef(null);

  const isDoNotDisturb = useSignal({
    isDnDOn: false,
  });
  function calcDnDFunc(doNotDisturbs) {
    if (doNotDisturbs?.length) {
      const res = getMinMaxDnD(doNotDisturbs);

      clearTimeout(calcTimeoutRef.current);
      let timeOut;
      isDoNotDisturb.value = res;
      if (res.isDnDOn) {
        timeOut = setTimeout(() => {
          calcDnDFunc(doNotDisturbs);
        }, res.maxDiffToLastOn * 1000 + 1000);
      } else {
        // start timer for the next dnd
        if (res.minDiffToStart !== null) {
          timeOut = setTimeout(() => {
            calcDnDFunc(doNotDisturbs);
          }, res.minDiffToStart * 1000 + 1000);
        }
      }
      calcTimeoutRef.current = timeOut;
    }
  }

  useEffect(() => {
    calcDnDFunc(doNotDisturbs);
    return () => clearTimeout(calcTimeoutRef.current);
  }, [doNotDisturbs]);

  return { isDoNotDisturb, calcDnDFunc };
}
