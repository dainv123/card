import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    name: String,
    trend: String,
    introduction: String,
    content: String,
    image: String
  },
  {
    timestamps: true
  }
);

const Blog = model('Blog', blogSchema);

export default Blog;
