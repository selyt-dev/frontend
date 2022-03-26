import Constants from "expo-constants";
const { manifest } = Constants;

const BASE_URL =
  typeof manifest.packagerOpts === `object` && manifest.packagerOpts.dev
    ? `http://${manifest.debuggerHost.split(`:`).shift().concat(`:8081`)}`
    : `https://selyt-api.herokuapp.com`;

module.exports = class API {
  static BASE_URL = BASE_URL;

  static login(body) {
    return API.post("/user/login", body);
  }

  static register(body) {
    return API.post("/user/register", body);
  }

  static getSelf(authorization) {
    return API.get("/user/@me", { authorization });
  }

  static getAd(adId, authorization) {
    return API.get(`/ad/${adId}/data`, { authorization });
  }

  static getAds(authorization) {
    return API.get("/ad", { authorization });
  }

  static getMultipleAds(adIds, authorization) {
    return API.get(`/ad/multiple?ads=${adIds.join(",")}`, { authorization });
  }

  static getChats(authorization) {
    return API.get("/inbox/chats", { authorization });
  }

  static getTransactions(authorization) {
    return API.get("/user/@me/transactions", {
      authorization,
    });
  }

  static getCategories(authorization) {
    return API.get("/category?limit=100", { authorization });
  }

  static updateSelf(authorization, body) {
    return API.put("/user/@me", authorization, body);
  }

  static changePassword(authorization, body) {
    return API.put("/user/@me/password", authorization, body);
  }

  static addVisit(adId, authorization) {
    return API.put(`/ad/${adId}/view`, authorization);
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

  static sendDeviceToken(authorization, token) {
    return API.post("/user/@me/device", { deviceToken: token }, authorization);
  }

  static createAd(authorization, body) {
    return API.post("/ad/create", body, authorization);
  }

  static searchAds(authorization, query) {
    return API.get(`/ad/search?query=${query}`, {
      authorization,
    });
  }

  static editAd(authorization, adId, body) {
    return API.put(`/ad/${adId}/edit`, authorization, body);
  }

  static get(route, headers = {}) {
    return fetch(`${BASE_URL}${route}`, {
      headers,
    });
  }

  static post(route, body, authorization = null) {
    return fetch(`${BASE_URL}${route}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authorization,
      },
      body: JSON.stringify(body),
    });
  }

  static put(route, authorization, body = {}) {
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
