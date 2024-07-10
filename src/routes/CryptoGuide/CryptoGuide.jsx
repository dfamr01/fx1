import WithSideBar from "../../layouts/WithSideBar/index.jsx";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

const Wrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentWrapper = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Title = styled(Typography)`
  font-size: 32px;
  font-weight: bold;
  letter-spacing: -0.5px;
  line-height: 40px;
  word-break: break-word;
  margin-bottom: 0;
  text-align: right;
`;

const Date = styled("div")`
  text-align: right;
  color: gray;
  margin-bottom: 10px;
`;

const Iframe = styled("iframe")`
  border-radius: 20px;
  max-width: 100%;
  //aspect-ratio: 9/16;
  border: none;
`;

const InstructionsWrap = styled("div")`
  margin-top: 10px;
`;

const InstructionsTitle = styled(Typography)`
  font-size: 20px;
  font-weight: bold;
`;

const InstructionsSubTitle = styled(Typography)`
  //color: #4d5b7c;
  font-size: 17px;
`;

const InstructionsBody = styled("div")`
  //color: #4d5b7c;
`;

const Ol = styled("ol")`
  margin-top: 0;
`;

const AppName = styled("span")`
  color: #ef3737;
`;

function CryptoGuide() {
  return (
    <Wrapper>
      <ContentWrapper>
        <Title
          variant="h5"
          gutterBottom
        >
          מדריך הפקדה דרך קריפטו
        </Title>
        <Date>24/04/23</Date>

        <InstructionsWrap dir={"auto"}>
          <InstructionsTitle>
            ברוך הבא! הנה מדריך שיעזור לך לקנות USDT באתר Binance ולהעבירו
            לאפלקציית <AppName>7XL</AppName>
          </InstructionsTitle>
          <InstructionsSubTitle>
            על מנת לרכוש USDT, יש לבצע את השלבים הבאים:
          </InstructionsSubTitle>

          <Iframe
            width="560"
            height="315"
            src="https://www.youtube-nocookie.com/embed/q1juOy60ma8"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
          <InstructionsBody>
            <Ol>
              <li>
                היכנס לאתר{" "}
                <Link
                  target="_blank"
                  rel="noreferrer"
                  to={"https://www.binance.com"}
                >
                  Binance (https://www.binance.com)
                </Link>{" "}
                והירשם לחשבון אם עדיין לא נרשמת.
              </li>
              <li>{`לחץ על "קנייה" בתפריט העליון של האתר.`}</li>
              <li>
                בחר את הזוג המסחרי של USDT שאתה מעוניין לקנות. לדוגמה, אם אתה
                רוצה לקנות USDT בצד של הדולר האמריקני (USD), תבחר בזוג המסחרי
                USDT/USD.
              </li>
              <li>
                בחר את השיטה שבה אתה רוצה לשלם. בינתיים, במקרה של USDT, כמעט
                תמיד השיטה היחידה היא לקנות באמצעות פייפאל, כרטיס אשראי או מטבע
                קריפטוגרפי אחר שנמצא בחשבון ה-Binance שלך.
              </li>
              <li>{`הזן את כמות ה-USDT שאתה רוצה לקנות ולחץ על "קנייה".`} </li>
              <li>אמת את הפעולה שלך ואז ה-USDT יופיעו בחשבון שלך.</li>
            </Ol>
          </InstructionsBody>

          <InstructionsSubTitle>
            כדי להפקיד לאפלקציית <AppName>7XL</AppName> את ה-USDT שקנית, יש לבצע
            את השלבים הבאים:
            <br />
            מציאת הכתובת ארנק של האפלקציית <AppName>7XL</AppName>
          </InstructionsSubTitle>

          <Iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Fq1t_KhAaZ0"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></Iframe>
          <Ol>
            <li>
              היכנס לאפליקציית <AppName>7XL</AppName> ולחץ על כפתור הCashier
            </li>
            <li>לחץ על Tether(USDT/TRC20)</li>
            <li>לחץ על GET ONE-TIME DEOPSIT ADDRESS</li>
            <li style={{ fontWeight: "bold" }}>העתק את הכתובת שתופיע שם</li>
            <li>
              .לאחר שתעתיק את הכתובת תצטרך לבחור בתיבה מתחתיו את השרת,תמיד תבחר
              בTRC20
            </li>
          </Ol>

          <InstructionsSubTitle>
            הפקדה לכתובת של הארנק האפלקציה <AppName>7XL</AppName>:
          </InstructionsSubTitle>
          <Ol>
            <li>
              {`כנס לחשבון ה-Binance שלך ולחץ על "ארנק" בתפריט העליון של האתר.`}
            </li>
            <li>{`בחר את ה-USDT שרכשת והקלק על משוך.`}</li>
            <li>
              הזן את כתובת הארנק של אפלקציית <AppName>7XL</AppName>{" "}
              <b>שהעתקת</b> בשלב הקודם המיועדת לקבלת ה-USDT.
            </li>
            <li>
              {`הזן את כמות ה-USDT שברצונך להעביר אל הכתובת ולחץ על משוך.`}{" "}
            </li>
            <li>אמת את הפעולה וה-USDT יועברו לכתובת הארנק שציינת.</li>
          </Ol>
        </InstructionsWrap>
      </ContentWrapper>
    </Wrapper>
  );
}

export default CryptoGuide;
