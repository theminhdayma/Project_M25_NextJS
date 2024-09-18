"use client";
import { useState, useEffect } from "react";
import { getAllPost, updatePost } from "@/service/post.service";
import { Post, User } from "@/interface";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { getLocal } from "@/store/reducers/Local";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/config/firebase";

interface Props {
  post: Post | null;
  close: () => void;
}

export default function FromUpdatePost({ post, close }: Props) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const dispatch = useDispatch();
  const listPost: Post[] = useSelector((state: any) => state.post.post);

  const [inputValue, setInputValue] = useState<Post>({
    id: post?.id || 0,
    idUser: post?.idUser || 0,
    avatarUser: post?.avatarUser || "",
    name: post?.name || "",
    detail: post?.detail || "",
    images: post?.images || [],
    fullDate: post?.fullDate || "",
    commentsById: post?.commentsById || [],
    favouristUsersById: post?.favouristUsersById || [],
    idGroup: post?.idGroup || 0,
    status: post?.status || true,
    privacy: post?.privacy || "",
    like: post?.like || []
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [newImages, setNewImages] = useState<File[]>([]);

  useEffect(() => {
    dispatch(getAllPost());
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [dispatch]);

  useEffect(() => {
    if (post) {
      setInputValue(post);
    }
  }, [post]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFilesArray = Array.from(e.target.files);
      setNewImages((prevFiles) => [...prevFiles, ...newFilesArray]);
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
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
    try {
      const imageUrls = await handleUploadImages(newImages);
      const updatedPost = {
        ...inputValue,
        images: [...inputValue.images, ...imageUrls],
      };
      await dispatch(updatePost(updatedPost)).unwrap();
      Swal.fire("Success", "Chỉnh sửa bài viết thành công!", "success");
      close();
    } catch (error) {
      Swal.fire("Error", "Chỉnh sửa bài viết thất bại", "error");
    }
  };

  return (
    <div className="absolute left-[550px] top-[120px] w-full max-w-md mx-auto bg-gray-900 text-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between">
        <div className="flex items-center mb-4 gap-4">
          <img
            src={
              loggedInUser?.avatar ||
              "https://png.pngtree.com/png-vector/20190223/ourlarge/pngtree-admin-rolls-glyph-black-icon-png-image_691507.jpg"
            }
            alt={loggedInUser?.name || "User Avatar"}
            className="w-10 h-10 rounded-full border-2 border-blue-500 object-cover"
          />
          <div>
            <select
              className="bg-gray-800 text-white p-2 rounded"
              name="privacy"
              value={inputValue.privacy}
              onChange={handleChange}
            >
              <option value={0}>Công khai</option>
              <option value={1}>Người theo dõi</option>
              <option value={2}>Chỉ mình tôi</option>
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
          placeholder={` ơi, bạn đang nghĩ gì thế?`}
          rows={3}
          name="detail"
          value={inputValue.detail}
          onChange={handleChange}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="fileinput"
          className="block text-blue-500 hover:underline cursor-pointer"
        >
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
          {inputValue.images.map((url, index) => (
            <img
              key={index}
              className="object-cover w-[100px] h-[100px] rounded-lg mr-2 mb-2"
              src={url}
              alt="preview"
            />
          ))}
          {newImages.map((file, index) => (
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
        {loading ? "Đang cập nhật..." : "Cập nhật"}
      </button>
    </div>
  );
}
