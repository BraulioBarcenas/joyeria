const contFiltros = document.querySelector('#contFiltros');
let checksFiltros = contFiltros.querySelectorAll('input');
let path = location.pathname;
let checksSelected = [];


for (const check of checksFiltros) {
    check.addEventListener('change',(e) => {
        let idFiltro = e.target.id;
        let tipoFiltro = e.target.parentElement.id;
        let allProductos = document.querySelectorAll('.cardBox');

        // Click
        if (e.target.checked) {;
            checksSelected.push({idFiltro: idFiltro,tipoFiltro: tipoFiltro});
            
            for (const producto of allProductos) {
                producto.style.display = "none";
            }
            
            for (const filtro of checksSelected) {
                let productosFiltrados = document.querySelectorAll(`div[${filtro.tipoFiltro}='${filtro.idFiltro}']`);
                for (const producto of productosFiltrados) {
                    producto.style.display="block";
                }
            }
            console.log(checksSelected);           
        }
        
        // unClick
        if (e.target.checked == false) {
            // let productosOcultos = document.querySelectorAll(`div[style="display: none;"]`)
                        
            let filtro = checksSelected.find(filtro => filtro.idFiltro === e.target.id);
            checksSelected = _.without(checksSelected,filtro);
            
            for (const producto of allProductos) {
                producto.style.display = "none";
            }

            for (const producto of checksSelected) {
                document.querySelector(`div[${producto.tipoFiltro}='${producto.idFiltro}']`).style.display="block";
            }

            if (checksSelected.length == 0) {
                for (const producto of allProductos) {
                    producto.style.display = "block";
                }    
            }
            console.log(checksSelected);           
        }
    })

}
