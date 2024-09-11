"use client";
import { Post, User } from "@/interface";
import Link from "next/link";
import { getAllPost } from "@/service/post.service";
import { getLocal } from "@/store/reducers/Local";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUser } from "@/service/user.service";

export default function ListPost() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5); // Default posts per page
  const [searchTerm, setSearchTerm] = useState(""); // Search term for post author
  const listPost: Post[] = useSelector((state: any) => state.post.post);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPost());
    dispatch(getAllUser());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  const getPrivacySetting = (privacy: number) => {
    switch (privacy) {
      case 0:
        return "Công khai";
      case 1:
        return "Bạn bè";
      case 2:
        return "Chỉ mình tôi";
      default:
        return "Unknown";
    }
  };

  // Filter posts by search term
  const filteredPosts = listPost.filter((post) =>
    post.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get current posts for the page
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <nav>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Implement search functionality
          }}
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
                      <div className="flex items-center gap-3">
                        <img
                          src={post.avatarUser}
                          alt={post.name}
                          className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                        />
                        <p>{post.name}</p>
                      </div>
                    </td>
                    <td>{post.detail}</td>
                    <td>{new Date(post.fullDate).toLocaleString()}</td>
                    <td>{getPrivacySetting(post.privacy)}</td>
                    <td>{post.images.length}</td>
                    <td>
                      {loggedInUser?.role === 0 && post.idUser !== loggedInUser?.id && (
                        <button
                          className="bg-red-500 text-white p-2 rounded"
                          onClick={() => console.log(`Ẩn bài viết ${post.id}`)}
                        >
                          Ẩn bài viết
                        </button>
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
                  Array(Math.ceil(filteredPosts.length / postsPerPage)).keys()
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
