import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Box,
  Typography,
  Container,
  Stack,
  Avatar,
} from "@mui/material";
import { useSocket } from "../context/SocketContext.jsx";
import api from "../api/api.js";

export default function MessagesPage() {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/messages/global");
        setChat(res.data.data);
      } catch (err) {
        console.error("Could not load global history", err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handler = (msg) => setChat((prev) => [...prev, msg]);
    socket.on("message", handler);
    return () => void socket.off("message", handler);
  }, [socket]);

  const sendMessage = () => {
    if (!message.trim() || !socket || socket.disconnected) return;
    socket.emit("message", message);
    setMessage("");
  };

  return (
    <Container>
      <Typography variant="h4" mt={4}>
        Global Chat
      </Typography>
      <Box mt={2}>
        {chat.map((msg, i) => (
          <Box
            key={i}
            display="flex"
            alignItems="flex-start"
            gap={1}
            mb={2}
            sx={{
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              p: 1.5,
              maxWidth: "80%",
            }}
          >
            <Avatar src={msg.user?.avatar} sx={{ width: 32, height: 32 }} />
            <Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="subtitle2" fontWeight={600}>
                  {msg.user?.username || msg.sender.username}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {msg.user?.createdAt
                    ? new Date(msg.user.createdAt).toLocaleTimeString()
                    : new Date(msg.createdAt).toLocaleTimeString()}
                </Typography>
              </Box>
              <Typography variant="body2" mt={0.5}>
                {msg.text}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Stack direction="row" spacing={2} mt={2}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
        />
        <Button variant="contained" onClick={sendMessage}>
          Send
        </Button>
      </Stack>
    </Container>
  );
}
