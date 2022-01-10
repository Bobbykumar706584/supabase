import React, { useState, useEffect } from "react";
import Select from "react-select";
import { supabase } from "../utils/supabaseClient";

const Posts = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [id, setId] = useState(null);
  const [username, setUsername] = useState(null);
  const [users, setUsers] = useState(null);
  const [posts, setPosts] = useState([]);
  const [userSearch, setUserSearch] = useState(null);
  const [post, setPost] = useState({
    user_id: "",
    title: "",
    body: "",
    username: "",
  });
  const { title, body } = post;
  useEffect(() => {
    userdropdown();
    fetchPosts();
  }, []);
  async function fetchPosts() {
    const { data } = await supabase.from("posts").select();
    data.sort((a, b) => a.id - b.id);
    setPosts(data);
  }
  async function createComment() {
    await supabase
      .from("posts")
      .insert([{ user_id: username, title, body }])
      .single();
    setPost({ user_id: "", title: "", body: "" });
    fetchPosts();
    setShowModal(false);
  }
  async function userdropdown() {
    const { data } = await supabase.from("users").select();
    const arr = [];
    data.map((item) => {
      const obj = {
        value: item.id,
        label: item.username,
      };
      arr.push(obj);
    });
    setUsers(arr);
  }
  async function deletePost(id) {
    await supabase.from("posts").delete().eq("id", id);
    setPosts(posts.filter((post) => post.id !== id));
  }
  const openModal = (id) => {
    setShowUpdateModal(true);
    setId(id);
    posts.filter((post) => {
      if (post.id === id) {
        setPost({
          username: post.user_id,
          title: post.title,
          body: post.body,
        });
      }
    });
  };
  async function updatePost() {
    await supabase.from("posts").upsert({ id, user_id: username, title, body });
    fetchPosts();
    setShowUpdateModal(false);
  }
  const filterUser = (post) => {
    return userSearch === null || post.user_id === userSearch;
  };
  return (
    <>
      <button
        className="float-right border-2 bg-green-600 p-2 rounded-xl ring-1 focus:outline-none hover:bg-green-600"
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
                  <h3 className="text-3xl font-semibold">Add Post</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      ×
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form>
                    <Select
                      options={users}
                      defaultValue={username}
                      onChange={(a) => setUsername(a.value)}
                    />
                    <input
                      type="text"
                      className="w-full border-2 mt-2 p-2 rounded"
                      placeholder="Title"
                      value={title}
                      onChange={(e) =>
                        setPost({ ...post, title: e.target.value })
                      }
                    />
                    <textarea
                      placeholder="Body"
                      value={body}
                      className="w-full border-2 p-2 mt-2 rounded h-40"
                      onChange={(e) =>
                        setPost({ ...post, body: e.target.value })
                      }
                    />
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
                    onClick={createComment}
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
      <Select
        className="w-80"
        options={users}
        onChange={(a) => setUserSearch(a ? a.value : null)}
        isClearable={true}
        defaultValue={userSearch}
        placeholder={"All Users"}
      />
      <table className="table-auto w-full">
        <thead className="bg-gray-700 h-12 text-cyan-50">
          <th className="">Username</th>
          <th>Title</th>
          <th>Body</th>
          <th>Update</th>
          <th>Delete</th>
        </thead>
        <tbody className="border-2 rounded-sm text-center">
          {posts &&
            users &&
            posts.filter(filterUser).map((item) => (
              <tr key={item.id} className="bg-gray-300 border-4">
                <td>{users.find((a) => a.value === item.user_id).label}</td>
                <td>{item.title}</td>
                <td>{item.body}</td>
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
                    onClick={() => deletePost(item.id)}
                    className="bg-red-700 rounded-xl p-2"
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
                  <h3 className="text-3xl font-semibold">Update Post</h3>
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
                    <Select
                      options={users}
                      defaultValue={username}
                      onChange={(a) => setUsername(a.value)}
                    />
                    <input
                      type="text"
                      className="w-full border-2 mt-2 p-2 rounded"
                      placeholder="Title"
                      value={title}
                      onChange={(e) =>
                        setPost({ ...post, title: e.target.value })
                      }
                    />
                    <textarea
                      placeholder="Body"
                      value={body}
                      className="w-full border-2 p-2 mt-2 rounded h-40"
                      onChange={(e) =>
                        setPost({ ...post, body: e.target.value })
                      }
                    />
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
                    onClick={() => updatePost(post.id)}
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

export default Posts;
