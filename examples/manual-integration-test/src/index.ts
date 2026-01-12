import { IntervalsClient } from 'intervals-icu';

console.log('Integrations Test: Initializing client...');

try {
    const client = new IntervalsClient({
        apiKey: 'dummy-key-for-test',
        athleteId: 'me'
    });

    console.log('✅ Client initialized successfully');

    if (typeof client.getAthlete === 'function') {
        console.log('✅ getAthlete method exists');
    } else {
        console.error('❌ getAthlete method missing');
        process.exit(1);
    }

    // Verify type checking (static analysis would fail if this was wrong, but good to have runtime check too)
    console.log('Runtime check passed. If this file compiled, types are also correct.');

} catch (e) {
    console.error('❌ Error initializing client:', e);
    process.exit(1);
}
