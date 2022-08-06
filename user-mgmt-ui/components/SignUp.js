import { useState } from "react";

export const SignUp = () => {

    const [user, setUser] = useState({
        id: "",
        username: "",
        password: "",
        email: "",
        role:""
      });
    
      const handleChange = (e =>{
        e.preventDefault();
        const value = e.target.value;
        setUser({ ...user, [e.target.name]: value });
      
      });
    
      const handleSubmit = async (e) =>{
        e.preventDefault();
        const jsonUser = JSON.stringify(user);
        const res = await fetch("http://localhost:8080/api/auth/signup",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
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


      
    return (
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
    )
}