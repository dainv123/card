import Joi from 'joi';
import JoiObjectId from 'joi-objectid';

Joi.objectId = JoiObjectId(Joi);

export const findTheme = Joi.object().keys({
  id: Joi.objectId()
});

export const createTheme = Joi.object().keys({
  userId: Joi.objectId(),
  themeId: Joi.objectId(),
  config: Joi.string()
});
