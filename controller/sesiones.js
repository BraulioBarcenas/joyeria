const mysqlAwait = require('mysql-await');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const controller = {};


controller.main = (req,res) => {
    if (req.session.loggedin != true) {
        res.redirect('/login');
    }else{
        res.redirect('/');
    }
}

controller.registro = (req,res) => {
    // Cuando el if es verdadero es que se ha iniciado session
    if (req.session.loggedin != true) {
        res.redirect('/login');
    }else{
        res.render('registroProducto');
    }
}

controller.buscador = (req,res) => {
    if (req.session.loggedin != true) {
        res.redirect('/login');
    }else{
        // res.render('registroProducto');
        res.render('buscador');
    }
}

controller.carrusel = (req,res) => {
    if (req.session.loggedin != true) {
        res.redirect('/login');
    }else{
        // res.render('registroProducto');
        res.render('carrusel');
    }
}

controller.recuperarPass = (req,res) => {
    if (req.session.loggedin == true) {
        res.redirect('/');
    }else{
        res.redirect('/opcionesRecPass');
    }

}

// controller.codigoVerificate = (req,res) => {
//     res.render('codigoVerificate');
// }

// controller.cambiarPass = (req,res) => {
//     res.render('cambiarPass');
// }

controller.recuperarPassQuestion = (req,res) => {
    res.render('recuperarPassQuestion');
}

controller.questionVerificate = (req,res) => {
    res.render('questionVerificate');
}

controller.email = async (req,res) => {
    
    // const emailInput = req.body.email;
    req.session.email = req.body.email;
    emailInput = req.session.email;

    req.getConnection(async (err, conn) =>{
        const  awaitConn = mysqlAwait.createConnection(conn.config);
        emailQuery = await awaitConn.awaitQuery("SELECT * FROM usuarios WHERE email=?",[emailInput]);
                
        if((emailQuery.length != 0)){
            let testAccount = await
            nodemailer.createTestAccount();
        
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth:{
                    user: 'cuentahost87@gmail.com',
                    pass: 'wezumnneeplenlcb'
                }
            });
            
            let codigo = controller.generarCodigo()

            codigoQuery = await awaitConn.awaitQuery("UPDATE usuarios set codigo=? WHERE email=?",[codigo ,emailQuery[0].email]);
            
            //Enfoque seguro
                // let codigoEncryp = codigo;

                // bcrypt.hash(codigoEncryp, 5, async function(err, hash) {
                //     codigoEncryp = hash;
                //     codigoQuery = await awaitConn.awaitQuery("UPDATE usuarios set codigo=? WHERE email=?",[codigoEncryp ,emailQuery[0].email]);
                // })

            const msg = {
                from: '"Administrador de OroShop" <cuentahost87@gmail.com>', // sender address
                to: emailQuery[0].email,
                // to: "cranelbell70@gmail.com", // list of receivers
                subject: "Recuperación de contraseña", // Subject line
                text: "Si", // plain text body
                html: "<h1>Recuperacion de contraseña</h1><br><b>No contestar. Tu codigo de verificación es</b>",
                alternatives: [
                    {
                        contentType: 'text/plain',
                        content: 'Tu codigo de verificación es: ' + codigo
                    }
                ]
                };
        
                const info = await transporter.sendMail(msg);
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
                
                res.render('codigoVerificate');
        }
        else{
            res.render('recuperarPassErr');
        }
    });
}

controller.reenviarCodigo = async (req,res) => {

    emailInput = req.session.email;

    req.getConnection(async (err, conn) =>{
        const  awaitConn = mysqlAwait.createConnection(conn.config);
        emailQuery = await awaitConn.awaitQuery("SELECT * FROM usuarios WHERE email=?",[emailInput]);
                
        if((emailQuery.length != 0)){
            let testAccount = await
            nodemailer.createTestAccount();
        
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth:{
                    user: 'cuentahost87@gmail.com',
                    pass: 'wezumnneeplenlcb'
                }
            });
            
            let codigo = controller.generarCodigo()

            codigoQuery = await awaitConn.awaitQuery("UPDATE usuarios set codigo=? WHERE email=?",[codigo ,emailQuery[0].email]);
            
            const msg = {
                from: '"Administrador de OroShop" <cuentahost87@gmail.com>', // sender address
                to: emailQuery[0].email,
                // to: "cranelbell70@gmail.com", // list of receivers
                subject: "Recuperación de contraseña", // Subject line
                text: "Si", // plain text body
                html: "<h1>Recuperacion de contraseña</h1><br><b>No contestar. Tu codigo de verificación es</b>",
                alternatives: [
                    {
                        contentType: 'text/plain',
                        content: 'Tu codigo de verificación es: ' + codigo
                    }
                ]
                };
        
                const info = await transporter.sendMail(msg);
                console.log("Message sent: %s", info.messageId);
                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
                
                res.redirect('/codigoVerificate');
        }
        else{
            res.render('recuperarPassErr');
        }
    });
}

//Bloque de código que genera codigos de manera aleatoria
controller.generarCodigo = () => {
        //Enfoque seguro
            let numeros = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"; 
        // let numeros = "0123456789"
        let codigo = "";
        for(let x = 0; x < 6; x++){
            let aleatorio = Math.floor(Math.random() * numeros.length);
            codigo += numeros.charAt(aleatorio);
        }
        return codigo;
}

//Se puede generar el codigo de manera aleatoria, guardarlo en la BD y luego jalarlo de la misma BD.

controller.verificate = (req,res) => {
    
    emailSession = req.session.email;
    codigoInput = req.body.codigoVerificate
    
    req.getConnection(async (err, conn) =>{
        const  awaitConn = mysqlAwait.createConnection(conn.config);
        emailQuery = await awaitConn.awaitQuery("SELECT * FROM usuarios WHERE email=?",[emailSession]);

        
            if(codigoInput == emailQuery[0].codigo){
                if(codigoInput != null){
                usadoQuery = await awaitConn.awaitQuery("UPDATE usuarios set codigo=? WHERE email=?",[null ,emailQuery[0].email]);
                res.render('cambiarPass');
                }
            }
        
        else{
            res.render("codigoVerificateErr")
        }
    })
}


//Agregar un campo en la BD que permita saber si el código de verificacion ya ha sido usado.
controller.cambiarPassMethod = (req, res) => {
    emailSession = req.session.email;
    passInput = req.body.pass1;

    bcrypt.hash(passInput, 12, function(err, hash) {
        passInput = hash;
        // Store hash in your password DB.
        req.getConnection(async(err, conn) =>{
            const  awaitConn = mysqlAwait.createConnection(conn.config);
            codigoQuery = await awaitConn.awaitQuery("UPDATE usuarios set pass=? WHERE email=?",[passInput ,emailQuery[0].email]);
            res.render('cambioPassSuccess');
        }
        )
    });
}

controller.emailQuestion = async (req,res) => {
    
    // const emailInput = req.body.email;
    req.session.email = req.body.email;
    emailInput = req.session.email;

    req.getConnection(async (err, conn) =>{
        const  awaitConn = mysqlAwait.createConnection(conn.config);
        emailQuery = await awaitConn.awaitQuery("SELECT * FROM usuarios WHERE email=?",[emailInput]);
        // questionQuery = req.session.emailQuery;
                
        if((emailQuery.length != 0)){
            req.session.questions = questions = {Q1: emailQuery[0].P1, Q2:emailQuery[0].P2};
            const questions1 = req.session.questions;
            res.render('questionVerificate', questions1)
        }
        else{
            res.render('recuperarPassErr');
        }
    });
}


controller.questionVerificateMethod = (req,res) => {
    
    emailSession = req.session.email;
    answer1Input = req.body.answer1;
    answer2Input = req.body.answer2;

    questions1 = req.session.questions;

    req.getConnection(async (err, conn) =>{
        const  awaitConn = mysqlAwait.createConnection(conn.config);
        emailQuery = await awaitConn.awaitQuery("SELECT * FROM usuarios WHERE email=?",[emailSession]);

        if((answer1Input == emailQuery[0].R1) && (answer2Input == emailQuery[0].R2)){
            res.redirect('/cambiarPass');
        }
        
        else{
            res.render("questionVerificateErr", questions1)
        }
    })
}


// controller.olvidar = (req,res) => {
//     //Inicailización de API de SMS
//     const { Vonage } = require('@vonage/server-sdk')
//     const vonage = new Vonage({
//     apiKey: "1eaf1460",
//     apiSecret: "2G8RQ5dDPjpaF6fa"
//     })

//     // const from = "Vonage APIs"
//     const from = "524381049618"
//     const to = "524434119006"
//     // const to = "524381049618"
//     const text = 'Si'

//     async function sendSMS() {
//         await vonage.sms.send({to, from, text})
//         .then(resp => { console.log('Message sent successfully'); console.log(resp); })
//         .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
// }

// sendSMS();
// }


module.exports = controller;