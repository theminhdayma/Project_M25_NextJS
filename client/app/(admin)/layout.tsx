"use client";
import { useEffect, useState } from "react";
import "../../style/admin.css";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { User } from "@/interface";
import { deleteLocal, getLocal } from "@/store/reducers/Local";

export default function Admin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // General loading state
  const [loadingUser, setLoadingUser] = useState<boolean>(false); // For user section
  const [loadingPost, setLoadingPost] = useState<boolean>(false); // For post section
  const route = useRouter();

  useEffect(() => {
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
      setLoading(false); 
    } else {
      setLoading(false);
      route.push("/login");
    }
  }, []);

  const handleNavigation = (section: string) => {
    if (section === "user") {
      setLoadingUser(true);
      setLoadingPost(false);
      route.push("/user");
    } else if (section === "post") {
      route.push("/post");
      setLoadingUser(false);
      setLoadingPost(true);
    }
  };

  const logout = () => {
    Swal.fire({
      title: "Bạn có chắc chắn muốn đăng xuất?",
      text: "Bạn sẽ phải đăng nhập lại để truy cập các chức năng của hệ thống.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Có, đăng xuất!",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteLocal("loggedInUser");
        route.push("/login");
      }
    });
  };

  if (loading) {
    return <div>Loading...</div>; // Render loading state
  }

  return (
    <div className="body">
      <section id="sidebar">
        <a href="#" className="brand">
          <i className="bx bxs-smile" />
          <span className="text">AdminHub</span>
        </a>
        <ul className="side-menu top">
          <li className={loadingUser ? "active" : ""}>
            <a onClick={() => handleNavigation("user")}>
              <i className="bx bxs-dashboard" />
              <span className="text">Quản lý người dùng</span>
            </a>
          </li>
          <li className={loadingPost ? "active" : ""}>
            <a onClick={() => handleNavigation("post")}>
              <i className="bx bxs-shopping-bag-alt" />
              <span className="text">Quản lý bài viết</span>
            </a>
          </li>
        </ul>
        <ul className="side-menu">
          <li>
            <button onClick={logout} className="logout text-2xl">
              <i className="bx bxs-log-out-circle" />
              <span className="text">Logout</span>
            </button>
          </li>
        </ul>
      </section>
      <section id="content">{children}</section>
    </div>
  );
}
