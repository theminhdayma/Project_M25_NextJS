"use client";

import { User } from "@/interface";
import { getLocal } from "@/store/reducers/Local";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "@/service/post.service";
import { useRouter } from "next/navigation";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

interface Props {
  close: () => void;
}

export default function FromAddPost({ close }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [detail, setDetail] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const user = getLocal("loggedInUser");
    if (user) setLoggedInUser(user);
  }, [dispatch]);

  const handleDetailChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDetail(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFilesArray = Array.from(e.target.files);
      setImages((prevFiles) => [...prevFiles, ...newFilesArray]);
    }
  };

  const handleUploadImages = async (imageFiles: File[]) => {
    setLoading(true);
    const uploadPromises = imageFiles.map((file) => {
      const storageRef = ref(storage, `posts/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    });

    try {
      const imageUrls = await Promise.all(uploadPromises);
      setLoading(false);
      return imageUrls;
    } catch (error) {
      console.error("Error uploading images: ", error);
      setLoading(false);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!loggedInUser) {
      return router.push("/login");
    }

    try {
      const uploadedImageUrls = await handleUploadImages(images);
      const newPost = {
        idUser: loggedInUser.id,
        avatarUser: loggedInUser.avatar,
        name: loggedInUser.name,
        detail: detail,
        images: uploadedImageUrls,
        fullDate: new Date().toISOString().split("T")[0],
        commentsById: [],
        favouristUsersById: [],
        idGroup: null,
        status: true,
      };

      await dispatch(createPost(newPost));
      close();
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  };

  return (
    <div className="absolute left-[550px] top-[120px] w-full max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between">
        <div className="flex items-center mb-4 gap-4">
          <img
            src={loggedInUser?.avatar || "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"}
            alt={loggedInUser?.name}
            className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
          />
          <div>
            <p className="font-bold">{loggedInUser?.name}</p>
            <select className="bg-gray-800 text-white p-2 rounded">
              <option value="">Công khai</option>
              <option value="profile">Bạn bè</option>
              <option value="logout">Chỉ mình tôi</option>
            </select>
          </div>
        </div>
        <button
          onClick={close}
          className="w-[30px] h-[30px] flex justify-center items-center bg-red-500 text-white"
        >
          <i className="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>

      <div className="mb-4">
        <textarea
          className="w-full bg-gray-800 p-2 rounded-lg text-sm placeholder-gray-500 resize-none"
          placeholder={`${loggedInUser?.name} ơi, bạn đang nghĩ gì thế?`}
          rows={3}
          value={detail}
          onChange={handleDetailChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="fileinput" className="block text-blue-500 hover:underline cursor-pointer">
          Thêm hình ảnh
        </label>
        <input
          type="file"
          id="fileinput"
          className="hidden"
          multiple
          onChange={handleImageChange}
        />
        <div className="flex flex-wrap mt-2">
          {images.map((file, index) => (
            <img
              key={index}
              className="object-cover w-[100px] h-[100px] rounded-lg mr-2 mb-2"
              src={URL.createObjectURL(file)}
              alt="preview"
            />
          ))}
        </div>
      </div>
      <button
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Đang đăng..." : "Đăng"}
      </button>
    </div>
  );
}
