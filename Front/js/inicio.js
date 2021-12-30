/**
 * Autor: J. Sebastián Beltrán S.
 * Fecha: 03/12/2021
 */
$(document).ready(function(){
    let userJson = sessionStorage.getItem("user");
    if (userJson == null){
        window.location.href = "ingreso.html";
    } else {
        let userJS = JSON.parse(userJson);
        identificarUsuario(userJS);
    
        $("#btn_mis_ordenes").click(function(){
            obtenerOrdenesAsesor(userJS.id);
        })
    }
})

/**
 * Mostrar tabla usuarios.
 */
$("#btn-admin-users").click(function(){
    $("#admin-prods").hide(1000);
    $("#admin-users").show(1000);
    obtenerInfoPersonal();
})

/**
 * Mostrar tabla productos.
 */
$("#btn-admin-prods").click(function(){
    $("#admin-users").hide(1000);
    $("#admin-prods").show(1000);
    obtenerInfoInventario();
})

/**
 * Mostrar menú crear órdenes.
 */
$("#btn_nueva_orden").click(function(){
    $("#crear_ordenes").show(1000);
    $("#mis_ordenes").hide(1000);
})

/**
 * Mostrar menú mis órdenes.
 */
$("#btn_mis_ordenes").click(function(){
    $("#crear_ordenes").hide(1000);
    $("#mis_ordenes").show(1000);
    $("#fecha_filtro").hide();
    $("#estado_filtro").hide();
})

/**
 * Mostrar filtro por fecha.
 */
$("#btn_filtro_fecha").click(function(){
    $("#fecha_filtro").show(500);
    $("#estado_filtro").hide(500);
})

/**
 * Mostrar filtro por estado.
 */
$("#btn_filtro_estado").click(function(){
    $("#estado_filtro").show(500);
    $("#fecha_filtro").hide(500);
})

/**
 * Cerrar sesión
 */
$("#btn-log-out").click(function(){
    sessionStorage.removeItem("user");
    window.location.href = "ingreso.html";
})

/**
 * Muestra en pantalla el nombre, el correo, el rol y la zona del usuario.
 * @param {user} userJS la información del usuario autenticado.
 */
function identificarUsuario(userJS){
    /**
     * Ajuste visual de rol de usuario.
     */
    let rolUser = "";

    switch(userJS.type){
        case "ADM":
            rolUser = "Administrador";
            break;
        case "COORD":
            rolUser = "Coordinador"
            break;
        case "ASE":
            rolUser = "Asesor de ventas"
            break;
    }

    /**
     * Mensaje de bienvenida para usuario.
     */
    let infoUser = "";
    infoUser += `<h3>¡Bienvenido!</h3>
                <p>Accediste como <strong>${userJS.name}</strong></p>
                <p>Email: <strong>${userJS.email}</strong></p>
                <p>Rol: <strong>${rolUser}</strong></p>
                <p>Zona: <strong>${userJS.zone}</strong></p>`

    $("#info_usuario").html(infoUser);
    
    /**
     * Habilitar opciones para cada perfil.
     */
    switch(rolUser){
        case "Administrador":
            $("#admin_index").show();
            $("#asesor_index").hide();
            $("#coord_index").hide();
            break;
        case "Coordinador":
            obtenerOrdenesZona(userJS.zone);
            $("#coord_index").show();
            $("#admin_index").hide();
            $("#asesor_index").hide();
            break;
        case "Asesor de ventas":
            obtenerProductos();
            obtenerOrdenesAsesor(userJS.id)
            $("#asesor_index").show();
            $("#coord_index").hide();
            $("#admin_index").hide();
            break;
    }
}
// ************************ FUNCIONES ASESOR **********************************
/**
 * Arreglo que contendrá las órdenes para detalle. 
 */
 let ordenesCompletas = [];
 let ordenesFecha = [];
 let ordenesEstado = [];

 /**
  * Aplicar filtros a la búsqueda de órdenes.
  */
function filtrarOrdenes(){
    /** Obtener id usuario.*/
    let userJson = sessionStorage.getItem("user");
    let userJS = JSON.parse(userJson);
    let idAsesor = userJS.id;

    /** Ejecutar si el filtro es por fecha*/
    if ($("#fecha_filtro").is(":visible")){
        /** Obtener fecha*/
        let dateOrden = $("#fecha_filtro").val();
        // Validar que se haya ingresado algún dato.
        if (dateOrden == ""){
            Swal.fire({
                icon:'warning',
                text:'Seleccione una fecha válida.'
            });
        } else {
            obtenerOrdenesFecha(dateOrden, idAsesor);
            // Ajustes visuales
            $("#btn_borrar_filtros").show(500);
            $("#todas_ordenes").hide(1000);
            $("#ordenes_estado").hide(1000);
            $("#ordenes_fecha").show(1000);
        }
    } else if ($("#estado_filtro").is(":visible")){
        /** Ejecutar si el filtro es por estado*/
        /** Obtener status*/
        let statusOrden = $("#estado_filtro").val();
        // Validar que se haya ingresado algún dato.
        if (statusOrden == "default"){
            Swal.fire({
                icon:'warning',
                text:'Seleccione un estado de pedido.'
            });
        } else {
            obtenerOrdenesEstado(statusOrden, idAsesor);
            // Ajustes visuales
            $("#btn_borrar_filtros").show(500);
            $("#todas_ordenes").hide(1000);
            $("#ordenes_fecha").hide(1000);
            $("#ordenes_estado").show(1000);
        }
    } else {
        /** Ejecutar si no se ha escogido ningún filtro*/
        Swal.fire({
            icon:'warning',
            text:'Ningún filtro seleccionado.'
        });
    }
}

/**
 * Oculta las tablas con las órdenes filtradas y muestra todas las órdenes.
 */
function borrarFiltros(){
    /** Limpiar filtros por estado*/
    $("#ordenes_estado").hide(1000);
    $("#tbody_ordenes_ase_estado").html("");
    $("tbody_detalle_orden_ase_estado").html("");
    $("detalle_orden_ase_estado").hide(500);
    $("#estado_filtro").hide(500);
    $("#estado_filtro").val("default");
    /** Limpiar filtros por fecha*/
    $("#ordenes_fecha").hide(1000);
    $("#tbody_ordenes_ase_fecha").html("");
    $("tbody_detalle_orden_ase_fecha").html("");
    $("detalle_orden_ase_fecha").hide(500);
    $("#fecha_filtro").hide(500);
    $("#fecha_filtro").val("");
    /** Mostrar tabla todas ordenes y ocultar botón borrar filtrados*/
    $("#todas_ordenes").show(1000);
    $("#btn_borrar_filtros").hide(500);
    /** Ocultar alertas*/
    $("#alert_no_orders_filtro").hide(500);
}

/**
  * Recupera las ordenes creadas por un usuario específico.
  * @param {String} idAsesor el id del asesor.
  */
function obtenerOrdenesAsesor(idAsesor){
    // Petición asíncrona para obtener las órdenes de un asesor
    $.ajax({
        url:`http://140.238.179.6:8081/api/order/salesman/${idAsesor}`,
        method:'GET',
        dataType:'json',
        contentType:'application/JSON',
        success:function(response){
            if (response.length <= 0){
                $("#alert_no_orders").show(500);
                $("#ordenes_asesor").hide();
            } else {
                $("#alert_no_orders").hide();
                let idTabla = "#ordenes_asesor";
                let idBody = "#tbody_ordenes_asesor"
                listarOrdenesAsesor(response, idTabla, idBody);
            }
        },
        error:function(xhr, status){
            $("#alert_error").show(500);
        },
        complete:function(xhr, status){
            $("#alert_consulta").show();
            $("#alert_consulta").hide(4000);
        }
    });
}

/**
  * Recupera las ordenes creadas en una fecha específica por un asesor determinado.
  * @param {String} dateOrden la fecha de la orden
  * @param {String} idAsesor el id del asesor.
  */
 function obtenerOrdenesFecha(dateOrden, idAsesor){
    // Petición asíncrona para obtener las órdenes de un asesor
    $.ajax({
        url:`http://140.238.179.6:8081/api/order/date/${dateOrden}/${idAsesor}`,
        method:'GET',
        dataType:'json',
        contentType:'application/JSON',
        success:function(response){
            if (response.length <= 0){
                $("#alert_no_orders_filtro").show(500);
                $("#ordenes_ase_fecha").hide();
            } else {
                $("#alert_no_orders_filtro").hide();
                let idTabla = "#ordenes_ase_fecha";
                let idBody = "#tbody_ordenes_ase_fecha"
                listarOrdenesAsesor(response, idTabla, idBody);
            }
        },
        error:function(xhr, status){
            $("#alert_error").show(500);
        },
        complete:function(xhr, status){
            $("#alert_consulta").show();
            $("#alert_consulta").hide(4000);
        }
    });
}

/**
  * Recupera las ordenes creadas por un asesor determinado con un estado determinado.
  * @param {String} statusOrden el estado de la orden
  * @param {String} idAsesor el id del asesor.
  */
 function obtenerOrdenesEstado(statusOrden, idAsesor){
    // Petición asíncrona para obtener las órdenes de un asesor
    $.ajax({
        url:`http://140.238.179.6:8081/api/order/state/${statusOrden}/${idAsesor}`,
        method:'GET',
        dataType:'json',
        contentType:'application/JSON',
        success:function(response){
            if (response.length <= 0){
                $("#alert_no_orders_filtro").show(500);
                $("#ordenes_ase_estado").hide();
            } else {
                $("#alert_no_orders_filtro").hide();
                let idTabla = "#ordenes_ase_estado";
                let idBody = "#tbody_ordenes_ase_estado"
                listarOrdenesAsesor(response, idTabla, idBody);
            }
        },
        error:function(xhr, status){
            $("#alert_error").show(500);
        },
        complete:function(xhr, status){
            $("#alert_consulta").show();
            $("#alert_consulta").hide(4000);
        }
    });
}

/**
 * Añade la información de las órdenes a las tablas correspondientes.
 * @param {Array} items las órdenes encontradas en BD.
 * @param {String} idTabla el id de la tabla en la que se insertarán los datos.
 * @param {String} idBody el id del body de la tabla en la que se insertarán los datos.
 */
 function listarOrdenesAsesor(items, idTabla, idBody){
    // Escoger arreglo que se usará e ids tablas detalles.
    let arreglo = null;
    let idTablaDetalle = "";
    let idBodyDetalle = "";

    switch(idTabla){
        case "#ordenes_asesor":
            ordenesCompletas = [];
            ordenesCompletas = items;
            arreglo = ordenesCompletas;
            idTablaDetalle = "#detalle_orden_asesor";
            idBodyDetalle = "#tbody_detalle_orden_asesor";
            break;
        case "#ordenes_ase_fecha":
            ordenesFecha = [];
            ordenesFecha = items;
            arreglo = ordenesFecha;
            idTablaDetalle = "#detalle_orden_ase_fecha";
            idBodyDetalle = "#tbody_detalle_orden_ase_fecha";
            break;
        case "#ordenes_ase_estado":
            ordenesEstado = [];
            ordenesEstado = items;
            arreglo = ordenesEstado;
            idTablaDetalle = "#detalle_orden_ase_estado";
            idBodyDetalle = "#tbody_detalle_orden_ase_estado";
            break;
    }
    // Limpiar body tabla
    $(idBody).html("");
    // Contenido de la tabla
    let contentTabla = "";

    for (i=0; i<arreglo.length; i++){
        // Ajuste fecha de orden
        let fecha = arreglo[i].registerDay;
        let fechaAjuste = fecha.substring(0, 10);
        contentTabla += `<tr>
                            <td>${arreglo[i].id}</td>
                            <td>${fechaAjuste}</td>
                            <td>${arreglo[i].status}</td>
                            <td><button onclick='listarDetalleAsesor(${arreglo[i].id}, "${idTablaDetalle}", "${idBodyDetalle}")'>Ver detalle</button></td>
                        </tr>`;
    }

    // Añadir contenido a body tabla ordenes coord
    $(idBody).html(contentTabla);
    // Mostrar tabla
    $(idTabla).show(500);
}

/**
 * Añade los detalles de la orden a la tabla detalle_orden.
 * @param {Integer} idOrden el id de la orden que se listará.
 * @param {String} idTablaDetalle el id de la tabla detalle.
 * @param {String} idBodyDetalle el id del body de la tabla detalle.
 */
 function listarDetalleAsesor(idOrden, idTablaDetalle, idBodyDetalle){
    // Limpiar body tabla detalle_orden
    $(idBodyDetalle).html("");
    // Decidir qué arreglo se recorrerá
    let arreglo = null;

    switch(idTablaDetalle){
        case "#detalle_orden_asesor":
            arreglo = ordenesCompletas;
            break;
        case "#detalle_orden_ase_fecha":
            arreglo = ordenesFecha;
            break;
        case "#detalle_orden_ase_estado":
            arreglo = ordenesEstado;
            break;
    }
    // Bandera de posición de la orden en ordenes[]
    let indexOrden = 0;
    // Obtener posición de la orden en ordenes[]
    for (i=0; i<arreglo.length; i++){
        if (arreglo[i].id == idOrden){
            indexOrden = i;
            break;
        }
    }
    // Obtener productos de la orden
    let prodsOrden = arreglo[indexOrden].products;
    let cantOrden = arreglo[indexOrden].quantities;
    // Obtener información para añadir en tabla detalle_orden
    let contentTabla = "";

    Object.entries(prodsOrden).forEach(([key, value]) =>{
        // Ajuste de disponibilidad
        let disponibilidad = "";
        if (value.availability){
            disponibilidad = "SÍ";
        } else {
            disponibilidad = "NO";
        }
        
        contentTabla += `<tr>
                            <td>${idOrden}</td>
                            <td>${value.reference}</td>
                            <td>${cantOrden[key]}</td>
                            <td>${value.price}</td>
                            <td>${disponibilidad}</td>
                            <td>${value.quantity}</td>
                        </tr>`;
    })
    
    // Añadir botón ocultar detalle a tabla detalle_orden
    contentTabla += `<tr>
                        <td colspan=6><button onclick='ocultarDetalleAsesor("${idTablaDetalle}", "${idBodyDetalle}")'>Ocultar detalle</button></td>
                    </tr>`
    // Añadir info a tabla detalle_orden
    $(idBodyDetalle).html(contentTabla);
    // Mostrar tabla
    $(idTablaDetalle).show(500);
}

/**
 * Limpia y oculta la tabla detalle_orden.
 */
function ocultarDetalleAsesor(idTablaDetalle, idBodyDetalle){
    // Ocultar tabla detalle_orden
    $(idTablaDetalle).hide(500);
    
    // Limpiar tabla detalle_orden
    $(idBodyDetalle).html("");
}

/**
 * Arreglos que contendrán las órdenes creadas.
 */
let productosBD = [];
let productosSeleccionados = [];
let cantidadesSeleccionadas = {};

/**
 * Recupera los productos guardados en la BD.
 */
function obtenerProductos(){
    /**
     * Petición ajax
     */
    $.ajax({
        url:'http://140.238.179.6:8081/api/supplements/all',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            if (response.length <= 0){
                $("#alert_no_resul").show(500);
            } else {
                $("#alert_no_resul").hide();
                listarProductos(response);
            }
        },
        error:function(xhr, status){
            $("#alert_error").show(500);
        },
        complete:function(xhr, status){
            $("#alert_consulta").show();
            $("#alert_consulta").hide(4000);
        }
    })
}

/**
 * Añade los datos recuperados a la tabla de Productos.
 * @param {Array} items los datos recuperados de la BD.
 */
 function listarProductos(items){
    /**
     * Añadir productos a productosBD[] para manejo en memoria.
     */
    productosBD = items;
    /**
     * Limpiar espacio en tabla.
     */
    $("#tbody_prods_asesor").html("");
    /**
      * Formatear info.
      */
    let contentTabla = "";
    
    for (i=0; i<items.length; i++){
        contentTabla += `<tr>
                            <td>${items[i].reference}</td>
                            <td>${items[i].brand}</td>
                            <td>${items[i].description}</td>
                            <td>${items[i].price}</td>
                            <td>${items[i].quantity}</td>
                            <td><input type="text" id="cantidad_${items[i].reference}" size=8/></td>
                            <td><button onclick="cargarProductoOrden(${i})">Agregar</button></td>
                        </tr>`
    }
    /**
     * Añadir info a tabla.
     */
    $("#tbody_prods_asesor").html(contentTabla);
    
    /**
     * Mostrar tabla.
     */
     $("#prods_asesor").show(1500);
}

/**
 * Añadir el producto y la cantidad del mismo a los arreglos
 * productosSeleccionados[] y cantidadesSeleccionadas[].
 * @param {Integer} index el índice del producto que se cargará.
 */
function cargarProductoOrden(index){
    // Recuperar producto seleccionado del array productos[].
    let producto = productosBD[index];
    // Referencia del producto para cantidadesSeleccionadas[].
    let referenciaProducto = producto.reference;
    // Recuperar cantidades ingresadas por el usuario.
    let cantidadProducto = parseInt($(`#cantidad_${referenciaProducto}`).val());
    // Validar que la cantidad ingresada sea mayor a 0.
    if (validarCantidadProducto(cantidadProducto)){
        //Validar que el producto no exista en productosSeleccionados[].
        if (validarExistenciaProducto(referenciaProducto)){
            cantidadesSeleccionadas[referenciaProducto] = cantidadesSeleccionadas[referenciaProducto] + cantidadProducto;
        } else {
            productosSeleccionados.push(producto);
            cantidadesSeleccionadas[referenciaProducto]= cantidadProducto;
        }
        // Limpiar campo cantidad productos.
        $(`#cantidad_${referenciaProducto}`).val("");
        // Mostrar productos de la orden en tabla orden_asesor.
        listarProductosOrden();
    } else {
        // Limpiar campo cantidad productos.
        $(`#cantidad_${referenciaProducto}`).val("");
    }
}

/**
 * Valida que la cantidad ingresada por el usuario sea mayor a 0.
 * @param {Integer} cantidad la cantidad de productos ingresada por el usuario. 
 * @returns true si la cantidad > 0; false en caso contrario.
 */
function validarCantidadProducto(cantidadProducto){
    // Bandera cantidad válida.
    let cantidadValida = false;

    if (isNaN(cantidadProducto) || cantidadProducto <= 0){
        cantidadValida = false;
        Swal.fire({
            icon: 'warning',
            title: 'Cantidad no válida.',
            text: 'La cantidad debe ser mayor a 0.'
        });     
    } else {
        cantidadValida = true;
    }

    return cantidadValida;
}

/**
 * Valida que el producto no exista en productosSeleccionados[].
 * @param {String} referenciaProducto la referencia del producto.
 * @returns true si el producto existe; false en caso contrario.
 */
function validarExistenciaProducto(referenciaProducto){
    // Bandera existencia producto en productosSeleccionados[].
    let existeProducto = false;

    for (i=0; i < productosSeleccionados.length; i++){
        if (referenciaProducto == productosSeleccionados[i].reference){
            existeProducto = true;
            break;
        } else {
            existeProducto = false;
        }
    }

    return existeProducto;
}

/**
 * Añade los elementos de productosSeleccionados[] y cantidadesSelccionadas[]
 * a la tabla orden_asesor.
 */
function listarProductosOrden(){
    // Limpiar tabla
    $("#tbody_orden_asesor").html("");
    // Longitud productosSeleccionados[]
    let longArreglo = productosSeleccionados.length;
    // Ocultar la tabla si no hay productos para listar (ajuste para borrado)
    if (longArreglo == 0){
        $("#orden_asesor").hide(500);
    } else {
        // Variable para tener subtotal de productos seleccionados.
        let subtotal = 0;
        // contenido html de la orden
        let contentOrder = "";
        for (i=0; i<longArreglo; i++){
            let referenciaProducto = productosSeleccionados[i].reference;
            contentOrder += `<tr>
                                <td>${referenciaProducto}</td>
                                <td>${cantidadesSeleccionadas[referenciaProducto]}</td>
                                <td>${productosSeleccionados[i].price}</td>
                                <td><button onclick='eliminarProductoOrden("${referenciaProducto}")'>Eliminar</button></td>
                            </tr>`
            subtotal += parseInt(cantidadesSeleccionadas[referenciaProducto]) * parseInt(productosSeleccionados[i].price);
        }
        // Añadir total y botón procesar orden.
        contentOrder += `<tr>
                            <td colspan=2><strong>Total</strong></td>
                            <td>${subtotal}</td>
                            <td><button onclick="prepararOrden()">Procesar</button></td>
                        </tr>`
        // Añadir contenido a tabla orden_asesor
        $("#tbody_orden_asesor").html(contentOrder);
        // Mostrar tabla orden_asesor
        $("#orden_asesor").show(500);
    }
}

/**
 * Crea un objeto orden con todos los elementos necesarios para
 * crear una orden en la BD.
 */
function prepararOrden(){
    // Recuperar usuario de sessionStorage.
    let userJson = sessionStorage.getItem("user");
    // Convertir userJson a formato JS.
    let userOrder = JSON.parse(userJson);
    //Objetos para crear orden.
    let productosOrden = {};
    let cantidadesOrden = {};
    // Cargar datos en productosOrden y cantidadesOrden.
    for (i=0; i<productosSeleccionados.length; i++){
        let referenciaProducto = productosSeleccionados[i].reference;
        productosOrden[referenciaProducto] = productosSeleccionados[i];
        cantidadesOrden[referenciaProducto] = cantidadesSeleccionadas[referenciaProducto];
    }
    // Objeto orden
    let orden = {
        registerDay: obtenerFechaRegistro(),
        status: "Pendiente",
        salesMan: userOrder,
        products: productosOrden,
        quantities: cantidadesOrden
    }
    // Convertir objeto orden a JSON
    let ordenJSON = JSON.stringify(orden);
    // Crear orden en BD.
    //crearOrdenBD(ordenJSON);
    $.ajax({
        url:"http://140.238.179.6:8081/api/order/new",
        method: 'POST',
        data: ordenJSON,
        //dataType: 'json',
        contentType: 'application/JSON',
        success: function(response){
            // Notificar registro exitoso.
            Swal.fire({
                icon: 'success',
                title: 'Excelente',
                text: `¡Orden ${response.id} creada con éxito!` 
            });
            // Limpiar tabla orden y ocultarla
            $("#tbody_orden_asesor").html("");
            $("#orden_asesor").hide();
            // Vaciar arreglos con productos y cantidades
            productosSeleccionados = [];
            cantidadesSeleccionadas = [];
        },
        error: function(xhr, status){
            console.log(xhr);
        }
    });
}

/**
 * Crea una orden en la BD.
 * @param {objeto JSON} orden la orden que se creará. 
 */
function crearOrdenBD(orden){
    console.log(orden);
    // Petición asíncrona para crear orden en BD.
    $.ajax({
        url:"http://140.238.179.6:8081/api/order/new",
        method: 'POST',
        data: orden,
        dataType: 'json',
        contentType: 'application/JSON',
        success: function(response){
            // Notificar registro exitoso.
            Swal.fire({
                icon: 'success',
                title: 'Excelente',
                text: `¡Orden ${response.id} creada con éxito!` 
            });
            // Limpiar tabla orden y ocultarla
            $("#tbody_orden_asesor").html("");
            $("#orden_asesor").hide();
            // Vaciar arreglos con productos y cantidades
            productosSeleccionados = [];
            cantidadesSeleccionadas = [];
        },
        error: function(xhr, status){
            console.log(xhr);
        }
    });
}

/**
 * Obtener fecha del sistema a la hora de procesar la orden.
 * @returns una fecha en formato yyyy-MM-ddTHH:mm:ss
 */
function obtenerFechaRegistro(){
    // Objeto date.
    let date = new Date();
    // Obtener yyyy-MM-dd.
    let fecha = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    // Crear fecha con tiempo 00:00:00.000
    let fechaRegistro = `${fecha}T00:00:00.000`;

    return fechaRegistro;
}

/**
 * Elimina el producto seleccionado de la orden.
 * @param {String} referencia la referencia del producto a borrar.
 */
function eliminarProductoOrden(referencia){
    // Bandera index
    let indexProducto = 0;
    // Encontrar index del producto en productosSeleccionados[]
    for (i=0; i<productosSeleccionados.length; i++){
        if (productosSeleccionados[i].reference == referencia){
            indexProducto = i;
            break;
        }
    }
    // Remover elemento de productosSeleccionados[]
    productosSeleccionados.splice(indexProducto, 1);
    // Remover cantidades de cantidadesSeleccionados{}
    delete cantidadesSeleccionadas.reference;

    // Listar productos pertenecientes a la orden
    listarProductosOrden();
}

// ************************** FUNCIONES COORDINADOR ************************
/**
 * Arreglo que contendrá las órdenes para detalle. 
 */
let ordenes = [];

/**
 * Recupera las ordenes creadas en una zona específica.
 * @param {String} zona la zona asociada al coordinador.
 */
function obtenerOrdenesZona(zona){
    // Petición asíncrona para obtener las órdenes de una zona
    $.ajax({
        url:`http://140.238.179.6:8081/api/order/zona/${zona}`,
        method:'GET',
        dataType:'json',
        contentType:'application/JSON',
        success:function(response){
            if (response.length <= 0){
                $("#alert_no_resul").show(500);
            } else {
                $("#alert_no_resul").hide();
                listarOrdenesZona(response);
            }
        },
        error:function(xhr, status){
            $("#alert_error").show(500);
        },
        complete:function(xhr, status){
            $("#alert_consulta").show();
            $("#alert_consulta").hide(4000);
        }
    });
}

/**
 * Añade la información de las órdenes a la tabla ordenes_coord
 * @param {Array} items las órdenes encontradas en BD.
 */
function listarOrdenesZona(items){
    // Limpiar arreglo y luego guardar órdenes en ordenes[]
    ordenes = [];
    ordenes = items;
    // Limpiar body tabla ordenes coord
    $("#tbody_ordenes_coord").html("");
    // Contenido de la tabla ordenes coord
    let contentTabla = "";

    for (i=0; i<items.length; i++){
        contentTabla += `<tr>
                            <td>${items[i].id}</td>
                            <td>${items[i].salesMan.name}</td>
                            <td>
                                <select id="status_orden_${items[i].id}">
                                    <option value="Aprobada">Aprobada</option>
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Rechazada">Rechazada</option>
                                </select>
                            </td>
                            <td><button onclick='actualizarEstado(${items[i].id})'>Guardar estado</button></td>
                            <td><button onclick='listarDetalle(${items[i].id})'>Ver detalle</button></td>
                        </tr>`;
    }

    // Añadir contenido a body tabla ordenes coord
    $("#tbody_ordenes_coord").html(contentTabla);
    // Añadir status actual de la orden a la tabla
    for (i=0; i<items.length; i++){
        $("#status_orden_"+items[i].id).val(items[i].status);
    }
    // Mostrar tabla
    $("#ordenes_coord").show(500);
}

/**
 * Actualiza el estado de una orden.
 * @param {Integer} idOrden el id de la orden que se actualizará. 
 */
function actualizarEstado(idOrden){
    // Objeto JS con la info de actualización
    let data = {
        id: idOrden,
        status: $("#status_orden_"+idOrden).val()
    }
    // Objeto JSON con la info de actualización
    let dataJSON = JSON.stringify(data);
    // Petición asíncrona para actualizar el estado de la orden.
    $.ajax({
        url:"http://140.238.179.6:8081/api/order/update",
        method:'PUT',
        data:dataJSON,
        dataType:'json',
        contentType:'application/JSON',
        success:function(response){
            Swal.fire({
                icon:'success',
                title:'Orden actualizada',
                text:`Orden ${response.id} actualizada con éxito.`
            });
            obtenerOrdenesZona(response.salesMan.zone);
            ocultarDetalle();
        },
        error:function(xhr, status){
            Swal.fire({
                icon:'error',
                title:'Error',
                text:'No puedo actualizarse la orden. Consulte con un administrador.'
            })
        }
    });
}

/**
 * Añade los detalles de la orden a la tabla detalle_orden.
 * @param {Integer} idOrden el ide de la orden que se listará.
 */
function listarDetalle(idOrden){
    // Limpiar body tabla detalle_orden
    $("#tbody_detalle_orden").html("");
    // Bandera de posición de la orden en ordenes[]
    let indexOrden = 0;
    // Obtener posición de la orden en ordenes[]
    for (i=0; i<ordenes.length; i++){
        if (ordenes[i].id == idOrden){
            indexOrden = i;
            break;
        }
    }
    // Obtener productos de la orden
    let prodsOrden = ordenes[indexOrden].products;
    let cantOrden = ordenes[indexOrden].quantities;
    // Obtener información para añadir en tabla detalle_orden
    let contentTabla = 0;

    Object.entries(prodsOrden).forEach(([key, value]) =>{
        // Ajuste de disponibilidad
        let disponibilidad = "";
        if (value.availability){
            disponibilidad = "SÍ";
        } else {
            disponibilidad = "NO";
        }
        
        contentTabla += `<tr>
                            <td>${idOrden}</td>
                            <td>${value.reference}</td>
                            <td>${cantOrden[key]}</td>
                            <td>${value.price}</td>
                            <td>${disponibilidad}</td>
                            <td>${value.quantity}</td>
                        </tr>`;
    })
    
    // Añadir botón ocultar detalle a tabla detalle_orden
    contentTabla += `<tr>
                        <td colspan=6><button onclick="ocultarDetalle()">Ocultar detalle</button></td>
                    </tr>`
    // Añadir info a tabla detalle_orden
    $("#tbody_detalle_orden").html(contentTabla);
    // Mostrar tabla
    $("#detalle_orden").show(500);
}

/**
 * Limpia y oculta la tabla detalle_orden.
 */
function ocultarDetalle(){
    // Ocultar tabla detalle_orden
    $("#detalle_orden").hide(500);
    
    // Limpiar tabla detalle_orden
    $("#tbody_detalle_orden").html("");
}

// ************************ FUNCIONES ADMIN ***********************************
// ============== Funciones usuarios =======================================
/**
 * Recupera los registros de usuarios de la BD.
 */
 function obtenerInfoPersonal(){
    /**
     * Petición ajax
     */
    $.ajax({
        url:'http://140.238.179.6:8081/api/user/all',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            if (response.length <= 0){
                $("#alert_no_resul").show(500);
                $("#btn-agregar-user").show(2000);
            } else {
                $("#alert_no_resul").hide();
                $("#btn-agregar-user").show(2000);
                listarInfoPersonal(response);
            }
        },
        error:function(xhr, status){
            $("#alert_error").show(500);
            $("#espacio-btn").hide();
        },
        complete:function(xhr, status){
            $("#alert_consulta").show();
            $("#alert_consulta").hide(4000);
        }
    })
}

/**
 * Añade los datos recuperados a la tabla de Personal.
 * @param {Array} items los datos recuperados de la BD.
 */
function listarInfoPersonal(items){
    /**
     * Habilitar div de personal.
     */
     $("#admin-users").show();
    /**
     * Limpiar espacio en tabla.
     */
     $("#body-tabla-user").html("");

     /**
      * Formatear info.
      */
    let contentTabla = "";
    for (i=0; i<items.length; i++){
        // Ajuste de rol de usuario
        let rolUser = "";

        switch(items[i].type){
            case "ADM":
                rolUser = "Administrador";
                break;
            case "COORD":
                rolUser = "Coordinador"
                break;
            case "ASE":
                rolUser = "Asesor de ventas"
                break;
        }

        contentTabla += `<tr>
                            <td><button class="btn-editar" onclick="cargarDatosActualizar(${items[i].id})" data-toggle="modal" data-target="#modalEditarUser">Editar</button></td>
                            <td><button class="btn-eliminar" onclick="cargarDatosEliminar(${items[i].id})" data-toggle="modal" data-target="#modalEliminarUser">Eliminar</button></td>
                            <td>${items[i].identification}</td>
                            <td>${items[i].name}</td>
                            <td>${items[i].email}</td>
                            <td>${items[i].cellPhone}</td>
                            <td>${rolUser}</td>
                            <td>${items[i].zone}</td>
                        </tr>`
    }
    /**
     * Añadir info a tabla.
     */
    $("#body-tabla-user").html(contentTabla);
    /**
     * Mostrar tabla.
     */
    $("#tabla-personal").show(1500);
}

/**
 * Valida que todos los campos del formulario agregar usuario estén llenos
 * y que no exista un usuario con el email ingresado.
 */
 function validarAgregarUsuario(){
    
    if (validarCamposRegistro()){
        validarExistenciaEmail($("#email_user").val());
    } else {
        Swal.fire({
            icon: 'warning',
            title: '¡Hey!',
            text: 'Llena todos los campos antes de continuar.'
        });
    }
}

/**
 * Valida que el email con el que se registra un nuevo usuario no exista ya
 * en la BD.
 * @param {String} email el email que se validará.
 */
function validarExistenciaEmail(email){
    $.ajax({
        url:'http://140.238.179.6:8081/api/user/emailexist/'+email,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            if (response == false){
                registrarUsuario();
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Atención',
                    text: 'Ya existe un usuario con ese email.'
                });
                // Mostrar error en formulario
                $("#error_email").html("Ya existe un usuario con este email.");
                $("#email_user").css("border", "2px solid red");
            }
        }
    });
}

/**
 * Petición POST para registrar un usuario en BD.
 */
function registrarUsuario(){
    /**
     * Recuperación datos ingresados
     */
    let datosUsuario = {
        identification: $("#identification_user").val(),
        name: $("#name_user").val(),
        address: $("#address_user").val(),
        birthtDay: $("#birthday_user").val()+"T00:00:00.000",
        monthBirthtDay: $("#birthday_user").val().substring(5, 7),
        cellPhone: $("#cellphone_user").val(),
        email: $("#email_user").val(),
        password: $("#password_user").val(),
        zone: $("#zone_user").val(),
        type: $("#type_user").val()
    }
    /**
     * Conversión a formato JSON.
     */
    let datosEnvio = JSON.stringify(datosUsuario);
    /**
    * Registrar el usuario a través de una petición POST.
    */
    $.ajax({
        url:"http://140.238.179.6:8081/api/user/new",
        method:'POST',
        data: datosEnvio,
        dataType:'json',
        contentType: 'application/JSON',
        success:function(response){
            Swal.fire({
                icon: 'success',
                title: '¡Usuario registrado!',
                text: `Usuario ${response.name} registrado con éxito.`
            });
            $("#modalAgregarUser").modal('hide');
            limpiarCamposRegistro();
            obtenerInfoPersonal();
        },
        error:function(hxr, status){
            Swal.fire({
                icon: 'warning',
                title: 'Error',
                text: 'Consulte con el administrador.'
            });
        }
    });
}

/**
 * Valida que todos los campos contengan información.
 * @returns true si todos los campos son válidos; false en cualquier otro escenario.
 */
function validarCamposRegistro(){
    /**
     * Variables para controlar la validación de los campos.
     */
    var statusIdentification = false;
    var statusName = false;
    var statusBirthday = false;
    var statusAddress = false;
    var statusCellPhone = false;
    var statusEmail = false;
    var statusPassword = false;
    var statusZone = false;
    var statusType = false;

    /**
     * Validar campo identificación
     */
     if ($("#identification_user").val().trim()==""){
        $("#error_identification").html("Por favor llene este campo.");
        $("#identification_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusIdentification = false;
    } else {
        $("#error_identification").html("");
        $("#identification_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusIdentification = true;
    }

    /**
     * Validar campo nombre
     */
     if ($("#name_user").val().trim()==""){
        $("#error_name").html("Por favor llene este campo.");
        $("#name_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusName = false;
    } else {
        $("#error_name").html("");
        $("#name_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusName = true;
    }

    /**
     * Validar campo fecha nacimiento
     */
     if ($("#birthday_user").val().trim()==""){
        $("#error_birthday").html("Por favor seleccione una fecha.");
        $("#birthday_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusBirthday = false;
    } else {
        $("#error_birthday").html("");
        $("#birthday_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusBirthday = true;
    }

    /**
     * Validar campo dirección
     */
     if ($("#address_user").val().trim()==""){
        $("#error_address").html("Por favor llene este campo.");
        $("#address_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusAddress = false;
    } else {
        $("#error_address").html("");
        $("#address_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusAddress = true;
    }

    /**
     * Validar campo celular.
     */
     if ($("#cellphone_user").val().trim()==""){
        $("#error_cellphone").html("Por favor llene este campo.");
        $("#cellphone_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusCellPhone = false;
    } else {
        $("#error_cellphone").html("");
        $("#cellphone_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusCellPhone = true;
    }

    /**
     * Validar campo email
     */
     if ($("#email_user").val().trim()==""){
        $("#error_email").html("Por favor llene este campo.");
        $("#email_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusEmail = false;
    } else {
        $("#error_email").html("");
        $("#email_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusEmail = true;
    }

    /**
     * Validar campo contraseña
     */
     if ($("#password_user").val().trim()==""){
        $("#error_password").html("Por favor llene este campo.");
        $("#password_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusPassword = false;
    } else {
        $("#error_password").html("");
        $("#password_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusPassword = true;
    }

    /**
     * Validar campo zona
     */
     if ($("#zone_user").val()=="default"){
        $("#error_zone").html("Por favor seleccione una zona.");
        $("#zone_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusZone = false;
    } else {
        $("#error_zone").html("");
        $("#zone_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusZone = true;
    }

    /**
     * Validar campo categoría
     */
     if ($("#type_user").val()=="default"){
        $("#error_type").html("Por favor seleccione una categoría.");
        $("#type_user").css("border", "2px solid red");

        // Cambiar estado de validación
        statusType = false;
    } else {
        $("#error_type").html("");
        $("#type_user").css("border", "2px solid green");

        // Cambiar estado de validación
        statusType = true;
    }

    return (statusIdentification && statusName && statusBirthday && statusAddress &&
            statusCellPhone && statusEmail && statusPassword && statusZone & statusType);
}

/**
 * Limpia los campos del formulario.
 */
 function limpiarCamposRegistro(){

    $("#identification_user").val("");
    $("#identification_user").css("border", "1px solid #ced4da");

    $("#name_user").val("");
    $("#name_user").css("border", "1px solid #ced4da");

    $("#birthday_user").val("");
    $("#birthday_user").css("border", "1px solid #ced4da");
    
    $("#address_user").val("");
    $("#address_user").css("border", "1px solid #ced4da");
    
    $("#cellphone_user").val("");
    $("#cellphone_user").css("border", "1px solid #ced4da");

    $("#email_user").val("");
    $("#email_user").css("border", "1px solid #ced4da");

    $("#password_user").val("");
    $("#password_user").css("border", "1px solid #ced4da");

    $("#zone_user").val("default"),
    $("#zone_user").css("border", "1px solid #ced4da");

    $("#type_user").val("default")
    $("#type_user").css("border", "1px solid #ced4da");

    $("#identification_user").focus();
}

/**
 * Recupera la info del User de la BD y la añade a los campos del
 * formulario actualizar.
 * @param {Integer} idUsuario el id del usuario que se recuperará.
 */
function cargarDatosActualizar(idUsuario){
    // Obtener datos de usuario y añadirlos a los campos del formulario.
    $.ajax({
        url:'http://140.238.179.6:8081/api/user/'+idUsuario,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            // Ajuste de fecha
            let birthday = response.birthtDay;
            let birthdayAjustado = birthday.substring(0, 10);
            
            $("#id_user_edit").val(response.id),
            $("#identification_user_edit").val(response.identification),
            $("#name_user_edit").val(response.name),
            $("#birthday_user_edit").val(birthdayAjustado),
            $("#address_user_edit").val(response.address),
            $("#cellphone_user_edit").val(response.cellPhone),
            $("#email_user_edit").val(response.email),
            $("#password_user_edit").val(response.password),
            $("#zone_user_edit").val(response.zone),
            $("#type_user_edit").val(response.type)
        }
    });
}

/**
 * Actualiza la información de un usuario.
 */
 function actualizarUsuario(){
    
    if (validarCamposActualizar()){
        /**
         * Recuperación datos ingresados
         */
        let datosUsuario = {
            id: $("#id_user_edit").val(),
            identification: $("#identification_user_edit").val(),
            name: $("#name_user_edit").val(),
            birthtDay: $("#birthday_user_edit").val()+"T00:00:00.000",
            monthBirthtDay: $("#birthday_user_edit").val().substring(5, 7),
            address: $("#address_user_edit").val(),
            cellPhone: $("#cellphone_user_edit").val(),
            email: $("#email_user_edit").val(),
            password: $("#password_user_edit").val(),
            zone: $("#zone_user_edit").val(),
            type: $("#type_user_edit").val()
        }
        /**
         * Conversión a formato JSON.
         */
        let datosEnvio = JSON.stringify(datosUsuario);
        /**
        * Registrar el usuario a través de una petición POST.
        */
        $.ajax({
            url:"http://140.238.179.6:8081/api/user/update",
            method:'PUT',
            data: datosEnvio,
            dataType:'json',
            contentType: 'application/JSON',
            success:function(response){
                console.log(response)
                Swal.fire({
                    icon: 'success',
                    title: '¡Usuario actualizado!',
                    text: 'Usuario actualizado con éxito.'
                });
                $("#modalEditarUser").modal('hide');
                limpiarCamposActualizar();
                obtenerInfoPersonal();
            },
            error:function(hxr, status){
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'Consulte con el administrador.'
                });
            }
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: '¡Hey!',
            text: 'Llena todos los campos antes de continuar.'
        });
    }
}

/**
 * Recupera la info del User que se borrará.
 * @param {Integer} idUsuario el id del usuario que se recuperará.
 */
function cargarDatosEliminar(idUsuario){
    // Obtener datos de usuario y añadirlos a la advertencia de borrado.
    $.ajax({
        url:'http://140.238.179.6:8081/api/user/'+idUsuario,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            let advertencia = `¿Quiere borrar al usuario ${response.name}?`
            $("#advertencia_borrar").html(advertencia);
            $("#id_borrado").html(response.id);
        }
    });
}

/**
 * Borra un usuario de la BD.
 */
function eliminarUsuario(){
    let idUsuario = $("#id_borrado").html();
    $.ajax({
        url:'http://140.238.179.6:8081/api/user/'+idUsuario,
        method: 'DELETE',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            Swal.fire({
                icon: 'success',
                title: '¡Usuario borrado!',
                text: 'Usuario borrado con éxito.'
            });
            obtenerInfoPersonal();
        }
    });
}

/**
 * Valida que todos los campos contengan información.
 * @returns true si todos los campos son válidos; false en cualquier otro escenario.
 */
 function validarCamposActualizar(){
    /**
     * Variables para controlar la validación de los campos.
     */
    var statusId = false;
    var statusIdentification = false;
    var statusName = false;
    var statusBirthday = false;
    var statusAddress = false;
    var statusCellPhone = false;
    var statusEmail = false;
    var statusPassword = false;
    var statusZone = false;
    var statusType = false;

    /**
     * Validar campo id
     */
     if ($("#id_user_edit").val().trim()==""){
        $("#error_id_edit").html("Por favor llene este campo.");
        $("#id_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusId = false;
    } else {
        $("#error_id_edit").html("");
        $("#id_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusId = true;
    }

    /**
     * Validar campo identificación
     */
     if ($("#identification_user_edit").val().trim()==""){
        $("#error_identification_edit").html("Por favor llene este campo.");
        $("#identification_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusIdentification = false;
    } else {
        $("#error_identification_edit").html("");
        $("#identification_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusIdentification = true;
    }

    /**
     * Validar campo nombre
     */
     if ($("#name_user_edit").val().trim()==""){
        $("#error_name_edit").html("Por favor llene este campo.");
        $("#name_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusName = false;
    } else {
        $("#error_name_edit").html("");
        $("#name_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusName = true;
    }

    /**
     * Validar campo fecha nacimiento
     */
     if ($("#birthday_user_edit").val().trim()==""){
        $("#error_birthday_edit").html("Por favor seleccione una fecha.");
        $("#birthday_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusBirthday = false;
    } else {
        $("#error_birthday_edit").html("");
        $("#birthday_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusBirthday = true;
    }

    /**
     * Validar campo dirección
     */
     if ($("#address_user_edit").val().trim()==""){
        $("#error_address_edit").html("Por favor llene este campo.");
        $("#address_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusAddress = false;
    } else {
        $("#error_address_edit").html("");
        $("#address_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusAddress = true;
    }

    /**
     * Validar campo celular.
     */
     if ($("#cellphone_user_edit").val().trim()==""){
        $("#error_cellphone_edit").html("Por favor llene este campo.");
        $("#cellphone_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusCellPhone = false;
    } else {
        $("#error_cellphone_edit").html("");
        $("#cellphone_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusCellPhone = true;
    }

    /**
     * Validar campo email
     */
     if ($("#email_user_edit").val().trim()==""){
        $("#error_email_edit").html("Por favor llene este campo.");
        $("#email_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusEmail = false;
    } else {
        $("#error_email_edit").html("");
        $("#email_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusEmail = true;
    }

    /**
     * Validar campo contraseña
     */
     if ($("#password_user_edit").val().trim()==""){
        $("#error_password_edit").html("Por favor llene este campo.");
        $("#password_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusPassword = false;
    } else {
        $("#error_password_edit").html("");
        $("#password_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusPassword = true;
    }

    /**
     * Validar campo zona
     */
     if ($("#zone_user_edit").val()=="default"){
        $("#error_zone_edit").html("Por favor seleccione una zona.");
        $("#zone_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusZone = false;
    } else {
        $("#error_zone_edit").html("");
        $("#zone_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusZone = true;
    }

    /**
     * Validar campo categoría
     */
     if ($("#type_user_edit").val()=="default"){
        $("#error_type_edit").html("Por favor seleccione una categoría.");
        $("#type_user_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusType = false;
    } else {
        $("#error_type_edit").html("");
        $("#type_user_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusType = true;
    }

    return (statusIdentification && statusName && statusBirthday && statusAddress && statusCellPhone &&
            statusEmail && statusPassword && statusZone & statusType && statusId);
}

/**
 * Limpia los campos del formulario.
 */
 function limpiarCamposActualizar(){
    $("#id_user_edit").val("");
    $("#id_user_edit").css("border", "1px solid #ced4da");

    $("#identification_user_edit").val("");
    $("#identification_user_edit").css("border", "1px solid #ced4da");

    $("#name_user_edit").val("");
    $("#name_user_edit").css("border", "1px solid #ced4da");

    $("#birthday_user_edit").val("");
    $("#birthday_user_edit").css("border", "1px solid #ced4da");
    
    $("#address_user_edit").val("");
    $("#address_user_edit").css("border", "1px solid #ced4da");
    
    $("#cellphone_user_edit").val("");
    $("#cellphone_user_edit").css("border", "1px solid #ced4da");

    $("#email_user_edit").val("");
    $("#email_user_edit").css("border", "1px solid #ced4da");

    $("#password_user_edit").val("");
    $("#password_user_edit").css("border", "1px solid #ced4da");

    $("#zone_user_edit").val("default"),
    $("#zone_user_edit").css("border", "1px solid #ced4da");

    $("#type_user_edit").val("default")
    $("#type_user_edit").css("border", "1px solid #ced4da");

    $("#identification_user_edit").focus();
}

// ============== Funciones inventario =======================================
/**
 * Recupera los registros de usuarios de la BD.
 */
 function obtenerInfoInventario(){
    /**
     * Petición ajax
     */
    $.ajax({
        url:'http://140.238.179.6:8081/api/supplements/all',
        method: 'GET',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            if (response.length <= 0){
                $("#alert_no_resul").show(500);
                $("#btn-agregar-product").show(1000);
            } else {
                $("#alert_no_resul").hide();
                $("#btn-agregar-product").show(2000);
                listarInfoInventario(response);
            }
        },
        error:function(xhr, status){
            $("#alert_error").show(500);
            $("#espacio-btn").hide();
        },
        complete:function(xhr, status){
            $("#alert_consulta").show();
            $("#alert_consulta").hide(4000);
        }
    })
}

/**
 * Añade los datos recuperados a la tabla de Productos.
 * @param {Array} items los datos recuperados de la BD.
 */
 function listarInfoInventario(items){
    /**
     * Habilitar div de inventario.
     */
    $("#admin-prods").show();
    /**
     * Limpiar espacio en tabla.
     */
    $("#body-tabla-products").html("");
    /**
      * Formatear info.
      */
    let contentTabla = "";
    
    for (i=0; i<items.length; i++){
        var disponibilidad = "";

        if (items[i].availability){
            disponibilidad = "SÍ";
        } else {
            disponibilidad = "NO";
        }

        contentTabla += `<tr>
                            <td><button class="btn-editar" onclick="cargarDatosSupp('${items[i].reference}')" data-toggle="modal" data-target="#modalEditarSupplement">Editar</button></td>
                            <td><button class="btn-eliminar" onclick="cargarBorradoSupp('${items[i].reference}')" data-toggle="modal" data-target="#modalEliminarSupplement"">Eliminar</button></td>
                            <td>${items[i].reference}</td>
                            <td>${items[i].brand}</td>
                            <td>${items[i].category}</td>
                            <td>${items[i].description}</td>
                            <td>`+disponibilidad+`</td>
                            <td>${items[i].price}</td>
                            <td>${items[i].quantity}</td>
                            <td><img class="foto-prod" src=${items[i].photography} alt="foto"/></td>
                        </tr>`
    }
    /**
     * Añadir info a tabla.
     */
    $("#body-tabla-products").html(contentTabla);
    
    /**
     * Mostrar tabla.
     */
     $("#tabla-productos").show(1500);
}

/**
 * Valida que todos los campos contengan información.
 * @returns true si todos los campos son válidos; false en cualquier otro escenario.
 */
 function validarCamposSuplemento(){
    /**
     * Variables para controlar la validación de los campos.
     */
    var statusReference = false;
    var statusBrand = false;
    var statusCategory = false;
    var statusObjetivo = false;
    var statusDescription = false;
    var statusAvailability = false;
    var statusPrice = false;
    var statusQuantity = false;
    var statusPhotography = false;

    /**
     * Validar campo referencia
     */
     if ($("#reference_supp").val().trim()==""){
        $("#error_reference").html("Por favor llene este campo.");
        $("#reference_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusReference = false;
    } else {
        $("#error_reference").html("");
        $("#reference_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusReference = true;
    }

    /**
     * Validar campo marca
     */
     if ($("#brand_supp").val().trim()==""){
        $("#error_brand").html("Por favor llene este campo.");
        $("#brand_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusBrand = false;
    } else {
        $("#error_brand").html("");
        $("#brand_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusBrand = true;
    }

    /**
     * Validar campo categoría.
     */
     if ($("#category_supp").val().trim()==""){
        $("#error_category").html("Por favor llene este campo.");
        $("#category_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusCategory = false;
    } else {
        $("#error_category").html("");
        $("#category_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusCategory = true;
    }

    /**
     * Validar campo objetivo.
     */
     if ($("#objetivo_supp").val().trim()==""){
        $("#error_objetivo").html("Por favor llene este campo.");
        $("#objetivo_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusObjetivo = false;
    } else {
        $("#error_objetivo").html("");
        $("#objetivo_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusObjetivo = true;
    }

    /**
     * Validar campo description
     */
     if ($("#description_supp").val().trim()==""){
        $("#error_description").html("Por favor llene este campo.");
        $("#description_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusDescription = false;
    } else {
        $("#error_description").html("");
        $("#description_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusDescription = true;
    }

    /**
     * Validar campo disponibilidad
     */
     if ($("#availability_supp").val()=="default"){
        $("#error_availability").html("Por favor seleccione una opción.");
        $("#availability_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusAvailability = false;
    } else {
        $("#error_availability").html("");
        $("#availability_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusAvailability = true;
    }

    /**
     * Validar campo precio
     */
     if ($("#price_supp").val().trim()==""){
        $("#error_price").html("Por favor llene este campo.");
        $("#price_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusPrice = false;
    } else {
        $("#error_price").html("");
        $("#price_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusPrice = true;
    }

    /**
     * Validar campo cantidad
     */
     if ($("#quantity_supp").val().trim()==""){
        $("#error_quantity").html("Por favor llene este campo.");
        $("#quantity_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusQuantity = false;
    } else {
        $("#error_quantity").html("");
        $("#quantity_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusQuantity = true;
    }

    /**
     * Validar campo fotografía.
     */
     if ($("#photography_supp").val().trim()==""){
        $("#error_photography").html("Por favor llene este campo.");
        $("#photography_supp").css("border", "2px solid red");

        // Cambiar estado de validación
        statusPhotography = false;
    } else {
        $("#error_photography").html("");
        $("#photography_supp").css("border", "2px solid green");

        // Cambiar estado de validación
        statusPhotography = true;
    }

    return (statusReference && statusBrand && statusCategory && statusObjetivo && statusDescription &&
            statusAvailability && statusPrice && statusQuantity & statusPhotography);
}

/**
 * Limpia los campos del formulario.
 */
 function limpiarCamposSuplemento(){

    $("#reference_supp").val("");
    $("#reference_supp").css("border", "1px solid #ced4da");

    $("#brand_supp").val("");
    $("#brand_supp").css("border", "1px solid #ced4da");
    
    $("#category_supp").val("");
    $("#category_supp").css("border", "1px solid #ced4da");
    
    $("#objetivo_supp").val("");
    $("#objetivo_supp").css("border", "1px solid #ced4da");

    $("#description_supp").val("");
    $("#description_supp").css("border", "1px solid #ced4da");

    $("#availability_supp").val("default");
    $("#availability_supp").css("border", "1px solid #ced4da");

    $("#price_supp").val(""),
    $("#price_supp").css("border", "1px solid #ced4da");

    $("#quantity_supp").val("")
    $("#quantity_supp").css("border", "1px solid #ced4da");

    $("#photography_supp").val("")
    $("#photography_supp").css("border", "1px solid #ced4da");

    $("#reference_supp").focus();
}

/**
 * Petición POST para registrar un suplemento en BD.
 */
 function crearSuplemento(){
    /**
     * Validar que todos los campos estén llenos.
     */
    if (validarCamposSuplemento()){
        /**
         * Recuperación datos ingresados
         */
        let datosSuplemento = {
            reference: $("#reference_supp").val(),
            brand: $("#brand_supp").val(),
            category: $("#category_supp").val(),
            objetivo: $("#objetivo_supp").val(),
            description: $("#description_supp").val(),
            availability: $("#availability_supp").val(),
            price: $("#price_supp").val(),
            quantity: $("#quantity_supp").val(),
            photography: $("#photography_supp").val()
        }
        /**
         * Conversión a formato JSON.
         */
        let datosEnvio = JSON.stringify(datosSuplemento);
        /**
        * Registrar el usuario a través de una petición POST.
        */
        $.ajax({
            url:"http://140.238.179.6:8081/api/supplements/new",
            method:'POST',
            data: datosEnvio,
            dataType:'json',
            contentType: 'application/JSON',
            success:function(response){
                Swal.fire({
                    icon: 'success',
                    title: '¡Producto creado!',
                    text: 'Producto creado con éxito.'
                });
                $("#modalAgregarSupplement").modal('hide');
                limpiarCamposSuplemento();
                obtenerInfoInventario();
            },
            error:function(hxr, status){
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'Consulte con el administrador.'
                });
            }
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: '¡Hey!',
            text: 'Llena todos los campos antes de continuar.'
        });
    }
}

/**
 * Valida que todos los campos contengan información.
 * @returns true si todos los campos son válidos; false en cualquier otro escenario.
 */
 function validarCamposActualizarSuplemento(){
    /**
     * Variables para controlar la validación de los campos.
     */
    var statusReference = false;
    var statusBrand = false;
    var statusCategory = false;
    var statusObjetivo = false;
    var statusDescription = false;
    var statusAvailability = false;
    var statusPrice = false;
    var statusQuantity = false;
    var statusPhotography = false;

    /**
     * Validar campo referencia
     */
     if ($("#reference_supp_edit").val().trim()==""){
        $("#error_reference_edit").html("Por favor llene este campo.");
        $("#reference_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusReference = false;
    } else {
        $("#error_reference_edit").html("");
        $("#reference_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusReference = true;
    }

    /**
     * Validar campo marca
     */
     if ($("#brand_supp_edit").val().trim()==""){
        $("#error_brand_edit").html("Por favor llene este campo.");
        $("#brand_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusBrand = false;
    } else {
        $("#error_brand_edit").html("");
        $("#brand_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusBrand = true;
    }

    /**
     * Validar campo categoría.
     */
     if ($("#category_supp_edit").val().trim()==""){
        $("#error_category_edit").html("Por favor llene este campo.");
        $("#category_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusCategory = false;
    } else {
        $("#error_category_edit").html("");
        $("#category_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusCategory = true;
    }

    /**
     * Validar campo objetivo.
     */
     if ($("#objetivo_supp_edit").val().trim()==""){
        $("#error_objetivo_edit").html("Por favor llene este campo.");
        $("#objetivo_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusObjetivo = false;
    } else {
        $("#error_objetivo_edit").html("");
        $("#objetivo_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusObjetivo = true;
    }

    /**
     * Validar campo description
     */
     if ($("#description_supp_edit").val().trim()==""){
        $("#error_description_edit").html("Por favor llene este campo.");
        $("#description_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusDescription = false;
    } else {
        $("#error_description_edit").html("");
        $("#description_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusDescription = true;
    }

    /**
     * Validar campo disponibilidad
     */
     if ($("#availability_supp_edit").val()=="default"){
        $("#error_availability_edit").html("Por favor seleccione una opción");
        $("#availability_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusAvailability = false;
    } else {
        $("#error_availability_edit").html("");
        $("#availability_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusAvailability = true;
    }

    /**
     * Validar campo precio
     */
     if ($("#price_supp_edit").val().trim()==""){
        $("#error_price_edit").html("Por favor llene este campo.");
        $("#price_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusPrice = false;
    } else {
        $("#error_price_edit").html("");
        $("#price_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusPrice = true;
    }

    /**
     * Validar campo cantidad
     */
     if ($("#quantity_supp_edit").val().trim()==""){
        $("#error_quantity_edit").html("Por favor llene este campo.");
        $("#quantity_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusQuantity = false;
    } else {
        $("#error_quantity_edit").html("");
        $("#quantity_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusQuantity = true;
    }

    /**
     * Validar campo fotografía.
     */
     if ($("#photography_supp_edit").val().trim()==""){
        $("#error_photography_edit").html("Por favor llene este campo.");
        $("#photography_supp_edit").css("border", "2px solid red");

        // Cambiar estado de validación
        statusPhotography = false;
    } else {
        $("#error_photography_edit").html("");
        $("#photography_supp_edit").css("border", "2px solid green");

        // Cambiar estado de validación
        statusPhotography = true;
    }

    return (statusReference && statusBrand && statusCategory && statusObjetivo && statusDescription &&
            statusAvailability && statusPrice && statusQuantity & statusPhotography);
}

/**
 * Limpia los campos del formulario.
 */
 function limpiarCamposActualizarSuplemento(){

    $("#reference_supp_edit").val("");
    $("#reference_supp_edit").css("border", "1px solid #ced4da");

    $("#brand_supp_edit").val("");
    $("#brand_supp_edit").css("border", "1px solid #ced4da");
    
    $("#category_supp_edit").val("");
    $("#category_supp_edit").css("border", "1px solid #ced4da");
    
    $("#objetivo_supp_edit").val("");
    $("#objetivo_supp_edit").css("border", "1px solid #ced4da");

    $("#description_supp_edit").val("");
    $("#description_supp_edit").css("border", "1px solid #ced4da");

    $("#availability_supp_edit").val("default");
    $("#availability_supp_edit").css("border", "1px solid #ced4da");

    $("#price_supp_edit").val(""),
    $("#price_supp_edit").css("border", "1px solid #ced4da");

    $("#quantity_supp_edit").val("")
    $("#quantity_supp_edit").css("border", "1px solid #ced4da");

    $("#photography_supp_edit").val("")
    $("#photography_supp_edit").css("border", "1px solid #ced4da");

    $("#reference_supp_edit").focus();
}

/**
 * Recupera la info del Supplement de la BD y la añade a los campos del
 * formulario actualizar.
 * @param {String} reference la referencia del producto que se recuperará.
 */
 function cargarDatosSupp(reference){
    // Obtener datos de usuario y añadirlos a los campos del formulario.
    $.ajax({
        url:'http://140.238.179.6:8081/api/supplements/'+reference,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            $("#reference_supp_edit").val(response.reference),
            $("#brand_supp_edit").val(response.brand),
            $("#category_supp_edit").val(response.category),
            $("#objetivo_supp_edit").val(response.objetivo),
            $("#description_supp_edit").val(response.description),
            $("#availability_supp_edit").val(response.availability),
            $("#price_supp_edit").val(response.price),
            $("#quantity_supp_edit").val(response.quantity),
            $("#photography_supp_edit").val(response.photography)
        }
    });
}

/**
 * Actualiza la información de un producto.
 */
 function actualizarSuplemento(){
    /**
     * Validar que todos los campos tengan contenido.
     */
    if (validarCamposActualizarSuplemento()){
        /**
         * Recuperación datos ingresados
         */
        let datosSuplemento = {
            reference: $("#reference_supp_edit").val(),
            brand: $("#brand_supp_edit").val(),
            category: $("#category_supp_edit").val(),
            objetivo: $("#objetivo_supp_edit").val(),
            description: $("#description_supp_edit").val(),
            availability: $("#availability_supp_edit").val(),
            price: $("#price_supp_edit").val(),
            quantity: $("#quantity_supp_edit").val(),
            photography: $("#photography_supp_edit").val()
        }
        /**
         * Conversión a formato JSON.
         */
        let datosEnvio = JSON.stringify(datosSuplemento);
        /**
        * Registrar el usuario a través de una petición POST.
        */
        $.ajax({
            url:"http://140.238.179.6:8081/api/supplements/update",
            method:'PUT',
            data: datosEnvio,
            dataType:'json',
            contentType: 'application/JSON',
            success:function(response){
                Swal.fire({
                    icon: 'success',
                    title: '¡Producto actualizado!',
                    text: 'Producto actualizado con éxito.'
                });
                $("#modalEditarSupplement").modal('hide');
                limpiarCamposActualizarSuplemento();
                obtenerInfoInventario();
            },
            error:function(hxr, status){
                Swal.fire({
                    icon: 'warning',
                    title: 'Error',
                    text: 'Consulte con el administrador.'
                });
            }
        });
    } else {
        Swal.fire({
            icon: 'warning',
            title: '¡Hey!',
            text: 'Llena todos los campos antes de continuar.'
        });
    }
}

/**
 * Recupera la info del producto que se borrará.
 * @param {String} reference la referencia del producto que se recuperará.
 */
function cargarBorradoSupp(reference){
    // Obtener datos de usuario y añadirlos a la advertencia de borrado.
    $.ajax({
        url:'http://140.238.179.6:8081/api/supplements/'+reference,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            let advertencia = `¿Quiere borrar el producto con referencia ${response.reference}?`
            $("#advertencia_borrar_supp").html(advertencia);
            $("#reference_borrado").html(response.reference);
        }
    });
}

/**
 * Borra un producto de la BD.
 */
function eliminarSuplemento(){
    let referenceSuplemento = $("#reference_borrado").html();
    $.ajax({
        url:'http://140.238.179.6:8081/api/supplements/'+referenceSuplemento,
        method: 'DELETE',
        dataType: 'json',
        contentType: 'application/JSON',
        success:function(response){
            Swal.fire({
                icon: 'success',
                title: '¡Usuario borrado!',
                text: 'Usuario borrado con éxito.'
            });
            obtenerInfoInventario();
        }
    });
}