import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

export const findCard = Joi.object().keys({
  id: Joi.objectId()
});

export const createCard = Joi.object().keys({
  userId: Joi.objectId(),
  themeId: Joi.objectId(),
  config: Joi.string(),
  name: Joi.string(),
});

export const updateCard = Joi.object().keys({
  id: Joi.objectId(),
  userId: Joi.objectId(),
  themeId: Joi.objectId(),
  config: Joi.string(),
  name: Joi.string(),
});

export const deleteCard = Joi.object().keys({
  id: Joi.objectId()
});
