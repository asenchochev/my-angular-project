const Perfume = require("../models/Perfume");

exports.getPerfumes = () => Perfume.find();

exports.create = (data) => Perfume.create(data);

exports.getOnePerfume = (id) => Perfume.findById(id);

exports.edit = (id, perfume) => Perfume.findByIdAndUpdate(id, perfume);

exports.delete = (id) => Perfume.findByIdAndDelete(id);

exports.getByUser = async (owner) => {
    let all = await Perfume.find().lean();
    const newArr = [];
    for(let p of all) {
        if(p.owner == owner._id) {
            newArr.push(p)
        }
    }
    return newArr;
};


exports.search = async (brand) => {
    let all = await Perfume.find().lean()
    const newArr = [];
    for(let p of all) {
        if(p.brand.toLocaleLowerCase().includes(brand.toLocaleLowerCase())) {
            newArr.push(p)
        }
    }

    return newArr;
}