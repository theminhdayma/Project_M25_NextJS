"use client";
import FromAddPost from "@/components/From/FromAddPost";
import "../style/user.scss";
import Header from "@/components/User/Header";
import { Post, User } from "@/interface";
import { createPost, getAllPost } from "@/service/post.service";
import { getLocal } from "@/store/reducers/Local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showFromUpPost, setShowFromUpPost] = useState<boolean>(false);
  const listPost: Post[] = useSelector((state: any) => state.post.post);
  const dispatch = useDispatch();
  const [newPost, setNewPost] = useState({ name: "", detail: "", images: [] });

  useEffect(() => {
    dispatch(getAllPost());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewPost((prevPost) => ({
      ...prevPost,
      [name]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (newPost.detail) {
      dispatch(createPost(newPost));
      setNewPost({ name: "Nguyễn Thế Minh", detail: "", images: [] }); // Reset form
    }
  };

  const handleShowFromUpPost = () => {
    setShowFromUpPost(true);
  };

  const handleClose = () => {
    setShowFromUpPost(false);
  };
  return (
    <div className="bg-gray-900 text-gray-200 font-sans">
      <Header />
      {/* Main Content */}
      <div className="container flex justify-between mt-5 gap-10 relative">
        {/* Sidebar Left */}
        <aside className="w-1/5 bg-gray-800 p-5 rounded-lg">
          <Link href={"/profile"} className="flex items-center gap-2 mb-5">
            <img
              src={
                loggedInUser?.avatar ||
                "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
              }
              alt={loggedInUser?.name}
              className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
            />
            <p>{loggedInUser?.name}</p>
          </Link>
          {/* Search bar */}
          <div className="relative flex items-center bg-gray-700 rounded-full px-4 py-2">
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              className="bg-transparent border-none text-gray-200 w-full focus:outline-none"
            />
            <i className="fas fa-search absolute right-4 text-gray-400" />
          </div>
          <ul>
            <li className="mb-3">
              <Link
                href="/list-frend"
                className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-lg"
              >
                <i className="fas fa-user-friends" /> Bạn bè
              </Link>
            </li>
            <li className="mb-3">
              <Link
                href="group"
                className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-lg"
              >
                <i className="fas fa-users" /> Nhóm
              </Link>
            </li>
          </ul>
        </aside>
        {/* Feed */}
        <section className="w-3/5 bg-gray-800 p-5 rounded-lg overflow-auto max-h-[780px]">
          {/* Stories */}
          <div className="flex gap-4 mb-5">
            <div className="w-24 h-36 bg-gray-700 rounded-lg overflow-hidden relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="Story 1"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                <p>Tạo tin</p>
              </div>
            </div>
            <div className="w-24 h-36 bg-gray-700 rounded-lg overflow-hidden relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="Story 1"
                className="w-full h-full object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                Trường Loan
              </p>
            </div>
            <div className="w-24 h-36 bg-gray-700 rounded-lg overflow-hidden relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="Story 2"
                className="w-full h-full object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                Phùng Lan
              </p>
            </div>
            <div className="w-24 h-36 bg-gray-700 rounded-lg overflow-hidden relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="Story 3"
                className="w-full h-full object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                Cristiano Ronaldo
              </p>
            </div>
          </div>
          <div className="mb-5">
            <div className="w-full flex gap-2">
              <Link href={"/profile"}>
                <img
                  src={
                    loggedInUser?.avatar ||
                    "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                  }
                  alt={loggedInUser?.name}
                  className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                />
              </Link>
              <button
                onClick={handleShowFromUpPost}
                className="w-full h-[50px] p-3 mb-3 bg-gray-700 text-gray-200"
              >
                Bạn đang nghĩ gì ?
              </button>
            </div>
          </div>

          {/* Post */}
          <div>
            {listPost.map((post: Post, index: number) => (
              <div className="bg-gray-700 p-4 rounded-lg mb-5" key={index}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <img
                      src={post.avatarUser}
                      alt={post.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <h4>{post.name}</h4>
                  </div>
                  <span className="text-sm text-gray-400">23 giờ trước</span>
                </div>
                <p className="mb-3">{post.detail}</p>
                {post.images.length > 0 && (
                  <img
                    src={post.images[0]}
                    alt="Post Image"
                    className="w-full h-auto rounded-lg mb-3"
                  />
                )}
                <div className="flex justify-around">
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <i className="fas fa-thumbs-up" /> Thích
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <i className="fas fa-comment" /> Bình luận
                  </button>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <i className="fas fa-share" /> Chia sẻ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Sidebar Right */}
        <aside className="w-1/5 bg-gray-800 p-5 rounded-lg">
          <h3 className="text-xl mb-3">Bạn bè trực tuyến</h3>
          <ul>
            <li className="flex items-center mb-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="User 2"
                className="w-10 h-10 rounded-full mr-3"
              />
              <p>Đinh Hà</p>
            </li>
            <li className="flex items-center mb-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="User 3"
                className="w-10 h-10 rounded-full mr-3"
              />
              <p>Mai Hương</p>
            </li>
          </ul>
        </aside>
        {showFromUpPost && (
         <FromAddPost close={handleClose} />
        )}
      </div>
    </div>
  );
}
