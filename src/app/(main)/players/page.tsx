"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { User } from '@prisma/client';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SKILL_LEVELS } from '@/constants/enums';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function PlayersPage() {
  const { data: session } = useSession();
  const [players, setPlayers] = useState<User[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<User[]>([]);
  const [skillFilter, setSkillFilter] = useState<string>('ALL');
  const [games, setGames] = useState([]);

  useEffect(() => {
    async function getPlayers() {
      const res = await fetch('/api/players');
      const data = await res.json();
      setPlayers(data);
      setFilteredPlayers(data);
    }
    async function fetchPublicGames() {
      const res = await fetch('/api/public-games');
      const data = await res.json();
      setGames(data);
    }
    getPlayers();
    fetchPublicGames();
  }, []);

  useEffect(() => {
    if (skillFilter === 'ALL') {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(players.filter(p => p.skillLevel === skillFilter));
    }
  }, [skillFilter, players]);

  async function handleAddFriend(receiverId: string) {
    const res = await fetch('/api/friends/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ receiverId }),
    });

    if (res.ok) {
      toast.success('Friend request sent!');
    } else {
      const { message } = await res.json();
      toast.error(message || 'Failed to send friend request.');
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      className="container mx-auto p-4 bg-gradient-to-b from-gray-50 to-white"
      initial="hidden"
      animate="visible"
      variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold tracking-tight mb-8">Community</h1>

      <Tabs defaultValue="players" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="public-games">Public Games</TabsTrigger>
        </TabsList>
        <TabsContent value="players">
          <div className="flex justify-end items-center my-4">
            <div className="w-1/4">
              <Select onValueChange={(value: string) => setSkillFilter(value)} defaultValue="ALL">
                <SelectTrigger className="shadow-sm">
                  <SelectValue placeholder="Filter by skill" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Skill Levels</SelectItem>
                  {SKILL_LEVELS.map(level => (
                    <SelectItem key={level} value={level}>{level.charAt(0) + level.slice(1).toLowerCase()}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPlayers.map((player) => (
              <motion.div
                key={player.id}
                className="border rounded-lg p-4 flex flex-col items-center shadow-md hover:shadow-xl transition-shadow duration-300 bg-white"
                variants={itemVariants}
              >
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={player.image ?? ''} />
                  <AvatarFallback className="text-2xl">{player.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mt-2">{player.name}</h2>
                <p className="text-sm text-gray-500">{player.email}</p>
                <p className="text-sm text-gray-500 capitalize font-bold text-primary">{player.skillLevel.toLowerCase()}</p>
                {session?.user?.id !== player.id && (
                  <Button onClick={() => handleAddFriend(player.id)} className="mt-6 w-full">
                    Add Friend
                  </Button>
                )}
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
        <TabsContent value="public-games">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
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
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
