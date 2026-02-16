"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function FriendsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);

  async function fetchFriends() {
    const res = await fetch('/api/friends');
    const data = await res.json();
    setFriends(data.friends);
    setPendingRequests(data.pendingRequests);
  }

  useEffect(() => {
    if (session) {
      fetchFriends();
    }
  }, [session]);

  async function handleRequest(requesterId: string, status: 'ACCEPTED' | 'DECLINED') {
    const res = await fetch('/api/friends/request', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requesterId, status }),
    });

    if (res.ok) {
      toast.success(`Friend request ${status.toLowerCase()}.`);
      fetchFriends();
    } else {
      toast.error('Failed to update friend request.');
    }
  }

  async function handleStartConversation(userId: string) {
    const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
    });
    const conversation = await res.json();
    router.push(`/messages/${conversation.id}`);
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Friends</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pending Requests</h2>
        {pendingRequests.length > 0 ? (
          <div className="space-y-2">
            {pendingRequests.map((req: any) => (
              <div key={req.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Avatar>
                    <AvatarImage src={req.requester.image ?? ''} />
                    <AvatarFallback>{req.requester.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span>{req.requester.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => handleRequest(req.requesterId, 'ACCEPTED')}>Accept</Button>
                  <Button variant="destructive" onClick={() => handleRequest(req.requesterId, 'DECLINED')}>Decline</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No pending friend requests.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Friends</h2>
        {friends.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {friends.map((friend: any) => {
              const friendUser = friend.requester.id === session?.user.id ? friend.receiver : friend.requester;
              return (
                <div key={friend.id} className="border rounded-lg p-4 flex flex-col items-center">
                  <Avatar>
                    <AvatarImage src={friendUser.image ?? ''} />
                    <AvatarFallback>{friendUser.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-lg font-semibold mt-2">{friendUser.name}</h2>
                  <p className="text-sm text-gray-500">{friendUser.email}</p>
                  <Button className="mt-4" onClick={() => handleStartConversation(friendUser.id)}>Message</Button>
                </div>
              );
            })}
          </div>
        ) : (
          <p>You have no friends yet.</p>
        )}
      </div>
    </div>
  );
}
