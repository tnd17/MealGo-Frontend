import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./authContext";

const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    // login thành công
    const login = (userData) => {
        setUser(userData);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );
    };

    // logout
    const logout = () => {

        setUser(null);

        localStorage.removeItem("user");

        // quay về trang chủ
        navigate("/");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;