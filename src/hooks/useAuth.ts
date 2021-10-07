import { useContext, useMemo } from "react";
import { UserContext } from "contexts/UserContext";

export default function useAuth() {
  const { auth, setLogin, setLogout, login, user, setAuth } = useContext(UserContext);
  return useMemo(() => ({
    setAuth: setAuth!,
    user: user,
    login: login,
    setLogin: setLogin!,
    setLogout: setLogout!,
    auth: auth!
  }), [user, login, setAuth, setLogin, setLogout, auth]);
};