import React, { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const User = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [id, setId] = useState(null);
  const [user, setUser] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    website: "",
  });
  const { name, username, email, phone, website } = user;

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    const { data } = await supabase.from("users").select();
    data.sort((a, b) => a.id - b.id);
    setUsers(data);
  }

  async function createUser() {
    await supabase
      .from("users")
      .insert([{ name, username, email, phone, website }])
      .single();
    setUser({ name: "", username: "", email: "", phone: "", website: "" });
    fetchUsers();
    setShowModal(false);
  }

  async function deleteUser(id) {
    await supabase.from("users").delete().eq("id", id);
    setUsers(users.filter((user) => user.id !== id));
  }

  const openModal = (id) => {
    setShowUpdateModal(true);
    setId(id);
    users.filter((user) => {
      if (user.id === id) {
        setUser({
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
        });
      }
    });
  };

  async function updateUser() {
    await supabase
      .from("users")
      .upsert({ name, username, email, phone, website, id });
    fetchUsers();
    setShowUpdateModal(false);
  }

  return (
    <>
      <button
        className="float-right border-2 bg-green-600 p-2 rounded-xl focus:outline-none ring-1 hover:bg-green-500 "
        onClick={(e) => setShowModal(true)}
      >
        + Add
      </button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Create User</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form>
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full border-2 p-2 mt-2 rounded"
                      value={name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                    <div className="flex justify-between">
                      <input
                        type="text"
                        className="w-1/1 border-2 p-2 mt-2 rounded"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                          setUser({ ...user, username: e.target.value })
                        }
                      />
                      <input
                        type="email"
                        className="w-full border-2 mt-2 p-2 rounded ml-2"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-between">
                      <input
                        type="number"
                        placeholder="Phone"
                        className="w-1/2 border-2 mt-2 p-2 rounded"
                        value={phone}
                        onChange={(e) =>
                          setUser({ ...user, phone: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Website"
                        className="w-full border-2 mt-2 p-2 rounded ml-2"
                        value={website}
                        onChange={(e) =>
                          setUser({ ...user, website: e.target.value })
                        }
                      />
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={createUser}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
      <table className="table-auto w-full">
        <thead className="bg-gray-700 h-12 text-cyan-50">
          <tr className="">
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Website</th>
            <th>Update</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className="border-2 rounded-sm text-center">
          {users &&
            users.map((item) => (
              <tr key={item.id} className="bg-gray-300 border-4">
                <td>{item.name}</td>
                <td>{item.username}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.website}</td>
                <td>
                  <button
                    onClick={() => openModal(item.id)}
                    className="bg-green-600 p-2 rounded-xl"
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button
                    className="bg-red-700 rounded-xl p-2"
                    onClick={() => deleteUser(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {showUpdateModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Update User</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form>
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full border-2 p-2 mt-2 rounded"
                      value={name}
                      onChange={(e) =>
                        setUser({ ...user, name: e.target.value })
                      }
                    />
                    <div className="flex justify-between">
                      <input
                        type="text"
                        className="w-1/1 border-2 p-2 mt-2 rounded"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                          setUser({ ...user, username: e.target.value })
                        }
                      />
                      <input
                        type="email"
                        className="w-full border-2 mt-2 p-2 rounded ml-2"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="flex justify-between">
                      <input
                        type="number"
                        placeholder="Phone"
                        className="w-1/2 border-2 mt-2 p-2 rounded"
                        value={phone}
                        onChange={(e) =>
                          setUser({ ...user, phone: e.target.value })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Website"
                        className="w-full border-2 mt-2 p-2 rounded ml-2"
                        value={website}
                        onChange={(e) =>
                          setUser({ ...user, website: e.target.value })
                        }
                      />
                    </div>
                  </form>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => updateUser(user.id)}
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default User;
