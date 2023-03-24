'use strict';
const Joi = require('joi');
const { objectId } = require('./custom.validation');

const settings = {
    body: Joi.object().keys({
        user: Joi.string().required().custom(objectId),
        who_access_ur_profile: Joi.string().required(),
        follow_me: Joi.boolean().required(),
        send_me_notification: Joi.boolean().required(),
        tagging: Joi.boolean().required(),
        sound_notification: Joi.boolean().required()
    })
}

module.exports = {
    settings
}