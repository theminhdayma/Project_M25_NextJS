"use client"
import Header from "@/components/User/Header";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-900 text-gray-200 font-sans">
      <Header/>
      {/* Main Content */}
      <div className="container mx-auto flex justify-between mt-5 gap-2">
        {/* Sidebar Left */}
        <aside className="w-1/5 bg-gray-800 p-5 rounded-lg">
          <Link href={"/profile"} className="flex items-center mb-5">
            <img
              src="https://imagev3.vietnamplus.vn/w1000/Uploaded/2024/mzdic/2022_05_29/realvodich1.jpg.webp"
              alt="Profile"
              className="w-12 h-12 rounded-full mr-3"
            />
            <p>Nguyễn Thế Minh</p>
          </Link>
          <ul>
            <li className="mb-3">
              <Link
                href="/list-frend"
                className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-lg"
              >
                <i className="fas fa-user-friends" /> Bạn bè
              </Link>
            </li>
            <li className="mb-3">
              <Link
                href="celebrate"
                className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-lg"
              >
                <i className="fas fa-clock" /> Kỷ niệm
              </Link>
            </li>
            <li className="mb-3">
              <a
                href="#"
                className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-lg"
              >
                <i className="fas fa-bookmark" /> Đã lưu
              </a>
            </li>
            <li className="mb-3">
              <Link 
                href="group"
                className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded-lg"
              >
                <i className="fas fa-users" /> Nhóm
              </Link>
            </li>
          </ul>
        </aside>
        {/* Feed */}
        <section className="w-3/5 bg-gray-800 p-5 rounded-lg">
          {/* Stories */}
          <div className="flex gap-4 mb-5">
            <div className="w-24 h-36 bg-gray-700 rounded-lg overflow-hidden relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="Story 1"
                className="w-full h-full object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                Trường Loan
              </p>
            </div>
            <div className="w-24 h-36 bg-gray-700 rounded-lg overflow-hidden relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="Story 2"
                className="w-full h-full object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                Phùng Lan
              </p>
            </div>
            <div className="w-24 h-36 bg-gray-700 rounded-lg overflow-hidden relative">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="Story 3"
                className="w-full h-full object-cover"
              />
              <p className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                Cristiano Ronaldo
              </p>
            </div>
          </div>
          {/* Post */}
          <div className="bg-gray-700 p-4 rounded-lg mb-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                  alt="User 1"
                  className="w-10 h-10 rounded-full mr-3"
                />
                <h4>User 1</h4>
              </div>
              <span className="text-sm text-gray-400">23 giờ trước</span>
            </div>
            <p className="mb-3">
              Mong anh sớm quay trở lại hàng tiền vệ của Real Madrid 🥰
            </p>
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
              alt="Post Image"
              className="w-full h-auto rounded-lg mb-3"
            />
            <div className="flex justify-around">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <i className="fas fa-thumbs-up" /> Thích
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <i className="fas fa-comment" /> Bình luận
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full flex items-center gap-2">
                <i className="fas fa-share" /> Chia sẻ
              </button>
            </div>
          </div>
        </section>
        {/* Sidebar Right */}
        <aside className="w-1/5 bg-gray-800 p-5 rounded-lg">
          <h3 className="text-xl mb-3">Bạn bè trực tuyến</h3>
          <ul>
            <li className="flex items-center mb-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="User 2"
                className="w-10 h-10 rounded-full mr-3"
              />
              <p>Đinh Hà</p>
            </li>
            <li className="flex items-center mb-3">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRj3VwTFHunTLePi9gZY1s53p_42XG2B0a0A&s"
                alt="User 3"
                className="w-10 h-10 rounded-full mr-3"
              />
              <p>Mai Hương</p>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}
