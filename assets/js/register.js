function validar(){
    let inputs = document.querySelectorAll('input');
    const name = document.getElementById('name');
    const lastname1 = document.getElementById('lastname1');
    const lastname2 = document.getElementById('lastname2');
    const email = document.getElementById('email');
    const number = document.getElementById('number');
    const pass1 = document.getElementById('password');
    const pass2 = document.getElementById('password2');
    const question1 = document.querySelector('.question1');
    const question2 = document.querySelector('.question2');
    
    const patternName = /^[A-Z][a-z]+([ ][A-Z][a-z]+)?$/;
    const patternLastname1 = /^[A-Z][a-z]+([- ][A-Z][a-z]+)*$/;
    const patternLastname2 = /^[A-Z][a-z]+([- ][A-Z][a-z]+)*$/;
    const patternEmail = /^[\w.%+-]+@([\w-]+\.)+[\w]{2,}$/;
    const patternNumber = /^\+?\d{1,3}[\s-]?\(?\d{1,}\)?[\s-]?\d{1,}[\s-]?\d{1,}[\s-]?\d{1,}[\s-]?\d{1,}$/;
    const patternPass1 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,}$/;
    const patternPass2 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W)[a-zA-Z\d\W]{8,}$/;

    for (const input of inputs) {
        if (input.value == '') {
            input.style.borderColor = 'red';
            input.placeholder = 'Campo vacío';
        }
        else{
            input.style.borderColor = 'black';
            input.placeholder = '';
        }       
    }

    if (patternName.test(name.value) == false) {
        name.style.borderColor = 'red';
    }
    if (patternLastname1.test(lastname1.value) == false) {
        lastname1.style.borderColor = 'red';
    }
    if (patternLastname2.test(lastname2.value) == false) {
        lastname2.style.borderColor = 'red';
    }
    if (patternEmail.test(email.value) == false) {
        email.style.borderColor = 'red';
    }
    if (patternNumber.test(number.value) == false) {
        number.style.borderColor = 'red';
    }
    if (patternPass1.test(pass1.value) == false) {
        pass1.style.borderColor = 'red';
    }
    if (patternPass2.test(pass2.value) == false) {
        pass2.style.borderColor = 'red';
    }
    
    if (pass1.value != pass2.value) {
        pass2.placeholder = 'Las contraseñas no coinciden';
        pass2.value = '';
        pass2.style.borderColor = 'red';
    }
    
    if (question1.value == 0) {
        question1.style.borderColor = 'red';
    }else{
        question1.style.borderColor = 'black';
    }
    if (question2.value == 0) {
        question2.style.borderColor = 'red';
    }else{
        question2.style.borderColor = 'black';
    }

    // $('/login/register').submit(function(event){
    //     event.preventDefault();
    //     const email = $('#email').val();

    //     $.post('/login/register', { email }, function(response){
    //         if (response.exists) {
    //             alert('AQUI');
    //             const alertHTML = '<div id="resut">El correo electrónico ya ha sido utilizado</div>';
    //             $('#result').html(alertHTML);
    //         }
    //     });
    // });

    // $.post('/login/register')   
}