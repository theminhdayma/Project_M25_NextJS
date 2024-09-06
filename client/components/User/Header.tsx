"use client";
import { User } from "@/interface";
import { deleteLocal, getLocal } from "@/store/reducers/Local";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  // Lấy tài khoản đăng nhập từ Local Storage khi component render
  useEffect(() => {
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  // Hàm xử lý khi chọn một option trong menu
  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;

    if (selectedOption === "profile") {
      // Điều hướng đến trang cá nhân
      router.push(`/profile/${loggedInUser?.id}`);
    } else if (selectedOption === "logout") {
      deleteLocal("loggedInUser");
      router.push("/login");
    }
  };

  return (
    <>
      <header className="bg-gray-800 py-3 sticky top-0 z-50 border-b border-gray-600">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="text-3xl text-blue-500 flex items-center gap-4">
            <i className="fab fa-facebook-f" />
            <p className="font-sans">FACEBOOK</p>
          </div>
          {/* Navbar */}
          <nav>
            <ul className="flex gap-24">
              <li>
                <a
                  href="#"
                  className="h-full flex items-center justify-center gap-2 text-[26px] text-lg hover:text-blue-500"
                >
                  <i className="fas fa-home" />
                  <span className="text-sm mt-1">Trang chủ</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="h-full flex items-center justify-center gap-2 text-[26px] text-lg hover:text-blue-500"
                >
                  <i className="fas fa-user-friends" />
                  <span className="text-sm mt-1">Bạn bè</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="h-full flex items-center justify-center gap-2 text-[26px] text-lg hover:text-blue-500"
                >
                  <i className="fas fa-users" />
                  <span className="text-sm mt-1">Nhóm</span>
                </a>
              </li>     
              <li>
                <a
                  href="#"
                  className="h-full flex items-center justify-center gap-2 text-[26px] text-lg hover:text-blue-500"
                >
                  <i className="fas fa-bell" />
                  <span className="text-sm mt-1">Thông báo</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* User Menu */}
          {loggedInUser ? (
            <div className="flex items-center gap-4 cursor-pointer">
              <img
                src={
                  loggedInUser.avatar ||
                  "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                }
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
              />
              <select
                className="bg-gray-800 text-white p-2 rounded"
                onChange={handleOptionChange}
              >
                <option value="">{loggedInUser.name}</option>
                <option value="profile">Trang cá nhân</option>
                <option value="logout">Đăng xuất</option>
              </select>
              <i className="fas fa-caret-down" />
            </div>
          ) : (
            <div className="flex items-center gap-4 cursor-pointer">
              <Link href="/login" className="text-blue-500">
                Đăng nhập
              </Link>
              <Link href="/register" className="text-blue-500">
                Đăng ký
              </Link>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
