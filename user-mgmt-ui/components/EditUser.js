import { Dialog, Transition } from "@headlessui/react";
import { React, useState, useEffect, Fragment } from "react";
import Cookie from 'js-cookie';
import { InputField } from "./InputField";
import { JwtTokenContext } from "../providers/JwtSessionProviders";
import { useContext } from "react";

const EditUser = ({ userId, applyEditUser, showModal ,closeEditModal}) => {
  const USER_API_BASE_URL = "http://localhost:8080/api/v1/users";
  const {accessToken} = useContext(JwtTokenContext);
  const [errors,setErrors] = useState({});
  const [user, setUser] = useState({
    id: "",
    username: "",
    password: "",
    email: "",
    role:""
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(USER_API_BASE_URL + "/" + userId, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Authorization': "Bearer " + accessToken
          },
        });
        const _user = await response.json();
        setUser(_user);
      } catch (error) {
        console.log(error);
      }
    };
    if (userId) {
      fetchData();
    }
  }, [userId]);



  const setValue = (name,value) => {
    setUser({ ...user, [name]: value });
  };
  

  const updateUser = async (e) => {
    e.preventDefault();
    const response = await fetch(USER_API_BASE_URL + "/" + userId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': "Bearer " + accessToken
      },
      body: JSON.stringify(user),
    });
    
    const data = await response.json();

    if (!response.ok) {
      console.log(data.errors)
      setErrors({...errors,...data.errors});
      return;
    }
    applyEditUser(data);
  };

  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={closeEditModal}>
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
                Update User
              </Dialog.Title>
              <div className="flex max-w-md max-auto">
                <div className="py-2">

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

                  <div className="h-14 my-4 space-x-4 pt-4">
                    <button
                      onClick={updateUser}
                      className="rounded text-white font-semibold bg-green-400 hover:bg-green-700 py-2 px-6">
                      Update
                    </button>
                    <button
                      onClick={closeEditModal}
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
  );
};

export default EditUser;
