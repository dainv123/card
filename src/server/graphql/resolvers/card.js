import Joi from 'joi';
import { Card, Theme } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';

export default {
  Query: {
    // cards: (root, args, context, info) => Card.find({}),
    cards: async (root, args, context, info) => {
      const cards = await Card.find({}).populate('themeId'); // Use populate to fetch the associated theme for each card

      // Map through the cards and transform them to include the theme name
      const cardsWithThemeNames = cards.map(card => ({
        id: card.id,
        userId: card.userId,
        themeId: card.themeId.id,
        themeName: card.themeId.name, // Include the theme name in the response
        config: card.config,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt
      }));

      return cardsWithThemeNames;
    },
    card: async (root, args, context, info) => {
      await Joi.validate(args, validators.card.findCard);

      return Card.findById(args.id);
    }
  },
  Mutation: {
    createCard: async (root, args, context, info) => {
      await Joi.validate(args, validators.card.createCard, { abortEarly: false });

      const card = await Card.create(args);

      return card;
    },

    updateCard: async (root, args, context, info) => {
      const cardToUpdate = await Card.findById(args.id);

      if (!cardToUpdate) {
        throw new Error('Card not found');
      }

      if (args.userId) {
        cardToUpdate.userId = args.userId;
      }

      if (args.themeId) {
        cardToUpdate.themeId = args.themeId;
      }

      if (args.config) {
        cardToUpdate.config = args.config;
      }

      // Save the updated card
      const updatedCard = await cardToUpdate.save();

      return updatedCard;
    },

    deleteCard: async (root, args, context, info) => {
      const cardToDelete = await Card.findById(args.id);

      if (!cardToDelete) {
        throw new Error('Card not found');
      }

      await cardToDelete.remove();

      return { id: args.id };
    }
  }
};
