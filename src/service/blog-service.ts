import type { Blog, BlogRequest, PageResponse, SearchBlogRequest } from "@/interfaces/blog";
import API from "./axios-instance";

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

export { createBlog, getBlogs, updateBlog };
