import Joi from 'joi';
import { Card } from '../../models/models';
import validators from '../validators/validators';
import * as Auth from '../../helpers/auth';

export default {
  Query: {
    cards: (root, args, context, info) => Card.find({}),
    card: async (root, args, context, info) => {
      await Joi.validate(args, validators.card.findCard);

      return Card.findById(args.id);
    }
  },
  Mutation: {
    createCard: async (root, args, context, info) => {
      console.log(111111111111111111);
      await Joi.validate(args, validators.card.createCard, { abortEarly: false });

      const card = await Card.create(args);

      return card;
    }
  }
};
