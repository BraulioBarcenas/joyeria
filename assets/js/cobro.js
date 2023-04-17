document.querySelector('#botonPrimario1').addEventListener('click',()=>{
    window.location= location.origin + '/registro';
});
document.querySelector('#botonPrimario2').addEventListener('click',()=>{
    window.location= location.origin + '/buscador';
});

let carrito = [];
const inputCodigo = document.querySelector('#codigoInput');
const inputPago = document.querySelector('#pagoInput');

const getTotal = (carrito) => {
    let total = 0;
    for (const producto of carrito) {
        total = total + (producto.cantidad * producto.precio);
    }
    document.querySelector('#totaltxt').innerText = `Total:   $${total}`; 
    return total
}

inputPago.addEventListener('keyup',(e) => {
    if (e.key == 'Enter') {
        document.querySelector('#pago').innerText = `Pagó con: $${inputPago.value}`; 
        const total = getTotal(carrito);
        document.querySelector('#cambio').innerText = `Cambio: $${((inputPago.value)*1)-total}`; 
    }
})

inputCodigo.addEventListener('keyup',async (e) => {
    if (e.key == 'Enter') {
        let codigoSN = inputCodigo.value;
        inputCodigo.value = "";
        let productos= await $.post('/searchProducto',{like:false, codigo: codigoSN}); 
        if (productos.length != 0) {
            const tbodyTabla = document.querySelector('#tabla').querySelector('tbody');
            let searched = tbodyTabla.querySelectorAll('.searched');
            for (const search of searched) {
                tbodyTabla.removeChild(search);
            }
            for (let producto of productos) {
                if (carrito.length == 0) {
                    carrito.push(_.extend(producto, {cantidad: 0}));                            
                }
                for (const item of carrito) {
                    const tr = document.createElement('tr');   
                    if (item.codigo == producto.codigo) {
                        item.cantidad++;
                    
                    // Every: Si todos los del carrito tienen diferente codigo al del producto actual
                    }else if( _.every(carrito,(i) => {return i.codigo != producto.codigo}) ){
                        carrito.push(_.extend(producto, {cantidad: 0}));                                                            
                    }
                    tr.innerHTML = `<td style="border: 1px solid black" id="codigoCarrito">${item.codigo}</td>
                                    <td style="border: 1px solid black">${item.nombreProducto}</td>
                                    <td style="border: 1px solid black">${item.precio}</td>
                                    <td style="border: 1px solid black">${item.cantidad}</td>
                                    <td style="border: 1px solid black"><button onclick="eliminarProducto(this)">Eliminar</button></td>`
                    tr.style.textAlign = 'center';
                    tr.style.borderBottom= '1px black solid'
                    tr.className='searched';
                    tbodyTabla.appendChild(tr);
                }
            }
        }

        getTotal(carrito);
    }
})

const eliminarProducto = (e) => {
    const codigoDelete = e.parentElement.parentElement.querySelector('#codigoCarrito').innerText;
    const tbodyTabla = document.querySelector('#tabla').querySelector('tbody');
    let searched = tbodyTabla.querySelectorAll('.searched');
    const index = _.findIndex(carrito, (i) => {
        return i.codigo == codigoDelete;
    });

    if (carrito[index].cantidad == 1) {
        carrito = _.reject(carrito, (i) => {
            return i.codigo == codigoDelete;
        });                
    } else {
        carrito[index].cantidad--
    }

    for (const search of searched) {
        tbodyTabla.removeChild(search);
    }

    for (const item of carrito) {
        const tr = document.createElement('tr');   
        tr.innerHTML = `<td style="border: 1px solid black" id="codigoCarrito">${item.codigo}</td>
                        <td style="border: 1px solid black">${item.nombreProducto}</td>
                        <td style="border: 1px solid black">${item.precio}</td>
                        <td style="border: 1px solid black">${item.cantidad}</td>
                        <td style="border: 1px solid black"><button onclick="eliminarProducto(this)">Eliminar</button></td>`
        tr.style.textAlign = 'center';
        tr.style.borderBottom= '1px black solid'
        tr.className='searched';
        tbodyTabla.appendChild(tr);
    }

    getTotal(carrito);
    document.querySelector('#pago').innerText = `Pagó con: $${inputPago.value}`; 
    const total = getTotal(carrito);
    document.querySelector('#cambio').innerText = `Cambio: $${((inputPago.value)*1)-total}`; 
}

const comprar = async (carrito) => {
    if (carrito.length != 0) {
        for (const producto of carrito) {
            await $.post('/buy',producto);
        }
        location.replace(location.origin+'/cobro');
    }else{
        alert('No se han agregado articulos')
    }
}