"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function MessagesPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    async function fetchConversations() {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data);
    }
    if (session) {
      fetchConversations();
    }
  }, [session]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="border rounded-lg">
        {conversations.map((convo: any) => {
          const otherUser = convo.users.find((user: any) => user.id !== session?.user.id);
          return (
            <Link key={convo.id} href={`/messages/${convo.id}`}>
              <div className="p-4 border-b hover:bg-muted/50 cursor-pointer">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={otherUser?.image ?? ''} />
                    <AvatarFallback>{otherUser?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{otherUser?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {convo.messages[0]?.body}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
