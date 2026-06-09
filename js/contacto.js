// JavaScript para Página de Contacto - ClasesMat
// Funcionalidad completa del formulario con envío por EmailJS

document.addEventListener('DOMContentLoaded', function() {
  
  // Elementos del DOM
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn.querySelector('.btn-text');
  const btnLoading = document.getElementById('btnLoading');
  const formMessage = document.getElementById('formMessage');
  
  // 🔥 CONFIGURACIÓN DE EMAILJS - REEMPLAZA CON TUS CREDENCIALES
  const EMAILJS_SERVICE_ID = 'service_f3ne6im';     // Ej: 'service_abc123'
  const EMAILJS_TEMPLATE_ID = 'template_dgd05wo';   // Ej: 'template_xyz789'
  const EMAILJS_PUBLIC_KEY = 'VvrusKbJD7JoB2mHy';     // Ej: 'user_123abc456def'

  // Inicializar EmailJS
  emailjs.init(EMAILJS_PUBLIC_KEY);

  // Event listener para el formulario
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar formulario
    if (validateForm()) {
      sendEmail();
    }
  });

  // Función de validación
  function validateForm() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const servicio = document.getElementById('servicio').value;
    const mensaje = document.getElementById('mensaje').value.trim();

    // Resetear mensajes previos
    hideMessage();

    // Validaciones básicas
    if (!nombre) {
      showMessage('Por favor ingresa tu nombre completo', 'error');
      return false;
    }

    if (!email || !isValidEmail(email)) {
      showMessage('Por favor ingresa un email válido', 'error');
      return false;
    }

    if (!servicio) {
      showMessage('Por favor selecciona el tipo de servicio', 'error');
      return false;
    }

    if (!mensaje || mensaje.length < 10) {
      showMessage('Por favor describe tu proyecto con más detalle (mínimo 10 caracteres)', 'error');
      return false;
    }

    return true;
  }

  // Función para validar email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Función principal para enviar email
  function sendEmail() {
    // Mostrar estado de carga
    setLoadingState(true);
    showMessage('Enviando tu consulta...', 'info');

    // Recopilar datos del formulario
    const formData = {
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      telefono: document.getElementById('telefono').value.trim() || 'No proporcionado',
      universidad: document.getElementById('universidad').value || 'No especificada',
      servicio: document.getElementById('servicio').value,
      mensaje: document.getElementById('mensaje').value.trim(),
      urgente: document.getElementById('urgente').checked ? 'Sí - URGENTE ⚡' : 'No',
      fecha: new Date().toLocaleString('es-PE'),
    };

    // Preparar template params para EmailJS
    const templateParams = {
      // Datos del remitente
      from_name: formData.nombre,
      from_email: formData.email,
      telefono: formData.telefono,
      universidad: formData.universidad,
      servicio: formData.servicio,
      mensaje: formData.mensaje,
      urgente: formData.urgente,
      fecha: formData.fecha,
      
      // Configuración del email
      subject: `🎓 Nueva Consulta ClasesMat - ${formData.servicio}${formData.urgente.includes('URGENTE') ? ' [URGENTE]' : ''}`,
      
      // Para usar en condicionales del template
      if_urgente: formData.urgente.includes('URGENTE')
    };

    // 🚀 ENVÍO A PRIMER EMAIL: cadenas100101@gmail.com
    sendToFirstEmail(templateParams, formData);
  }

  // Enviar a primer email
  function sendToFirstEmail(templateParams, formData) {
    // Configurar destinatario
    const paramsEmail1 = {
      ...templateParams,
      to_email: 'cadenas100101@gmail.com',
      to_name: 'Equipo ClasesMat'
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, paramsEmail1)
      .then(function(response) {
        console.log('✅ Email 1 enviado exitosamente:', response);
        
        // Enviar al segundo email
        sendToSecondEmail(templateParams, formData);
        
      })
      .catch(function(error) {
        console.error('❌ Error al enviar email 1:', error);
        handleError('Error al enviar a cadenas100101@gmail.com');
      });
  }

  // Enviar a segundo email
  function sendToSecondEmail(templateParams, formData) {
    // Configurar destinatario
    const paramsEmail2 = {
      ...templateParams,
      to_email: 'acayllac@clasesmat.com',
      to_name: 'ClasesMat Admin'
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, paramsEmail2)
      .then(function(response) {
        console.log('✅ Email 2 enviado exitosamente:', response);
        
        // Ambos emails enviados correctamente
        handleSuccess(formData);
        
      })
      .catch(function(error) {
        console.error('⚠️ Error al enviar email 2:', error);
        
        // Mostrar éxito parcial
        handlePartialSuccess('Consulta enviada parcialmente. Te contactaremos pronto.');
      });
  }

  // Manejar éxito completo
  function handleSuccess(formData) {
    setLoadingState(false);
    showMessage('¡Consulta enviada exitosamente! 🎉 Te responderemos en menos de 2 horas.', 'success');
    
    // Limpiar formulario
    form.reset();
    
    // Track del evento
    trackFormEvent('form_submit_success', formData.servicio);
    
    // Opcional: redirigir a WhatsApp después de 3 segundos
    setTimeout(() => {
      const whatsappMessage = encodeURIComponent(
        `¡Hola! Acabo de enviar una consulta sobre "${formData.servicio}" por el formulario web. ¿Podrían confirmar que la recibieron?`
      );
      
      if (confirm('¿Te gustaría continuar la conversación por WhatsApp?')) {
        window.open(`https://wa.me/51968269924?text=${whatsappMessage}`, '_blank');
      }
    }, 3000);
  }

  // Manejar éxito parcial
  function handlePartialSuccess(message) {
    setLoadingState(false);
    showMessage(message + ' Por favor, contáctanos también por WhatsApp.', 'success');
    form.reset();
  }

  // Manejar error
  function handleError(specificError = '') {
    setLoadingState(false);
    const errorMsg = specificError || 'Hubo un problema al enviar tu consulta.';
    showMessage(`${errorMsg} Por favor, intenta de nuevo o contáctanos directamente por WhatsApp.`, 'error');
    
    // Track del error
    trackFormEvent('form_submit_error', specificError);
  }

  // Función para mostrar mensajes
  function showMessage(text, type) {
    formMessage.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span>${getMessageIcon(type)}</span>
        <span>${text}</span>
      </div>
    `;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll hacia el mensaje
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Auto-hide para mensajes de info
    if (type === 'info') {
      setTimeout(() => {
        if (formMessage.classList.contains('info')) {
          hideMessage();
        }
      }, 10000);
    }
  }

  // Iconos para los mensajes
  function getMessageIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      info: 'ℹ️'
    };
    return icons[type] || 'ℹ️';
  }

  // Función para ocultar mensajes
  function hideMessage() {
    formMessage.style.display = 'none';
  }

  // Función para manejar estado de carga
  function setLoadingState(loading) {
    if (loading) {
      submitBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'flex';
      submitBtn.style.cursor = 'not-allowed';
    } else {
      submitBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      submitBtn.style.cursor = 'pointer';
    }
  }

  // Validación en tiempo real
  const inputs = form.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
  });

  // Función para validar campos individuales
  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.getAttribute('name');
    
    // Remover clases de validación previas
    field.classList.remove('invalid', 'valid');
    
    // Validaciones específicas por campo
    switch(fieldName) {
      case 'nombre':
        if (value.length >= 2) {
          field.classList.add('valid');
        } else if (value.length > 0) {
          field.classList.add('invalid');
        }
        break;
        
      case 'email':
        if (isValidEmail(value)) {
          field.classList.add('valid');
        } else if (value.length > 0) {
          field.classList.add('invalid');
        }
        break;
        
      case 'mensaje':
        if (value.length >= 10) {
          field.classList.add('valid');
        } else if (value.length > 0) {
          field.classList.add('invalid');
        }
        break;
    }
  }

  // Contador de caracteres para el textarea
  const mensajeTextarea = document.getElementById('mensaje');
  const charCounter = document.createElement('div');
  charCounter.className = 'char-counter';
  charCounter.style.cssText = 'font-size: 12px; color: #64748b; text-align: right; margin-top: 4px;';
  mensajeTextarea.parentNode.appendChild(charCounter);

  mensajeTextarea.addEventListener('input', function() {
    const length = this.value.length;
    charCounter.textContent = `${length} caracteres (mínimo 10)`;
    
    if (length >= 10) {
      charCounter.style.color = '#10b981';
    } else {
      charCounter.style.color = '#ef4444';
    }
  });

  // Auto-resize del textarea
  mensajeTextarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });

  // Detectar si el usuario está saliendo de la página sin enviar
  let formChanged = false;
  
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      formChanged = true;
    });
  });

  window.addEventListener('beforeunload', function(e) {
    if (formChanged && !form.submitted) {
      e.preventDefault();
      e.returnValue = '¿Estás seguro de que quieres salir? Perderás los datos del formulario.';
    }
  });

  // Marcar como enviado cuando se envía exitosamente
  form.addEventListener('submit', function() {
    form.submitted = true;
  });

  // Auto-completar universidad basado en email
  const emailInput = document.getElementById('email');
  const universidadSelect = document.getElementById('universidad');
  
  emailInput.addEventListener('blur', function() {
    const email = this.value.toLowerCase();
    
    // Auto-detectar universidad por dominio de email
    const universityDomains = {
      'ucsm.edu.pe': 'UCSM',
      'ucsp.edu.pe': 'UCSP',
      'utp.edu.pe': 'UTP',
      'usmp.edu.pe': 'USMP',
      'unsa.edu.pe': 'UNSA'
    };
    
    for (const [domain, university] of Object.entries(universityDomains)) {
      if (email.includes(domain)) {
        universidadSelect.value = university;
        break;
      }
    }
  });

  // Verificar si EmailJS está cargado
  if (typeof emailjs === 'undefined') {
    console.error('❌ EmailJS no está cargado. Agrega el script en tu HTML:');
    console.error('<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>');
    
    showMessage('Error: EmailJS no está configurado. Contacta por WhatsApp.', 'error');
  } else {
    console.log('✅ EmailJS cargado correctamente');
  }

  console.log('🚀 ContactForm ClasesMat inicializado correctamente');
  console.log('📧 Emails de destino: cadenas100101@gmail.com, acayllac@clasesmat.com');
});

// Funciones utilitarias globales

// Tracking de eventos (para Google Analytics si está configurado)
function trackFormEvent(action, label) {
  if (typeof gtag !== 'undefined') {
    gtag('event', action, {
      'event_category': 'Contact Form',
      'event_label': label
    });
  }
  console.log(`📊 Event tracked: ${action} - ${label}`);
}

// Función para enviar consulta rápida por WhatsApp
function sendWhatsAppQuick(service) {
  const message = encodeURIComponent(`¡Hola! Estoy interesado en el servicio de ${service}. ¿Podrían darme más información?`);
  window.open(`https://wa.me/51968269924?text=${message}`, '_blank');
}

// CSS adicional para validación en tiempo real
const additionalStyles = `
  .form-group.focused {
    transform: translateY(-1px);
  }
  
  .form-group input.valid,
  .form-group select.valid,
  .form-group textarea.valid {
    border-color: #10b981 !important;
    background-color: #f0fdf4 !important;
  }
  
  .form-group input.invalid,
  .form-group select.invalid,
  .form-group textarea.invalid {
    border-color: #ef4444 !important;
    background-color: #fef2f2 !important;
  }
  
  .form-message {
    animation: slideDown 0.3s ease-out;
  }
  
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

// Agregar estilos adicionales
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);