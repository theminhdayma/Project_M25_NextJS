"use client";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/service/user.service";
import Swal from "sweetalert2";
import Link from "next/link";
import { User } from "@/interface";

export default function Register() {
  const [checkUseEmail, setCheckUseEmail] = useState<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [id]: value }));
  };

  const validateForm = async () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  
    let isValid = true;
  
    // Kiểm tra tên tài khoản không được để trống
    if (!form.username) {
      newErrors.username = "Tên tài khoản không được để trống";
      isValid = false;
    }
  
    // Kiểm tra email có đúng định dạng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email) {
      newErrors.email = "Email không được để trống";
      isValid = false;
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Email không đúng định dạng";
      isValid = false;
    } else {
      // Kiểm tra email có tồn tại không (nếu đúng định dạng mới kiểm tra)
      const existingUser = await checkExistingUser(form.email);
      if (existingUser) {
        newErrors.email = "Email đã được sử dụng";
        isValid = false;
      }
    }
  
    // Kiểm tra mật khẩu
    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
      isValid = false;
    } else if (form.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      isValid = false;
    }
  
    // Kiểm tra xác nhận mật khẩu
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Xác nhận mật khẩu không được để trống";
      isValid = false;
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và xác nhận mật khẩu không khớp";
      isValid = false;
    }
  
    // Cập nhật lỗi nếu có
    setErrors(newErrors);
    return isValid;
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid = await validateForm(); // Thêm await để chờ validate
  
    if (isValid) {
      try {
        await dispatch(register(form));
        Swal.fire({
          title: "Đăng ký thành công!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          router.push("/login");
        });
      } catch (error) {
        Swal.fire({
          title: "Đăng ký thất bại",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    }
    setForm({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  // Hàm kiểm tra xem email đã tồn tại chưa
  const checkExistingUser = async (email: string) => {
    try {
      const response = await fetch("http://localhost:8080/users");
      const data = await response.json();

      if (data && data.length > 0) {
        return data.find((user: User) => user.email === email);
      } else {
        return null;
      }
    } catch (error) {
      console.error("Lỗi:", error);
      return null;
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 font-sans">
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Đăng ký</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm mb-2">
                Tên tài khoản
              </label>
              <input
                type="text"
                id="username"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Nhập tên tài khoản"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Nhập email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Nhập mật khẩu"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm mb-2">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Nhập lại mật khẩu"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
            >
              Đăng ký
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-500">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
