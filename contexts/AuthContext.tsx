import { User, Session } from '@supabase/supabase-js'
import { createContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

type AuthContextType = {
  user?: User;
  session?: Session;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider(props) {
  const [user, setUser] = useState<User>();
  const [session, setSession] = useState<Session>();

  useEffect(() => {
    const currentSession = supabase.auth.session();

    if (currentSession) {
      setSession(currentSession)
      setUser(currentSession.user)
    }

    const { data } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user);
    
      fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ event, session: newSession })
      })
    })

    return () => {
      data.unsubscribe();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, session }}>
      {props.children}
    </AuthContext.Provider>
  )
}