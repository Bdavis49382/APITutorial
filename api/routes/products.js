const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null,file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, false);
        cb(null, true);
    }
}
const upload = multer({storage:storage, limits: {
    fileSize: 1024 * 1024 * 5
},
fileFilter: fileFilter});

const ProductsController = require('../controllers/products')

//If no id is given, gets all products.
router.get('/',ProductsController.getAll)

//Posts new product
router.post('/',upload.single('productImage'),ProductsController.createProduct)

//If id is given, get the specific product
router.get('/:productId',ProductsController.getOne)

//Changes the given properties of a product by id
router.patch('/:productId',ProductsController.updateProduct)

//Deletes the product with the given id
router.delete('/:productId',ProductsController.deleteOne)

module.exports = router;