const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getAll = (req,res,next) => {
    Product.find().select('name price _id productImage').exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    productImage: 'http://localhost:3000/'+doc.productImage,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+doc._id
                    }
                }
            })
        }
        res.status(200).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}
exports.createProduct = (req,res,next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created product successfully',
                createdProduct: {
                    name :result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: "http://localhost:3000/products/"+result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err 
            })
        });
}
exports.getOne = (req,res,next) => {
    const id = req.params.productId;
    Product.findById(id).select('name price _id productImage').exec().then(doc => {
        res.status(200).json(doc);
        console.log("From database", doc);
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res.status(404).json({message: 'No valid entry for provided request'})
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({error: err})
    });
    
}
exports.updateProduct = (req,res,next) => {
    const id = req.params.productId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id},{ $set: updateOps})
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/'+id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}
exports.deleteOne = (req,res,next) => {
    const id = req.params.productId;
    Product.remove({_id: id}).exec().then(result => {
        res.status(200).json(result);
    }).catch(err=> {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
}