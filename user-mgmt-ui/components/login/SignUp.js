import { useState, useContext } from "react";
import { InputField } from "../InputField";
import { JwtTokenContext } from "../../providers/JwtSessionProviders";
import login from "../../utils/login";
const SignUp = () => {
  const { setJwtToken } = useContext(JwtTokenContext);
  const [user, setUser] = useState({
    id: "",
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [errors, setErrors] = useState({});

  const setValue = (name, value) => {
    setUser({ ...user, [name]: value });
  };

  const signUpWithSpring = async (e) => {
    e.preventDefault();
    const jsonUser = JSON.stringify(user);
    const res = await fetch("http://localhost:8080/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonUser,
    })
      .then(async (res) => {
        const data = await res.json();
        console.log(res);
        if (!res.ok || data.error) {
          setErrors({
            ...errors,
            ...data.errors,
            authError: data.error,
          });
          throw new Error(response.statusText);
        } else {
          const loginRes = await login(user);
          const data = await loginRes.json();
          setJwtToken((old)=>  {
            return {
              ...old,
              accessToken:data.token,
              refreshToken:data.refreshToken
            }
          })
          
        }
      })
      .catch((res) => {
        console.log(res.message);
      });
  };

  return (
    <div>
      <div className="min-h-screen text-center">
        <div className="inline-block w-full max-w-md overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md">
          <div className="flex max-w-md max-auto">
            <div className="py-2 mx-auto">
              {errors.authError && (
                <div className="text-red-500 whitespace-pre-wrap text-sm">
                  {errors.authError}
                </div>
              )}
              <InputField
                type={"text"}
                name={"username"}
                value={user.username}
                setValue={setValue}
                error={errors.username}
              />
              <InputField
                type={"text"}
                name={"email"}
                value={user.email}
                setValue={setValue}
                error={errors.email}
              />
              <InputField
                type={"text"}
                name={"role"}
                value={user.role}
                setValue={setValue}
                error={errors.role}
              />
              <InputField
                type={"text"}
                name={"password"}
                value={user.password}
                setValue={setValue}
                error={errors.password}
              />

              <div className="h-14 my-8 space-x-4 pt-4 text-center">
                <button
                  onClick={signUpWithSpring}
                  className="rounded text-white font-semibold bg-green-400 hover:bg-green-700 py-2 px-6"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
