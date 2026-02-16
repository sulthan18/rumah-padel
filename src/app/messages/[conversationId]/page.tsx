"use client";

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ConversationPage({ params }: { params: { conversationId: string } }) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  async function fetchMessages() {
    const res = await fetch(`/api/conversations/${params.conversationId}`);
    const data = await res.json();
    setMessages(data);
  }

  useEffect(() => {
    if (session) {
      fetchMessages();
    }
  }, [session]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        conversationId: params.conversationId,
        body: newMessage,
      }),
    });

    if (res.ok) {
      setNewMessage('');
      fetchMessages(); // Re-fetch messages to show the new one
    } else {
      toast.error('Failed to send message.');
    }
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex-grow overflow-y-auto p-4 border rounded-lg mb-4">
        {messages.map((msg: any) => (
          <div
            key={msg.id}
            className={`flex items-start gap-4 my-4 ${msg.senderId === session?.user.id ? 'justify-end' : ''}`}
          >
            {msg.senderId !== session?.user.id && (
              <Avatar>
                <AvatarImage src={msg.sender.image ?? ''} />
                <AvatarFallback>{msg.sender.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            )}
            <div
              className={`rounded-lg p-3 max-w-lg ${
                msg.senderId === session?.user.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}
            >
              <p>{msg.body}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
