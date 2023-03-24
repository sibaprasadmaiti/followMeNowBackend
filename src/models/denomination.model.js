const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const denominationSchema = mongoose.Schema({
    denomination:{
        type:String,
        default:''
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// add plugin that converts mongoose to json
 denominationSchema.plugin(toJSON);
 denominationSchema.plugin(paginate);

/**
 * @typedef Denomination
 */
const Denomination = mongoose.model('Denomination',  denominationSchema);

module.exports =  Denomination;
