"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function PublicGamesPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function fetchPublicGames() {
      const res = await fetch('/api/public-games');
      const data = await res.json();
      setGames(data);
    }
    fetchPublicGames();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Public Games</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((game: any) => (
          <Card key={game.id}>
            <CardHeader>
              <CardTitle>{game.court.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src={game.user.image ?? ''} />
                  <AvatarFallback>{game.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{game.user.name}</p>
                  <p className="text-sm text-muted-foreground">Skill: {game.user.skillLevel}</p>
                </div>
              </div>
              <p>
                {format(new Date(game.startTime), 'EEE, MMM d, yyyy')}
              </p>
              <p>
                {format(new Date(game.startTime), 'h:mm a')} - {format(new Date(game.endTime), 'h:mm a')}
              </p>
              <Button className="mt-4 w-full">Request to Join</Button>
            </CardContent>
          </Card>
        ))}
        {games.length === 0 && (
            <p>No public games available at the moment. Check back later!</p>
        )}
      </div>
    </div>
  );
}
