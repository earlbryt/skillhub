// Script to update workshops in Supabase
// 80% will be upcoming, 20% will be completed

import { createClient } from '@supabase/supabase-js';

// Supabase credentials from src/lib/supabase.ts
const supabaseUrl = 'https://znohucbxvuitqpparsyb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpub2h1Y2J4dnVpdHFwcGFyc3liIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTk1NTMsImV4cCI6MjA1NzE5NTU1M30.YlDfCY2mxPFweLDYNvm8sWnINK1HcZC87p9-NOfUngE';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateWorkshops() {
  try {
    // Fetch all workshops
    const { data: workshops, error } = await supabase
      .from('workshops')
      .select('*')
      .order('id');
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${workshops.length} workshops to update`);
    
    // Calculate how many workshops should be completed (20%)
    const completedCount = Math.floor(workshops.length * 0.2);
    const upcomingCount = workshops.length - completedCount;
    
    console.log(`Setting ${upcomingCount} workshops as upcoming and ${completedCount} as completed`);
    
    // Current date
    const now = new Date();
    
    // Update each workshop
    for (let i = 0; i < workshops.length; i++) {
      const workshop = workshops[i];
      let startDate, endDate;
      
      if (i < upcomingCount) {
        // 80% of workshops will be upcoming
        // Set start date to between 1 and 60 days in the future
        const futureStartDays = Math.floor(Math.random() * 60) + 1;
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() + futureStartDays);
        
        // Set end date to 1-3 days after start date
        const durationDays = Math.floor(Math.random() * 3) + 1;
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + durationDays);
      } else {
        // 20% of workshops will be completed
        // Set end date to between 1 and 30 days in the past
        const pastEndDays = Math.floor(Math.random() * 30) + 1;
        endDate = new Date(now);
        endDate.setDate(endDate.getDate() - pastEndDays);
        
        // Set start date to 1-3 days before end date
        const durationDays = Math.floor(Math.random() * 3) + 1;
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - durationDays);
      }
      
      // Update the workshop in Supabase
      const { error: updateError } = await supabase
        .from('workshops')
        .update({
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', workshop.id);
      
      if (updateError) {
        console.error(`Error updating workshop ${workshop.id}:`, updateError);
      } else {
        console.log(`Updated workshop ${workshop.id} - ${workshop.title}`);
        console.log(`  Start: ${startDate.toISOString()}`);
        console.log(`  End: ${endDate.toISOString()}`);
        console.log(`  Status: ${i < upcomingCount ? 'Upcoming' : 'Completed'}`);
      }
    }
    
    console.log('Workshop update completed successfully!');
    
  } catch (error) {
    console.error('Error updating workshops:', error);
  }
}

// Run the update function
updateWorkshops(); 