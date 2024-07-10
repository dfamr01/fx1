import { useEffect, useState } from "react";
import CustomDialog from "../../../../components/CustomDialog/index.jsx";
import ImageInput from "../../../../components/ImageInput/index.jsx";
import { css, styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { BANKS } from "../../../../utilities/constants.js";
import { useCheckMobileScreen } from "../../../../utilities/hooks.js";
import {
  hasError,
  OpenWhatsapp,
  prefixTimeStampAndUUID,
} from "../../../../utilities/utils.js";
import storageFB from "../../../../utilities/firebase/storage.js";
import { errorHandler } from "../../../../components/Toast/index.jsx";
import React from "react";
import LoadingButton from "../../../../components/LoadingButton/index.jsx";

const AvatarNameWrap = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Name = styled(Typography)`
  font-size: 17px;
  /* color: gray; */
  margin-bottom: 5px;
`;

const AmountTitle = styled(Typography)`
  font-weight: bold;
  font-size: 17px;
`;

const TextGrid = styled(Grid)`
  display: flex;
  justify-content: center;
`;

const DepositButton = styled(LoadingButton)`
  display: flex;
  margin-top: 20px;
  width: 80%;
  margin-left: auto;
  margin-right: auto;
`;

const ImageInputWrap = styled("div")`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-direction: column;
  align-items: center;
`;

const ImgTitle = styled(Typography)`
  font-weight: bold;
`;

const CircularProgressWrap = styled(CircularProgress)`
  height: 23px !important;
  width: 23px !important;
`;

// example styled with prop
const ImageInputEl = styled(ImageInput)`
  /* width: 80%; */
  /* aspect-ratio: 16 / 9; */
  /* padding-top: 50%; */
  border-radius: 5px;
  width: 40%;
  height: auto;

  ${({ has_img }) =>
    !has_img &&
    css`
      aspect-ratio: 1;
    `}
  ${({ is_mobile }) =>
    is_mobile &&
    css`
      width: 80%;
    `}
`;

async function uploadImageFileToDB(img, secureFolder) {
  if (!img) {
    return;
  }

  const uploadRes = await storageFB.uploadImageFile({
    name: img.name,
    file: img,
    secureFolder,
  });
  return uploadRes;
}

function BankDepositModal({
  createTransaction,
  agent,
  bankAccount,
  amount,
  text,
  open,
  setOpen,
}) {
  const [errors, setErrors] = useState();
  const [transferImg, setTransferImg] = useState();
  const [idImg, setIdImg] = useState();
  const [loading, setLoading] = useState(false);

  const isMobile = useCheckMobileScreen();

  async function onClickDeposit() {
    try {
      setLoading(true);
      try {
        await createTransaction();
      } catch (err) {
        setLoading(true);
        throw new Error(err);
      }

      const [
        { downloadURL: uploadTransferDownloadURL },
        { downloadURL: uploadIdResDownloadURL },
      ] = await Promise.all([
        uploadImageFileToDB(transferImg, true),
        uploadImageFileToDB(idImg, true),
      ]);
      setLoading(false);
      let depositMessage = "";
      // const depositMessage = ':פרטי הפקדה \n';
      depositMessage += `הופקד ל${agent.firstName} ${agent.lastName} \n`;
      depositMessage += `סכום: ${amount}\n`;
      depositMessage += `בנק: ${BANKS[bankAccount.bankKey].value}\n`;
      depositMessage += `סניף: ${bankAccount.branchId}\n`;
      depositMessage += `חשבון: ${bankAccount.accountNumber}\n`;
      depositMessage += "\n";
      depositMessage += `צילום העברה: ${uploadTransferDownloadURL}\n`;
      depositMessage += "\n";
      depositMessage += `צילום ת.ז: ${uploadIdResDownloadURL}\n`;

      // const messageWithImg = `${depositMessage}\n${downloadURL}`
      const messageEncoded = encodeURIComponent(depositMessage);
      OpenWhatsapp(agent.phoneNumber, messageEncoded);
      // whatsappInstance.initialize();

      setOpen(false);
    } catch (e) {
      setLoading(false);
      errorHandler(e);
    }
  }

  function onChangeTransferImage(img) {
    setTransferImg(img);
  }

  function onChangeIdImage(img) {
    setIdImg(img);
  }

  return (
    <CustomDialog
      open={open}
      setOpen={setOpen}
      caption={"הפקדה באמצעות העברה בנקאית"}
    >
      <AvatarNameWrap>
        <Avatar src={agent?.avatar?.photoURL} />
        <Name>{`${agent.firstName} ${agent.lastName}`}</Name>
      </AvatarNameWrap>

      <Box sx={{ flexGrow: 1, justifyContent: "flex-end" }}>
        <AmountTitle
          variant="subtitle2"
          gutterBottom
          dir={"auto"}
        >
          {`סכום: ${amount}`}
        </AmountTitle>

        <Grid
          sx={{ justifyContent: "flex-end" }}
          container
          spacing={2}
        >
          <TextGrid
            item
            xs={6}
          >
            <TextField
              label="מספר בנק"
              defaultValue={bankAccount?.branchId}
              InputProps={{
                readOnly: true,
              }}
            />
          </TextGrid>
          <TextGrid
            item
            xs={6}
          >
            <TextField
              label="בנק"
              defaultValue={BANKS[bankAccount?.bankKey].value}
              InputProps={{
                readOnly: true,
              }}
            />
          </TextGrid>

          {/* <Grid sx={{ justifyContent: "flex-end" }} container spacing={2}> */}
          <TextGrid
            item
            xs={6}
          >
            <TextField
              label="מספר חשבון"
              defaultValue={bankAccount.accountNumber}
              InputProps={{
                readOnly: true,
              }}
            />
          </TextGrid>
          <TextGrid
            item
            xs={6}
          >
            <TextField
              label="סניף"
              defaultValue={bankAccount.branchId}
              InputProps={{
                readOnly: true,
              }}
            />
          </TextGrid>
        </Grid>

        <ImageInputWrap>
          <ImgTitle variant="h5">צילום העברה</ImgTitle>
          <ImageInputEl
            has_img={transferImg}
            is_mobile={+isMobile}
            round={false}
            text={"העלה צילום העברה"}
            onChange={onChangeTransferImage}
          />
        </ImageInputWrap>

        <ImageInputWrap>
          <ImgTitle variant="h5">צילום ת.ז</ImgTitle>
          <ImageInputEl
            has_img={idImg}
            is_mobile={+isMobile}
            round={false}
            text={"העלה צילום ת.ז"}
            onChange={onChangeIdImage}
          />
        </ImageInputWrap>

        <DepositButton
          onClick={onClickDeposit}
          isLoading={loading}
          variant="contained"
          disabled={!transferImg || !idImg || hasError(errors)}
          caption={"הפקד"}
        />
      </Box>
    </CustomDialog>
  );
}

const Component = React.memo(BankDepositModal);
export default Component;
