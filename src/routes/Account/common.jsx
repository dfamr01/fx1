import { SIDE_MENU_TYPE } from "../../utilities/constants";

export const ACCOUNT_MENU = [
  {
    type: SIDE_MENU_TYPE.LINK,
    button: {
      onClick: () => {},
    },
    link: {
      to: "/account/profile",
    },
    icon: null,
    caption: "הגדרות פרופיל",
    agentOnly: false,
  },
  {
    type: SIDE_MENU_TYPE.LINK,
    button: {
      onClick: () => {},
    },
    link: {
      to: "/account/bankAccount",
    },
    icon: null,
    caption: "הגדרות חשבון בנק",
    agentOnly: true,
  },
  {
    type: SIDE_MENU_TYPE.LINK,
    button: {
      onClick: () => {},
    },
    link: {
      to: "/account/deposit",
    },
    icon: null,
    caption: "הגדרות הפקדה",
    agentOnly: true,
  },
  {
    type: SIDE_MENU_TYPE.LINK,
    button: {
      onClick: () => {},
    },
    link: {
      to: "/account/doNotDisturb",
    },
    icon: null,
    caption: "הגדרות זמינות",
    agentOnly: true,
  },
  {
    type: SIDE_MENU_TYPE.LINK,
    button: {
      onClick: () => {},
    },
    link: {
      to: "/account/notificationSettings",
    },
    icon: null,
    caption: "הגדרת התראות",
  },
];
