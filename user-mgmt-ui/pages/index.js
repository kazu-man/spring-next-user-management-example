import { getSession } from "next-auth/react";
import Head from "next/head";
import AddUser from "../components/AddUser";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import Navbar from "../components/Navbar";
import { JwtTokenContext } from "../providers/JwtSessionProviders";
import { useContext } from "react";

export default function Home({ session }) {

  const {accessToken} = useContext(JwtTokenContext)

  if (!accessToken) return <SignUp />;
  // if (!accessToken) return <Login />;
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
