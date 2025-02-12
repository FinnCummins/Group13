"use client";

import { useState, useEffect, useRef } from "react";

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEnd = useRef(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSend = async () => { 
      if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const botResponse = await simulateLLMResponse(input);
    setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
  };

  // replace with api call
  const simulateLLMResponse = async (userInput) => {
    return "response to: " + userInput
  };

  useEffect(() => {
    if (messagesEnd.current) {
      messagesEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <>
      {!isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "var(--foreground)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 1000,
          }}
          onClick={toggleChat}
        >
          <span style={{ color: "var(--background)", fontSize: "24px" }}>
            💬
          </span>
        </div>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "var(--background)",
            border: "1px solid var(--text)",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "var(--foreground)",
              color: "var(--background)",
              padding: "10px",
              borderTopLeftRadius: "8px",
              borderTopRightRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
              {/*Chat box*/}
            <span>Chat</span>
            <button
              onClick={toggleChat}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--background)",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ✖
            </button>
          </div>
              {/*Chat messages*/}
          <div
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
              backgroundColor: "var(--background)",
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "8px",
                  textAlign: msg.sender === "user" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px",
                    borderRadius: "4px",
                    backgroundColor: "var(--foreground)",
                    color: "var(--background)",
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            <div ref={messagesEnd} />
          </div>

          <div
            style={{
              padding: "10px",
              borderTop: "1px solid var(--text)",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              style={{
                width: "100%",
                padding: "8px",
                boxSizing: "border-box",
                border: "1px solid var(--text)",
                borderRadius: "4px",
                color: "var(--text)",
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
