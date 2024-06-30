import Joi from 'joi';
import mongoose from 'mongoose';
import { Theme } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';

export default {
  Query: {
    themes: async (root, args, context, info) => {
      const themes = await Theme.find()
        .populate('tags', 'id name')
        .exec();
      return themes;
    },
    theme: async (root, args, context, info) => {
      await Joi.validate(args, validators.theme.findTheme);
      return Theme.findById(args.id)
        .populate('tags', 'id name')
        .exec();
    },
    publicTheme: async (root, args, context, info) => {
      return Theme.findById(args.id);
    },
    publicThemes: async (root, args, context, info) => {
      const themes = await Theme.find()
        .populate('tags', 'id name')
        .exec();
      return themes;
    }
  },
  Mutation: {
    createTheme: async (root, args, context, info) => {
      await Joi.validate(args, validators.theme.createTheme, { abortEarly: false });

      const tagIds = args.tags.map(id => mongoose.Types.ObjectId(id));

      const theme = new Theme({
        name: args.name,
        path: args.path,
        tags: tagIds,
        image: args.image
      });

      const savedTheme = await theme.save();

      return savedTheme;
    },

    updateTheme: async (root, args, context, info) => {
      const themeToUpdate = await Theme.findById(args.id);

      if (!themeToUpdate) {
        throw new Error('Theme not found');
      }

      if (args.name) {
        themeToUpdate.name = args.name;
      }

      if (args.path) {
        themeToUpdate.path = args.path;
      }

      if (args.tags) {
        themeToUpdate.tags = args.tags;
      }

      if (args.image) {
        themeToUpdate.image = args.image;
      }

      const updatedTheme = await themeToUpdate.save();

      return updatedTheme;
    },

    deleteTheme: async (root, args, context, info) => {
      const themeToDelete = await Theme.findById(args.id);

      if (!themeToDelete) {
        throw new Error('Theme not found');
      }

      await themeToDelete.remove();

      return { id: args.id };
    }
  }
};
