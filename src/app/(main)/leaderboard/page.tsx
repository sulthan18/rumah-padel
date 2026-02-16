"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Crown, Shield, Trophy } from 'lucide-react';

export default function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);

    useEffect(() => {
        async function fetchLeaderboard() {
            const res = await fetch('/api/leaderboard');
            const data = await res.json();
            setLeaderboard(data);
        }
        fetchLeaderboard();
    }, []);

    const getRankIcon = (rank: number) => {
        if (rank === 0) return <Crown className="w-6 h-6 text-yellow-500" />;
        if (rank === 1) return <Trophy className="w-6 h-6 text-gray-400" />;
        if (rank === 2) return <Shield className="w-6 h-6 text-orange-400" />;
        return rank + 1;
    }

    return (
        <motion.div 
            className="container mx-auto p-4 bg-gradient-to-b from-gray-50 to-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-3xl font-bold mb-8 tracking-tight">Leaderboard</h1>
            <div className="border rounded-lg shadow-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Rank</TableHead>
                            <TableHead>Player</TableHead>
                            <TableHead>Wins</TableHead>
                            <TableHead>Losses</TableHead>
                            <TableHead>Win Rate</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaderboard.map((player: any, index) => (
                            <TableRow 
                                key={player.id} 
                                className={index < 3 ? 'bg-yellow-50' : ''}
                            >
                                <TableCell className="font-medium text-lg">{getRankIcon(index)}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={player.image ?? ''} />
                                            <AvatarFallback>{player.name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-semibold">{player.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-green-600 font-bold">{player.wins}</TableCell>
                                <TableCell className="text-red-600 font-bold">{player.losses}</TableCell>
                                <TableCell>{player.winRate.toFixed(1)}%</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
}
