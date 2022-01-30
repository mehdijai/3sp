async function logTxt(message) {
  const fsp = require("fs").promises;
  const path = require("path");
  const { app } = require("electron");
  const filePath = path.join(app.getPath("userData"), "/3sp.log");

  const data = `[${Date()}]: ${message}\n`;
  await fsp.writeFile(filePath, data, {
    encoding: "utf8",
    flag: "a",
  });
}

export default logTxt;
