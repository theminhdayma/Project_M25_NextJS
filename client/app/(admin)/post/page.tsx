"use client";
import { Post, User } from "@/interface";
import Link from "next/link";
import { blockPost, getAllPost, unblockPost } from "@/service/post.service";
import { getLocal } from "@/store/reducers/Local";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "@/service/user.service";

export default function ListPost() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [privacyFilter, setPrivacyFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<string>(""); // State for sorting order
  const [visibilityFilter, setVisibilityFilter] = useState<string>(""); // State for visibility filter

  const listPost: Post[] = useSelector((state: any) => state.post.post);
  const listUser: User[] = useSelector((state: any) => state.user.user);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPost());
    dispatch(getAllUser());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  const getPrivacySetting = (privacy: string) => {
    switch (privacy) {
      case "0":
        return "Công khai";
      case "1":
        return "Người theo dõi";
      case "2":
        return "Chỉ mình tôi";
      default:
        return "Unknown";
    }
  };

  // Filter posts by search term, privacy setting, and visibility
  const filteredPosts = listPost.filter(
    (post) =>
      post.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (privacyFilter === "" || post.privacy === privacyFilter) &&
      (visibilityFilter === "" || (visibilityFilter === "hidden" ? post.status === false : post.status === true)) &&
      listUser.some((user) => user.id === post.idUser && user.role === 1) // Check role
  );

  // Sort posts based on the selected order
  const sortedPosts = filteredPosts.sort((a, b) => {
    const dateA = new Date(a.fullDate).getTime();
    const dateB = new Date(b.fullDate).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  // Get current posts for the page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleHidePost = (id: number) => {
    dispatch(blockPost(id));
  };

  const handleUnblockPost = (id: number) => {
    dispatch(unblockPost(id));
  };

  return (
    <div>
      <nav>
        <form
          className="w-[500px] flex gap-10"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-input">
            <input
              type="search"
              placeholder="Search by author..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="search-btn">
              <i className="bx bx-search" />
            </button>
          </div>
          <select
            value={privacyFilter}
            onChange={(e) => setPrivacyFilter(e.target.value)}
            className="bg-gray-700 text-white border border-gray-800 p-2"
          >
            <option value="">Quyền riêng tư</option>
            <option value="0">Công khai</option>
            <option value="1">Người theo dõi</option>
            <option value="2">Chỉ mình tôi</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-700 text-white border border-gray-800 p-2"
          >
            <option value="">Sắp xếp theo thời gian</option>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="bg-gray-700 text-white border border-gray-800 p-2"
          >
            <option value="">Tất cả</option>
            <option value="hidden">Đã bị ẩn</option>
            <option value="visible">Không bị ẩn</option>
          </select>
        </form>

        <Link
          href={`/profile/${loggedInUser?.id}`}
          className="profile flex justify-center items-center gap-3 font-bold text-xl"
        >
          <p>{loggedInUser?.name}</p>
          <img
            src={
              loggedInUser?.avatar ||
              "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
            }
            alt={loggedInUser?.name}
            className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
          />
        </Link>
      </nav>
      <div className="main">
        <div className="table-data">
          <div className="order">
            <div className="head">
              <h3>Danh sách bài viết</h3>
              <i className="bx bx-search" />
              <i className="bx bx-filter" />
            </div>
            <table>
              <thead>
                <tr>
                  <th>Tên người đăng</th>
                  <th>Nội dung</th>
                  <th>Thời gian đăng</th>
                  <th>Quyền riêng tư</th>
                  <th>Số lượng ảnh</th>
                  <th>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <Link
                        href={`/profile/${post.idUser}`}
                        className="flex items-center gap-3"
                      >
                        <img
                          src={
                            post.avatarUser ||
                            "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                          }
                          alt="User"
                          className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                        />
                        <p>{post.name}</p>
                      </Link>
                    </td>
                    <td>{post.detail}</td>
                    <td>{new Date(post.fullDate).toLocaleString()}</td>
                    <td>{getPrivacySetting(post.privacy)}</td>
                    <td>{post.images.length}</td>
                    <td>
                      {loggedInUser?.role === 0 &&
                        post.idUser !== loggedInUser?.id && (
                          <>
                            {post.status ? (
                              <button
                                className="w-[150px] bg-red-500 text-white p-2 rounded"
                                onClick={() => handleHidePost(post.id)}
                              >
                                Ẩn bài viết
                              </button>
                            ) : (
                              <button
                                className="w-[150px] bg-green-500 text-white p-2 rounded"
                                onClick={() => handleUnblockPost(post.id)}
                              >
                                Hiển thị bài viết
                              </button>
                            )}
                          </>
                        )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="w-full p-3 flex justify-end items-center gap-2 mt-4">
              <select
                className="border border-gray-800 p-2 bg-gray-700 text-white"
                name="postsPerPage"
                value={postsPerPage}
                onChange={(e) => setPostsPerPage(Number(e.target.value))}
              >
                <option value="5">5 bản ghi</option>
                <option value="10">10 bản ghi</option>
                <option value="15">15 bản ghi</option>
                <option value="20">20 bản ghi</option>
              </select>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from(
                  Array(Math.ceil(sortedPosts.length / postsPerPage)).keys()
                ).map((number) => (
                  <button
                    key={number}
                    className={`border border-gray-950 p-1 ${
                      currentPage === number + 1 ? "bg-gray-200 text-black" : ""
                    }`}
                    onClick={() => paginate(number + 1)}
                  >
                    {number + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
