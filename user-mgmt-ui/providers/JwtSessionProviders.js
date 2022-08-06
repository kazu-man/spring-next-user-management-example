import { createContext, useState } from "react";

export const JwtTokenContext = createContext();

export const JwtSessionProvider = ({ children }) => {
  const [jwtToken, setJwtToken] = useState({
    accessToken: null,
    updateAccessToken: (val) => {
      setJwtToken({ ...jwtToken, accessToken: val });
    },
  });

  return (
    <JwtTokenContext.Provider value={jwtToken}>
      {children}
    </JwtTokenContext.Provider>
  );
};
