import { Platform } from "react-native";

module.exports = class Device {
  static getDeviceOs() {
    return Platform.OS;
  }
};
