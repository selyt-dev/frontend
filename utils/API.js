const BASE_URL = `https://${
  __DEV__ === "production" ? "prod" : "dev"
}.selyt.fun`;

module.exports = class API {
  static BASE_URL = `https://${
    __DEV__ === "production" ? "prod" : "dev"
  }.selyt.fun`;

  static login(body) {
    return API.post("/user/login", body);
  }

  static register(body) {
    return API.post("/user/register", body);
  }

  static getSelf(authorization) {
    return API.get("/user/@me", { authorization });
  }

  static updateAvatar(authorization, avatar) {
    const data = new FormData()
    data.append("avatar", avatar)

    console.log(data)

    return fetch(`${BASE_URL}/user/@me/avatar`, {
      method: "POST",
      headers: {
        Authorization: authorization,
      },
      body: data,
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
};
