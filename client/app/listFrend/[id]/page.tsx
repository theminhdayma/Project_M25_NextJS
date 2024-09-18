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
  const [followerPerPage, setFriendsPerPage] = useState(5); // State for follower per page

  const listUser: User[] = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(getAllUser());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  // Filter follower by search term
  const follower = listUser
    .filter((user) => loggedInUser?.followersById.includes(user.id))
    .filter((follower) =>
      follower.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Calculate the index of the first and last follower on the current page
  const indexOfLastFriend = currentPage * followerPerPage;
  const indexOfFirstFriend = indexOfLastFriend - followerPerPage;
  const currentFriends = follower.slice(indexOfFirstFriend, indexOfLastFriend);

  // Function to handle page change
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Function to handle change in number of follower per page
  const handleFriendsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFriendsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when followerPerPage changes
  };

  return (
    <>
      <Header />
      <div className="bg-gray-900 min-h-screen text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Tất cả người theo dõi</h1>
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
          {/* Render filtered follower list */}
          {currentFriends.map((follower) => (
            <div
              key={follower.id}
              className="bg-gray-800 p-4 rounded-lg shadow-lg"
            >
              <Link href={`/profile/${follower.id}`}>
                <img
                  src={
                    follower.avatar ||
                    "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                  }
                  alt={follower.name}
                  className="rounded-lg w-full h-[200px] object-cover mb-4"
                />
              </Link>
              <h2 className="text-lg font-semibold">{follower.name}</h2>
              <p className="text-gray-400 mb-4">
                {follower.biography[0]?.workplace || "Không có thông tin"}
              </p>
              <p className="text-gray-400 mb-4">
                {follower.followersById.length} người theo dõi
              </p>
              <div className="flex justify-between gap-2">
                <Link href={`/profile/${follower.id}`} className="w-full bg-blue-500 text-[18px] p-2 text-white rounded-lg flex justify-center items-center">
                  Xem chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="w-full p-3 flex justify-end items-center gap-2 mt-4">
          {/* Friends per page dropdown */}
          <select
            className="border border-gray-800 p-2 bg-gray-700 text-white"
            name="followerPerPage"
            id="followerPerPage"
            value={followerPerPage}
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
              Array(Math.ceil(follower.length / followerPerPage)).keys()
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
