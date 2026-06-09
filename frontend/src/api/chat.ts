import API from "./auth";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const sendChatMessage = async (
  messages: ChatMessage[]
): Promise<string> => {
  const res = await API.post("/ai/chat", { messages });
  return res.data.data.message;
};
