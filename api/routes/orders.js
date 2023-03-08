const express = require('express');
const router = express.Router();

const OrdersController = require('../controllers/orders')

router.get('/',OrdersController.getAll)

router.get('/:orderId',OrdersController.getOne)

router.delete('/:orderId',OrdersController.deleteOne)

router.post('/',OrdersController.createOrder)

module.exports = router;