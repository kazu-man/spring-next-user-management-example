const login = async (user) => {
    const res = await fetch("http://localhost:8080/api/auth/signin",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    return res;
  }

  export default login;