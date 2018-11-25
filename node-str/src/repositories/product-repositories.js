'use strict'

const mongoose = require('mongoose');
const Product = mongoose.model('Product');


exports.get = async () => {
    const res = await Product.find({
        'active': true
    }, 'title price slug');
    return res;
}

exports.getBySlug = async (slug) => {
    var res = await Product.findOne({
        'slug': slug,
        'active': true
    }, 'title description price tags');
    return res;
}

exports.getById = async (id) => {
    var res = await Product.findById(id);
    return res;
}

exports.getByTag = async (tags) => {
    var res = await Product.find({
        'tags': tags,
        'active': true
    }, 'title description price slug tags');
    return res;
}


exports.create = async (data) => {
    var product = new Product(data);
    await product.save();

}

exports.update = async (data, id) => {
    await Product.findByIdAndUpdate(id, {
        $set: {
            title: data.title,
            description: data.description,
            price: data.price
        }
    })
}

exports.delete = (id) => {
    return Product.findOneAndRemove(id);
}