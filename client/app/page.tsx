"use client";
import FromAddPost from "@/components/From/FromAddPost";
import "../style/user.scss";
import Header from "@/components/User/Header";
import { Post, User, Comment } from "@/interface";
import { getAllPost, updatePostLikes } from "@/service/post.service";
import { getLocal, saveLocal } from "@/store/reducers/Local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { followUser, getAllUser } from "@/service/user.service";
import { formatDate } from "@/utils/fomatDate";
import Swal from "sweetalert2";
import {
  fetchCommentsByPostId,
  addCommentToPost,
} from "@/store/reducers/commentReducer";

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
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [colorLike, setColorLike] = useState<{ [key: number]: boolean }>({});
  const [newComment, setNewComment] = useState<string>("");
  const [postComments, setPostComments] = useState<{
    [key: number]: Comment[];
  }>({});

  const listPost: Post[] = useSelector((state: any) => state.post.post);
  const listUser: User[] = useSelector((state: any) => state.user.user);
  const comments: Comment[] = useSelector(
    (state: any) => state.comment.comment
  );
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
    if (loggedInUser && listUser.length > 0 && listPost.length > 0) {
      const nonLoggedInUsers = listUser.filter(
        (usr) =>
          usr.id !== loggedInUser.id &&
          !loggedInUser.requestFollowById.includes(usr.id)
      );
      const shuffledUsers = shuffleArray(nonLoggedInUsers);
      setFriendSuggestions(shuffledUsers.slice(0, 5));
  
      const visiblePosts = listPost
        .filter((post) => {
          if (post.status === true) {
            if (post.privacy == "0") {
              return true;
            } else if (post.privacy == "1") {
              return (
                loggedInUser.id === post.idUser ||
                loggedInUser.requestFollowById.includes(post.idUser)
              );
            }
          }
          return false;
        })
        .sort(
          (a: Post, b: Post) =>
            new Date(b.fullDate).getTime() - new Date(a.fullDate).getTime()
        );
  
      setFilteredPosts(visiblePosts);
  
      // Initialize the colorLike state
      const initialLikeStatus = visiblePosts.reduce((acc, post) => {
        acc[post.id] = post.like.includes(loggedInUser.id);
        return acc;
      }, {} as { [key: number]: boolean });
  
      setColorLike(initialLikeStatus);
    }
  }, [loggedInUser, listUser, listPost]);
  

  useEffect(() => {
    filteredPosts.forEach((post) => {
      dispatch(fetchCommentsByPostId(post.id)).then((result: any) => {
        if (result.meta.requestStatus === "fulfilled") {
          setPostComments((prevComments) => ({
            ...prevComments,
            [post.id]: result.payload,
          }));
        }
      });
    });
  }, [filteredPosts]);

  const handleShowFromUpPost = () => {
    setShowFromUpPost(true);
  };

  const handleClose = () => {
    setShowFromUpPost(false);
  };

  const handleAddFriend = async (targetUserId: number) => {
    if (loggedInUser) {
      try {
        // Gửi yêu cầu theo dõi
        const data: any = { targetUserId, userId: loggedInUser.id };
        await dispatch(followUser(data));

        // Cập nhật dữ liệu người dùng sau khi theo dõi thành công
        const updatedUser = {
          ...loggedInUser,
          requestFollowById: [...loggedInUser.requestFollowById, targetUserId],
        };

        // Cập nhật state với dữ liệu người dùng mới
        setLoggedInUser(updatedUser);

        // Lưu dữ liệu người dùng mới vào local storage
        saveLocal("loggedInUser", updatedUser);

        // Hiển thị thông báo thành công
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Đã theo dõi",
          showConfirmButton: false,
          timer: 1500,
        });
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

  const handleLike = async (postId: number) => {
    if (loggedInUser) {
      try {
        setColorLike((prevStatus) => ({
          ...prevStatus,
          [postId]: !prevStatus[postId], // Toggle like status
        }));
  
        const post = listPost.find((post) => post.id === postId);
        if (!post) return;
  
        const userId = loggedInUser.id;
        let updatedLikes = [...post.like];
  
        if (updatedLikes.includes(userId)) {
          updatedLikes = updatedLikes.filter((id) => id !== userId);
        } else {
          updatedLikes.push(userId);
        }
  
        await dispatch(updatePostLikes({ postId, like: updatedLikes }));
      } catch (error) {
        console.error("Error liking the post:", error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "An error occurred",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };
  

  //Comment
  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setNewComment(event.target.value);
  };

  const handleAddComment = async (postId: number) => {
    if (loggedInUser && newComment.trim()) {
      try {
        const response = await dispatch(
          addCommentToPost({ postId, text: newComment })
        );
        const addedComment = response.payload;

        setPostComments((prevComments) => ({
          ...prevComments,
          [postId]: [...(prevComments[postId] || []), addedComment],
        }));

        setNewComment("");
      } catch (error) {
        console.error("Lỗi khi thêm bình luận:", error);
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
                href={`/listFrend/${loggedInUser?.id}`}
                className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-lg"
              >
                <i className="fas fa-user-friends" /> Người theo dõi
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
            {filteredPosts.map((post: Post, index: number) => (
              <div className="bg-gray-700 p-4 rounded-lg mb-5" key={index}>
                <div className="flex items-center justify-between mb-3">
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
                            {post.privacy == "0"
                              ? "Công khai"
                              : post.privacy == "1"
                              ? "Người theo dõi"
                              : "Chỉ mình tôi"}
                          </p>
                        </div>
                      </div>
                    </div>
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
                <div className="flex justify-around gap-4 mt-4">
                  <button
                    onClick={() => handleLike(post.id)}
                    style={{
                      background: colorLike[post.id] ? "blue" : "",
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105 text-white`}
                  >
                    <i className="fas fa-thumbs-up text-lg"></i>
                    <span className="text-sm font-medium">Thích</span>
                    <p className="ml-2 text-sm font-medium">
                      {post.like.length}
                    </p>
                  </button>
                  <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
                    <i className="fas fa-comment text-lg"></i>
                    <span className="text-sm font-medium">Bình luận</span>
                  </button>

                  <button className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg shadow-md transition-transform transform hover:scale-105">
                    <i className="fas fa-share text-lg"></i>
                    <span className="text-sm font-medium">Chia sẻ</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
        {/* Friend Suggestions */}
        <aside className="w-1/5 bg-gray-800 p-5 rounded-lg">
          <h3 className="font-bold text-xl mb-3">Gợi ý kết bạn</h3>
          {friendSuggestions.map((friend: User) => (
            <div
              key={friend.id}
              className="flex justify-between mb-5 items-center"
            >
              <Link
                href={`/profile/${friend.id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={
                    friend.avatar ||
                    "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                  }
                  alt={friend.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <p>{friend.name}</p>
              </Link>
              <button
                className="bg-blue-500 text-gray-200 px-4 py-2 rounded-lg"
                onClick={() => handleAddFriend(friend.id)}
              >
                Theo dõi
              </button>
            </div>
          ))}
          {/* Online Friends */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="font-bold text-xl mb-3">Bạn bè trực tuyến</h3>
            <ul>
              <li className="flex items-center mb-3">
                <div className="relative flex items-center">
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                    alt="User 2"
                    className="w-10 h-10 rounded-full mr-3"
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
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="absolute -bottom-1 left-7 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800" />
                  <p>Mai Hương</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
      {showFromUpPost && <FromAddPost close={handleClose} />}
    </div>
  );
}
