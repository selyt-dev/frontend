import API from '../API'

import AsyncStorage from '@react-native-async-storage/async-storage'

module.exports = class DataStore {
  static async getAndStoreUserData(authorization) {
    const user = await API.getSelf(authorization);
    const userData = user.json();

    if (userData.user) {
      await AsyncStorage.setItem('user', JSON.stringify(userData.user));
    }
  }
}