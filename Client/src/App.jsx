import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { Button, TextField } from "@mui/material";

function App() {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [messageInput, setMessageInput] = useState("");
  const [messageGet, setMessageGet] = useState([]);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketId, setSocketId] = useState("");

  console.log(messageGet);

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });

    socket.on("welcome", (s) => {
      console.log(s, "welcome");
    });

    socket.on("receive-message", (m) => {
      console.log(m, "message useEffect");
      setMessageGet((messageGet) => [...messageGet, m]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const send = { messageInput, room };

    socket.emit("message", send);
    setMessageInput("");
  };

  const handleJoin = (e) => {
    e.preventDefault();

    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <>
      <h1>{socketId}</h1>
      <form onSubmit={handleJoin}>
        <TextField
          onChange={(e) => {
            setRoomName(e.target.value);
          }}
          value={roomName}
          id="standard-basic"
          label="Room Name"
          variant="standard"
        />

        <Button type="submit" variant="contained">
          Join
        </Button>
      </form>
      <form onSubmit={handleSubmit}>
        <TextField
          onChange={(e) => {
            setMessageInput(e.target.value);
          }}
          value={messageInput}
          name="message"
          id="standard-basic"
          label="Message"
          variant="standard"
        />
        <br />
        <TextField
          onChange={(e) => {
            setRoom(e.target.value);
          }}
          value={room}
          name="setRoom"
          id="standard-basic"
          label="Room"
          variant="standard"
        />

        <Button type="submit" variant="contained">
          Send
        </Button>
      </form>
      <br />

      {messageGet?.map((m, i) => (
        <>
          <h3 key={i}>{m}</h3>
        </>
      ))}
    </>
  );
}

export default App;
