import cookies from "js-cookie"

const retrieveRefreshToken = async (data,callback,setJwtToken) => {
    setJwtToken((old)=>  {
        return {
          ...old,
          accessToken:data.token,
          refreshToken:data.refreshToken
        }
      })
    await callback();
    console.log("second request with refresh token")
    cookies.set("jwt-token",data.token);
    cookies.set("refresh-token",data.refreshToken);

}

export default retrieveRefreshToken