import * as yup from 'yup';

export const createCardSchema = yup.object().shape({
    config: yup
      .string()
  });