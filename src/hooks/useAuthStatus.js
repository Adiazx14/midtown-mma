import { useEffect, useRef, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useAuthStatus = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [uid, setUid] = useState("");
  const isMounted = useRef(true);

  useEffect(() => {
    if (isMounted) {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (
            [
              "WThS4cVfqdZypO04WkgRzsZA9pz2",
              "gryUf2y7DfdjiSYDS1ABZr1S8T72",
              "JLZtYYmvT3UP7KTr44n9mIUbJDt2",
            ].includes(user.uid)
          ) {
            setIsAdmin(true);
            setUid(user.uid);
          }
          setIsLoggedIn(true);
        }
        setLoadingAdmin(false);
      });
    }

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  return { isLoggedIn, loadingAdmin, isAdmin, uid };
};

export default useAuthStatus;
