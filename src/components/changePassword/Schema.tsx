import Joi from 'joi-browser';

export default {
  oldPasswd: Joi.string().required().label('Old Password'),
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
