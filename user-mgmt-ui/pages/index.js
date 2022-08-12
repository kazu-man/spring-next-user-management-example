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
  const USER_API_BASE_URL = "http://localhost:8080/api/v1/users";
  const USER_API_SIGNOUT_URL = "http://localhost:8080/logout";

  //ログインチェック
  useEffect(()=>{    
    const tokenInCookie = cookies.get("jwt-token");
    const refreshTokenInCookie = cookies.get("refresh-token");

    const loginCheck = async() =>{
      const res = await fetch(USER_API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          'Authorization': "Bearer " + tokenInCookie + "REFRESH_TOKEN" + refreshTokenInCookie,
        },
      });
      const data = await res.json();
      if(res.ok){
        setJwtToken((old)=>  {
          return {
            ...old,
            accessToken:tokenInCookie,
            refreshToken:refreshTokenInCookie
          }
        })
    
      }else if(res.status === 401 && data.refreshToken){
        setJwtToken((old)=>  {
          return {
            ...old,
            accessToken:data.token,
            refreshToken:data.refreshToken
          }
        })
        cookies.set("jwt-token",data.token);
        cookies.set("refresh-token",data.refreshToken);
  
      }else{
        const signOut = async () => {
          
          const logoutRes = await fetch(USER_API_SIGNOUT_URL,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          if(!logoutRes.ok){
            alert("logout 失敗")
          }else {
            cookies.remove("jwt-token");      
            cookies.remove("refresh-token");      
            setJwtToken((old)=>  {
              return {
                ...old,
                accessToken:null,
                refreshToken:null
              }
            })
          }
        }
        signOut()
      }
    }


    if(tokenInCookie){
      loginCheck()
    }

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
