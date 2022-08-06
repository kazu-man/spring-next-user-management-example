import { getSession } from "next-auth/react";
import Head from "next/head";
import AddUser from "../components/AddUser";
import Navbar from "../components/Navbar";
import { JwtTokenContext } from "../providers/JwtSessionProviders";
import { useContext } from "react";
import LoginSignUpTab from "../components/LoginSignUpTab";

export default function Home({ session }) {
  const { accessToken } = useContext(JwtTokenContext);

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
