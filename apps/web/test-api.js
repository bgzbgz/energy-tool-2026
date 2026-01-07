// Test script to verify Supabase connection and API functionality
// Run with: node test-api.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://onysuwdifyeplitwurbe.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ueXN1d2RpZnllcGxpdHd1cmJlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3NjI0NDMsImV4cCI6MjA4MzMzODQ0M30.lPSaCdJ6iWbDRDi4LpUA5lqAmpG32B42CgFxDzHh1T4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const testSubmission = {
  tool_name: 'energy_body_mind',
  user_id: 'test.user@company.com',
  user_name: 'Test User',
  company_id: 'test-company',
  company_name: 'Test Company',
  tool_data: {
    audit: {
      sleep: {
        rating: 7,
        hours: 7,
        habits: 'I typically get 7 hours of sleep per night, but I wake up frequently. I go to bed around 11 PM and wake at 6 AM.'
      },
      food: {
        rating: 5,
        habits: 'I eat 3 meals per day but often skip breakfast. Lunch is usually fast food, dinner is home-cooked. I drink 3-4 cups of coffee daily.'
      },
      movement: {
        rating: 4,
        minutes: 30,
        habits: 'I sit at my desk for 8+ hours per day. I walk my dog for 15 minutes in the evening. No structured exercise routine.'
      },
      brain: {
        rating: 8,
        routines: 'I do deep work in the morning from 8-11 AM. I take notes during meetings and review them daily. I read for 30 minutes before bed.'
      }
    },
    drains: {
      biggest_drain: 'Constant email notifications and Slack messages throughout the day destroy my ability to focus. I check email compulsively every 5-10 minutes, which fragments my attention and makes deep work impossible. This causes anxiety and decision fatigue.',
      impact: 'Reduces productivity by approximately 50%, increases stress levels, makes it impossible to complete complex tasks in one sitting',
      peak_times: '8-11 AM when I have uninterrupted time before meetings start',
      crash_times: '2-4 PM after lunch and heavy meeting load'
    },
    protocols: {
      sleep_commitment: 'Lights out by 10:30 PM every night. No screens after 10 PM. Bedroom temperature set to 67°F. Blackout curtains closed. White noise machine on. Wake at 6:00 AM with sunrise alarm clock. No snoozing.',
      food_commitment: 'Eat breakfast at 7 AM (2 eggs, oatmeal, berries). Lunch at 12:30 PM (protein + vegetables). Dinner at 6:30 PM (home-cooked, no processed food). No snacking after 8 PM. Drink 2 liters of water throughout the day. Limit coffee to 2 cups before 12 PM.',
      movement_commitment: '30-minute walk at 6:30 AM daily before work. 10 pushups and 10 squats every hour from 9 AM to 5 PM (set phone timer). 20-minute stretching routine at 7 PM. Stand during all phone calls.',
      brain_commitment: 'Email and Slack turned off from 9-11 AM and 2-4 PM for deep work blocks. Check messages only at 8 AM, 11 AM, 1 PM, 4 PM, 5 PM. Morning planning session at 8 AM (20 minutes). Weekly review every Friday at 4 PM. No phone in bedroom.'
    },
    first_win: {
      action: 'Tomorrow morning at 9 AM, I will turn off all notifications (email, Slack, phone) and complete one focused 90-minute work block on my quarterly strategy document without interruptions.',
      timeframe: 'Tomorrow (Wednesday) 9:00 AM - 10:30 AM',
      accountability_partner: 'Sarah Chen'
    }
  }
};

async function testSupabase() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Test 1: Insert submission
  console.log('1️⃣ Testing INSERT (POST equivalent)...');
  try {
    const { data, error } = await supabase
      .from('energy_submissions')
      .insert(testSubmission)
      .select('id')
      .single();

    if (error) {
      console.error('❌ INSERT Error:', error.message);
      return;
    }

    console.log('✅ INSERT Success!');
    console.log('   Submission ID:', data.id);
    const submissionId = data.id;

    // Test 2: Query by company
    console.log('\n2️⃣ Testing SELECT by company_id (GET equivalent)...');
    const { data: submissions, error: queryError } = await supabase
      .from('energy_submissions')
      .select('*')
      .eq('company_id', 'test-company')
      .order('submitted_at', { ascending: false })
      .limit(10);

    if (queryError) {
      console.error('❌ SELECT Error:', queryError.message);
      return;
    }

    console.log('✅ SELECT Success!');
    console.log(`   Found ${submissions.length} submission(s)`);
    if (submissions.length > 0) {
      console.log('   Latest submission:', {
        id: submissions[0].id,
        user_name: submissions[0].user_name,
        company_id: submissions[0].company_id,
        submitted_at: submissions[0].submitted_at
      });
    }

    // Test 3: Cleanup (optional)
    console.log('\n3️⃣ Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('energy_submissions')
      .delete()
      .eq('id', submissionId);

    if (deleteError) {
      console.log('⚠️  Cleanup warning:', deleteError.message);
    } else {
      console.log('✅ Test data cleaned up');
    }

    console.log('\n🎉 All tests passed! Database is working correctly.');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

testSupabase();

