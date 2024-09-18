"use client";
import { User } from "@/interface";
import { getAllUser } from "@/service/user.service";
import { getLocal } from "@/store/reducers/Local";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function FromNotification() {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const listUser: User[] = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(getAllUser());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);


  return (
    <div className="absolute z-50 right-[90px] p-4 bg-gray-800 w-[550px] rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Thông báo</h2>
      {loggedInUser?.requestFollowById.map((item: any, index: number) => {
        const user = listUser.find((u) => u.id === item);
        if (!user) return null;
        return (
          <div
            key={index}
            className="bg-gray-800 p-4 mb-3 rounded-lg flex items-center justify-between shadow-md"
          >
            <div className="flex items-center gap-2">
              <Link href={`/profile/${user.id}`}>
                <img
                  src={
                    user.avatar ||
                    "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
                />
              </Link>
              <div>
                <p className="font-semibold">
                  <b>{user.name}</b> đã gửi cho bạn lời mời kết bạn.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Xác nhận
              </button>
              <button className="px-4 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">
                Xóa
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
