import { useState, useEffect, useRef, useCallback } from "react";
import { Moon, Sun } from "lucide-react";
import Loader from "./Loader";

const MY_FLASK_API = import.meta.env.VITE_FLASK_API;

export default function ChatBot() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);

    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [messages]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3500);
  }, []);

  const processBotMessages = useCallback(async (data) => {
    const botResponses = data.response.split("<br />");

    for (const text of botResponses) {
      setMessages((prev) => [...prev, { sender: "bot", text }]);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }, []);

  const handleMessage = async (userInput = null) => {
    const messageText = userInput || "first greet";

    if (userInput) {
      setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
      setInput("");
    }

    try {
      const response = await fetch(`${MY_FLASK_API}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await response.json();
      processBotMessages(data);
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
    }
  };

  useEffect(() => {
    if (!loading) {
      handleMessage();
    }
  }, [loading]);
  

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors relative">
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
          <h1 className="text-xl font-bold">VoiceDrift AI ChatBot</h1>
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </nav>

        <div className="relative z-10 flex flex-col items-center justify-end sm:h-[80vh] md:h-[90vh] p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col gap-3">
            <div className="h-[500px] overflow-y-auto p-3 border-b border-gray-300 dark:border-gray-700">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 my-1 text-sm sm:text-base ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white self-end max-w-[40%] break-words whitespace-pre-wrap rounded-2xl px-4 my-4 mr-[-3px] sm:mr-0"
                      : "bg-gray-200 dark:bg-gray-700 self-start text-left w-full rounded-md ml-[-10px] sm:ml-0 pr-[30px]"
                  }`}
                  style={{
                    width: msg.sender === "user" ? "fit-content" : "100%",
                    maxWidth: msg.sender === "user" ? "70%" : "100%",
                    marginLeft: msg.sender === "user" ? "auto" : "-10",
                  }}
                >
                  {msg.text}
                </div>
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
