"use client";
import { User } from "@/interface";
import { block, getAllUser, unblock } from "@/service/user.service";
import { getLocal } from "@/store/reducers/Local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ListUser() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const listUser: User[] = useSelector((state: any) => state.user.user);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [sortOrder, setSortOrder] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState(""); 
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllUser());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  // Handle Block and Unblock actions
  const handleBlock = (userId: number) => {
    dispatch(block(userId));
  };

  const handleUnblock = (userId: number) => {
    dispatch(unblock(userId));
  };

  const listUsers = listUser.filter(
    (user: User) => user.id !== loggedInUser?.id
  );

  const filteredUsers = listUsers
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (visibilityFilter === "" ||
          (visibilityFilter === "hidden" ? !user.status : user.status))
    )
    .sort((a, b) => {
      if (sortOrder === "newest") {
        return a.name.localeCompare(b.name);
      } else if (sortOrder === "oldest") {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

  // Handle pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Handle change for users per page
  const handleUsersPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setUsersPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing per page count
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
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
            />
            <button type="submit" className="search-btn">
              <i className="bx bx-search" />
            </button>
          </div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-gray-700 text-white border border-gray-800 p-2"
          >
            <option value="">Sắp xếp theo tên</option>
            <option value="newest">Từ A - Z</option>
            <option value="oldest">Từ Z - A</option>
          </select>
          <select
            value={visibilityFilter}
            onChange={(e) => setVisibilityFilter(e.target.value)}
            className="bg-gray-700 text-white border border-gray-800 p-2"
          >
            <option value="">Tất cả</option>
            <option value="hidden">Bị chặn</option>
            <option value="visible">Không bị chặn</option>
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
              <h3>Danh sách người dùng</h3>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Chức Vụ</th>
                  <th>Giới tính</th>
                  <th>Người theo dõi</th>
                  <th>Bạn bè</th>
                  <th>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <img
                        src={
                          user?.avatar ||
                          "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                        }
                        alt={user?.name}
                        className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                      />
                    </td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role === 0 ? "Admin" : "User"}</td>
                    <td>{user.gender}</td>
                    <td>{user.requestFollowById.length}</td>
                    <td>{user.listFrend.length}</td>
                    <td>
                      {user.role === 0 ? (
                        "Không có quyền"
                      ) : (
                        <div>
                          {user.status ? (
                            <button
                              className="bg-red-500 text-white p-2 rounded"
                              onClick={() => handleBlock(user.id)}
                            >
                              Block
                            </button>
                          ) : (
                            <button
                              className="bg-green-500 text-white p-2 rounded"
                              onClick={() => handleUnblock(user.id)}
                            >
                              Unblock
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="w-full p-3 flex justify-end items-center gap-2 mt-4">
              <select
                className="border border-gray-800 p-2 bg-gray-700 text-white"
                name="usersPerPage"
                value={usersPerPage}
                onChange={handleUsersPerPageChange}
              >
                <option value="5">5 bản ghi</option>
                <option value="10">10 bản ghi</option>
                <option value="15">15 bản ghi</option>
                <option value="20">20 bản ghi</option>
              </select>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from(
                  Array(Math.ceil(filteredUsers.length / usersPerPage)).keys()
                ).map((number, index) => (
                  <button
                    key={index}
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
