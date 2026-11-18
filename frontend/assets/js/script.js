const contenedorCartas = document.querySelector(".cartas-grid");
const btnMonstruos = document.querySelector("#btnMonstruos");
const btnMagicas = document.querySelector("#btnMagicas");
const btnTrampas = document.querySelector("#btnTrampas");
const botonesFiltro = document.querySelectorAll(".filter-btn");
const switchSets = document.querySelector("#switchSets");

const apiURLNormal = "http://localhost:3000/api/cartas";
const apiURLPorSet = "http://localhost:3000/api/cartas/por-set";

let allCards = [];
let setsCargados = false;

// Función para obtener las cartas iniciales desde el backend
async function obtenerCartasDD() {
    try {
        const res = await fetch(apiURLNormal);
        const resultado = await res.json();
        allCards = resultado.data || [];
        renderizarCartas();
    } catch (error) {
        console.error("Error al obtener las cartas:", error);
        contenedorCartas.innerHTML = "<p class='text-danger text-center'>Error al conectar con la API.</p>";
    }
}

// Evento del interruptor para cambiar entre vista normal y vista agrupada por set
switchSets.addEventListener("change", async () => {
    try {
        switchSets.disabled = true;

        if (switchSets.checked) {
            const res = await fetch(apiURLPorSet);
            const resultado = await res.json();
            allCards = resultado.data || [];
            setsCargados = true;
        } else {
            const res = await fetch(apiURLNormal);
            const resultado = await res.json();
            allCards = resultado.data || [];
            setsCargados = false;
        }

        switchSets.disabled = false;
        renderizarCartas();
    } catch (error) {
        console.error("Error al cambiar el filtro de sets:", error);
        switchSets.checked = false;
        switchSets.disabled = false;
    }
});

// Función para filtrar y pintar las tarjetas en el DOM
function renderizarCartas() {
    const mostrarMonstruos = btnMonstruos.checked;
    const mostrarMagicas = btnMagicas.checked;
    const mostrarTrampas = btnTrampas.checked;

    // Filtrado dinámico según los botones seleccionados
    const cartasFiltradas = allCards.filter(carta => {
        const tipoLower = carta.type.toLowerCase();
        const esMagica = tipoLower.includes("spell");
        const esTrampa = tipoLower.includes("trap");
        const esMonstruo = !esMagica && !esTrampa;

        if (esMonstruo && mostrarMonstruos) return true;
        if (esMagica && mostrarMagicas) return true;
        if (esTrampa && mostrarTrampas) return true;
        return false;
    });

    if (cartasFiltradas.length === 0) {
        contenedorCartas.innerHTML = "<p class='text-center text-secondary w-100'>No hay cartas que mostrar con los filtros actualizados.</p>";
        return;
    }

    let template = "";

    // Agrupación visual si el switch de sets está activo
    if (setsCargados) {
        let gruposPorSet = {};

        cartasFiltradas.forEach(carta => {
            let nombreSet = "Sin Set Asignado";
            if (carta.card_sets && carta.card_sets.length > 0) {
                nombreSet = carta.card_sets[0].set_name;
            }
            if (!gruposPorSet[nombreSet]) {
                gruposPorSet[nombreSet] = [];
            }
            gruposPorSet[nombreSet].push(carta);
        });

        Object.keys(gruposPorSet).forEach(nombreSet => {
            const cartasDelSet = gruposPorSet[nombreSet];

            template += `
                <div class="col-12 mt-4 mb-2">
                    <h3 class="text-info border-bottom border-secondary pb-2"> ${nombreSet}</h3>
                </div>
            `;

            cartasDelSet.forEach(carta => {
                template += generarHTMLTarjeta(carta);
            });
        });
    } else {
        // Vista estándar sin agrupar
        cartasFiltradas.forEach(carta => {
            template += generarHTMLTarjeta(carta);
        });
    }

    contenedorCartas.innerHTML = template;
}

// Función auxiliar para construir el HTML de cada tarjeta individual
function generarHTMLTarjeta(carta) {
    const imagenURL = carta.card_images ? carta.card_images[0].image_url : "";

    const atributo = carta.attribute ? `<strong>Atributo:</strong> ${carta.attribute}` : "";
    const nivel = carta.level ? `<strong>Nivel/Rango:</strong> ${carta.level}` : "";
    const escala = carta.scale !== undefined ? `<strong>Escala Péndulo:</strong> ${carta.scale}` : "";
    const propiedad = carta.race ? `<strong>Propiedad:</strong> ${carta.race}` : "";

    return `
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch">
            <div class="carta-card w-100">
                <img src="${imagenURL}" alt="${carta.name}" class="img-fluid rounded mb-2">
                <h3 class="fs-6 text-warning text-center">${carta.name}</h3>
                <p class="mb-1 text-center small"><strong>Tipo de carta:</strong> ${carta.type}</p>
                ${atributo ? `<p class="mb-1 text-center small">${atributo}</p>` : ""}
                ${nivel ? `<p class="mb-1 text-center small">${nivel}</p>` : ""}
                ${escala ? `<p class="mb-1 text-center small">${escala}</p>` : ""}
                ${propiedad ? `<p class="mb-1 text-center small">${propiedad}</p>` : ""}
                <p class="mb-0 text-center small mt-2"><strong>ATK:</strong> ${carta.atk ?? "N/A"} | <strong>DEF:</strong> ${carta.def ?? "N/A"}</p>
            </div>
        </div>
    `;
}

// Escuchadores de eventos para los filtros de tipo
botonesFiltro.forEach(btn => {
    btn.addEventListener("change", renderizarCartas);
});

// Llamada inicial al cargar la página
obtenerCartasDD();