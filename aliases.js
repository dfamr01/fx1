import path from "path";

const aliases = {
  "@components": path.resolve(__dirname, "src/components"),
  "@routes": path.resolve(__dirname, "src/routes"),
  "@utilities": path.resolve(__dirname, "src/utilities"),
  "@hooks": path.resolve(__dirname, "src/hooks"),
  "@apis": path.resolve(__dirname, "src/apis"),
  "@redux": path.resolve(__dirname, "src/redux"),
  "@styles": path.resolve(__dirname, "src/styles"),
};

export default aliases;
