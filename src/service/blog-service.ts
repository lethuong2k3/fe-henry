import type { Blog, BlogRequest, PageResponse, SearchBlogRequest } from "@/interfaces/blog";
import API from "./axios-instance";
import axiosClient from "./client-service";

const createBlog = async (value: BlogRequest) => {
  const res = await API.post("/api/auth/blogs", value);
  return res.data;
};

const getBlogs = async (params: SearchBlogRequest): Promise<PageResponse<Blog>> => {
  const res = await API.post<PageResponse<Blog>>("/api/auth/blogs/search", params);
  return res.data;
};

const updateBlog = async (id: String, payload: BlogRequest) => {
  const res = await API.put(`/api/auth/blogs/${id}`, payload);
  return res.data;
};

const deleteBlog = async (id: String) => {
  const res = await API.delete(`/api/admin/blogs/${id}`);
  return res.data;
};

const updateBlogsStatus = async (ids: string[], status: "0" | "1"): Promise<void> => {
  await API.patch("/api/auth/blogs/status", { ids, value: status});
}

const updateBlogsActive = async (ids: string[], active: "0" | "1") => {
  await API.patch("/api/auth/blogs/active", {
    ids,
    value: active
  })
}

const deleteBlogs = async (ids: string[]): Promise<void> => {
  await API.delete("/api/admin/blogs", { data: { ids } });
}

// User
const getBlogsByActive = async () => {
  const res = await axiosClient.get("/api/blogs-active");
  return res.data;
}

export { createBlog, getBlogs, updateBlog, deleteBlog, getBlogsByActive, updateBlogsStatus, updateBlogsActive, deleteBlogs};
