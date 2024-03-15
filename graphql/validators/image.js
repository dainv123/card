import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

export const findImage = Joi.object().keys({
  id: Joi.objectId()
});

export const createImage = Joi.object().keys({
  userId: Joi.objectId(),
  image: Joi.required()
});

export const updateImage = Joi.object().keys({
  id: Joi.objectId(),
  userId: Joi.objectId(),
  image: Joi.required()
});

export const deleteImage = Joi.object().keys({
  id: Joi.objectId()
});
