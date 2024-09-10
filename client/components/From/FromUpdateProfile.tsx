"use client";
import { BiographyEntry, User } from "@/interface";
import { getLocal } from "@/store/reducers/Local";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "@/service/user.service";
import { storage } from "@/config/firebase";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

interface Props {
  close: () => void;
}

export default function FromUpdateProfile({ close }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    avatar: "",
    banner: "",
    gender: "",
    workplace: "",
    school: "",
  });

  const dispatch = useDispatch<any>();

  useEffect(() => {
    const user: User = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
      
      setFormData({
        name: user.name || "",
        avatar: user.avatar || "",
        banner: user.banner || "",
        gender: user.gender || "",
        workplace: user.biography[0]?.workplace || "",
        school: user.biography[0]?.school || "",
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
      uploadBytes(storageRef, file).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          setFormData((prev) => ({ ...prev, [name]: downloadURL }));
        });
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loggedInUser) {

      const updatedData: any = {
        id: loggedInUser.id,
        name: formData.name,
        avatar: formData.avatar,
        banner: formData.banner,
        gender: formData.gender,
        biography: [
          {
            workplace: formData.workplace,
            school: formData.school,
          }
        ],
      };

      dispatch(updateProfile(updatedData)).then(() => {
        close();
      });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Chỉnh sửa thông tin cá nhân
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Avatar</label>
              <input
                type="file"
                name="avatar"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Banner</label>
              <input
                type="file"
                name="banner"
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Giới tính</label>
              <input
                type="text"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Nơi làm việc</label>
              <input
                type="text"
                name="workplace"
                value={formData.workplace}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Trường học</label>
              <input
                type="text"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={close}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 mr-2"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
