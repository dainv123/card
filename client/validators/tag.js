import * as yup from 'yup';
import { MAX_MESSAGE, REQUIRED_MESSAGE } from '../constants/wording';

export const createTagSchema = yup.object().shape({
  name: yup
    .string()
    .max(255, MAX_MESSAGE(255))
    .required(REQUIRED_MESSAGE('Name')),
});