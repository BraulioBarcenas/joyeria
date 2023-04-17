let olvidar = document.getElementById('olvidar');
let element = document.getElementById('token');
// element.style.display = 'none';


function mostrar(){
    
    let element = document.getElementById('token');
    let check = document.getElementById('check');
    let olvidar = document.getElementById('olvidar');
    let login = document.getElementById('login');
    let email = document.getElementById('email');
    let pass = document.getElementById('pass');

    if (check.checked) {

        email.disabled = true;
        pass.disabled = true;
        
        olvidar.style.display = 'none';
        login.style.display = 'none';
        element.style.display = 'grid';
    }else{
        element.style.display = 'none'
        olvidar.style.display = 'grid';
        login.style.display = 'grid';
        email.disabled = false;
        pass.disabled = false;
    }
    
}
