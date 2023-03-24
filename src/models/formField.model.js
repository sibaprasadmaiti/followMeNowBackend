const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');
const { toJSON, paginate } = require('./plugins');
var uniqueValidator = require('mongoose-unique-validator');

const options = {
    separator: "_",
    lang: "en",
    truncate: 120,
    backwardCompatible: true //support for the old options names used in the mongoose-slug-generator
}
mongoose.plugin(slug, options);
const { Schema } = mongoose;
const string = {
    type: String,
};

const formSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: '',
    },
    formField: [{
        type: {
            type: String,
            enum: ['image', 'text', 'textarea', 'editor', 'file', 'repeater'],
        },
        fieldName: {
            type:String,
            unique: true,
            null:true
        },
        formFieldRepeater: [{
            type: {
                type: String,
                enum: ['image', 'text', 'textarea', 'editor', 'file', 'repeater'],
            },
            fieldName:{
                type:String,
                unique: true,
                null:true
            } ,
            fieldId: {
                type: String,
                slug: 'fieldName',
                index: true,
                slugPaddingSize: 4,
                permanent: true,
                uniqueGroupSlug: '_id', // slug unique within current document,
                //  slugOn: { findOneAndUpdate: false, updateMany: false }
            }
        }],
        fieldId: {
            type: String,
            slug: 'fieldName',
            index: true,
            slugPaddingSize: 4,
            uniqueGroupSlug: '_id',
            permanent: true,
            // slug unique within current document,
            //  slugOn: { findOneAndUpdate: false, updateMany: false }
        }
    }],
    /*   slug: {
          type: String,
          slug: 'title',
          unique: true,
      }, */
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    is_active: {
        type: Boolean,
        enum: [true, false],
        default: true,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

// add plugin that converts mongoose to json
formSchema.plugin(toJSON);
formSchema.plugin(paginate);
// formSchema.plugin(uniqueValidator);

/**
 * @typedef FormFields
 */

formSchema.pre('save', async function(next) {
    const form = this;
    // console.log('form')
    // console.log(form)

    let modifiedData = [];
    let modifiedFetchData = [];
    if (form.formField) {
        //Fetch Data From Database
        // let fetchData= this.constructor.find(function(err, data) {
        //     if(err){
        //        return next(err);
        //     }
        //     // if no error do something as you need and return callback next() without error
        //     console.log("Data-------------",data);
        //     let modifiedDataArr = [];

        //     for(let val of data){
        //         console.log('Val ===', val.formField);
        //         const frmField= val.formField;
        //         console.log('Val ===', frmField[0].fieldName);
        //         modifiedDataArr.push(frmField.fieldName);
        //         console.log("1111111111122212",modifiedDataArr);
        //     //Step 1 : For Text Form Filed
        //         if(val.formField.formFieldRepeater.length >0 ){
        //            val.formFieldRepeater.map(valR => {
        //                 modifiedDataArr.push(valR.fieldName);
        //                 console.log("333333333333333433434",modifiedDataArr);
        //                 return modifiedDataArr;
        //             })
        //           } 
        //         //   console.log("repArr======",repArr);
        //         return modifiedDataArr;
        //     }

        //     return data;
        //    });
        //    console.log("fetchData",fetchData);
        //Step 1 : For Text Form Filed
        // fetchData.forEach(val => {
            

        //    })

        //    console.log("modifiedFetchData11111",modifiedFetchData);
        //    const frmField=form.formField;
        //    console.log("frmField",frmField);
           

        modifiedData = form.formField.map(e => {
            if (e.type == 'image' || e.type == 'file') {
                let fieldId = e.fieldName + '_upload_weavers';
                e = {...e._doc, fieldId }
            } else {
                let fieldId = e.fieldName
                e = {...e._doc, fieldId }
            }

            if (e.type == 'repeater') {
                let formFieldRepeater = e.formFieldRepeater.map(r => {
                    if (r.type == 'image' || r.type == 'file') {
                        let fieldId = r.fieldName + '_upload_weavers';
                        r = {...r._doc, fieldId }
                    } else {
                        let fieldId = r.fieldName
                        r = {...r._doc, fieldId }
                    }
                    return r;
                })
                let fieldId = e.fieldName
                let fieldName = e.fieldName;
                let type = e.type;
                e = {...e._doc, ... { formFieldRepeater: formFieldRepeater, fieldId: fieldId, fieldName: fieldName, type: type } }
            }
            return e;
        });
        form.formField = modifiedData;
    }
    next();
});

const FormFields = mongoose.model('FormField', formSchema);
module.exports = FormFields;
