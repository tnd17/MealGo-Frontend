import { useState } from "react";
import { AuthContext } from "./authContext";

const AuthProvider = ({ children}) => {
    const [user, setUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    ); //load user tu localstorage hoac chua co thi null

    const login = (userData) => { //login thanh cong
        setUser(userData);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );
    };

    const logout = () => {
        setUser(null);

        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;