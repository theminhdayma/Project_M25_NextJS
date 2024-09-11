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
import { friendRequest, getAllUser } from "@/service/user.service";
import { formatDate } from "@/utils/fomatDate";

// Function to shuffle an array
const shuffleArray = (array: any[]) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
};

export default function Home() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [showFromUpPost, setShowFromUpPost] = useState<boolean>(false);
  const [friendSuggestions, setFriendSuggestions] = useState<User[]>([]);
  const listPost: Post[] = useSelector((state: any) => state.post.post);
  const listUser: User[] = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(getAllPost());
    dispatch(getAllUser());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  useEffect(() => {
    if (listUser.length > 0 && loggedInUser) {
      const nonLoggedInUsers = listUser.filter(
        (user) =>
          user.id !== loggedInUser.id && 
          !loggedInUser.listFrend.includes(user.id) 
      );
      const shuffledUsers = shuffleArray(nonLoggedInUsers);
      setFriendSuggestions(shuffledUsers.slice(0, 5));
    }
  }, [listUser, loggedInUser]);

  const handleShowFromUpPost = () => {
    setShowFromUpPost(true);
  };

  const handleClose = () => {
    setShowFromUpPost(false);
  };

  const handleAddFriend = (friendId: number) => {
    if (loggedInUser) {
      dispatch(friendRequest({ friendId, userId: loggedInUser.id }));
    }
  };

  // const shuffledPosts = shufflePosts(listPost);
  const shuffledPosts = shuffleArray([...listPost]);

  return (
    <div className="relative bg-gray-900 text-gray-200 font-sans">
      <Header />
      {/* Main Content */}
      <div className="container flex justify-between mt-5 gap-10 relative">
        {/* Sidebar Left */}
        <aside className="w-1/5 bg-gray-800 p-5 rounded-lg flex flex-col gap-3">
          <Link
            href={`/profile/${loggedInUser?.id}`}
            className="flex items-center gap-2 mb-5"
          >
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
              <Link href={`/profile/${loggedInUser?.id}`}>
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
          <div>
            {shuffledPosts.map((post: Post, index: number) => (
              <div className="bg-gray-700 p-4 rounded-lg mb-5" key={index}>
                <div className=" flex items-center justify-between mb-3">
                  <div className="w-full flex justify-between">
                    <div className="flex items-center gap-3">
                      <Link href={`/profile/${post.idUser}`}>
                        <img
                          src={
                            post.avatarUser ||
                            "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                          }
                          alt={post.name}
                          className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                        />
                      </Link>
                      <div>
                        <h4>{post.name}</h4>
                        <div className="flex justify-center items-center gap-4">
                          <span className="text-sm text-gray-400">
                            {formatDate(post.fullDate)}
                          </span>
                          <p className="text-gray-400">
                            {post.privacy === 0
                              ? "Công khai"
                              : post.privacy === 1
                              ? "Bạn bè"
                              : "Chỉ mình tôi"}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Nút để báo cáo */}
                    <i className="fa-solid fa-ellipsis cursor-pointer" />
                  </div>
                </div>
                <p className="mb-3">{post.detail}</p>
                {post.images.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {post.images.map((image, idx) => (
                      <img
                        key={idx}
                        src={image}
                        alt={`Post Image ${idx + 1}`}
                        className="w-full h-[300px] rounded-lg mb-3 object-cover"
                      />
                    ))}
                  </div>
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
        <aside className="w-1/5 bg-gray-800 p-5 rounded-lg flex flex-col gap-[100px]">
          <div>
            <h3 className="text-xl mb-3">Gợi ý kết bạn</h3>
            <ul>
              {friendSuggestions.map((user: User, index: number) => (
                <li className="flex items-center mb-3" key={index}>
                  <Link
                    href={`/profile/${user.id}`}
                    className="w-[180px] flex items-center"
                  >
                    <img
                      src={
                        user.avatar ||
                        "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <p>{user.name}</p>
                  </Link>
                  <button
                    className="bg-blue-500 text-white px-1 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => handleAddFriend(user.id)}
                  >
                    Kết bạn
                  </button>
                </li>
              ))}
              {friendSuggestions.length === 0 && (
                <p className="text-gray-400">Không có gợi ý kết bạn.</p>
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-xl mb-3">Bạn bè trực tuyến</h3>
            <ul>
              <li className="flex items-center mb-3">
                <div className="relative flex items-center">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                    alt="User 2"
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <span className="absolute -bottom-1 left-7 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                  <p>Đinh Hà</p>
                </div>
              </li>
              <li className="flex items-center mb-3">
                <div className="relative flex items-center">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                    alt="User 3"
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <span className="absolute -bottom-1 left-7 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                  <p>Mai Hương</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
        {showFromUpPost && <FromAddPost close={handleClose} />}
      </div>
    </div>
  );
}
