--- local-storage-manager.js (原始)


+++ local-storage-manager.js (修改后)
// Función para cargar recomendaciones desde el archivo local
async function loadRecommendationsFromLocal() {
  try {
    // Usamos fetch para cargar el archivo JSON actual
    const response = await fetch('data/recomendations.json?_=' + new Date().getTime()); // Agregamos parámetro para evitar caché
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    return { movies: [], series: [] };
  } catch (error) {
    console.error('Error cargando recomendaciones:', error);
    return { movies: [], series: [] };
  }
}

// Función para guardar recomendaciones en el archivo local
// En realidad, esta función no podrá escribir directamente en el servidor desde el navegador
// por razones de seguridad, pero mantendremos la estructura para futura implementación
function saveRecommendationsToLocal(recommendations) {
  // En un entorno real con servidor, aquí haríamos una llamada al backend
  // Por ahora, simulamos el guardado en localStorage para que funcione en el navegador
  localStorage.setItem('dondeverlo_recommendations', JSON.stringify(recommendations));
  return true;
}

// Función para sincronizar con el backend (simulado)
async function syncWithBackend() {
  // En una implementación real, aquí haríamos la sincronización con el servidor
  // Por ahora, simplemente actualizamos desde localStorage si existe
  const localData = localStorage.getItem('dondeverlo_recommendations');
  if (localData) {
    return JSON.parse(localData);
  }
  return await loadRecommendationsFromLocal();
}

// Función para mostrar notificación
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  const notificationText = document.getElementById('notificationText');
  const icon = document.getElementById('notificationIcon');

  notificationText.textContent = message;

  if (type === 'error') {
    notification.style.background = 'linear-gradient(to right, #e53935, #ef5350)';
    icon.className = 'fas fa-exclamation-circle';
  } else {
    notification.style.background = 'linear-gradient(to right, var(--secondary-color), var(--tertiary-color))';
    icon.className = 'fas fa-check-circle';
  }

  notification.classList.add('show');

  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

// Exportar funciones
window.LocalStorageManager = {
  loadRecommendationsFromLocal,
  saveRecommendationsToLocal,
  syncWithBackend,
  showNotification
};