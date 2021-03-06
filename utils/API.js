const BASE_URL = "https://api.selyt.pt";

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

  static getMyAds(authorization) {
    return API.get("/ad/@me", { authorization });
  }

  static searchAdsByCategory(categoryId, authorization) {
    return API.get(`/ad/search-by-category?category=${categoryId}`, {
      authorization,
    });
  }

  static getMultipleAds(adIds, authorization) {
    return API.get(`/ad/multiple?ads=${adIds.join(",")}`, { authorization });
  }

  static getChats(authorization) {
    return API.get("/inbox/chats", { authorization });
  }

  static getChat(id, authorization) {
    return API.get(`/inbox/${id}`, { authorization });
  }

  static createChat(adId, authorization) {
    return API.post("/inbox/create", { adId }, authorization);
  }

  static sendMessage(inboxId, message, authorization) {
    return API.post(`/inbox/${inboxId}`, { message }, authorization);
  }

  static uploadImage(inboxId, image, authorization) {
    return API.post(`/inbox/${inboxId}/upload`, { image }, authorization);
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
