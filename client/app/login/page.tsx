"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";
import Swal from "sweetalert2";
import { User } from "@/interface";
import { getAllUser, login } from "@/service/user.service";
import Link from "next/link";

export default function Login() {
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const [checkHollow, setCheckHollow] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);
  const [checkPassword, setCheckPassword] = useState(false);
  const [checkComfimPassword, setCheckComfimPassword] = useState(false);
  const [checkAccount, setCheckAccount] = useState(false);
  const [checkUseEmail, setCheckUseEmail] = useState(false);

  // Lấy danh sách tài khoản từ Redux
  const listAccount: User[] = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch<any>();
  const router = useRouter();

  // Lấy tất cả tài khoản khi component được render
  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  // Hàm kiểm tra định dạng email
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    // Kiểm tra các trường có rỗng hay không
    if (!inputValue.email || !inputValue.password) {
      setCheckHollow(true);
      return;
    } else {
      setCheckHollow(false);
    }
  
    // Kiểm tra định dạng email
    if (!validateEmail(inputValue.email)) {
      setCheckEmail(true);
      return;
    } else {
      setCheckEmail(false);
    }
  
    // Kiểm tra độ dài mật khẩu
    if (inputValue.password.length < 8) {
      setCheckPassword(true);
      Swal.fire({
        icon: "error",
        title: "Mật khẩu phải ít nhất 8 ký tự",
      });
      return;
    } else {
      setCheckPassword(false);
    }
  
    // Tìm tài khoản với email nhập vào
    const user = listAccount.find((user) => user.email === inputValue.email);
  
    // Nếu không tìm thấy tài khoản với email đó
    if (!user) {
      setCheckUseEmail(true);
      return;
    } else {
      setCheckUseEmail(false);
    }
  
    // Giải mã mật khẩu
    const bytes = CryptoJS.AES.decrypt(user.password, "secret_key");
    const decryptedPassword = bytes.toString(CryptoJS.enc.Utf8);
  
    // Kiểm tra mật khẩu đã giải mã có khớp với mật khẩu người dùng nhập vào
    if (decryptedPassword !== inputValue.password) {
      setCheckComfimPassword(true);
      return;
    } else {
      setCheckComfimPassword(false);
    }
  
    // Kiểm tra xem tài khoản có bị khóa không
    if (user.status !== true) {
      Swal.fire({
        icon: "error",
        title: "Tài khoản đã bị khóa",
        text: "Vui lòng liên hệ với quản trị viên để biết thêm chi tiết.",
      });
      return;
    }
  
    // Nếu các kiểm tra đều hợp lệ, tiến hành đăng nhập
    dispatch(login(user.id));
  
    if (user.role === 0) {
      router.push("/user");
    } else {
      router.push("/");
    }
  
    setInputValue({ email: "", password: "" });
    Swal.fire({
      title: "Đăng nhập thành công",
      icon: "success",
      confirmButtonText: "OK",
    });
  };
  

  return (
    <div className="bg-gray-900 text-gray-200 font-sans">
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Đăng nhập</h2>
          <form onSubmit={handleSubmit}>
            {/* Nhập email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm mb-2">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={inputValue.email}
                onChange={(e) =>
                  setInputValue({ ...inputValue, email: e.target.value })
                }
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Nhập email"
              />
              {checkEmail && <p className="text-red-500">Email không hợp lệ</p>}
            </div>
            {/* Nhập mật khẩu */}
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                value={inputValue.password}
                onChange={(e) =>
                  setInputValue({ ...inputValue, password: e.target.value })
                }
                className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-blue-500"
                placeholder="Nhập mật khẩu"
              />
              {checkPassword && (
                <p className="text-red-500">Mật khẩu phải ít nhất 8 ký tự</p>
              )}
            </div>
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-sm">
                <input type="checkbox" className="mr-2 bg-gray-700 rounded" />
                Nhớ mật khẩu
              </label>
              <a href="#" className="text-blue-500 text-sm">
                Quên mật khẩu?
              </a>
            </div>
            {/* Nút đăng nhập */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg"
            >
              Đăng nhập
            </button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/resgiter" className="text-blue-500">
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
