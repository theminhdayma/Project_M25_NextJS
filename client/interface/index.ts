export interface BiographyEntry {
  workplace: string;
  school: string;
}

export interface User {
  id: number;
  name: string;
  password: string;
  email: string;
  avatar: string;
  banner: string;
  biography: BiographyEntry[];
  gender: string;
  postsById: number[];
  followersById: number[];
  status: boolean;
  private: boolean;
  requestFollowById: number[];
  listFrend: number[];
  role: number;
}

export interface Post {
  id: number;
  idUser: number;
  avatarUser: string;
  name: string;
  detail: string;
  fullDate: string;
  images: string[];
  commentsById: number[];
  favouristUsersById: number[];
  idGroup: number | null;
  status: boolean;
  privacy: string;
  like: number[]
}

export interface CommentParent {
  id: number;
  idUser: number;
  avatarUser: string;
  name: string;
  postId: number;
  detail: string;
  commentsById: number[];
}

export interface CommentChild {
  id: number;
  idUser: number;
  avatarUser: string;
  nameUser: string;
  postId: number;
  idParent: number;
  userNameParent: string;
  detail: string;
}

export interface Comment {
  id: number;           // ID của comment
  idUser: number;       // ID của người dùng đã bình luận
  postId: number;       // ID của bài viết mà comment này thuộc về
  text: string;         // Nội dung của bình luận
  fullDate: string;     // Ngày tạo của bình luận (dạng chuỗi)
  avatarUser: string;   // Hình đại diện của người dùng
  nameUser: string;     // Tên người dùng
}

export interface Group {
  id: number;
  groupName: string;
  usersById: number[];
  status: boolean;
  avatar: string;
  private: boolean;
  adminById: number;
}
