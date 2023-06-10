import { CustomValidator } from 'express-validator';

export const passwordMatches: CustomValidator = (value, { req }) => {
  if (value !== req.body.password) {
    return Promise.reject('Passwords doesn\'t match')
  } else return Promise.resolve()
};