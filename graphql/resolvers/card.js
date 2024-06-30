import Joi from 'joi';
import { Card, Theme } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';
import * as Role from '../../constants/role';

export default {
  Query: {
    cards: async (root, args, context, info) => {
      const userIdFilter =
        context.req.session.userRole === Role.USER ? { userId: context.req.session.userId } : {};

      const cards = await Card.find(userIdFilter).populate('themeId');

      const cardsWithThemeNames = await Promise.all(
        cards.map(async card => {
          const theme =
            card.themeId && card.themeId.id ? await Theme.findById(card.themeId.id) : null;

          return {
            id: card.id,
            userId: card.userId,
            themeId: theme ? theme.id : null,
            themeName: theme ? theme.name : null,
            config: card.config,
            name: card.name || null,
            createdAt: card.createdAt,
            updatedAt: card.updatedAt
          };
        })
      );

      return cardsWithThemeNames;
    },
    card: async (root, args, context, info) => {
      const query = {};
      if (args.id) {
        query._id = args.id;
      } else if (args.name) {
        query.name = args.name;
      } else {
        throw new Error('Please provide either id or name for card lookup.');
      }

      const card = await Card.findOne(query);

      if (!card) {
        throw new Error('Card not found');
      }

      return card;
    },
    publicCard: async (root, args, context, info) => {
      const query = {};
      if (args.id) {
        query._id = args.id;
      } else if (args.name) {
        query.name = args.name;
      } else {
        throw new Error('Please provide either id or name for card lookup.');
      }

      const card = await Card.findOne(query);

      if (!card) {
        throw new Error('Card not found');
      }

      return card;
    }
  },
  Mutation: {
    createCard: async (root, args, context, info) => {
      await Joi.validate(args, validators.card.createCard, { abortEarly: false });

      if (args.name) {
        const existingCardWithSameName = await Card.findOne({ name: args.name });
  
        if (existingCardWithSameName) {
          throw new Error('Card with the provided name already exists');
        }
      }

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

        cardToUpdate.config = args.config;

      if (args.name) {
        const existingCardWithSameName = await Card.findOne({
          name: args.name,
          _id: { 
            $ne: args.id 
          }
        });
  
        if (existingCardWithSameName) {
          throw new Error('Card with the provided name already exists');
        }

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
