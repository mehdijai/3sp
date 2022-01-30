async function setAppEncKey(db) {
  const existingAppKey = await db.findOne({ name: "app_key" });
  if (!existingAppKey) {
    const sKey = {
      name: "app_key",
      value: generateKey(),
    };
    const appKey = await db.create(sKey);
    await db.save(appKey);
  }
}
async function getAppEncKey(db) {
  const appKey = await db.findOne({ name: "app_key" });
  if (!appKey) {
    await setAppEncKey();
    return await getAppEncKey();
  }

  return appKey;
}
function generateKey() {
  let chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789&+%/*$._-#@";

  let str = "";
  for (let i = 0; i < 50; i++) {
    str += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return str;
}

export { setAppEncKey, getAppEncKey };
