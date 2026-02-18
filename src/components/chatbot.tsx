"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
}

export function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content:
                "Halo! 👋 Saya asisten virtual Rumah Padel. Ada yang bisa saya bantu? Tanyakan tentang jadwal, harga, booking, atau apapun tentang klub kami! 🎾",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: input.trim(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const history = messages
                .filter((m) => m.id !== "welcome")
                .map((m) => ({
                    role: m.role === "user" ? "user" : "model",
                    content: m.content,
                }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage.content,
                    history,
                }),
            });

            const data = await res.json();

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.reply || data.error || "Maaf, terjadi kesalahan.",
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Maaf, terjadi kesalahan koneksi. Silakan coba lagi. 😔",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Floating Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="fixed bottom-6 right-6 z-50"
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            size="lg"
                            className="h-16 w-16 rounded-full shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all hover:scale-110 relative"
                        >
                            <MessageCircle className="h-7 w-7" />
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed bottom-6 right-6 z-50 w-[400px] h-[600px] flex flex-col rounded-2xl shadow-2xl border bg-white overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                        <Sparkles className="h-5 w-5" />
                                    </div>
                                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 rounded-full border-2 border-indigo-700" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">Rumah Padel AI</h3>
                                    <p className="text-xs text-blue-100">
                                        Powered by Rudel ✨
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-white hover:bg-white/20 rounded-full h-8 w-8"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Messages */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
                        >
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex gap-2 ${message.role === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}
                                >
                                    <Avatar className="h-8 w-8 shrink-0 shadow-sm">
                                        <AvatarFallback
                                            className={
                                                message.role === "user"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : "bg-indigo-100 text-indigo-700"
                                            }
                                        >
                                            {message.role === "user" ? (
                                                <User className="h-4 w-4" />
                                            ) : (
                                                <Bot className="h-4 w-4" />
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div
                                        className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${message.role === "user"
                                            ? "bg-blue-600 text-white rounded-br-md"
                                            : "bg-white text-gray-800 border rounded-bl-md"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2"
                                >
                                    <Avatar className="h-8 w-8 shrink-0">
                                        <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-white border rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-1.5">
                                            <span
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "0ms" }}
                                            />
                                            <span
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "150ms" }}
                                            />
                                            <span
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: "300ms" }}
                                            />
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t bg-white shrink-0">
                            <div className="flex items-center gap-2">
                                <Input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ketik pesan..."
                                    className="flex-1 rounded-full border-gray-200 focus-visible:ring-blue-500 bg-gray-50"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={sendMessage}
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 shrink-0 transition-all disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="text-[10px] text-gray-400 text-center mt-2">
                                Powered by Rudel
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
