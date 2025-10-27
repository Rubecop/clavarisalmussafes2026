document.addEventListener("DOMContentLoaded", function() {
    console.log("scripts.js: DOMContentLoaded");
  
    // endpoint de Google Forms (debe terminar en /formResponse)
    const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSe2ZEPpjZTsPFjmphmWr9LPhUtz8diSnGshDmC_K2fL9zllZA/formResponse";
  
    // REEMPLAZA por tus entry reales; si cambias aquí, actualiza según inspector/Network.
    const ENTRY_CORREO = "entry.1107173523";
    const ENTRY_MENSAJE = "entry.843591406";
  
    const form = document.getElementById("form-sugerencias");
    if (!form) {
      console.error("No se encuentra el formulario con id 'form-sugerencias'. Asegúrate de que exista en el HTML.");
      return;
    }
  
    const inputCorreo = document.getElementById("correo");
    const inputMensaje = document.getElementById("mensaje");
    if (!inputCorreo || !inputMensaje) {
      console.error("No se encuentran los inputs 'correo' o 'mensaje'. Comprueba sus IDs en el HTML.");
      return;
    }
  
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      console.log("submit detectado.");
  
      const correo = inputCorreo.value.trim();
      const mensaje = inputMensaje.value.trim();
  
      if (!correo || !mensaje) {
        console.warn("Campos vacíos, no se envía.");
        alert("Por favor completa todos los campos.");
        return;
      }
  
      // Crear iframe invisible (si ya existe, reusar)
      let iframe = document.querySelector("iframe[name='hidden_iframe']");
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.name = "hidden_iframe";
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        console.log("iframe oculto creado.");
      } else {
        console.log("Reutilizando iframe existente.");
      }
  
      // Escuchar carga del iframe para confirmar envío (Google responde con redirección)
      const onIframeLoad = function() {
        console.log("hidden_iframe cargado (posible confirmación).");
        // Aquí puedes mostrar un mensaje de éxito más específico si quieres
        showSuccessMessage();
        // remover listener para evitar llamadas repetidas
        iframe.removeEventListener("load", onIframeLoad);
      };
      iframe.addEventListener("load", onIframeLoad);
  
      // Crear y enviar formulario oculto apuntando al iframe
      const hiddenForm = document.createElement("form");
      hiddenForm.action = GOOGLE_FORM_URL;
      hiddenForm.method = "POST";
      hiddenForm.target = "hidden_iframe";
      hiddenForm.style.display = "none";
  
      // Montar datos
      const data = {};
      data[ENTRY_CORREO] = correo;
      data[ENTRY_MENSAJE] = mensaje;
  
      // Añadir campos al formulario oculto
      for (const name in data) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        input.value = data[name];
        hiddenForm.appendChild(input);
      }
  
      // OPTIONAL: añadir campos que en algunos formularios ayudan a evitar problemas
      // hiddenForm.appendChild(Object.assign(document.createElement("input"), { type: "hidden", name: "fvv", value: "1" }));
      // hiddenForm.appendChild(Object.assign(document.createElement("input"), { type: "hidden", name: "pageHistory", value: "0" }));
  
      document.body.appendChild(hiddenForm);
  
      console.log("Enviando datos a Google Forms:", data);
      hiddenForm.submit();
  
      // Si el iframe no carga en X segundos, lo informamos
      setTimeout(() => {
        console.log("Timeout: comprobando en Network si la petición llegó.");
        // comprueba manualmente la pestaña Network si no ves la petición
      }, 3000);
  
      // Reiniciar formulario visible y mostrar mensaje inmediato
      form.reset();
    });
  
    function showSuccessMessage() {
      // Evitar múltiples mensajes
      if (document.getElementById("msg-sugerencia-enviada")) return;
  
      const msg = document.createElement("div");
      msg.id = "msg-sugerencia-enviada";
      msg.textContent = "✅ ¡Gracias! Tu sugerencia ha sido enviada.";
      Object.assign(msg.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "10px 20px",
        background: "#4caf50",
        color: "white",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: "9999"
      });
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 3000);
    }
  });
  