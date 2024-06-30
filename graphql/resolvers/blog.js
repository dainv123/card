import Joi from 'joi';
import mongoose from 'mongoose';
import { Blog } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';

export default {
  Query: {
    blogs: (root, args, context, info) => {
      return Blog.find({});
    },
    publicBlogs: (root, args, context, info) => {
      return Blog.find({});
    },
    blog: async (root, args, context, info) => {
      const query = {};
      if (args.id) {
        query._id = args.id;
      } else if (args.name) {
        query.name = args.name;
      } else {
        throw new Error('Please provide either id or name for blog lookup.');
      }

      const blog = await Blog.findOne(query);

      if (!blog) {
        throw new Error('Blog not found');
      }

      return blog;
    },
    publicBlog: async (root, args, context, info) => {
      const query = {};
      if (args.id) {
        query._id = args.id;
      } else if (args.name) {
        query.name = args.name;
      } else {
        throw new Error('Please provide either id or name for blog lookup.');
      }

      const blog = await Blog.findOne(query);

      if (!blog) {
        throw new Error('Blog not found');
      }

      return blog;
    }
  },
  Mutation: {
    createBlog: async (root, args, context, info) => {
      await Joi.validate(args, validators.blog.createBlog, { abortEarly: false });

      const blog = new Blog({
        name: args.name,
        trend: args.trend,
        introduction: args.introduction,
        content: args.content,
        image: args.image
      });

      const savedBlog = await blog.save();

      return savedBlog;
    },

    updateBlog: async (root, args, context, info) => {
      const blogToUpdate = await Blog.findById(args.id);

      if (!blogToUpdate) {
        throw new Error('Blog not found');
      }

      if (args.name) {
        blogToUpdate.name = args.name;
      }

      if (args.trend) {
        blogToUpdate.trend = args.trend;
      }

      if (args.introduction) {
        blogToUpdate.introduction = args.introduction;
      }

      if (args.content) {
        blogToUpdate.content = args.content;
      }

      if (args.image) {
        blogToUpdate.image = args.image;
      }

      const updatedBlog = await blogToUpdate.save();

      return updatedBlog;
    },

    deleteBlog: async (root, args, context, info) => {
      const blogToDelete = await Blog.findById(args.id);

      if (!blogToDelete) {
        throw new Error('Blog not found');
      }

      await blogToDelete.remove();

      return { id: args.id };
    }
  }
};
