import { useState } from "react";
import { supabase } from "../utils/supabase";

function AdminLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleLogin() {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
        }

        else {
            alert("Login successful");
        }
    }

    return (
        <div>
            <h2>Admin Login</h2>

            <input
                type="email"
                placeholder="Your Email"
                onChange={(e) => setEmail(e.target.value)}
            />    

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="hover: rounded cursor-pointer" onClick={handleLogin}>
                Login
            </button>    
        </div>
    );
}

export default AdminLogin;