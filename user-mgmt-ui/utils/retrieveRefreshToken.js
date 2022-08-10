
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
}

export default retrieveRefreshToken