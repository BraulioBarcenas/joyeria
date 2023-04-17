const header = document.querySelector('head');
let link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/css/productos.css';
// const tipo = location.pathname.split('/',3);
header.append(link); 
// header.append(document.write(`<link rel='stylesheet' href='/css/${tipo[tipo.length-1]}.css'></link>`)); 