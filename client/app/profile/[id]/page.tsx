"use client";
import FromAddPost from "@/components/From/FromAddPost";
import FromUpdatePost from "@/components/From/FromUpdatePost";
import FromUpdateProfile from "@/components/From/FromUpdateProfile";
import Header from "@/components/User/Header";
import { Post, User } from "@/interface";
import { deletePost, getAllPost } from "@/service/post.service";
import { followUser, getAllUser } from "@/service/user.service";
import { getLocal, saveLocal } from "@/store/reducers/Local";
import { formatDate } from "@/utils/fomatDate";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import CryptoJS from "crypto-js";

const Profile = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const listPost: Post[] = useSelector((state: any) => state.post.post);
  const [showFromUpPost, setShowFromUpPost] = useState<boolean>(false);
  const [showUpPost, setShowUpPost] = useState<boolean>(false);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAdd, setShowAdd] = useState<boolean>(true);
  const [post, setPost] = useState<Post | null>(null);
  const [showFromUpdatePost, setShowFromUpdatePost] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState<boolean>();
  const [showSelect, setShowSelect] = useState<boolean>(false);
  const listUser: User[] = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch<any>();
  const params = useParams();

  useEffect(() => {
    dispatch(getAllPost());
    dispatch(getAllUser());
    const user: User = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
      if (user.id === +params.id) {
        setShowUpPost(true);
        setShowUpdate(true);
        setShowAdd(false);
        setShowSelect(true);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const profileUser = listUser.find((u) => u.id === +params.id);
    console.log(profileUser);

    if (profileUser && loggedInUser) {
      setIsFollowing(loggedInUser?.requestFollowById.includes(profileUser.id));
    }
  }, [listUser]);

  const listPostUser = listPost
    .filter((post: Post) => {
      if (!post.status) return false;
      if (post.idUser !== +params.id) return false;
      if (post.privacy === "0") return true;
      return (
        loggedInUser?.id === post.idUser ||
        loggedInUser?.requestFollowById.includes(post.idUser)
      );
    })
    .sort(
      (a: Post, b: Post) =>
        new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime()
    ); // Sort posts by fullDate descending

  const userProfile = listUser.find((user: User) => user.id === +params.id);

  const handleShowFromUpPost = () => setShowFromUpPost(true);
  const handleClose = () => setShowFromUpPost(false);
  const handleEditProfile = () => setShowEditModal(true);
  const closeEditModal = () => setShowEditModal(false);
  const handleShowFromUpdatePost = (post: Post) => {
    setPost(post);
    setShowFromUpdatePost(true);
  };

  const handleCloseFromUpdatePost = () => {
    setShowFromUpdatePost(false);
  };

  const handleDeletePost = (id: number) => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn xóa bài viết này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePost(id));
      }
    });
  };

  const handleChangePassword = () => {
    Swal.fire({
      title: "Nhập mật khẩu hiện tại",
      input: "password",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
      },
      showCancelButton: true,
      confirmButtonText: "Tiếp tục",
      showLoaderOnConfirm: true,
      preConfirm: (currentPassword) => {
        const bytes = CryptoJS.AES.decrypt(
          loggedInUser?.password || "",
          "secret_key"
        );
        const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
        console.log(decryptedPassword);

        if (currentPassword !== decryptedPassword) {
          Swal.showValidationMessage("Mật khẩu hiện tại không chính xác");
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Nhập mật khẩu mới",
          input: "password",
          inputAttributes: {
            autocapitalize: "off",
            autocorrect: "off",
            minlength: "8",
          },
          showCancelButton: true,
          confirmButtonText: "Đổi mật khẩu",
          showLoaderOnConfirm: true,
          preConfirm: (newPassword) => {
            if (newPassword.length < 8) {
              Swal.showValidationMessage("Mật khẩu phải có ít nhất 8 ký tự");
            }
            return newPassword;
          },
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "Xác nhận mật khẩu mới",
              input: "password",
              inputAttributes: {
                autocapitalize: "off",
                autocorrect: "off",
              },
              showCancelButton: true,
              confirmButtonText: "Xác nhận",
              showLoaderOnConfirm: true,
              preConfirm: (confirmPassword) => {
                if (confirmPassword !== result.value) {
                  Swal.showValidationMessage("Mật khẩu xác nhận không khớp");
                }
                return confirmPassword;
              },
            }).then((result) => {
              if (result.isConfirmed) {
                const encryptedPassword = CryptoJS.AES.encrypt(
                  result.value,
                  "secret_key"
                ).toString();
                if (loggedInUser) {
                  const updatedUser = {
                    ...loggedInUser,
                    password: encryptedPassword,
                  };
                  saveLocal("loggedInUser", updatedUser);
                  axios
                    .put(
                      `http://localhost:8080/users/${loggedInUser.id}`,
                      updatedUser
                    )
                    .then(() => {
                      setLoggedInUser(updatedUser);
                      setLoading(false);
                      Swal.fire({
                        title: "Thành công!",
                        text: "Mật khẩu đã được thay đổi thành công.",
                        icon: "success",
                      });
                    })
                    .catch((error) => {
                      console.error("Error updating password:", error);
                      setLoading(false);
                      Swal.fire("Error", "Failed to update password", "error");
                    });
                }
              }
            });
          }
        });
      }
    });
  };

  const handleAddFriend = async (targetUserId: number) => {
    if (loggedInUser) {
      try {
        const data = { targetUserId, userId: loggedInUser.id };
        await dispatch(followUser(data));
        const updatedLoggedInUser = {
          ...loggedInUser,
          requestFollowById: [...loggedInUser.requestFollowById, targetUserId],
        };
        setLoggedInUser(updatedLoggedInUser);
        saveLocal("loggedInUser", updatedLoggedInUser);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Đã theo dõi",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsFollowing(true);
      } catch (error) {
        console.error("Lỗi khi theo dõi người dùng:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Có lỗi xảy ra",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  const handleUnfollow = async (targetUserId: number) => {
    if (loggedInUser) {
      try {
        const data = { targetUserId, userId: loggedInUser.id };
        const updatedLoggedInUser = {
          ...loggedInUser,
          requestFollowById: loggedInUser.requestFollowById.filter(
            (id) => id !== targetUserId
          ),
        };
        setLoggedInUser(updatedLoggedInUser);
        saveLocal("loggedInUser", updatedLoggedInUser);
        await axios.put(
          `http://localhost:8080/users/${loggedInUser.id}`,
          updatedLoggedInUser
        );
        await axios.put(`http://localhost:8080/users/${targetUserId}`, {
          followersById: loggedInUser.requestFollowById,
        });
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Đã bỏ theo dõi",
          showConfirmButton: false,
          timer: 1500,
        });
        setIsFollowing(false);
      } catch (error) {
        console.error("Lỗi khi bỏ theo dõi người dùng:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Có lỗi xảy ra",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  return (
    <>
      <Header />
      <div className="w-full bg-gray-900 text-white">
        <div className=" w-full h-80 bg-gray-800">
          <img
            className="w-full h-full object-cover"
            src={
              userProfile?.banner ||
              "https://us.123rf.com/450wm/sedatseven/sedatseven1601/sedatseven160100036/51502027-m%C3%A0u-x%C3%A1m-%C4%91en-gradient-n%E1%BB%81n-tr%E1%BB%ABu-t%C6%B0%E1%BB%A3ng-d%E1%BB%B1ng-h%C3%ACnh-%C4%91%E1%BB%83-tr%C6%B0ng-b%C3%A0y-montage-s%E1%BA%A3n-ph%E1%BA%A9m-c%E1%BB%A7a-b%E1%BA%A1n.jpg?ver=6"
            }
            alt={userProfile?.name}
          />
        </div>
        <div className="relative mx-auto -mt-16 w-11/12 lg:w-10/12 px-6 lg:px-8">
          <div className="bg-gray-800 rounded-lg shadow-md p-6 flex justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <Link href={`/profile/${loggedInUser?.id}`}>
                  <img
                    src={
                      userProfile?.avatar ||
                      "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                    }
                    alt={userProfile?.name}
                    className="rounded-full w-24 h-24 lg:w-32 lg:h-32 border-4 border-white object-cover"
                  />
                </Link>
                <div>
                  <h1 className="text-xl lg:text-3xl font-bold text-white">
                    {userProfile?.name}
                  </h1>
                  <p className="text-sm lg:text-base text-gray-300">
                    {userProfile?.followersById.length} người theo dõi
                  </p>
                </div>
              </div>
              {showAdd && (
                <div className="mt-4 flex space-x-3">
                  {isFollowing ? (
                    <button
                      onClick={() => handleUnfollow(+params.id)}
                      className="px-4 py-2 text-white font-semibold rounded bg-red-600"
                    >
                      Hủy theo dõi
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(+params.id)}
                      className="px-4 py-2 text-white font-semibold rounded bg-blue-600"
                    >
                      Theo dõi
                    </button>
                  )}
                  <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
                    Nhắn Tin
                  </button>
                </div>
              )}
            </div>
            {showUpdate && (
              <div className="flex gap-2">
                <button
                  onClick={handleEditProfile}
                  className="font-semibold h-[30px] bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex justify-center items-center  hover:bg-gray-400"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleChangePassword}
                  className="font-semibold h-[30px] bg-gray-300 text-gray-800 px-4 py-2 rounded-lg flex justify-center items-center  hover:bg-gray-400"
                >
                  Đổi mật khẩu
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Main Content */}
        <section className="mt-[30px] flex flex-col lg:flex-row gap-6 px-6 lg:px-8">
          {/* Sidebar: Introduction */}
          <div className="lg:w-1/3 bg-gray-800 text-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Giới thiệu</h2>
            <ul className="space-y-4 text-sm lg:text-base">
              <li className="flex items-center space-x-3">
                <i className="fa-solid fa-briefcase text-blue-400"></i>
                <span>
                  {userProfile?.biography?.[0]?.school || "Chưa cập nhật"}
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <i className="fa-solid fa-briefcase text-blue-400"></i>
                <span>
                  {userProfile?.biography?.[0]?.workplace || "Chưa cập nhật"}
                </span>
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
              {listPostUser.length <= 0 ? (
                <h2 className="flex justify-center items-center text-[24px]">
                  Chưa có bài viết nào
                </h2>
              ) : (
                <div className="flex flex-col gap-[30px]">
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
                          <div>
                            <h4>{post.name}</h4>
                            <div className="flex justify-center items-center gap-4">
                              <span className="text-sm text-gray-400">
                                {formatDate(post.fullDate)}
                              </span>
                              <p className="text-gray-400">
                                {post.privacy == "0"
                                  ? "Công khai"
                                  : post.privacy == "1"
                                  ? "Người theo dõi"
                                  : "Chỉ mình tôi"}
                              </p>
                            </div>
                          </div>
                        </div>
                        {showSelect && (
                          <select
                            defaultValue={""}
                            className="bg-gray-700 text-white"
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "edit") {
                                handleShowFromUpdatePost(post);
                              } else if (value === "delete") {
                                handleDeletePost(post.id);
                              }
                            }}
                          >
                            <option value="">...</option>
                            <option value="edit">Chỉnh sửa bài viết</option>
                            <option value="delete">Xóa bài viết</option>
                          </select>
                        )}
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
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Form to Add Post */}
      {showFromUpPost && <FromAddPost close={handleClose} />}
      {showEditModal && <FromUpdateProfile close={closeEditModal} />}
      {showFromUpdatePost && (
        <FromUpdatePost post={post} close={handleCloseFromUpdatePost} />
      )}
    </>
  );
};

export default Profile;
