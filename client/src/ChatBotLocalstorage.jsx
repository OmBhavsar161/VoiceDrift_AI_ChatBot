import { useState, useEffect, useRef, useCallback } from "react";
import { Moon, Sun, Download, Trash, Menu, X } from "lucide-react";
import Loader from "../../MVP/client/src/Loader";
import jsPDF from "jspdf";

const MY_RASA_API = import.meta.env.VITE_RASA_API;

export default function ChatBotNewLocalstorage() {
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const messagesEndRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setDarkMode(mediaQuery.matches);
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem("chatbotUserId");
    if (!storedId) {
      const newId = crypto.randomUUID();
      localStorage.setItem("chatbotUserId", newId);
      setUserId(newId);
    } else {
      setUserId(storedId);
    }
  }, []);

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("chatMessages"));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }
  }, [messages]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 3500);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const processBotMessages = useCallback((data) => {
    const botMessages = data
      .map((msg) => ({ sender: "bot", text: msg.text }))
      .map((msg) => msg.text)
      .join("<br />")
      .split("<br />");

    botMessages.forEach((msg, index) => {
      setTimeout(() => {
        setMessages((prev) => [...prev, { sender: "bot", text: msg }]);
      }, index * 500);
    });
  }, []);

  const handleMessage = async (userInput = null) => {
    const messageText = userInput || "hi";

    if (userInput) {
      setMessages((prev) => [...prev, { sender: "user", text: userInput }]);
      setInput("");
    }

    const response = await fetch(MY_RASA_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: userId || "user", message: messageText })
    });

    const data = await response.json();
    if (data.length > 0) processBotMessages(data);
  };

  useEffect(() => {
    if (!loading && userId) {
      handleMessage();
    }
  }, [loading, userId]);

  const downloadChatAsPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("VoiceDrift AI ChatBot Conversation", 10, y);
    y += 10;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    messages.forEach((msg, i) => {
      let text = `${
        msg.sender === "user" ? "You" : "ChatBot"
      }: ${msg.text.replace(/<[^>]+>/g, "")}`;
      const splitText = doc.splitTextToSize(text, 180);

      if (msg.sender === "user") {
        doc.setTextColor(0, 0, 255);
        doc.text(splitText, 10, y);
        y += splitText.length * 7;
        y += 3; // Add extra 5 units of space after user messages
      } else {
        doc.setTextColor(0, 0, 0);
        doc.text(splitText, 10, y);
        y += splitText.length * 7;
      }

     
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
    });

    const logoUrl = "Pdf Logo.png";
    doc.addImage(logoUrl, "PNG", 85, y, 40, 40);
    y += 45;

    const timestamp = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${timestamp}`, 10, y);

    doc.save("VoiceDrift AI ChatBot Conversation.pdf");
  };

  const clearChat = () => {
    setShowConfirmation(true);
  };

  const confirmClearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
    setShowConfirmation(false);
    window.location.reload();
  };

  const cancelClearChat = () => {
    setShowConfirmation(false);
  };

  if (loading) return <Loader />;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-base md:text-xl font-bold">VoiceDrift AI ChatBot</h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
          <button
              onClick={downloadChatAsPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all group"
            >
              <Download
                size={18}
                className="transition-transform duration-300 transform group-hover:translate-y-1"
              />
              Download PDF
            </button>
            <button
              onClick={clearChat}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex items-center gap-2 group"
            >
              <Trash
                size={20}
                className="transition-transform duration-300 transform group-hover:rotate-12"
              />
              Clear Chat
            </button>

          

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:opacity-70 transition-opacity duration-300"
            >
              {darkMode ? (
                <Sun
                  size={22}
                  className="transition-transform duration-300 transform"
                />
              ) : (
                <Moon
                  size={22}
                  className="transition-transform duration-300 transform"
                />
              )}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-4">
            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:opacity-70 transition-opacity duration-300"
            >
              {darkMode ? (
                <Sun
                  size={22}
                  className="transition-transform duration-300 transform"
                />
              ) : (
                <Moon
                  size={22}
                  className="transition-transform duration-300 transform"
                />
              )}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:opacity-70 transition-opacity duration-300"
            >
              {mobileMenuOpen ? (
                <X size={22} />
              ) : (
                <Menu size={22} />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden absolute right-4 top-16 z-40 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-lg p-4 w-54"
          >
            <button
              onClick={() => {
                downloadChatAsPDF();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all group mb-2"
            >
              <Download
                size={18}
                className="transition-transform duration-300 transform group-hover:translate-y-1"
              />
              Download PDF
            </button>
            
            <button
              onClick={() => {
                clearChat();
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all flex items-center gap-2 group"
            >
              <Trash
                size={18}
                className="transition-transform duration-300 transform group-hover:rotate-12"
              />
              Clear Chat
            </button>
          </div>
        )}

        {/* Confirmation Page Modal with blurred background */}
        {showConfirmation && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backdropFilter: "blur(10px)"
            }}
          >
            <div className="bg-white dark:bg-gray-900  p-6 rounded-lg w-80 text-center ring-1">
              <h2 className="text-xl font-semibold mb-4">
                VoiceDrift AI ChatBot
              </h2>
              <p className="mb-4">Are you sure you want to clear the chat?</p>
              <div className="flex justify-around">
                <button
                  onClick={confirmClearChat}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Yes, Clear
                </button>
                <button
                  onClick={cancelClearChat}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

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
                    marginLeft: msg.sender === "user" ? "auto" : "0"
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