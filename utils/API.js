const BASE_URL = __DEV__
  ? "http://192.168.1.66:8081"
  : "https://selyt-api.herokuapp.com";

module.exports = class API {
  static BASE_URL = __DEV__
    ? "http://192.168.1.66:8081"
    : "https://selyt-api.herokuapp.com";

  static login(body) {
    return API.post("/user/login", body);
  }

  static register(body) {
    return API.post("/user/register", body);
  }

  static getSelf(authorization) {
    return API.get("/user/@me", { authorization });
  }

  static updateSelf(authorization, body) {
    return API.put("/user/@me", authorization, body);
  }

  static updateAvatar(authorization, avatar) {
    return fetch(`${BASE_URL}/user/@me/avatar`, {
      method: "POST",
      headers: {
        Authorization: authorization,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ avatar }),
    });
  }

  static get(route, headers = {}) {
    return fetch(`${BASE_URL}${route}`, {
      headers,
    });
  }

  static post(route, body) {
    return fetch(`${BASE_URL}${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  }

  static put(route, authorization, body) {
    return fetch(`${BASE_URL}${route}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });
  }
};
