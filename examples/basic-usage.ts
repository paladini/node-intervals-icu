/**
 * Basic usage examples for node-intervals-icu
 * 
 * Make sure to set the INTERVALS_API_KEY environment variable before running this example:
 * export INTERVALS_API_KEY="your-api-key-here"
 */

import { IntervalsClient, IntervalsAPIError } from '../src/index.js';

async function main() {
  // Initialize the client
  const apiKey = process.env.INTERVALS_API_KEY;
  
  if (!apiKey) {
    console.error('Please set the INTERVALS_API_KEY environment variable');
    process.exit(1);
  }

  const client = new IntervalsClient({
    apiKey,
    athleteId: 'me', // Use 'me' for the authenticated athlete
  });

  try {
    // 1. Get athlete information
    console.log('\n=== Getting Athlete Info ===');
    const athlete = await client.getAthlete();
    console.log(`Name: ${athlete.name}`);
    console.log(`FTP: ${athlete.ftp}`);
    console.log(`Weight: ${athlete.weight} kg`);

    // 2. Get recent events
    console.log('\n=== Getting Recent Events ===');
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const events = await client.getEvents({
      oldest: thirtyDaysAgo.toISOString().split('T')[0],
      newest: now.toISOString().split('T')[0],
      limit: 5,
    });
    
    console.log(`Found ${events.length} events`);
    events.forEach((event) => {
      console.log(`  - ${event.start_date_local}: ${event.name || 'Unnamed'} (${event.category})`);
    });

    // 3. Get recent wellness data
    console.log('\n=== Getting Recent Wellness Data ===');
    const wellness = await client.getWellness({
      oldest: thirtyDaysAgo.toISOString().split('T')[0],
      newest: now.toISOString().split('T')[0],
      limit: 5,
    });
    
    console.log(`Found ${wellness.length} wellness entries`);
    wellness.forEach((w) => {
      console.log(`  - ${w.date}: Weight=${w.weight}, HR=${w.restingHR}, Sleep=${w.sleepSecs ? (w.sleepSecs / 3600).toFixed(1) + 'h' : 'N/A'}`);
    });

    // 4. Get recent workouts
    console.log('\n=== Getting Recent Workouts ===');
    const workouts = await client.getWorkouts({
      oldest: thirtyDaysAgo.toISOString().split('T')[0],
      newest: now.toISOString().split('T')[0],
      limit: 5,
    });
    
    console.log(`Found ${workouts.length} workouts`);
    workouts.forEach((workout) => {
      console.log(`  - ${workout.start_date_local}: ${workout.name || 'Unnamed'} (TSS=${workout.tss})`);
    });

    // 5. Get recent activities
    console.log('\n=== Getting Recent Activities ===');
    const activities = await client.getActivities({
      oldest: thirtyDaysAgo.toISOString().split('T')[0],
      newest: now.toISOString().split('T')[0],
      limit: 5,
    });
    
    console.log(`Found ${activities.length} activities`);
    activities.forEach((activity) => {
      console.log(`  - ${activity.start_date_local}: ${activity.name || 'Unnamed'} (${activity.type})`);
    });

    // 6. Check rate limit status
    console.log('\n=== Rate Limit Status ===');
    const remaining = client.getRateLimitRemaining();
    const reset = client.getRateLimitReset();
    console.log(`Remaining API calls: ${remaining}`);
    console.log(`Reset time: ${reset?.toISOString()}`);

    // Example: Create a new event (commented out to avoid modifying data)
    /*
    console.log('\n=== Creating New Event ===');
    const newEvent = await client.createEvent({
      start_date_local: '2024-12-20',
      name: 'Example Race',
      category: 'RACE',
      description: 'An example race event',
    });
    console.log(`Created event: ${newEvent.id}`);
    */

    // Example: Create wellness entry (commented out to avoid modifying data)
    /*
    console.log('\n=== Creating Wellness Entry ===');
    const newWellness = await client.createWellness({
      date: '2024-12-15',
      weight: 70,
      restingHR: 50,
      sleepSecs: 28800, // 8 hours
      sleepQuality: 8,
      mood: 7,
    });
    console.log(`Created wellness entry for: ${newWellness.date}`);
    */

  } catch (error) {
    if (error instanceof IntervalsAPIError) {
      console.error('\n=== API Error ===');
      console.error(`Message: ${error.message}`);
      console.error(`Status: ${error.status}`);
      console.error(`Code: ${error.code}`);
      
      if (error.code === 'AUTH_FAILED') {
        console.error('\nPlease check your API key is correct');
      } else if (error.code === 'RATE_LIMIT_EXCEEDED') {
        console.error('\nRate limit exceeded. Please wait before making more requests');
      }
    } else {
      console.error('\n=== Unknown Error ===');
      console.error(error);
    }
    process.exit(1);
  }
}

main();
