import Joi from 'joi-browser';

export default {
  email: Joi.string().required().email().min(6).max(50).label('Email'),
  name: Joi.string().min(3).max(25).required().label('Name'),
  passwd: Joi.string().required().min(6).max(15).label('Password'),
  confirmPasswd: Joi.string()
    .required()
    .valid(Joi.ref('passwd'))
    .options({
      language: {
        any: {
          allowOnly: '!!Passwords do not match'
        }
      }
    })
    .label('Password')
};
