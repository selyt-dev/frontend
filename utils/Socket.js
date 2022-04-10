import { io } from "socket.io-client";

module.exports = class Socket {
  constructor(url, token) {
    this.socket = io(url);
    this.token = token;
    this.connect();
  }

  connect() {
    this.socket.on("connect", () => {
      this.socket.emit("authenticate", { token: this.token });
    });
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }
};
