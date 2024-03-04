import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

const name = Joi.string()
  .max(255)
  .required()
  .label('Name');

export const findTag = Joi.object().keys({
  id: Joi.objectId()
});

export const createTag = Joi.object().keys({
  name
});

export const updateTag = Joi.object().keys({
  id: Joi.objectId(),
  name
});

export const deleteTag = Joi.object().keys({
  id: Joi.objectId()
});
