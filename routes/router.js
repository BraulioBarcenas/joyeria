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
router.get('/productos',controller.goToProductos);
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

const sesiones = require('../controller/sesiones.js')

router.get('/',sesiones.main);
router.get('/registro',sesiones.registro);
router.get('/buscador',sesiones.buscador);
router.get('/carrusel',sesiones.carrusel);
router.get('/recuperarPass', sesiones.recuperarPass);
// router.get('/codigoVerificate', sesiones.codigoVerificate);
// router.get('/cambiarPass', sesiones.cambiarPass);
router.get('/recuperarPassQuestion', sesiones.recuperarPassQuestion);
router.get('/questionVerificate', sesiones.questionVerificate);

router.post('/email', sesiones.email);
router.post('/verificate', sesiones.verificate);
router.post('/cambiarPassMethod', sesiones.cambiarPassMethod);
router.post('/reenviarCodigo', sesiones.reenviarCodigo)
router.post('/emailQuestion', sesiones.emailQuestion);
router.post('/questionVerificateMethod', sesiones.questionVerificateMethod);

const login = require('../controller/login.js');

// router.get('/', login.main);
router.get('/login', login.login);
router.get('/login/register', login.register);
router.get('/logout',login.logout);
router.get('/opcionesRecPass', login.opcionesRecPass);

router.post('/login', login.auth);
router.post('/login/register', login.registerPost);

router.get('*', function(req, res){
    res.status(404).redirect('/error');
});
module.exports = router;