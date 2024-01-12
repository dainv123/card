import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

export const findCard = Joi.object().keys({
  id: Joi.objectId()
});

export const createCard = Joi.object().keys({
  userId: Joi.objectId(),
  themeId: Joi.objectId(),
  config: Joi.string()
});
