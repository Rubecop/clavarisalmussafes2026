document.addEventListener("DOMContentLoaded", function() {
    console.log("scripts.js cargado correctamente");
  
    // URL de envío (no la de vista)
    const url = "https://docs.google.com/forms/d/e/1FAIpQLSe2ZEPpjZTsPFjmphmWr9LPhUtz8diSnGshDmC_K2fL9zllZA/formResponse";
  
    // Sustituye por los entry reales de tu formulario
    const payload = {
      "entry.1107173523": "CORREO",
      "entry.843591406": "SUGERENCIA"
    };
  
    // Crear formulario oculto
    const iframe = document.createElement("iframe");
    iframe.name = "hidden_iframe";
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  
    // Crear formulario oculto que apunta al iframe
    const form = document.createElement("form");
    form.action = url;
    form.method = "POST";
    form.target = "hidden_iframe"; // ← esto evita la redirección
    form.style.display = "none";
  
    for (const name in payload) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = payload[name];
      form.appendChild(input);
    }
  
    document.body.appendChild(form);
  
    // Enviar automáticamente
    console.log("Voy a enviar:", payload);
    form.submit();
  });