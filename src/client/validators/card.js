import * as yup from 'yup';

const requiredMessage = field => `${field} is required`;
const minMessage = min => `Must have at least ${min} characters`;
const maxMessage = max => `Cannot have more than ${max} characters`;

export const createCardSchema = yup.object().shape({
    config: yup
      .string()
  });