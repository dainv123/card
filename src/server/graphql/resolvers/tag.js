import Joi from 'joi';
import { Tag } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';

export default {
  Query: {
    tags: (root, args, context, info) => Tag.find({}),

    tag: async (root, args, context, info) => {
      await Joi.validate(args, validators.tag.findTag);
      return Tag.findById(args.id);
    },

    publicTag: async (root, args, context, info) => {
      return Tag.findById(args.id);
    },
  },
  Mutation: {
    createTag: async (root, args, context, info) => {
      await Joi.validate(args, validators.tag.createTag, { abortEarly: false });

      const tag = await Tag.create(args);

      return tag;
    },

    updateTag: async (root, args, context, info) => {
      const tagToUpdate = await Tag.findById(args.id);

      if (!tagToUpdate) {
        throw new Error('Tag not found');
      }

      if (args.name) {
        tagToUpdate.name = args.name;
      }

      // Save the updated tag
      const updatedTag = await tagToUpdate.save();

      return updatedTag;
    },

    deleteTag: async (root, args, context, info) => {
      const tagToDelete = await Tag.findById(args.id);

      if (!tagToDelete) {
        throw new Error('Tag not found');
      }

      await tagToDelete.remove();

      return { id: args.id };
    }
  }
};
