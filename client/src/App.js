import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { DeepstreamClient } from "@deepstream/client";

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

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    client.login(
      {
        username: "user_01",
        type: "user",
      },
      (success, data) => {
        // console.log(success, data);
        if(success) {
          setUser(data.user);
          client.event.subscribe(
            `message_${data.user.user_id}`,
            async ({ payload }) => {
              console.log("Server responseListener: ", payload.message);
            }
          );
        }
      }
    );
  }, []);

  const sendMessage = (message) => {
    client.event.emit(`send_message`, {
      payload: {
        message,
      },
      user: { user_id: user.user_id },
    });
  }
  return (
    <div>
      {
        user ? <button onClick={() => sendMessage("ping")}>Ping</button> : <div>Loading...</div>
      }
    </div>
  );
}

export default App;
