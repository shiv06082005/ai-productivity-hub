"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaCopy,
  FaTrash,
  FaImage,
  FaTimes,
} from "react-icons/fa";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function AIChat() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    setImageName(file.name);

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImage(null);
    setImageName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function askAI() {
    const currentQuestion = question.trim();

    if ((!currentQuestion && !image) || loading) return;

    let userContent = currentQuestion;

    if (image && !currentQuestion) {
      userContent = "Please analyze this uploaded image.";
    }

    const userMessage: Message = {
      role: "user",
      content: userContent,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
          image,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const aiMessage: Message = {
          role: "assistant",
          content: data.answer,
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.error ||
              "Something went wrong. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chat Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Server error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      removeImage();
    }
  }

  function clearChat() {
    setMessages([]);
    setQuestion("");
    removeImage();
  }

  async function copyMessage(content: string) {
    try {
      await navigator.clipboard.writeText(content);
    } catch (error) {
      console.error("Copy error:", error);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">

        {/* Heading */}

        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            🤖 AI Chat Assistant
          </h1>

          <p className="text-gray-400">
            Ask anything and continue your conversation naturally.
          </p>
        </div>

        {/* Chat Container */}

        <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}

          <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">

            <div className="flex items-center gap-3">

              <div className="bg-blue-600 p-2 rounded-lg">
                <FaRobot />
              </div>

              <div>
                <h2 className="font-semibold">
                  AI Assistant
                </h2>

                <p className="text-xs text-green-400">
                  ● Online
                </p>
              </div>

            </div>

            <button
              onClick={clearChat}
              disabled={messages.length === 0}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-40 px-4 py-2 rounded-lg transition"
            >
              <FaTrash />
              Clear
            </button>

          </div>

          {/* Messages */}

          <div className="h-[500px] overflow-y-auto p-6 space-y-6">

            {messages.length === 0 && (

              <div className="h-full flex flex-col items-center justify-center text-center">

                <div className="bg-blue-600/20 p-5 rounded-full mb-5">
                  <FaRobot className="text-5xl text-blue-400" />
                </div>

                <h3 className="text-2xl font-bold mb-2">
                  How can I help you?
                </h3>

                <p className="text-gray-400 max-w-md">
                  Ask questions about coding, studies, career,
                  technology, travel, business ideas and more.
                </p>

              </div>
            )}

            {messages.map((message, index) => (

              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                {message.role === "assistant" && (

                  <div className="shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <FaRobot />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-slate-800 border border-slate-700"
                  }`}
                >

                  {message.role === "user" ? (

                    <p className="whitespace-pre-wrap">
                      {message.content}
                    </p>

                  ) : (

                    <>

                      <div className="prose prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>

                      <button
                        onClick={() =>
                          copyMessage(message.content)
                        }
                        className="mt-4 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition"
                      >
                        <FaCopy />
                        Copy response
                      </button>

                    </>
                  )}

                </div>

                {message.role === "user" && (

                  <div className="shrink-0 w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                    <FaUser />
                  </div>
                )}

              </div>
            ))}

            {/* Loading */}

            {loading && (

              <div className="flex gap-3 items-center">

                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <FaRobot />
                </div>

                <div className="bg-slate-800 border border-slate-700 rounded-2xl px-5 py-4">

                  <div className="flex gap-2">

                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />

                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />

                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />

                  </div>

                </div>

              </div>
            )}

            <div ref={bottomRef} />

          </div>

          {/* Image Preview */}

          {image && (

            <div className="px-4 pt-4 bg-slate-800">

              <div className="relative inline-block">

                <img
                  src={image}
                  alt="Uploaded preview"
                  className="max-h-32 rounded-xl border border-slate-600"
                />

                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 w-7 h-7 rounded-full flex items-center justify-center"
                >
                  <FaTimes />
                </button>

              </div>

              <p className="text-xs text-gray-400 mt-2">
                {imageName}
              </p>

            </div>
          )}

          {/* Input Area */}

          <div className="border-t border-slate-700 bg-slate-800 p-4">

            <div className="flex items-end gap-3">

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 w-14 h-14 rounded-xl flex items-center justify-center transition"
                title="Upload Image"
              >
                <FaImage />
              </button>

              <textarea
                rows={2}
                value={question}
                placeholder="Message AI Assistant..."
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    askAI();
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />

              <button
                onClick={askAI}
                disabled={
                  loading ||
                  (!question.trim() && !image)
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed w-14 h-14 rounded-xl flex items-center justify-center transition"
              >
                <FaPaperPlane />
              </button>

            </div>

            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Shift + Enter for a new line
            </p>

          </div>

        </div>

      </div>
    </main>
  );
}