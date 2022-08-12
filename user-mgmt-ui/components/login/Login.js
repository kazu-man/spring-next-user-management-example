import React, { useState, Fragment, useContext } from "react";
import { InputField } from "../InputField";
import { JwtTokenContext } from "../../providers/JwtSessionProviders";
import login from "../../utils/login";
import cookies from "js-cookie"

const Login = () => {
  const { setJwtToken } = useContext(JwtTokenContext);
  const [errors, setErrors] = useState({});
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const setValue = (name, value) => {
    setUser({ ...user, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const signinWithSpring = async () => {
    const res = await login(user);
    const data = await res.json();
    if (!res.ok || data.error) {
      setErrors({ ...errors, ...data.errors, authError: data.error });
    } else {
      setJwtToken((old)=>  {
        return {
          ...old,
          accessToken:data.token,
          refreshToken:data.refreshToken
        }
      })
      cookies.set("jwt-token",data.token);
      cookies.set("refresh-token",data.refreshToken);
    }
  };

  return (
    <div>
      <div className="text-center">
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
                name={"email"}
                value={user.email}
                setValue={setValue}
                error={errors.email}
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
                  onClick={signinWithSpring}
                  className="rounded text-white font-semibold bg-green-400 hover:bg-green-700 py-2 px-6"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
