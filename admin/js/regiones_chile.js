/**
 * ============================================================================
 * SONIDO VIVO - Catálogo de Regiones y Comunas de Chile
 * Archivo: admin/js/regiones_chile.js
 * Asignatura: Desarrollo Full Stack II (DSY1104)
 * ============================================================================
 */

(function () {
  "use strict";

  const REGIONES_CHILE = [
    {
      region: "Arica y Parinacota",
      comunas: ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    {
      region: "Tarapacá",
      comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Pica"]
    },
    {
      region: "Antofagasta",
      comunas: ["Antofagasta", "Mejillones", "Calama", "Tocopilla"]
    },
    {
      region: "Atacama",
      comunas: ["Copiapó", "Caldera", "Vallenar", "Chañaral"]
    },
    {
      region: "Coquimbo",
      comunas: ["La Serena", "Coquimbo", "Ovalle", "Illapel"]
    },
    {
      region: "Valparaíso",
      comunas: [
        "Viña del Mar",
        "Valparaíso",
        "Quilpué",
        "Villa Alemana",
        "Concón",
        "Quillota",
        "San Antonio",
        "Los Andes"
      ]
    },
    {
      region: "Metropolitana de Santiago",
      comunas: [
        "Santiago",
        "Providencia",
        "Las Condes",
        "Ñuñoa",
        "La Florida",
        "Maipú",
        "Puente Alto",
        "San Bernardo"
      ]
    },
    {
      region: "O'Higgins",
      comunas: ["Rancagua", "Machalí", "Rengo", "San Fernando", "Pichilemu"]
    },
    {
      region: "Maule",
      comunas: ["Talca", "Curicó", "Linares", "Constitución", "Cauquenes"]
    },
    {
      region: "Ñuble",
      comunas: ["Chillán", "San Carlos", "Bulnes", "Quirihue"]
    },
    {
      region: "Biobío",
      comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Los Ángeles", "Coronel"]
    },
    {
      region: "La Araucanía",
      comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón", "Angol"]
    },
    {
      region: "Los Ríos",
      comunas: ["Valdivia", "La Unión", "Panguipulli", "Río Bueno"]
    },
    {
      region: "Los Lagos",
      comunas: ["Puerto Montt", "Puerto Varas", "Osorno", "Castro", "Ancud"]
    },
    {
      region: "Aysén",
      comunas: ["Coyhaique", "Puerto Aysén", "Chile Chico", "Cochrane"]
    },
    {
      region: "Magallanes y Antártica",
      comunas: ["Punta Arenas", "Puerto Natales", "Porvenir", "Cabo de Hornos"]
    }
  ];

  /**
   * Conecta dos selectores HTML para implementar selección dependiente de Región y Comuna.
   * @param {HTMLSelectElement} selectRegion 
   * @param {HTMLSelectElement} selectComuna 
   * @param {string} [comunaSeleccionada] 
   */
  function inicializarSelectores(selectRegion, selectComuna, comunaSeleccionada) {
    if (!selectRegion || !selectComuna) return;

    // Poblar regiones si está vacío
    if (selectRegion.options.length <= 1) {
      selectRegion.innerHTML = '<option value="">-- Seleccione Región --</option>';
      REGIONES_CHILE.forEach(function (r) {
        const opt = document.createElement("option");
        opt.value = r.region;
        opt.textContent = r.region;
        selectRegion.appendChild(opt);
      });
    }

    function actualizarComunas(regionNombre, valorPorDefecto) {
      selectComuna.innerHTML = '<option value="">-- Seleccione Comuna --</option>';
      if (!regionNombre) {
        selectComuna.disabled = true;
        return;
      }

      const itemRegion = REGIONES_CHILE.find(function (r) {
        return r.region === regionNombre;
      });

      if (itemRegion && itemRegion.comunas) {
        itemRegion.comunas.forEach(function (comuna) {
          const opt = document.createElement("option");
          opt.value = comuna;
          opt.textContent = comuna;
          if (valorPorDefecto && valorPorDefecto === comuna) {
            opt.selected = true;
          }
          selectComuna.appendChild(opt);
        });
        selectComuna.disabled = false;
      } else {
        selectComuna.disabled = true;
      }
    }

    selectRegion.addEventListener("change", function () {
      actualizarComunas(selectRegion.value, null);
    });

    if (selectRegion.value) {
      actualizarComunas(selectRegion.value, comunaSeleccionada);
    }
  }

  window.RegionesChile = {
    datos: REGIONES_CHILE,
    conectarSelectores: inicializarSelectores
  };
})();
