import Joi from 'joi-browser';

export default {
  comment: Joi.string().required().label('Comment')
};
