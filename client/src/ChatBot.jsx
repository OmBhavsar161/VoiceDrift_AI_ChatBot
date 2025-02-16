import { useState, useEffect, useRef, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
const MY_RASA_API =  import.meta.env.VITE_RASA_API

export default function ChatBot() {
  
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  // const PDFLINK = "https://rera.rajasthan.gov.in/Content/uploads/f70aed69-0f30-420b-9b46-9c47f2235e98.PDF";

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);

    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to process bot messages and handle line breaks correctly
  const processBotMessages = useCallback((data) => {
    const botMessages = data
      .map((msg) => {
        if (msg.text.includes("[Click Here for PDF]")) {
          return {
            sender: "bot",
            text: `Here is the link for the PDF: <a href="${PDFLINK}" target="_blank" class="text-blue-500">Click Here for PDF</a>`,
          };
        }
        return { sender: "bot", text: msg.text };
      })
      .map((msg) => msg.text)
      .join("<br />")
      .split("<br />");

    botMessages.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: msg }]);
      }, index * 500);
    });
  }, []);

  // Merged function to handle both initial and user messages
  const handleMessage = async (userInput = null) => {
    const messageText = userInput || "hi"; // "hi" for initial message

    if (userInput) {
      setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
      setInput(""); // Clear input only if it's user-triggered
    }

    const response = await fetch(MY_RASA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: "user", message: messageText }),
    });

    const data = await response.json();
    if (data.length > 0) processBotMessages(data);
  };

  // Call handleMessage on mount to send initial "hi" message
  useEffect(() => {
    handleMessage();
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
          <h1 className="text-xl font-bold">VoiceDrift AI ChatBot</h1>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        <div className="flex flex-col items-center justify-end sm:h-[80vh] md:h-[90vh] p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col gap-3">
            <div className="h-[500px] overflow-y-auto p-3 border-b border-gray-300 dark:border-gray-700">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 text-sm sm:text-base ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white self-end max-w-[40%] break-words whitespace-pre-wrap rounded-2xl px-4 my-4"
                      : "bg-gray-200 dark:bg-gray-700 self-start text-left w-full rounded-md"
                  }`}
                  style={{
                    width: msg.sender === "user" ? "fit-content" : "100%",
                    maxWidth: msg.sender === "user" ? "70%" : "100%",
                    marginLeft: msg.sender === "user" ? "auto" : "0",
                  }}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 rounded-xl border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-sm sm:text-base"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleMessage(input)}
              />
              <button
                onClick={() => handleMessage(input)}
                className="px-4 py-2 bg-blue-500 dark:bg-blue-600 hover:bg-blue-700 text-white rounded-xl sm:text-base text-sm"
                disabled={!input.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
