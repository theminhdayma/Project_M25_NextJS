"use client";
import { useEffect, useReducer, useState } from "react";
import "../../style/admin.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@/interface";
import { deleteLocal, getLocal } from "@/store/reducers/Local";

export default function Admin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    const allSideMenu = document.querySelectorAll<HTMLAnchorElement>(
      "#sidebar .side-menu.top li a"
    );

    allSideMenu.forEach((item) => {
      const li = item.parentElement as HTMLLIElement;

      item.addEventListener("click", function () {
        allSideMenu.forEach((i) => {
          i.parentElement!.classList.remove("active");
        });
        li.classList.add("active");
      });
    });
  }, []);

  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);
  const route = useRouter();

  useEffect(() => {
    const user = getLocal("loggedInUser");
    if (user) {
      setLoggedInUser(user);
    }
  }, [loggedInUser]);

  const logout = () => {
    deleteLocal("loggedInUser");
    route.push("/login");
  };

  return (
    <div className="body">
      <section id="sidebar">
        <a href="#" className="brand">
          <i className="bx bxs-smile" />
          <span className="text">AdminHub</span>
        </a>
        <ul className="side-menu top">
          <li className="active">
            <Link href={"/user"}>
              <i className="bx bxs-dashboard" />
              <span className="text">Quản lý người dùng</span>
            </Link>
          </li>
          <li>
            <Link href={"/post"}>
              <i className="bx bxs-shopping-bag-alt" />
              <span className="text">Quản lý bài viết</span>
            </Link>
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
