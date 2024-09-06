// Lưu dữ liệu lên local
export const saveLocal = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

// Lấy dữ liệu từ local về
export const getLocal = (key: string) => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

// Xóa dữ liệu trên local

export const deleteLocal = (key: string) => {
  localStorage.removeItem(key);
};
