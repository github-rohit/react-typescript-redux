import Joi from 'joi-browser';

export default {
  email: Joi.string().required().email().label('Email'),
  passwd: Joi.string().required().label('Password')
};
