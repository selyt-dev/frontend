const API = require("./API.js");

module.exports = class LoginUtils {
  static login(email, password) {
    return API.login({ email, password })
      .then((res) => res.json())
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.message);
        } else {
          return res;
        }
      });
  }

  static register(body) {
    return API.register(body)
      .then((res) => res.json())
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.message);
        } else {
          return res;
        }
      });
  }
};
