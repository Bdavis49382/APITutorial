const mongoose = require('mongoose');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getAll = (req, res, next) => {
    Order.find().select('product quantity _id')
        .populate('product', 'name price')
        .exec().then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/orders/'+doc._id
                    }
                }
            }),
        })
    })};
exports.createOrder = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });

            }
            const order = new Order({
                _id:mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            })
            return order.save()
        })
        .then(result => {
            // console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
}
exports.getOne = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}
exports.deleteOne = (req,res,next) => {
    Order.deleteOne({ _id: req.params.orderId})
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: "order not found"
                })
            }
            res.status(200).json({
                message: 'Order deleted',
                request: {
                    type: "POST",
                    url: "http://localhost:3000/orders",
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}