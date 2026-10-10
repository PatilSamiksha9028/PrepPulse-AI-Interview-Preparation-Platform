import { useState, useEffect, createContext } from "react";
import { getMe } from "../services/auth.api.js";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Run once on app start to restore session
    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await getMe();
                setUser(data.user);
            } catch {
                setUser(null); // not logged in
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                setLoading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};