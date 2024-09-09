"use client";

import { User } from "@/interface";
import { getLocal } from "@/store/reducers/Local";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "@/service/post.service"; 

interface Props {
  close: () => void;
}

export default function FromAddPost({ close }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [detail, setDetail] = useState(""); // Nội dung bài viết
  const [images, setImages] = useState<File[]>([]); // Lưu trữ ảnh tải lên
  const dispatch = useDispatch();

  // Lấy thông tin người dùng đã đăng nhập từ localStorage
  useEffect(() => {
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  // Hàm xử lý thay đổi nội dung bài viết
  const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetail(e.target.value);
  };

  // Hàm xử lý khi người dùng chọn ảnh
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files)); // Lưu trữ tất cả ảnh
    }
  };

  // Hàm đăng bài viết
  const handleSubmit = async () => {
    if (!loggedInUser) return; // Kiểm tra xem đã đăng nhập chưa

    const newPost = {
      idUser: loggedInUser.id,
      avatarUser: loggedInUser.avatar,
      name: loggedInUser.name,
      detail: detail,
      images: images.map((file) => URL.createObjectURL(file)), // Tạo URL tạm cho ảnh
      fullDate: new Date().toISOString().split("T")[0], // Lấy ngày hiện tại
      commentsById: [],
      favouristUsersById: [],
      idGroup: null,
      status: true,
    };

    try {
      await dispatch(createPost(newPost)); // Gửi yêu cầu tạo bài viết
      close(); // Đóng form sau khi đăng thành công
    } catch (error) {
      console.error("Error posting:", error);
    }
  };

  return (
    <>
      <div className="absolute left-[550px] top-[120px] w-full max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-4">
        <div className="flex justify-between">
          <div className="flex items-center mb-4 gap-4">
            <img
              src={
                loggedInUser?.avatar ||
                "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
              }
              alt={loggedInUser?.name}
              className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
            />
            <div>
              <p className="font-bold">{loggedInUser?.name}</p>
              <button className="text-gray-400 text-sm flex items-center">
                <select className="bg-gray-800 text-white p-2 rounded">
                  <option value="">Công khai</option>
                  <option value="profile">Bạn bè</option>
                  <option value="logout">Chỉ mình tôi</option>
                </select>
              </button>
            </div>
          </div>
          <button
            onClick={close}
            className="w-[30px] h-[30px] flex justify-center items-center bg-red-500 text-white"
          >
            <i className="fa-solid fa-xmark text-2xl"></i>
          </button>
        </div>
        {/* Input field */}
        <div className="mb-4">
          <textarea
            className="w-full bg-gray-800 p-2 rounded-lg text-sm placeholder-gray-500 resize-none"
            placeholder={`${loggedInUser?.name} ơi, bạn đang nghĩ gì thế?`}
            rows={3}
            value={detail}
            onChange={handleDetailChange}
          />
        </div>
        <div className="imageProduct_form">
          <div className="uploadImage_part">
            <div className="upload_icon_part">
              <svg
                className="upload_icon"
                viewBox="0 0 23 21"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.5 0A1.5 1.5 0 0120 1.5V12c-.49-.07-1.01-.07-1.5 0V1.5H2v12.65l3.395-3.408a.75.75 0 01.958-.087l.104.087L7.89 12.18l3.687-5.21a.75.75 0 01.96-.086l.103.087 3.391 3.405c.81.813.433 2.28-.398 3.07A5.235 5.235 0 0014.053 18H2a1.5 1.5 0 01-1.5-1.5v-15A1.5 1.5 0 012 0h16.5z"></path>
                <path d="M6.5 10.5a1 1 0 011-1h8a1 1 0 110 2h-8a1 1 0 01-1-1z"></path>
              </svg>
            </div>
            <label htmlFor="fileinput" className="uploadImage_content">
              Thêm hình ảnh
            </label>
            <input
              type="file"
              id="fileinput"
              className="upload_input mt-2 text-blue-500 hover:underline"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div className="image_list">
            {images.map((file, index) => (
              <div key={index} className="image_item">
                <img src={URL.createObjectURL(file)} alt="preview" className="w-full" />
              </div>
            ))}
          </div>
        </div>
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
          onClick={handleSubmit}
        >
          Đăng
        </button>
      </div>
    </>
  );
}
