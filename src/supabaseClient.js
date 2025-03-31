// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hithwmfrnmmkqttjteci.supabase.co';  // استبدل بـ URL الخاص بك
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpdGh3bWZybm1ta3F0dGp0ZWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0MjcwMDYsImV4cCI6MjA1OTAwMzAwNn0.aUkhOZoeB6RLt5ZoJJVc-Hb2jgCKifnToVRj_xsmoFo';  // استبدل بـ مفتاح API الخاص بك

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
