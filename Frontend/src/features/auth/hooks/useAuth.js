import { useContext } from "react";
import { AuthContext } from "../services/auth.context.jsx";
import {
    login,
    logout,
    register,
} from "../services/auth.api.js";


export const useAuth = () => {

    const context = useContext(AuthContext);

    const {
        user,
        setUser,
        loading,
        setLoading
    } = context;

    const handlelogin = async ({ email, password }) => {
        setLoading(true);
        try {
            const data = await login({ email, password });
            setUser(data.user);
            return data;
        } catch (err) {
            console.error("Login error:", err);
            throw err; // re-throw so Login.jsx can display the error message
        } finally {
            setLoading(false);
        }
    };

    const handleregister = async ({ username, email, password }) => {
        setLoading(true);

        try {
            const data = await register({
                username,
                email,
                password
            });

            return data;

        } catch (error) {
            console.error("Registration error:", error);
            throw error;

        } finally {
            setLoading(false);
        }
    };

    const handlelogout = async () => {
        setLoading(true);

        try {
            await logout();
            setUser(null);
        } catch (err) {
            console.error("Logout error:", err);
        } finally {
            setLoading(false);
        }
    };


    return {
        user,
        loading,
        handlelogin,
        handleregister,
        handlelogout
    };
};