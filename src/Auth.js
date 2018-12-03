var cookies = require("browser-cookies");

const loggedIn = () => {
  return cookies.get("credentials") === null;
};

export default {
  loggedIn
};
