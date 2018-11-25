'use strinc'
const mongoose = require('mongoose');
const Product = mongoose.model('Product');
const Validator = require('../validators/fluent-validators');
const repo = require('../repositories/product-repositories');
const azure = require('azure-storage');
const guid =  require('guid');
const config = require('../config');

exports.get = async (req, res, next) => {
    try {
        var data = await repo.get()
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Server Error",
            data: e
        })
    }
}

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repo.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Internal server Error",
            data: e
        });
    }
}
exports.getByTags = async (req, res, next) => {

    try {
        var data = await repo.getByTag(req.params.tags);
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({
            message: "Internal server Error",
            data: e
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repo.getById(req.params.id)
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: "Internal server Error",
            data: e
        });
    }
}
exports.post = async (req, res, next) => {
    let contract = new Validator();

    contract.hasMinLen(req.body.title, 3, "El titulo debe contener al menos 3 caracteres");
    contract.hasMinLen(req.body.slug, 3, "El titulo debe contener al menos 3 caracteres");
    contract.hasMinLen(req.body.description, 3, "El titulo debe contener al menos 3 caracteres");

    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
    }
    try {
        const blobSvc = azure.createBlobService(config.containerConnectionString );
        let filename = guid.raw().toString() + '.jpg';
        let rawdata = req.body.image;
        let matches = rawdata.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer(matches[2], 'base64');        
        console.log(buffer);
        await blobSvc.createBlockBlobFromText('product-images', filename, buffer,{
            contentType: type
        },function(error, result, response){
            if(error){
                filename =  'default-product.png'
            }
        })
        await repo.create({
            title:req.body.title,
            slug:req.body.slug,
            description:req.body.description,
            price:req.body.price,
            tags:req.body.tags,
            image: 'https://nodestorage1422.blob.core.windows.net/product-images/' + filename,
        });
        res.status(200).send({
            message: 'Producto registrado con exito'

        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            message: "Internal server Error",
            data: e
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repo.update(req.body, req.params.id);
        res.status(201).send({
            message: "Producto actualizado"
        })
    } catch (e) {
        res.status(400).send({
            message: "Error al internar actualizar el producto",
            data: e
        });
    }
};

exports.delete = async(req, res, next) => {
    try {
        await repo.delete(req.body.id)
        res.status(201).send({
            message: "Producto eliminado"
        });
    } catch (e) {
        res.status(400).send({
            message: "Error al internar actualizar el producto",
            data: e
        });
    }
};