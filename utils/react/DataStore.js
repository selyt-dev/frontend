import API from "../API";

import AsyncStorage from "@react-native-async-storage/async-storage";

module.exports = class DataStore {
  static async getAndStoreUserData(authorization) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await API.getSelf(authorization);
        const userData = await user.json();

        await AsyncStorage.setItem("user", JSON.stringify(userData.user));

        resolve(userData.user);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async setUserData(userData) {
    await AsyncStorage.setItem("user", JSON.stringify(userData));
  }

  static async getUserData() {
    return new Promise(async (resolve, reject) => {
      AsyncStorage.getItem("user")
        .then((user) => {
          resolve(JSON.parse(user));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
};
