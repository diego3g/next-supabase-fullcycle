import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { supabase } from "../services/supabase"

export default function Home() {
  const { user } = useContext(AuthContext)

  console.log(user);

  async function login() {
    const { error } = await supabase.auth.signIn({
      provider: 'github',
    })

    if (error) {
      console.log(error);
      return;
    }
  }

  async function logout() {
    await supabase.auth.signOut();
  }

  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
