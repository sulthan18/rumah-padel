"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

export default function RewardsPage() {
    const { data: session } = useSession();
    const [rewards, setRewards] = useState([]);
    const [user, setUser] = useState(null);

    async function fetchRewards() {
        const res = await fetch('/api/rewards');
        const data = await res.json();
        setRewards(data);
    }

    async function fetchUser() {
        if (session) {
            const res = await fetch(`/api/users/${session.user.id}`); // Assuming you have an endpoint to get user details
            const data = await res.json();
            setUser(data);
        }
    }

    useEffect(() => {
        fetchRewards();
        fetchUser();
    }, [session]);

    async function handleRedeem(rewardId: string) {
        const res = await fetch('/api/rewards/redeem', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rewardId }),
        });

        if (res.ok) {
            toast.success("Reward redeemed successfully!");
            fetchUser(); // Refresh user points
        } else {
            const { message } = await res.json();
            toast.error(message || "Failed to redeem reward.");
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Rewards</h1>
                {user && (
                    <div className="text-lg font-semibold">
                        Your Points: {user.loyaltyPointsBalance}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward: any) => (
                    <Card key={reward.id}>
                        <CardHeader>
                            <CardTitle>{reward.name}</CardTitle>
                            <CardDescription>{reward.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-lg font-bold">{reward.pointsCost} Points</p>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                onClick={() => handleRedeem(reward.id)}
                                disabled={!user || user.loyaltyPointsBalance < reward.pointsCost}
                            >
                                Redeem
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
