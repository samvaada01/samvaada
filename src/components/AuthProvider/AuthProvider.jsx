import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { useEffect } from "react";
import { useState } from "react";
import { createContext } from "react";
import app from "../Firebase/firebase.config";
import { getFirestore } from "firebase/firestore";

const auth = getAuth(app);

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const db = getFirestore(app);

// console.log(db);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const allowedDomains = ["@nmamit.in", "@nitte.edu.in"];

  // hd = hosted-domain hint, so the account picker prefilters to students or
  // faculty. It's only a hint — the allowedDomains check below still decides.
  const googleLogin = (hd) => {
    setLoading(true);
    googleProvider.setCustomParameters(hd ? { hd } : {});
    return signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const email = (result.user.email || "").toLowerCase();
        if (!allowedDomains.some((domain) => email.endsWith(domain))) {
          // must await: the popup already persisted a valid token
          await signOut(auth);
          throw new Error("Please login using your college email");
        }
        return result;
      })
      .catch(async (err) => {
        setLoading(false); // a cancelled popup must not leave the app spinning
        throw err;
      });
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      // console.log("user auth state check", currentUser);
      setUser(currentUser);
      setLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);

  const authInfo = {
    db,
    user,
    googleLogin,
    logOut,
    loading,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};
export default AuthProvider;

