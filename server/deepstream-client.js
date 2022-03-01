const { DeepstreamClient } = require("@deepstream/client");
// const client = deepstream("localhost:1111")
const client = new DeepstreamClient("127.0.0.1:8080", {
  // Reconnect after 10, 20 and 30 seconds
  reconnectIntervalIncrement: 10000,
  // Try reconnecting every thirty seconds
  maxReconnectInterval: 30000,
  // We never want to stop trying to reconnect
  maxReconnectAttempts: Infinity,
  // Send heartbeats only once a minute
  heartbeatInterval: 60000,
});
client.login(
  {
    username: "adward",
    type: "admin",
  },
  (success, data) => {
    console.log(success, data)
    if (success) {
      client.event.emit("message", "test")
      client.event.subscribe("send_message", ({ payload, user }) => {
        console.log("React Send: ", payload.message)
        client.event.emit(`message_${user.user_id}`, {
          payload: { message: "pong" }
        })
      })
      client.event.listen(
        "message_*",
        (match, response) => {
          // client.event.emit(match, { message: "pong" })
          response.accept()
          // if (/* if you want to provide */) {
          //   // start publishing data via `client.event.emit(eventName, /* data */)`
          //   response.accept()
        
          //   response.onStop(() => {
          //     // stop publishing data
          //   })
          // } else {
          //   response.reject() // let deepstream ask another provider
          // }
        }
      );
    }
  }
);
client.on("connectionStateChanged", (connectionState) => {
  // will be called with 'CLOSED' once the connection is successfully closed.
  console.log("connectionState", connectionState);
  switch (connectionState) {
    case "OPEN":
      break;
    case "CLOSED":
      break;
    case "ERROR":
      break;
    default:
      break;
  }
});
