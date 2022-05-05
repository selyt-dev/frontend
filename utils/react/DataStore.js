import API from "../API";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

import * as Notifications from "expo-notifications";

module.exports = class DataStore {
  static async getAndStoreUserData(authorization) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await API.getSelf(authorization);
        const userData = await user.json();

        await AsyncStorage.setItem("user", JSON.stringify(userData.user));
        await SecureStore.setItemAsync("authorization", authorization);
        await SecureStore.setItemAsync("isAuthenticated", "true");

        const token = (await Notifications.getExpoPushTokenAsync()).data;

        await API.sendDeviceToken(authorization, token);

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

  static async clearUserData() {
    return new Promise(async (resolve, reject) => {
      try {
        await SecureStore.deleteItemAsync("authorization");
        await SecureStore.deleteItemAsync("isAuthenticated");
        await AsyncStorage.removeItem("user");

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async setItemAsync(key, value) {
    return new Promise(async (resolve, reject) => {
      try {
        await AsyncStorage.setItem(key, value);
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  }

  static async getItemAsync(key, toObject = false) {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await AsyncStorage.getItem(key);
        resolve(toObject ? JSON.parse(item) : item);
      } catch (error) {
        reject(error);
      }
    });
  }
};
