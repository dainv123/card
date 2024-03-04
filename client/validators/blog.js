import * as yup from 'yup';
import { MIN_MESSAGE, REQUIRED_MESSAGE } from '../constants/wording';

export const createBlogSchema = yup.object().shape({
    name: yup
      .string()
      .min(1, MIN_MESSAGE(1))
      .required(REQUIRED_MESSAGE('Name')),
  });