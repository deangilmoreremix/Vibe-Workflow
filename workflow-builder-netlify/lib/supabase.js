import { createContext, useContext, useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bzxohkrxcwodllketcpz.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6eG9oa3J4Y3dvZGxsa2V0Y3B6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NjYzODUsImV4cCI6MjA4OTQ0MjM4NX0.ExeLy2sWZMnLY4VToGlbqr3F4SpNmrsE9Hw0lyAhb9A';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext({});

export function AuthProvider({ children, initialSession }) {
  const [session, setSession] = useState(initialSession);
  const [user, setUser] = useState(initialSession?.user || null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ session, user, supabase }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export { supabase };
