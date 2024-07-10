import AppBar from "../AppBar/index";

function Top({ isLoggedIn }) {
  return (
    <>
      <AppBar isLoggedIn={isLoggedIn} />
    </>
  );
}

export default Top;
