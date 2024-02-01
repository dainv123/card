import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

const name = Joi.string()
  .min(1)
  .max(255)
  .required()
  .label('Name');

const trend = Joi.string()
  .min(0)
  .max(255)
  .label('Trend');

const introduction = Joi.string()
  .min(0)
  .max(255)
  .label('Introduction');

const content = Joi.string()
  .min(0)
  .max(255)
  .label('Content');

const image = Joi.required();

export const findBlog = Joi.object().keys({
  id: Joi.objectId()
});

export const createBlog = Joi.object().keys({
  name,
  trend,
  introduction,
  content,
  image
});

export const updateBlog = Joi.object().keys({
  id: Joi.objectId(),
  name,
  trend,
  introduction,
  content,
  image
});

export const deleteBlog = Joi.object().keys({
  id: Joi.objectId()
});
