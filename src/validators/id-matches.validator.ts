import { CustomValidator } from 'express-validator';

export const idMatches: CustomValidator = (value, { req }) => {
  if (value !== req.params.id) {
    return Promise.reject('Inconsistent data')
  } else return Promise.resolve()
};