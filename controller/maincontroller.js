const mysqlAwait = require("mysql-await");
const _ = require('underscore');
const fs = require('fs')

const controller = {};

controller.main = (req,res) => {
    res.render('index');
}

controller.goToProductos = (req,res) => {
    res.redirect('/productos/anillos');
}

controller.renderProductos = (req,res) => {
    const determinarTipo = (string) => {
        switch (string) {
            case "anillos":
                return "1"
                break;
            case "aretes":
                return "2"
                break;
            case "esclavas":
                return "3"
                break;
            case "relojes":
                return "4"
                break;
            default:
                break;
        }
    }
    const tipo = determinarTipo((req.params.tipo).toString());
    req.getConnection((err,conn) => {
        conn.query(`SELECT * FROM productos WHERE tipoProducto="${tipo}"`, (err, result) => {
            const marcas = _.pairs(_.countBy(result,'marca')); // Tiene objeto con la marca como key y el numero de veces
            const colores = _.pairs(_.countBy(result,'color')); // Tiene objeto con la marca como key y el numero de veces
            const materiales = _.pairs(_.countBy(result,'material')); // Tiene objeto con la marca como key y el numero de veces
            const tamanos = _.pairs(_.countBy(result,'tamano')); // Tiene objeto con la marca como key y el numero de veces
            res.render('productos',{
                productos: result,
                marcas: marcas,
                colores: colores,
                materiales: materiales,
                tamanos: tamanos
            });
        })
    })   
}

controller.error = (req, res) => {
    res.render('error');
}


controller.cobro = (req,res) => {
    res.render('cobro');
}

controller.registro = (req,res) => {
    if (req.query.correcto == 'true') {
        res.render('registroProducto',{
            mensaje: 'registroCorrecto'
        });
    }
    res.render('registroProducto',{
        mensaje: null
    });
}

controller.nuevoProducto = (req,res,next) => {
    let producto = req.body; 
    producto.nombreImg = req.file.filename
    console.log(producto);
    req.getConnection((err,conn) => {
        conn.query('INSERT INTO productos SET ?', [producto], (result) => {
            return next();
        })
    })
}

controller.correcto = (req,res) => {
    res.render('correcto');
}
controller.buscador = (req,res) => {
    res.render('buscador');
}

controller.searchProducto = (req,res) => {
    let codigoProducto = req.body;
    req.getConnection(async (err,conn) => {
        const awaitConn = mysqlAwait.createConnection(conn.config);
        const like = codigoProducto.like;
        codigoProducto =_.omit(codigoProducto, (value,key,object) => {
            return (value == '' || key == 'like') ? true : false;
        });
        let query = 'SELECT * FROM productos WHERE 1=1 ';
        codigoProducto = _.pairs(codigoProducto); // codigoProducto ahora es un Arreglo
        if (like == 'true') {
            for (const producto of codigoProducto) {
                query = query + ` AND ${producto[0]} LIKE '%${producto[1]}%'`;
            }
        }
        if(like == 'false'){
            for (const producto of codigoProducto) {
                query = query + ` AND ${producto[0]}='${producto[1]}'`;
            }
        }
        if (codigoProducto.length != 0) {
            const producto = await awaitConn.awaitQuery(query);
            res.send(producto);
        }else{
            res.send('Fallido');
        }
    })
}

controller.viewProducto = (req, res) => {
    const id = req.params.id;
    req.getConnection((err,conn) => {
        conn.query("SELECT * FROM productos WHERE idProducto=?",[id], (err, result) => {
            res.render('viewProducto',{
                producto: result
            });
        })
    })
}

controller.comprar = (req,res) => {
    req.getConnection(async (err,conn) => {
        const producto = req.body;
        const idProducto = producto.idProducto;
        const awaitConn = mysqlAwait.createConnection(conn.config);
        let stock = (await awaitConn.awaitQuery('SELECT stock FROM productos WHERE idProducto=?',[producto.idProducto]))[0].stock;
        const resta = (stock)*1-(producto.cantidad)*1;
        conn.query("UPDATE productos SET stock=? WHERE idProducto=?",[resta,idProducto], (err, result) => {
            res.send(true);
        })
    })
}

controller.deleteProducto = (req,res) => {
    req.getConnection(async (err,conn) => {
        const awaitConn = mysqlAwait.createConnection(conn.config);
        const codigo = req.body.codigo;
        try {
            awaitConn.awaitQuery("DELETE FROM productos WHERE codigo=?",[codigo]);
            res.send('OK');
        } catch (error) {
            res.send('Error')
        }
    })
}

controller.editProducto = (req,res) => {
    req.getConnection(async (err,conn) => {
        const awaitConn = mysqlAwait.createConnection(conn.config);
        const codigo = req.body.codigo;
        const producto = await awaitConn.awaitQuery('SELECT * FROM productos WHERE codigo=?',[codigo]);
        res.render('registroProducto',{producto: producto});
    })
}

controller.editProductoApply = (req,res) => {
    req.getConnection(async (err,conn) => {
        const codigo = req.body.codigo;
        const producto = req.body;
        const noHayImagen = typeof req.file == "undefined";

        // Verificar img anterior
        const awaitConn = mysqlAwait.createConnection(conn.config);
        const oldImgName = (await awaitConn.awaitQuery('SELECT nombreImg FROM productos WHERE codigo=?',[codigo]))[0].nombreImg;
    
        if (noHayImagen) {
            try {
                const update = await awaitConn.awaitQuery('UPDATE productos SET ? WHERE codigo=?',[producto,codigo]);
                console.log(update);
                res.render('correcto');
            } catch (error) {
                res.redirect('/error');
                console.log('Error: ', error);
            }
        }else{
            try {
                const archivo = req.file;
                const productoWithCodigo = {...producto,nombreImg: archivo.filename};
                fs.unlink(`./assets/img/${oldImgName}`, (err) => {});
                await awaitConn.awaitQuery('UPDATE productos SET ? WHERE codigo=?',[productoWithCodigo,codigo]);
                res.render('correcto');
            } catch (error) {
                console.log(error);
                res.redirect('/error');
            }            
        }

    });
    // Si suben imagen, se crea req.file, si no, esta indefinido
}
module.exports = controller;