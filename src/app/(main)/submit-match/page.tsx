"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { User } from '@prisma/client';
import { Check, ChevronsUpDown, Search, Trophy, Users, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export default function SubmitMatchPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [players, setPlayers] = useState<User[]>([]);
    const [teamA, setTeamA] = useState<string[]>([]);
    const [teamB, setTeamB] = useState<string[]>([]);
    const [teamAScore, setTeamAScore] = useState<number>(0);
    const [teamBScore, setTeamBScore] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        async function fetchPlayers() {
            try {
                const res = await fetch('/api/players');
                if (!res.ok) throw new Error('Failed to fetch players');
                const data = await res.json();
                setPlayers(data);
            } catch (error) {
                toast.error("Failed to load players");
            }
        }
        fetchPlayers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (teamA.length === 0 || teamB.length === 0) {
            toast.error("Please select at least one player for each team.");
            setIsSubmitting(false);
            return;
        }

        const winnerTeam = teamAScore > teamBScore ? 'A' : 'B';

        try {
            const res = await fetch('/api/matches', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamA,
                    teamB,
                    teamAScore,
                    teamBScore,
                    winnerTeam,
                }),
            });

            if (res.ok) {
                toast.success("Match result submitted successfully!", {
                    description: "The leaderboard has been updated."
                });
                router.push('/leaderboard');
            } else {
                throw new Error("Failed to submit");
            }
        } catch (error) {
            toast.error("Failed to submit match result.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePlayer = (team: 'A' | 'B', playerId: string) => {
        if (team === 'A') {
            if (teamB.includes(playerId)) return;
            setTeamA(prev =>
                prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
            );
        } else {
            if (teamA.includes(playerId)) return;
            setTeamB(prev =>
                prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
            );
        }
    };

    const TeamSelection = ({ team, title, selectedIds, onToggle, score, onScoreChange, colorClass }: {
        team: 'A' | 'B',
        title: string,
        selectedIds: string[],
        onToggle: (id: string) => void,
        score: number,
        onScoreChange: (val: number) => void,
        colorClass: string
    }) => (
        <Card className={cn("border-2 transition-all duration-300",
            team === 'A' ? "border-blue-100 hover:border-blue-300" : "border-red-100 hover:border-red-300"
        )}>
            <CardHeader className={cn("rounded-t-lg bg-opacity-10", colorClass)}>
                <CardTitle className="flex justify-between items-center text-2xl">
                    {title}
                    <Badge variant="outline" className="text-lg px-3 py-1 bg-white/50 backdrop-blur-sm">
                        {selectedIds.length} Players
                    </Badge>
                </CardTitle>
                <CardDescription>Select players and enter score</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Score Input */}
                <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl">
                    <Label className="text-lg font-semibold text-gray-600 mb-2">Sets Won</Label>
                    <div className="flex items-center gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full"
                            onClick={() => onScoreChange(Math.max(0, score - 1))}
                        >
                            -
                        </Button>
                        <span className="text-4xl font-bold font-mono w-16 text-center">{score}</span>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="h-12 w-12 rounded-full"
                            onClick={() => onScoreChange(score + 1)}
                        >
                            +
                        </Button>
                    </div>
                </div>

                <Separator />

                {/* Player Selection */}
                <div className="space-y-4">
                    <Label className="text-base">Roster</Label>
                    <div className="grid grid-cols-1 gap-2">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-full justify-between"
                                >
                                    Select Player...
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search player..." />
                                    <CommandList>
                                        <CommandEmpty>No player found.</CommandEmpty>
                                        <CommandGroup>
                                            {players
                                                .filter(p => !teamA.includes(p.id) && !teamB.includes(p.id) || selectedIds.includes(p.id))
                                                .map((player) => (
                                                    <CommandItem
                                                        key={player.id}
                                                        value={player.name || ''}
                                                        onSelect={() => togglePlayer(team, player.id)}
                                                        className="cursor-pointer"
                                                    >
                                                        <Check
                                                            className={cn(
                                                                "mr-2 h-4 w-4",
                                                                selectedIds.includes(player.id) ? "opacity-100" : "opacity-0"
                                                            )}
                                                        />
                                                        <Avatar className="h-6 w-6 mr-2">
                                                            <AvatarImage src={player.image || ''} />
                                                            <AvatarFallback>{player.name?.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        {player.name}
                                                    </CommandItem>
                                                ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <ScrollArea className="h-[200px] w-full rounded-md border p-4 bg-slate-50">
                        {selectedIds.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                                <Users className="h-8 w-8 mb-2 opacity-20" />
                                <p>No players selected</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {players.filter(p => selectedIds.includes(p.id)).map(player => (
                                    <div key={player.id} className="flex items-center justify-between bg-white p-2 rounded-md shadow-sm border animate-in slide-in-from-left-2">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={player.image || ''} />
                                                <AvatarFallback>{player.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium text-sm">{player.name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => togglePlayer(team, player.id)}
                                        >
                                            <span className="sr-only">Remove</span>
                                            &times;
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-5xl mx-auto"
            >
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-2">
                        Submit Match Result
                    </h1>
                    <p className="text-lg text-gray-600">
                        Record the outcome of your latest game and update the leaderboard.
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Team A */}
                        <div className="lg:col-span-5">
                            <TeamSelection
                                team="A"
                                title="Team A"
                                selectedIds={teamA}
                                onToggle={(id) => togglePlayer('A', id)}
                                score={teamAScore}
                                onScoreChange={setTeamAScore}
                                colorClass="bg-blue-500/10 text-blue-700"
                            />
                        </div>

                        {/* VS Divider - Desktop */}
                        <div className="hidden lg:flex lg:col-span-2 flex-col items-center justify-center pt-20">
                            <div className="bg-white p-4 rounded-full shadow-lg border-4 border-gray-100 relative z-10">
                                <Swords className="h-10 w-10 text-gray-400" />
                            </div>
                            <div className="h-full w-px bg-gray-200 absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 -z-0"></div>
                        </div>

                        {/* VS Divider - Mobile */}
                        <div className="lg:hidden flex items-center justify-center py-4">
                            <div className="bg-white px-6 py-2 rounded-full shadow-sm border text-gray-500 font-bold text-xl">
                                VS
                            </div>
                        </div>

                        {/* Team B */}
                        <div className="lg:col-span-5">
                            <TeamSelection
                                team="B"
                                title="Team B"
                                selectedIds={teamB}
                                onToggle={(id) => togglePlayer('B', id)}
                                score={teamBScore}
                                onScoreChange={setTeamBScore}
                                colorClass="bg-red-500/10 text-red-700"
                            />
                        </div>
                    </div>

                    <div className="mt-10 flex justify-center">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isSubmitting}
                            className={cn(
                                "px-12 py-6 text-lg font-bold shadow-xl transition-all hover:scale-105",
                                "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            )}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                    Submitting...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Trophy className="h-6 w-6" />
                                    Submit Final Score
                                </span>
                            )}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
