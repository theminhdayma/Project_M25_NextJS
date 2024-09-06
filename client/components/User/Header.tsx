"use client";
import { User } from "@/interface";
import { getAllUser } from "@/service/user.service";
import { getLocal } from "@/store/reducers/Local";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Header() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const dispatch = useDispatch();

  // Lấy tất cả tài khoản khi component được render
  useEffect(() => {
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  console.log(loggedInUser);
  
  return (
    <>
      <header className="bg-gray-800 py-3 sticky top-0 z-50 border-b border-gray-600">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-3xl text-blue-500 flex items-center">
            <i className="fab fa-facebook-f" />
          </div>
          {/* Search bar */}
          <div className="relative flex items-center bg-gray-700 rounded-full px-4 py-2 w-80">
            <input
              type="text"
              placeholder="Tìm kiếm trên Facebook"
              className="bg-transparent border-none text-gray-200 w-full focus:outline-none"
            />
            <i className="fas fa-search absolute right-4 text-gray-400" />
          </div>
          {/* Navbar */}
          <nav>
            <ul className="flex gap-8">
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center text-lg hover:text-blue-500"
                >
                  <i className="fas fa-home" />
                  <span className="text-sm mt-1">Trang chủ</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center text-lg hover:text-blue-500"
                >
                  <i className="fas fa-user-friends" />
                  <span className="text-sm mt-1">Bạn bè</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center text-lg hover:text-blue-500"
                >
                  <i className="fas fa-users" />
                  <span className="text-sm mt-1">Nhóm</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center text-lg hover:text-blue-500"
                >
                  <i className="fas fa-video" />
                  <span className="text-sm mt-1">Video</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex flex-col items-center text-lg hover:text-blue-500"
                >
                  <i className="fas fa-bell" />
                  <span className="text-sm mt-1">Thông báo</span>
                </a>
              </li>
            </ul>
          </nav>
          {/* User Menu */}
          <div className="flex items-center gap-4 cursor-pointer">
            <img
              src="https://imagev3.vietnamplus.vn/w1000/Uploaded/2024/mzdic/2022_05_29/realvodich1.jpg.webp"
              alt="User"
              className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
            />
            <i className="fas fa-caret-down" />
          </div>
        </div>
      </header>
    </>
  );
}
