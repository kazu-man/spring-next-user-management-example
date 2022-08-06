import React,{useState,Fragment,useContext} from "react";
import Navbar from "./Navbar";
import { Dialog, Transition } from "@headlessui/react";
import { InputField } from "./InputField";
import { JwtTokenContext } from "../providers/JwtSessionProviders";
import login from "../utils/login";
const Login = () => {

  const {updateAccessToken} = useContext(JwtTokenContext);
  const [errors,setErrors] = useState({});
  const [user,setUser] = useState({
    email:"",
    password:""
  })

  const setValue = (name,value) => {
    setUser({ ...user, [name]: value });
    setErrors({...errors,[name]:""})
  };

  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }
  
  function openModal() {
    setIsOpen(true);
  }

  function reset() {
    closeModal(false)
    setUser({
      email:"",
      username:""
    })
    setErrors({})
  }
  const signinWithSpring = async () => {
    const res = await login(user);

    const data = await res.json();
    if(!res.ok || data.error){
      setErrors({...errors,...data.errors,authError:data.error});
    }else{
      updateAccessToken(data.token)
    }
   
  }

  return (
    <div>
      <Navbar />
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
                        name={"email"}
                        value={user.email}
                        setValue={setValue}
                        error={errors.email}/>

                      <InputField
                        type={"text"}
                        name={"password"}
                        value={user.password}
                        setValue={setValue}
                        error={errors.password}/>

                      <div className="h-14 my-8 space-x-4 pt-4">
                      <button
                        onClick={signinWithSpring}
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
  );
};

export default Login;
