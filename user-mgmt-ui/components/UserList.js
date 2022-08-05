import { React, useState, useEffect } from "react";
import EditUser from "./EditUser";
import User from "./User";
import Cookie from 'js-cookie';

const UserList = ({ user }) => {
  const USER_API_BASE_URL = "http://localhost:8080/api/v1/users";
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [responseUser, setResponseUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const xsrf = Cookie.get('XSRF-TOKEN');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(USER_API_BASE_URL, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const users = await response.json();
        setUsers(users);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [user, responseUser]);

  const deleteUser = (e, id) => {
    e.preventDefault();
    fetch(USER_API_BASE_URL + "/" + id, {
      method: "DELETE",
    }).then((res) => {
      if (users) {
        setUsers((prevElement) => {
          return prevElement.filter((user) => user.id !== id);
        });
      }
    });
  };

  const editUser = (e, id) => {
    e.preventDefault();
    setUserId(id);
    setShowModal(true)
  };

  const applyEditUser = (edittedUser) =>{
    setResponseUser(edittedUser);
    setShowModal(false);
  }
  const closeEditModal =() => {
    console.log("close")
    setShowModal(false);
    
  }

  return (
    <>
      <div className="container mx-auto my-8">
        <div className="flex shadow border-b">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left font-medium text-gray-500 uppercase tracking-wide py-3 px-6">
                  Username
                </th>
                <th className="text-left font-medium text-gray-500 uppercase tracking-wide py-3 px-6">
                  Email
                </th>
                <th className="text-left font-medium text-gray-500 uppercase tracking-wide py-3 px-6">
                  Role
                </th>
                <th className="text-right font-medium text-gray-500 uppercase tracking-wide py-3 px-6">
                  Actions
                </th>
              </tr>
            </thead>
            {!loading && (
              <tbody className="bg-white">
                {users?.map((user) => (
                  <User
                    user={user}
                    key={user.id}
                    deleteUser={deleteUser}
                    editUser={editUser}
                  />
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      {
        showModal &&
        <EditUser userId={userId} applyEditUser={applyEditUser} showModal={showModal} closeEditModal={closeEditModal}/>
      }
    </>
  );
};

export default UserList;
