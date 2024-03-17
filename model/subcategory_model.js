const mongoose = require('mongoose');

const subcategorySchema = mongoose.Schema({
    name:String,
    image:String,
    category: {
        type: mongoose.Schema.Types.ObjectId, ref:"category", required:true
    }
},{
    timestamps: true
})

module.exports = mongoose.model(
    'subcategory',subcategorySchema,'subCategories'
);