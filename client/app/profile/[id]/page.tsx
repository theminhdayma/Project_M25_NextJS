"use client";
import FromAddPost from "@/components/From/FromAddPost";
import FromUpdateProfile from "@/components/From/FromUpdateProfile";
import Header from "@/components/User/Header";
import { BiographyEntry, Post, User } from "@/interface";
import { getAllPost } from "@/service/post.service";
import { getAllUser } from "@/service/user.service";
import { getLocal } from "@/store/reducers/Local";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Profile = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const listPost: Post[] = useSelector((state: any) => state.post.post);
  const [showFromUpPost, setShowFromUpPost] = useState<boolean>(false);
  const [showUpPost, setShowUpPost] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(true);
  const listUser: User[] = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const params = useParams();

  useEffect(() => {
    dispatch(getAllPost());
    dispatch(getAllUser());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
      if (user.id === +params.id) {
        setShowUpPost(true);
        setShowUpdate(true);
        setShowAdd(false);
      }
    }
  }, [dispatch]);

  const listPostUser = listPost.filter(
    (post: Post) => post.idUser === +params.id
  );
  const userProfile = listUser.find((user: User) => user.id === +params.id);

  const handleShowFromUpPost = () => setShowFromUpPost(true);
  const handleClose = () => setShowFromUpPost(false);
  const handleEditProfile = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);

  return (
    <>
      <Header />
      <div className="w-full bg-gray-900 text-white">
        {/* Cover Photo Section */}
        <div className="relative w-full h-80 bg-gray-800">
          <img
            className="w-full h-full object-cover"
            src={userProfile?.banner}
            alt={userProfile?.name}
          />
        </div>

        <div className="relative mx-auto -mt-16 w-11/12 lg:w-10/12 px-6 lg:px-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 flex justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <img
                  src={userProfile?.avatar}
                  alt={userProfile?.name}
                  className="rounded-full w-24 h-24 lg:w-32 lg:h-32 border-4 border-white object-cover"
                />
                <div>
                  <h1 className="text-xl lg:text-3xl font-bold text-white">
                    {userProfile?.name}
                  </h1>
                  <p className="text-sm lg:text-base text-gray-300">
                    {userProfile?.listFrend.length} bạn bè
                  </p>
                </div>
              </div>
              {showAdd && (
                <div className="mt-4 flex space-x-3">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    Thêm Bạn Bè
                  </button>
                  <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
                    Nhắn Tin
                  </button>
                </div>
              )}
            </div>
            {showUpdate && (
              <button
                onClick={handleEditProfile}
                className="font-semibold h-[30px] bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex justify-center items-center  hover:bg-gray-400"
              >
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>
        {/* Main Content */}
        <section className="relative top-8 flex flex-col lg:flex-row gap-6 px-6 lg:px-8">
          {/* Sidebar: Introduction */}
          <div className="lg:w-1/3 bg-gray-800 text-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>
            <ul className="space-y-4 text-sm lg:text-base">
              <li className="flex items-center space-x-3">
                <i className="fa-solid fa-briefcase text-blue-400"></i>
                <span>{userProfile?.biography[0].school}</span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fa-solid fa-briefcase text-blue-400"></i>
                <span>{userProfile?.biography[0].workplace}</span>
              </li>
            </ul>
          </div>
          <div className="lg:w-2/3">
            {showUpPost && (
              <div className="mb-6 bg-gray-800 rounded-lg p-4">
                <div className="flex gap-3">
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
                    className="flex-grow h-12 bg-gray-700 text-gray-200 rounded-lg text-left pl-4"
                  >
                    Bạn đang nghĩ gì?
                  </button>
                </div>
              </div>
            )}

            {/* User Posts */}
            <div className="space-y-6 overflow-auto max-h-[780px]">
              {listPostUser.map((post: Post, index: number) => (
                <div key={index} className="bg-gray-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <Link href={`/profile/${post.idUser}`}>
                        <img
                          src={
                            loggedInUser?.avatar ||
                            "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                          }
                          alt={loggedInUser?.name}
                          className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                        />
                      </Link>
                      <h4 className="text-lg font-semibold">{post.name}</h4>
                    </div>
                    <span className="text-sm text-gray-400">23 giờ trước</span>
                  </div>
                  <p className="mb-3">{post.detail}</p>
                  {post.images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {post.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Post Image ${index + 1}`}
                          className="w-full h-auto rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex justify-around mt-4">
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
          </div>
        </section>
      </div>

      {/* Form to Add Post */}
      {showFromUpPost && <FromAddPost close={handleClose} />}
      {showEditModal && <FromUpdateProfile close={closeEditModal} />}
    </>
  );
};

export default Profile;
