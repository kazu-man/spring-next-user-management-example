import { getSession } from "next-auth/react";
import Head from "next/head";
import AddUser from "../components/AddUser";
import Navbar from "../components/Navbar";
import { JwtTokenContext } from "../providers/JwtSessionProviders";
import { useContext ,useEffect} from "react";
import LoginSignUpTab from "../components/login/LoginSignUpTab";
import cookies from "js-cookie"

export default function Home({ session }) {
  const {jwtToken,setJwtToken} = useContext(JwtTokenContext);
  const {accessToken} = jwtToken;
  //ログインチェック
  useEffect(()=>{    
    const tokenInCookie = cookies.get("jwt-token");
    const refreshTokenInCookie = cookies.get("refresh-token");
    setJwtToken((old)=>  {
      return {
        ...old,
        accessToken:tokenInCookie,
        refreshToken:refreshTokenInCookie
      }
    })

  },[])

  if (!accessToken) return <LoginSignUpTab />;

  return (
    <div>
      <Head>
        <title>User management App</title>
      </Head>
      <Navbar />
      <main>
        <AddUser />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);
  return {
    props: { session },
  };
}
