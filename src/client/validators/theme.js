import * as yup from 'yup';

const requiredMessage = field => `${field} is required`;
const minMessage = min => `Must have at least ${min} characters`;
const maxMessage = max => `Cannot have more than ${max} characters`;

export const createThemeSchema = yup.object().shape({
    name: yup
      .string()
      .min(1, minMessage(1))
      .required(requiredMessage('Name')),
  });