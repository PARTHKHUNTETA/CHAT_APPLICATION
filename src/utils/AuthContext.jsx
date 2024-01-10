import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../appwriteConfig";
import { useNavigate } from "react-router-dom";
import { ID } from "appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getUserOnLoad();
  }, []);

  const getUserOnLoad = async () => {
    try {
      let accountDetails = await account.get();
      console.log("accountDetails", accountDetails);
      setUser(accountDetails);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.warn(err);
    }
  };

  const submitUserDetails = async (e, credentials) => {
    e.preventDefault();
    try {
      let response = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      let accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUserLogOut = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  const handleRegister = async (e, credentials) => {
    e.preventDefault();
    console.log("Handle Register triggered!", credentials);

    if (credentials.password1 !== credentials.password2) {
      alert("Passwords did not match!");
      return;
    }

    try {
      let response = await account.create(
        ID.unique(),
        credentials.email,
        credentials.password1,
        credentials.name
      );
      console.log("User registered!", response);

      await account.createEmailSession(
        credentials.email,
        credentials.password1
      );
      let accountDetails = await account.get();
      setUser(accountDetails);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const contextData = {
    user,
    handleUserLogOut,
    loading,
    submitUserDetails,
    handleRegister,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading ......</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
