import Joi from 'joi-browser';

export default {
  title: Joi.string().required().min(5).label('Title'),
  description: Joi.string().required().label('Description')
};
