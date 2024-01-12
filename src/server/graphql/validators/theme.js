import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

const name = Joi.string()
  .min(1)
  .max(255)
  .required()
  .label('Name');

const path = Joi.string()
  .min(0)
  .max(255)
  .label('Path');

export const findTheme = Joi.object().keys({
  id: Joi.objectId()
});

export const createTheme = Joi.object().keys({
  name,
  path
});
