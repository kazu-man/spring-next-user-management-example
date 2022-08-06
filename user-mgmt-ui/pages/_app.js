import "../styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { JwtSessionProvider } from "../providers/JwtSessionProviders";
function MyApp({ Component, pageProps, session }) {
  return (
    <JwtSessionProvider>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </JwtSessionProvider>
  );
}

export default MyApp;
