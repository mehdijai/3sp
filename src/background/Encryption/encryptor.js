const fileContent_encrypter = (fileContent, privateKey) => {
  const crypto = require("crypto");
  const algo = "aes-128-cbc";

  const hash = crypto.createHash("sha1");
  hash.update(privateKey);
  const secretKey = hash.digest().slice(0, 16);

  let cipher, result;
  const iv = crypto.randomBytes(16);
  cipher = crypto.createCipheriv(algo, secretKey, iv);
  result = Buffer.concat([iv, cipher.update(fileContent), cipher.final()]);
  return result;
};

const fileContent_decrypter = (encryptedFileContent, privateKey) => {
  const crypto = require("crypto");
  const algo = "aes-128-cbc";

  const hash = crypto.createHash("sha1");
  hash.update(privateKey);
  const secretKey = hash.digest().slice(0, 16);

  let decipher, result;

  const iv = encryptedFileContent.slice(0, 16);
  encryptedFileContent = encryptedFileContent.slice(16);

  decipher = crypto.createDecipheriv(algo, secretKey, iv);
  result = Buffer.concat([
    decipher.update(encryptedFileContent),
    decipher.final(),
  ]);

  return result;
};

const fileEncryptor = async (data, destinationFile, privateKey) => {
  const fs = require("fs").promises;

  const encryptedFileContent = fileContent_encrypter(data, privateKey);

  await fs.writeFile(destinationFile, encryptedFileContent);
};

const fileDecryptor = async (filePath, privateKey) => {
  const fs = require("fs").promises;
  const file = await fs.readFile(filePath);
  let decryptedFileContent = fileContent_decrypter(file, privateKey);
  return decryptedFileContent.toString("utf-8");
};

const keyEncryptor = (key, privateKey) => {
  const crypto_js = require("crypto-js");
  const keyWord = crypto_js.enc.Hex.parse(privateKey);
  const secretKey = crypto_js.enc.Hex.stringify(keyWord);

  return crypto_js.AES.encrypt(key, secretKey).toString();
};
const keyDecryptor = (encrypted, privateKey) => {
  const crypto_js = require("crypto-js");
  const keyWord = crypto_js.enc.Hex.parse(privateKey);
  const secretKey = crypto_js.enc.Hex.stringify(keyWord);

  let bytes = crypto_js.AES.decrypt(encrypted, secretKey);
  return bytes.toString(crypto_js.enc.Utf8);
};

module.exports = {
  fileContent_encrypter,
  fileContent_decrypter,
  fileEncryptor,
  fileDecryptor,
  keyEncryptor,
  keyDecryptor,
};
