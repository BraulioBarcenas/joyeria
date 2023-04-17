const controller = {};
const bcrypt     = require('bcrypt');
const mysqlAwait = require("mysql-await");
const { session } = require('passport');

// controller.main = (req,res) => {
//     // res.render('main');
//     if (req.session.loggedin == true) {
//         res.render('main',{
//             name: req.session.name
//         });
//     }else{
//         res.redirect('/login');
//     }
// }

controller.login = (req,res) => {
    if (req.session.loggedin != true) {
        res.render('login');
    }else{
        res.redirect('/');
    }
}

controller.register = (req,res) => {
    if (req.session.loggedin != true) {
        res.render('register')
    }else{
        res.redirect('/');
    }
}

controller.opcionesRecPass = (req,res) => {
    res.render('opcionesRecPass');
}

controller.auth = (req,res) => {
    const data = req.body;
    req.getConnection((err,conn) => {
        conn.query('SELECT * FROM usuarios WHERE email = ?', [data.email], function(err,usuarioData){
            if (usuarioData.length > 0) {
                    usuarioData.forEach(element => {
                        bcrypt.compare(data.password,element.pass).then((isMatch) => {
                            if(!isMatch){
                                console.log('La contraseña es incorrecta');
                                res.render('errorPass');
                            }else{
                                console.log(element);
                                if (element.Rol == "1") {
                                    console.log('BIENVENIDO');
                                    req.session.loggedin = true;
                                    req.session.name = element.name;
                                    res.redirect('/');
                                }
                                if (element.Rol == "2") {
                                    console.log('BIENVENIDO EMPLEADO');
                                    req.session.loggedin = true;
                                    req.session.empleado = true;
                                    req.session.name = element.name;
                                    res.redirect('/cobro');                                    
                                }
                            }
                        })
                });
            } else {
                res.render('errorEmail');
                console.log('Correo no existente');
            };
        }); 
    });
};

controller.registerPost = (req,res) => {
    const data = req.body;
    bcrypt.hash(data.password,12).then((hash) => {
        data.password = hash;
        req.getConnection((err,conn) => {
            conn.query('SELECT * FROM usuarios WHERE email = ?', [data.email], (err,usuarioData) => {
                if (usuarioData.length > 0) {
                    console.log('El correo ha sido registrado anteriormente');
                    res.render('errorEmailRegister');
                }else{
                    req.getConnection((err,conn) => {
                        conn.query('INSERT INTO usuarios(nombre, apPat, apMat, email, telefono, pass, P1, R1, P2, R2) VALUES (?,?,?,?,?,?,?,?,?,?)', [data.name, data.lastname1, data.lastname2, data.email, data.number, data.password, data.question1, data.answer1, data.question2, data.answer2],(err,rows) => {
                           console.log(rows);
                           console.log(err);
                            res.redirect('/login')
                        });
                    });
                };
            });
        });
    });
};

controller.logout = (req,res) => {
    if (req.session.loggedin == true) {
        req.session.destroy();
        res.redirect('login')
    }else{
        res.redirect('login');
    }
}

module.exports = controller;