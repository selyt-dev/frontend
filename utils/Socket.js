import { io } from "socket.io-client";

module.exports = class Socket {
  constructor(url, token, room = "" /* optional */) {
    this.socket = io(url);
    this.token = token;
    this.room = room;
    this.connect();
  }

  connect() {
    this.socket.on("connect", () => {
      this.emit("authenticate", { token: this.token, room: this.room });
    });

    return this.socket;
  }

  on(event, callback) {
    this.socket.on(event, callback);
  }

  emit(event, data) {
    this.socket.emit(event, data);
    return this.socket;
  }

  join(room) {
    this.socket.join(room);
    return this.socket;
  }
};
