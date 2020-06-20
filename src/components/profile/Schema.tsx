import Joi from 'joi-browser';

export default {
  name: Joi.string().min(3).max(25).required().label('Name')
};
