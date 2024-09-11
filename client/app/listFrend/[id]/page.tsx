"use client";

import Header from "@/components/User/Header";
import { User } from "@/interface";
import { getAllUser } from "@/service/user.service";
import { getLocal } from "@/store/reducers/Local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ListFrend = () => {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [friendsPerPage, setFriendsPerPage] = useState(5); // State for friends per page

  const listUser: User[] = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(getAllUser());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  // Filter friends by search term
  const friends = listUser
    .filter((user) => loggedInUser?.listFrend.includes(user.id))
    .filter((friend) =>
      friend.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate the index of the first and last friend on the current page
  const indexOfLastFriend = currentPage * friendsPerPage;
  const indexOfFirstFriend = indexOfLastFriend - friendsPerPage;
  const currentFriends = friends.slice(indexOfFirstFriend, indexOfLastFriend);

  // Function to handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to handle change in number of friends per page
  const handleFriendsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFriendsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when friendsPerPage changes
  };

  return (
    <>
      <Header />
      <div className="bg-gray-900 min-h-screen text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Tất cả bạn bè</h1>
        {/* Search input */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Tìm kiếm bạn bè..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {/* Render filtered friends list */}
          {currentFriends.map((friend) => (
            <div
              key={friend.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <Link href={`/profile/${friend.id}`}>
                <img
                  src={
                    friend.avatar ||
                    "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                  }
                  alt={friend.name}
                  className="rounded-lg w-full h-[200px] object-cover mb-4"
                />
              </Link>
              <h2 className="text-lg font-semibold">{friend.name}</h2>
              <p className="text-gray-400 mb-4">
                {friend.biography[0]?.workplace || "Không có thông tin"}
              </p>
              <div className="flex justify-between gap-2">
                <button className="bg-blue-500 text-[14px] p-2 text-white rounded-lg">
                  Xem chi tiết
                </button>
                <button className="bg-gray-600 text-[14px] p-2 text-white rounded-lg">
                  Hủy kết bạn
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="w-full p-3 flex justify-end items-center gap-2 mt-4">
          {/* Friends per page dropdown */}
          <select
            className="border border-gray-800 p-2 bg-gray-700 text-white"
            name="friendsPerPage"
            id="friendsPerPage"
            value={friendsPerPage}
            onChange={handleFriendsPerPageChange}
          >
            <option value="5">5 bản ghi</option>
            <option value="10">10 bản ghi</option>
            <option value="15">15 bản ghi</option>
            <option value="20">20 bản ghi</option>
          </select>
          
          {/* Page number buttons */}
          <div className="flex gap-2">
            {Array.from(
              Array(Math.ceil(friends.length / friendsPerPage)).keys()
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
    </>
  );
};

export default ListFrend;
