// Referencias a los elementos de la primera página
const btnSiguiente = document.getElementById('btn-siguiente');
const inputNombre = document.getElementById('clienteNombre');
const errorNombre = document.getElementById('errorNombre');
const page1 = document.getElementById('page1');
const page2 = document.getElementById('page2');

// Variable global para almacenar el nombre y usarlo al final
let nombreCliente = "";

// Evento de clic en el botón "Ir a cuestionario"
btnSiguiente.addEventListener('click', () => {
    // Obtenemos el valor quitando espacios en blanco al inicio y final
    const nombre = inputNombre.value.trim();
    
    if (nombre === "") {
        // Mostrar mensaje de error y resaltar el borde en rojo
        errorNombre.style.display = "block";
        inputNombre.style.borderColor = "var(--error-color)";
    } else {
        // Guardar el nombre, limpiar errores y avanzar
        errorNombre.style.display = "none";
        inputNombre.style.borderColor = "#e0e0e0";
        nombreCliente = nombre;
        
        // Transición de vistas
        page1.classList.remove('active');
        page2.classList.add('active');
        window.scrollTo(0,0); // Sube al inicio de la página 2 por si hicieron scroll
    }
});

// Ocultar el error automáticamente cuando el usuario empiece a escribir
inputNombre.addEventListener('input', () => {
    errorNombre.style.display = "none";
    inputNombre.style.borderColor = "#e0e0e0";
});


// --- REFERENCIAS Y LÓGICA DE LA SEGUNDA PÁGINA ---

// Variables para almacenar las respuestas
let respLocal = "";
let respServicios = [];
let ratingAtencion = 0;
let ratingDetalle = 0;
let respRecomendacion = "";

// TU NÚMERO DE WHATSAPP
const WHATSAPP_NUMBER = "51940838233"; 

// Lógica P1: Origen (Selección única)
const opcionesLocal = document.querySelectorAll('#q1-local .option-btn');
opcionesLocal.forEach(btn => {
    btn.addEventListener('click', function() {
        opcionesLocal.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        respLocal = this.getAttribute('data-value');
    });
});

// Lógica P2: Servicios (Selección múltiple)
const opcionesServicios = document.querySelectorAll('#q2-servicios .option-btn.multi');
opcionesServicios.forEach(btn => {
    btn.addEventListener('click', function() {
        this.classList.toggle('selected');
        const valor = this.getAttribute('data-value');
        if(this.classList.contains('selected')) {
            respServicios.push(valor);
        } else {
            respServicios = respServicios.filter(s => s !== valor);
        }
    });
});

// Lógica P5: Recomendación (Selección única)
const opcionesRecomendacion = document.querySelectorAll('#q5-recomendacion .option-btn');
opcionesRecomendacion.forEach(btn => {
    btn.addEventListener('click', function() {
        opcionesRecomendacion.forEach(b => b.classList.remove('selected'));
        this.classList.add('selected');
        respRecomendacion = this.getAttribute('data-value');
    });
});

// Lógica P3 y P4: Estrellas interactivas (Con efecto Hover)
function configurarEstrellas(contenedorId, callback) {
    const estrellas = document.querySelectorAll(`#${contenedorId} .star`);
    const contenedor = document.getElementById(contenedorId);
    
    // Almacenar el valor actual para no perderlo al quitar el mouse
    let valorActual = 0;

    estrellas.forEach((estrella, index) => {
        // Al hacer clic, se guarda el valor
        estrella.addEventListener('click', () => {
            valorActual = index + 1;
            callback(valorActual);
            actualizarEstrellas(estrellas, valorActual);
        });

        // Efecto hover (iluminar al pasar el mouse)
        estrella.addEventListener('mouseenter', () => {
            actualizarEstrellas(estrellas, index + 1);
        });
    });

    // Al quitar el mouse del contenedor, regresar al valor guardado
    contenedor.addEventListener('mouseleave', () => {
        actualizarEstrellas(estrellas, valorActual);
    });
}

function actualizarEstrellas(nodos, valor) {
    nodos.forEach((e, i) => {
        if (i < valor) {
            e.classList.add('active');
        } else {
            e.classList.remove('active');
        }
    });
}

configurarEstrellas('stars-atencion', (valor) => ratingAtencion = valor);
configurarEstrellas('stars-detalle', (valor) => ratingDetalle = valor);

// Lógica del botón Enviar a WhatsApp
const btnEnviar = document.getElementById('btn-enviar');
const errorGeneral = document.getElementById('errorGeneral');

btnEnviar.addEventListener('click', () => {
    // Validación: Que no falte ninguna de las 5 preguntas principales
    if (respLocal === "" || respServicios.length === 0 || ratingAtencion === 0 || ratingDetalle === 0 || respRecomendacion === "") {
        errorGeneral.style.display = "block";
        return;
    }
    errorGeneral.style.display = "none";

    const comentarios = document.getElementById('comentarios').value.trim() || "Ninguno en especial.";

    // Diseño atractivo usando códigos seguros para que los emojis nunca fallen
    let mensaje = `\u{2728} *¡Hola! Aquí tienes mis respuestas de la encuesta.*\n_Gracias por la excelente atención._\n\n`;
    mensaje += `\u{1F464} *Cliente:* ${nombreCliente}\n`;
    mensaje += `\u{1F4CD} *Llegó por:* ${respLocal}\n`;
    mensaje += `\u{1F485} *Servicios:* ${respServicios.join(", ")}\n`;
    mensaje += `\u{2B50} *Atención:* ${ratingAtencion}/5\n`;
    mensaje += `\u{1F381} *Detalle:* ${ratingDetalle}/5\n`;
    mensaje += `\u{1F496} *¿Nos recomendaría?:* ${respRecomendacion}\n`;
    mensaje += `\u{1F4AC} *Comentario:* ${comentarios}`;

    // Codificar y redirigir
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
});