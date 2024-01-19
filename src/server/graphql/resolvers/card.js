import Joi from 'joi';
import { Card, Theme } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';

export default {
  Query: {
    cards: async (root, args, context, info) => {
      const cards = await Card.find({}).populate('themeId');

      const cardsWithThemeNames = await Promise.all(cards.map(async (card) => {
        const theme = await Theme.findById(card.themeId.id);

        return {
          id: card.id,
          userId: card.userId,
          themeId: card.themeId.id,
          themeName: theme ? theme.name : null,
          config: card.config,
          name: card.name || null,
          createdAt: card.createdAt,
          updatedAt: card.updatedAt,
        };
      }));

      return cardsWithThemeNames;
    },
    card: async (root, args, context, info) => {
      await Joi.validate(args, validators.card.findCard);

      return Card.findById(args.id);
    },
    publicCard: async (root, args, context, info) => {
      return Card.findById(args.id);
    },
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

      if (args.name) {
        cardToUpdate.name = args.name;
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
