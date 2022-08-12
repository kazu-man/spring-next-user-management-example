// import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import cookies from "js-cookie"

const Navbar = () => {
  // const { data: session, status } = useSession();
  
  const signOut = async () => {
    
    const res = await fetch("http://localhost:8080/logout",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if(!res.ok){
      alert("logout 失敗")
    }else {
      cookies.remove("jwt-token");
      cookies.remove("refresh-token");      
      location.reload();

    }

  }
  return (
    <div className="bg-gray-800">
      <div className="h-16 px-8 flex items-center">
        <p className="text-white font-bold flex-auto">User Management System</p>
          <div className="flex items-center sm:space-x-2 justify-end">
            <Image
              onClick={signOut}
              className="rounded-full cursor-pointer"
              src="https://picsum.photos/600/600?random=1"
              height="30"
              width="30"
              layout="fixed"
              title="Click to Logout"></Image>
            {/* <p className="text-white font-bold">{session?.user.name}</p> */}
          </div>

{/* {session && (
          <div className="flex items-center sm:space-x-2 justify-end">
            <Image
              onClick={signOut}
              className="rounded-full cursor-pointer"
              src={session.user.image}
              height="30"
              width="30"
              layout="fixed"
              title="Click to Logout"></Image>
            <p className="text-white font-bold">{session?.user.name}</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Navbar;
