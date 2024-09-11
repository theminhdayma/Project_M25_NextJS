"use client";
import { User } from "@/interface";
import { deleteLocal, getLocal } from "@/store/reducers/Local";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FromNotification from "../From/FromNotification";

export default function Header() {
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    } else {
      router.push("/login");
    }
  }, [dispatch]);

  const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = e.target.value;

    if (selectedOption === "profile") {
      router.push(`/profile/${loggedInUser?.id}`);
    } else if (selectedOption === "logout") {
      deleteLocal("loggedInUser");
      router.push("/login");
    }
  };

  const handleshowNotification = () => {
    setShowNotification(!showNotification);
  };

  return (
    <>
      <header className=" bg-gray-800 py-3 sticky top-0 z-50 border-b border-gray-600">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-3xl text-blue-500 flex items-center gap-4">
            <i className="fab fa-facebook-f" />
            <p className="font-sans">FACEBOOK</p>
          </div>
          <nav>
            <ul className="flex gap-24 text-white">
              <li>
                <Link
                  href={"/"}
                  className="h-full flex items-center justify-center gap-2 text-[26px] text-lg hover:text-blue-500"
                >
                  <i className="fas fa-home" />
                  <span className="text-sm mt-1">Trang chủ</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/listFrend/${loggedInUser?.id}`}
                  className="h-full flex items-center justify-center gap-2 text-[26px] text-lg hover:text-blue-500"
                >
                  <i className="fas fa-user-friends" />
                  <span className="text-sm mt-1">Bạn bè</span>
                </Link>
              </li>
              <li>
                <Link
                  href={`/listGroup/${loggedInUser?.id}`}
                  className="h-full flex items-center justify-center gap-2 text-[26px] text-lg hover:text-blue-500"
                >
                  <i className="fas fa-users" />
                  <span className="text-sm mt-1">Nhóm</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleshowNotification}
                  className="h-full flex items-center justify-center gap-2 text-[26px] text-lg hover:text-blue-500"
                >
                  <i className="fas fa-bell" />
                  <span className="text-sm mt-1">Thông báo</span>
                </button>
              </li>
            </ul>
          </nav>
          {loggedInUser ? (
            <div className="flex items-center gap-4 cursor-pointer">
              <Link href={`/profile/${loggedInUser.id}`}>
                <img
                  src={
                    loggedInUser.avatar ||
                    "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                />
              </Link>
              <select
                className="bg-gray-800 text-white p-2 rounded"
                onChange={handleOptionChange}
              >
                <option value="">{loggedInUser.name}</option>
                <option value="profile">Trang cá nhân</option>
                <option value="logout">Đăng xuất</option>
              </select>
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
      {showNotification && <FromNotification />}
    </>
  );
}
