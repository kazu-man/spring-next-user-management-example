import { useState,Fragment,useContext } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { InputField } from "./InputField";
import { JwtTokenContext } from "../providers/JwtSessionProviders";
import login from "../utils/login"
const SignUp = () => {
    const {updateAccessToken} = useContext(JwtTokenContext);
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState({
      id: "",
      username: "",
      password: "",
      email: "",
      role:""
    });
    const [errors,setErrors] = useState({});
  
    function closeModal() {
      setIsOpen(false);
    }
    
    function openModal() {
      setIsOpen(true);
    }
  
    const setValue = (name,value) => {
      setUser({ ...user, [name]: value });
    };
    
    const reset = () => {
      setErrors({})
      setUser({
        id: "",
        username: "",
        password: "",
        email: "",
        role:""
      });
      setIsOpen(false);
    };
    
      const signUpWithSpring = async (e) =>{
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
            const data = await res.json();
            console.log(res)
          if(!res.ok || data.error){
            setErrors({...errors,...data.errors,authError:data.error});
            throw new Error(response.statusText);
          }else{
            const loginRes = await login(user);
            const data = await loginRes.json();
            updateAccessToken(data.token)

          }
    
        })
        .catch((res) => {
          console.log(res.message)
        })
      }



    return (
<div>
<div className="container mx-auto my-8">
  <div className="h-12">
    <button
      onClick={openModal}
      className="rounded bg-blue-600 text-white px-6 py-2 font-semibold">
      Sign In
    </button>
  </div>

  <Transition appear show={isOpen} as={Fragment}>
  <Dialog
    as="div"
    className="fixed inset-0 z-10 overflow-y-auto"
    onClose={closeModal}>
    <div className="min-h-screen px-4 text-center">
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95">
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-md">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900">
            Add new User
          </Dialog.Title>
          <div className="flex max-w-md max-auto">
            <div className="py-2">
                {
                  errors.authError &&
                  <div className="text-red-500 whitespace-pre-wrap text-sm">{errors.authError}</div>
                }

                        <InputField
                        type={"text"}
                        name={"username"}
                        value={user.username}
                        setValue={setValue}
                        error={errors.username}/>
                      <InputField
                        type={"text"}
                        name={"email"}
                        value={user.email}
                        setValue={setValue}
                        error={errors.email}/>
                      <InputField
                        type={"text"}
                        name={"role"}
                        value={user.role}
                        setValue={setValue}
                        error={errors.role}/>
                      <InputField
                        type={"text"}
                        name={"password"}
                        value={user.password}
                        setValue={setValue}
                        error={errors.password}/>

                <div className="h-14 my-8 space-x-4 pt-4">
                <button
                  onClick={signUpWithSpring}
                  className="rounded text-white font-semibold bg-green-400 hover:bg-green-700 py-2 px-6">
                  Save
                </button>
                <button
                  onClick={reset}
                  className="rounded text-white font-semibold bg-red-400 hover:bg-red-700 py-2 px-6">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition.Child>
    </div>
  </Dialog>
</Transition>


</div>
</div>
    )
}

export default SignUp;
