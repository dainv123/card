import Joi from 'joi';
import { Theme } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';

export default {
  Query: {
    themes: (root, args, context, info) => Theme.find({}),
    theme: async (root, args, context, info) => {
      await Joi.validate(args, validators.theme.findTheme);

      return Theme.findById(args.id);
    }
  },
  Mutation: {
    createTheme: async (root, args, context, info) => {
      await Joi.validate(args, validators.theme.createTheme, { abortEarly: false });

      const theme = await Theme.create(args);

      return theme;
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

      // Save the updated theme
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
