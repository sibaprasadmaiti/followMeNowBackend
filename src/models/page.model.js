const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const { toJSON, paginate } = require('./plugins');

mongoose.plugin(slug);
const { Schema } = mongoose;
const string = {
    type: String,
};

const content = mongoose.Schema({
    sectionTitle: string,
    fieldType: string,
    content: [],
    formId: {
        type: Schema.Types.ObjectId,
        ref: 'FormField',
    }
});
const pageSchema = mongoose.Schema({
    title_en: {
        type: String,
        required: true,
        trim: true,
        default: '',
    },
    title_ar: {
        type: String,
        required: true,
        trim: true,
        default: '',
    },
    slug: {
        type: String,
        slug: 'title_en',
        unique: true,
    },
    block: {},
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    formId: [],
    is_active: {
        type: Boolean,
        enum: [true, false],
        default: true,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// add plugin that converts mongoose to json
pageSchema.plugin(toJSON);
pageSchema.plugin(paginate);

/**
 * @typedef Pages
 */
const Pages = mongoose.model('Page', pageSchema);

module.exports = Pages;
