import * as yup from 'yup';

import { 
  NAME,
  E_MAIL,
  USERNAME,
  PASSWORD,
  MAX_MESSAGE,
  MIN_MESSAGE, 
  REQUIRED_MESSAGE,
  ENTER_VALID_INFO_MESSAGE,
  MUST_ACCEPT_TERM_MESSAGE,
  MUST_AT_LEAST_ONE_MESSAGE,
  ONLY_NUMBER_LETTER_MESSAGE,
  MUST_BE_VALID_EMAIL_MESSAGE,
  PASSWORD_CONFIRMATION_MESSAGE,
  ENTER_EMAIL_PASSWORD_MESSAGE,
  PASSWORD_MUST_MATCH_MESSAGE,
} from '../constants/wording';

export const loginSchema = yup.object().shape({
  email: yup
    .string(ENTER_VALID_INFO_MESSAGE)
    .min(3)
    .max(255, ENTER_VALID_INFO_MESSAGE)
    .email(ENTER_VALID_INFO_MESSAGE)
    .required(ENTER_EMAIL_PASSWORD_MESSAGE),
  password: yup
    .string(ENTER_VALID_INFO_MESSAGE)
    .min(8, ENTER_VALID_INFO_MESSAGE)
    .max(50, ENTER_VALID_INFO_MESSAGE)
    .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, ENTER_VALID_INFO_MESSAGE)
    .required(ENTER_EMAIL_PASSWORD_MESSAGE)
});

export const registerSchema = yup.object().shape({
  email: yup
    .string()
    .min(3, MIN_MESSAGE(3))
    .max(255, MAX_MESSAGE(255))
    .email(MUST_BE_VALID_EMAIL_MESSAGE)
    .required(REQUIRED_MESSAGE(E_MAIL)),
  password: yup
    .string()
    .min(8)
    .max(50, MAX_MESSAGE(50))
    .matches(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/, MUST_AT_LEAST_ONE_MESSAGE)
    .required(REQUIRED_MESSAGE(PASSWORD)),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], PASSWORD_MUST_MATCH_MESSAGE)
    .required(REQUIRED_MESSAGE(PASSWORD_CONFIRMATION_MESSAGE)),
  username: yup
    .string()
    .min(4, MIN_MESSAGE(4))
    .max(30, MAX_MESSAGE(30))
    .matches(/^[a-zA-Z0-9]*$/, ONLY_NUMBER_LETTER_MESSAGE)
    .required(REQUIRED_MESSAGE(USERNAME)),
  name: yup
    .string()
    .min(4, MIN_MESSAGE(4))
    .max(255, MAX_MESSAGE(255))
    .required(REQUIRED_MESSAGE(NAME)),
  terms: yup.boolean().oneOf([true], MUST_ACCEPT_TERM_MESSAGE)
});

export const updateSchema = yup.object().shape({
  email: yup
    .string(ENTER_VALID_INFO_MESSAGE)
    .min(3)
    .max(255, ENTER_VALID_INFO_MESSAGE)
    .email(ENTER_VALID_INFO_MESSAGE)
    .required(ENTER_EMAIL_PASSWORD_MESSAGE),
  username: yup
    .string()
    .min(4, MIN_MESSAGE(4))
    .max(30, MAX_MESSAGE(30))
    .matches(/^[a-zA-Z0-9]*$/, ONLY_NUMBER_LETTER_MESSAGE)
    .required(REQUIRED_MESSAGE(USERNAME)),
  name: yup
    .string()
    .min(4, MIN_MESSAGE(4))
    .max(255, MAX_MESSAGE(255))
    .required(REQUIRED_MESSAGE(NAME))
});
