/**
 * Basic usage examples for node-intervals-icu v2.0
 *
 * Run:
 *   export INTERVALS_API_KEY="your-api-key-here"
 *   npx tsx examples/basic-usage.ts
 */

import { IntervalsClient, IntervalsAPIError } from '../src/index.js';

async function main() {
  const apiKey = process.env.INTERVALS_API_KEY;
  if (!apiKey) {
    console.error('Please set the INTERVALS_API_KEY environment variable');
    process.exit(1);
  }

  // athleteId defaults to '0' (the authenticated athlete)
  const client = new IntervalsClient({ apiKey });

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const oldest = thirtyDaysAgo.toISOString().split('T')[0];
  const newest = now.toISOString().split('T')[0];

  try {
    // 1. Athlete
    console.log('\n=== Athlete ===');
    const athlete = await client.athletes.getAthlete();
    console.log(`${athlete.name} — FTP: ${athlete.ftp}, Weight: ${athlete.weight} kg`);

    // 2. Sport Settings
    console.log('\n=== Sport Settings ===');
    const settings = await client.sportSettings.list();
    settings.forEach((s) => {
      console.log(`  - ${(s.types || []).join(', ')}: pace=${s.threshold_pace}, power=${s.threshold_power}`);
    });

    // 3. Events (with resolved workout data)
    console.log('\n=== Recent Events ===');
    const events = await client.events.listEvents({ oldest, newest, resolve: true });
    console.log(`Found ${events.length} events`);
    events.slice(0, 5).forEach((e) => {
      console.log(`  - ${e.start_date_local}: ${e.name || 'Unnamed'} [${e.category}] ${e.type || ''}`);
    });

    // 4. Activities
    console.log('\n=== Recent Activities ===');
    const activities = await client.activities.listActivities({ oldest, newest });
    console.log(`Found ${activities.length} activities`);
    activities.slice(0, 5).forEach((a) => {
      console.log(`  - ${a.start_date_local}: ${a.name} (${a.type}) — ${((a.distance || 0) / 1000).toFixed(1)} km`);
    });

    // 5. Wellness
    console.log('\n=== Recent Wellness ===');
    const wellness = await client.wellness.listWellness({ oldest, newest });
    wellness.slice(0, 5).forEach((w) => {
      console.log(`  - ${w.date}: weight=${w.weight}, rHR=${w.restingHR}, HRV=${w.hrv}`);
    });

    // 6. Fitness (CTL/ATL/TSB)
    console.log('\n=== Fitness ===');
    const fitness = await client.fitness.getFitness({ oldest, newest });
    const latest = fitness[fitness.length - 1];
    if (latest) {
      console.log(`Latest: fitness=${latest.fitness}, fatigue=${latest.fatigue}, form=${latest.form}`);
    }

    // 7. Weather
    console.log('\n=== Weather ===');
    const weather = await client.weather.getWeather();
    const forecast = weather.forecasts?.[0];
    if (forecast) {
      console.log(`Next: ${forecast.temp}°, feels like ${forecast.feels_like}°, wind ${forecast.wind_speed} m/s`);
    }

    // 8. Chat (send a message to yourself)
    /*
    await client.chats.sendMessage({
      to_athlete_id: athlete.id!,
      content: 'Hello from node-intervals-icu v2!',
      type: 'TEXT',
    });
    */

    // 9. Rate limit
    console.log('\n=== Rate Limit ===');
    console.log(`Remaining: ${client.getRateLimitRemaining()}, resets at: ${client.getRateLimitReset()?.toISOString()}`);

  } catch (error) {
    if (error instanceof IntervalsAPIError) {
      console.error(`\nAPI Error: ${error.code} — ${error.message} (HTTP ${error.status})`);
    } else {
      console.error('\nUnexpected error:', error);
    }
    process.exit(1);
  }
}

main();
