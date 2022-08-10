import { createContext, useState } from "react";

export const JwtTokenContext = createContext();

export const JwtSessionProvider = ({ children }) => {
  const [jwtToken, setJwtToken] = useState({
    accessToken: null,
    refreshToken:null,  
  });

  return (
    <JwtTokenContext.Provider value={{jwtToken,setJwtToken}}>
      {children}
    </JwtTokenContext.Provider>
  );
};
