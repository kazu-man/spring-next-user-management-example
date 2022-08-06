import { signIn } from "next-auth/react";
import React,{useState, useContext} from "react";
import Navbar from "./Navbar";
import { JwtTokenContext } from "../providers/JwtSessionProviders";

const Login = () => {
  const {accessToken, updateAccessToken} = useContext(JwtTokenContext)

  console.log("accessToken",accessToken)
  const [token,setToken] = useState("");
  const [user, setUser] = useState({
    id: "",
    username: "",
    password: "",
    email: "",
    role:""
  });
  const signinWithSpring = async () => {
    const res = await fetch("http://localhost:8080/api/auth/signin",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'X-XSRF-TOKEN': xsrf
      },
      body: JSON.stringify({
        username:"admin@test.com",
        password:"ADMIN"
      }),

    })
    .then(async (res) => {
      const data = await res.json();
      setToken(data.token)
      updateAccessToken(data.token)
    })
    .catch((res) => {
      console.log(res)
    })
  }

  const handleChange = (e =>{
    e.preventDefault();
    const value = e.target.value;
    setUser({ ...user, [e.target.name]: value });
  
  });

  const handleSubmit = async (e) =>{
    e.preventDefault();
    console.log(user)
    const jsonUser = JSON.stringify(user);
    console.log(jsonUser)
    const res = await fetch("http://localhost:8080/api/auth/signup",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'X-XSRF-TOKEN': xsrf
      },
      body: jsonUser,

    })
    .then(async (res) => {
      console.log(res)
    })
    .catch((res) => {
      console.log(res.message)
    })

  }

  const test = async () => {
    const res = await fetch("http://localhost:8080/api/v1/getusers",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + accessToken
      },

    })
    .then(async (res) => {
      console.log(res)
      const data = await res.json();
      console.log(data)
    })
    .catch((res) => {
      console.log(res)
    })
  }
  return (
    <div>
      <Navbar />
      <div className="container mx-auto my-8">
        <div className="h-12">
          <button
            onClick={signinWithSpring}
            className="rounded bg-blue-600 text-white px-6 py-2 font-semibold">
            Sign In
          </button>
          <button
            onClick={test}
            className="rounded bg-blue-600 text-white px-6 py-2 font-semibold">
            Test
          </button>
        </div>
      </div>

      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label for="first">usename:</label>
          <input onChange={(e => handleChange(e))} type="text" id="username" name="username" />
          <label for="last">email:</label>
          <input onChange={(e => handleChange(e))} type="text" id="email" name="email" />
          <label for="last">password:</label>
          <input onChange={(e => handleChange(e))} type="text" id="password" name="password" />
          <label for="last">role:</label>
          <input onChange={(e => handleChange(e))} type="text" id="role" name="role" />
          <button type="submit">Submit</button>
          
        </form>
      </div>
    </div>
  );
};

export default Login;
