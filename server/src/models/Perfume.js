const mongoose = require("mongoose");

const perfumeModel = new mongoose.Schema({
    id: {
        type: Number,
    },
    brand: {
        type: String,
        required: [true, 'Brand required!'],
    },
    model: {
        required: [true, 'Model required!'],
        type: String,
    },
    amount: {
        required: [true, 'Amount required!'],
        type: Number,
    },
    imageUrl: {
        required: [true, 'ImageUrl required!'],
        type: String,
    },
    price: {
        required: [true, 'Price required!'],
        type: Number,
        minLength: 0,
    },
    description: {
        required: [true, 'Short description required!'],
        type: String,
    },
    owner: {
        required: true,
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
});

const Perfume = mongoose.model("Perfume", perfumeModel);

module.exports = Perfume;
