const express = require('express');
const router = express.Router();
const controller = require('../controller/maincontroller.js')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req,file,cb) {
        cb(null,'assets/img/'); 
    }, 
    filename: (req,file,cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
  })
const upload = multer({storage: storage});


router.get('/',controller.main);
router.get('/productos/:tipo',controller.renderProductos);
router.get('/error',controller.error);
router.get('/cobro',controller.cobro);
router.get('/registro',controller.registro);
router.post('/nuevoProducto',upload.single('img'),controller.nuevoProducto,controller.correcto);
router.get('/buscador',controller.buscador);
router.get('/viewProducto/:id',controller.viewProducto);
router.post('/searchProducto',controller.searchProducto);
router.post('/buy',controller.comprar);
router.post('/deleteProducto',controller.deleteProducto);
router.post('/editProducto',controller.editProducto);
router.post('/editProductoApply',upload.single('img'),controller.editProductoApply);

router.get('*', function(req, res){
    res.status(404).redirect('/error');
});
module.exports = router;