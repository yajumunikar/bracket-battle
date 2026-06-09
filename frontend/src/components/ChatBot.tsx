import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { sendChatMessage } from "../api/chat";
import type { ChatMessage } from "../api/chat";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm your BracketBattle Arena Assistant. Ask me about open tournaments, how the platform works, or which game to compete in! 🎮",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(
        updatedMessages.filter(
          (m) => m.role === "user" || m.role === "assistant"
        )
      );
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: 90,
            right: 24,
            width: 360,
            height: 480,
            background: "#13131c",
            border: "1px solid #1f1f2e",
            borderTop: "2px solid #00ffe0",
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            zIndex: 1300,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom: "1px solid #1f1f2e",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <SmartToyIcon sx={{ color: "#00ffe0", fontSize: 20 }} />
              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    fontSize: 15,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  ARENA ASSISTANT
                </Typography>
                <Typography sx={{ fontSize: 11, color: "#00ffe0" }}>
                  Powered by AI
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{ color: "#555570", p: 0.5 }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              px: 2,
              py: 1.5,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    px: 1.5,
                    py: 1,
                    borderRadius:
                      msg.role === "user"
                        ? "12px 12px 2px 12px"
                        : "12px 12px 12px 2px",
                    background: msg.role === "user" ? "#00ffe0" : "#1f1f2e",
                    color: msg.role === "user" ? "#0d0d10" : "#e8e8f0",
                    fontSize: 13,
                    lineHeight: 1.5,
                  }}
                >
                  {msg.content}
                </Box>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Box
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: "12px 12px 12px 2px",
                    background: "#1f1f2e",
                  }}
                >
                  <CircularProgress size={14} sx={{ color: "#00ffe0" }} />
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderTop: "1px solid #1f1f2e",
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "#0d0d10",
                  fontSize: 13,
                  "& fieldset": { borderColor: "#1f1f2e" },
                  "&:hover fieldset": { borderColor: "#555570" },
                  "&.Mui-focused fieldset": { borderColor: "#00ffe0" },
                },
                "& .MuiOutlinedInput-input": { color: "#e8e8f0" },
              }}
            />
            <IconButton
              onClick={handleSend}
              disabled={loading || !input.trim()}
              sx={{
                background: "#00ffe0",
                color: "#0d0d10",
                width: 36,
                height: 36,
                "&:hover": { background: "#00ccb4" },
                "&.Mui-disabled": { background: "#1f1f2e", color: "#555570" },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      )}

      {/* Floating Bubble */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: open ? "#1f1f2e" : "#00ffe0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1300,
          transition: "background 0.2s",
          "&:hover": { background: open ? "#2a2a3e" : "#00ccb4" },
        }}
      >
        <SmartToyIcon
          sx={{ color: open ? "#555570" : "#0d0d10", fontSize: 26 }}
        />
      </Box>
    </>
  );
}
