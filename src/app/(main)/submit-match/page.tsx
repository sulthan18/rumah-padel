"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { User } from '@prisma/client';

export default function SubmitMatchPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [players, setPlayers] = useState<User[]>([]);
    const [teamA, setTeamA] = useState<string[]>([]);
    const [teamB, setTeamB] = useState<string[]>([]);
    const [teamAScore, setTeamAScore] = useState<number>(0);
    const [teamBScore, setTeamBScore] = useState<number>(0);

    useEffect(() => {
        async function fetchPlayers() {
            const res = await fetch('/api/players');
            const data = await res.json();
            setPlayers(data);
        }
        fetchPlayers();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (teamA.length === 0 || teamB.length === 0) {
            toast.error("Please select at least one player for each team.");
            return;
        }

        const winnerTeam = teamAScore > teamBScore ? 'A' : 'B';

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
            toast.success("Match result submitted successfully!");
            router.push('/leaderboard');
        } else {
            toast.error("Failed to submit match result.");
        }
    };

    const handleSelectPlayer = (team: 'A' | 'B', playerId: string) => {
        if (team === 'A') {
            setTeamA(prev => 
                prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
            );
        } else {
            setTeamB(prev => 
                prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]
            );
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Submit Match Result</h1>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Team A</h2>
                        <div className="space-y-2">
                            {players.map(player => (
                                <div key={player.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`teamA-${player.id}`}
                                        checked={teamA.includes(player.id)}
                                        onChange={() => handleSelectPlayer('A', player.id)}
                                        disabled={teamB.includes(player.id)}
                                    />
                                    <label htmlFor={`teamA-${player.id}`}>{player.name}</label>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Label htmlFor="teamAScore">Score</Label>
                            <Input
                                id="teamAScore"
                                type="number"
                                value={teamAScore}
                                onChange={e => setTeamAScore(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Team B</h2>
                        <div className="space-y-2">
                            {players.map(player => (
                                <div key={player.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={`teamB-${player.id}`}
                                        checked={teamB.includes(player.id)}
                                        onChange={() => handleSelectPlayer('B', player.id)}
                                        disabled={teamA.includes(player.id)}
                                    />
                                    <label htmlFor={`teamB-${player.id}`}>{player.name}</label>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <Label htmlFor="teamBScore">Score</Label>
                            <Input
                                id="teamBScore"
                                type="number"
                                value={teamBScore}
                                onChange={e => setTeamBScore(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                </div>
                <Button type="submit">Submit Result</Button>
            </form>
        </div>
    );
}
