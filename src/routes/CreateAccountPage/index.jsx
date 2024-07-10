import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Paper, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { PageWrapper } from "../../styles/common.js";
import SignUp from "../../components/SignUp/index.jsx";
import logo from "../../assets/static/general/logo.png";
import { styled } from "@mui/material/styles";
import WithSideBar from "../../layouts/WithSideBar/index.jsx";
import { theme } from "../../styles/theme.js";

const PaperWrapper = styled(Paper)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  padding: 15px;
`;

const Logo = styled("img")``;

const ButtonAgent = styled(Button)`
  background-color: #bb4ce22e;
  margin-bottom: 10px;
`;

const ButtonClient = styled(Button)`
  background-color: #e24c4c2e;
`;

const ButtonCaption = styled(Typography)`
  color: ${theme.color.black};
  font-size: 1rem;
`;

function CreateAccountPage({ isLoggedIn }) {
  let [searchParams, setSearchParams] = useSearchParams();

  const [openSignUp, setOpenSignUp] = useState(false);
  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    if (searchParams.get("agentId")) {
      setOpenSignUp(true);
    }
  }, [searchParams]);

  function onClick(isAgent) {
    setIsAgent(isAgent);
    setOpenSignUp(true);
  }

  return (
    <WithSideBar>
      <SignUp
        setOpen={setOpenSignUp}
        show={openSignUp}
        isAgent={isAgent}
      />
      <PageWrapper>
        <PaperWrapper>
          <Logo src={logo} />
          <ButtonAgent onClick={() => onClick(true)}>
            <ButtonCaption variant="button">יצירת חשבון סוכן</ButtonCaption>
          </ButtonAgent>
          <ButtonClient onClick={() => onClick(false)}>
            <ButtonCaption variant="button">יצירת חשבון לקוח</ButtonCaption>
          </ButtonClient>
        </PaperWrapper>
      </PageWrapper>
    </WithSideBar>
  );
}

CreateAccountPage.prototype = {};
export default CreateAccountPage;
