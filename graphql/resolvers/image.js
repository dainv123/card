import Joi from 'joi';
import mongoose from 'mongoose';
import { Image } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';

export default {
  Query: {
    images: async (root, args, context, info) => {
      const images = await Image.find({ userId: context.req.session.userId });
      return images;
    },
    image: async (root, args, context, info) => {
      return Image.findById(args.id);
    },
  },
  Mutation: {
    createImage: async (root, args, context, info) => {
      await Joi.validate(args, validators.image.createImage, { abortEarly: false });

      const image = new Image({ image: args.image, userId: args.userId });

      const savedImage = await image.save();

      return savedImage;
    },

    updateImage: async (root, args, context, info) => {
      const imageToUpdate = await Image.findById(args.id);

      if (!imageToUpdate) {
        throw new Error('Image not found');
      }

      if (args.image) {
        imageToUpdate.image = args.image;
      }

      if (args.userId) {
        imageToUpdate.userId = args.userId;
      }

      const updatedImage = await imageToUpdate.save();

      return updatedImage;
    },

    deleteImage: async (root, args, context, info) => {
      const imageToDelete = await Image.findById(args.id);

      if (!imageToDelete) {
        throw new Error('Image not found');
      }

      await imageToDelete.remove();

      return { id: args.id };
    }
  }
};
