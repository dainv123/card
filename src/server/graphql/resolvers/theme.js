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
    }
  }
};
