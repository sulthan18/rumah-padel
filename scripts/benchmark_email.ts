import { performance } from "perf_hooks";

// Mock email sending
async function sendWaitlistNotificationEmail() {
    return new Promise(resolve => setTimeout(resolve, 50)); // Simulating 50ms delay
}

async function benchmark() {
    const entries = Array(50).fill(null);

    // Sequential
    const startSeq = performance.now();
    for (const entry of entries) {
        await sendWaitlistNotificationEmail();
    }
    const endSeq = performance.now();
    const seqTime = endSeq - startSeq;

    // Parallel
    const startPar = performance.now();
    await Promise.all(entries.map(() => sendWaitlistNotificationEmail()));
    const endPar = performance.now();
    const parTime = endPar - startPar;

    console.log(`Sequential time: ${seqTime.toFixed(2)} ms`);
    console.log(`Parallel time: ${parTime.toFixed(2)} ms`);
    console.log(`Improvement: ${((seqTime - parTime) / seqTime * 100).toFixed(2)}%`);
}

benchmark();
