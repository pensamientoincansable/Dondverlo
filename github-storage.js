// Configuración para la API de GitHub
const GITHUB_CONFIG = {
  // REEMPLAZA ESTOS VALORES CON TU INFORMACIÓN
  owner: 'TU_NOMBRE_DE_USUARIO_GITHUB',  // Ejemplo: 'juanperez'
  repo: 'NOMBRE_DE_TU_REPOSITORIO',      // Ejemplo: 'dondeverlo'
  token: '', // DEJA VACÍO, SE PEDIRÁ AL USUARIO
  path: 'data/recommendations.json',
  branch: 'main'
};

// Función para cargar recomendaciones desde GitHub
async function loadRecommendationsFromGitHub() {
  try {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?ref=${GITHUB_CONFIG.branch}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (response.status === 404) {
      console.log('Archivo no encontrado. Se creará uno nuevo.');
      return { movies: [], series: [] };
    }
    
    if (response.ok) {
      const data = await response.json();
      // Decodificar el contenido Base64
      const content = JSON.parse(atob(data.content.replace(/\s/g, '')));
      return content;
    } else {
      console.error('Error al cargar:', response.status);
      return loadFromLocalStorage();
    }
  } catch (error) {
    console.error('Error cargando desde GitHub:', error);
    return loadFromLocalStorage();
  }
}

// Función para guardar recomendaciones en GitHub
async function saveRecommendationsToGitHub(recommendations) {
  if (!GITHUB_CONFIG.token) {
    console.error('Token de GitHub no configurado');
    return false;
  }
  
  try {
    // Primero, obtener el archivo actual para tener el SHA
    const getUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}?ref=${GITHUB_CONFIG.branch}`;
    
    const getResponse = await fetch(getUrl, {
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    let sha = '';
    if (getResponse.ok) {
      const data = await getResponse.json();
      sha = data.sha;
    }
    
    // Preparar el contenido para GitHub (Base64)
    const content = btoa(JSON.stringify(recommendations, null, 2));
    
    // Crear el cuerpo de la solicitud
    const body = {
      message: `Actualización de recomendaciones - ${new Date().toISOString()}`,
      content: content,
      branch: GITHUB_CONFIG.branch,
      sha: sha || undefined
    };
    
    // Enviar la solicitud PUT
    const putUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    
    const putResponse = await fetch(putUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    
    if (putResponse.ok) {
      console.log('✅ Guardado en GitHub exitoso');
      return true;
    } else {
      const errorText = await putResponse.text();
      console.error('❌ Error al guardar en GitHub:', errorText);
      
      // Si hay un error de autenticación, mostrar mensaje
      if (putResponse.status === 401) {
        showNotification('❌ Token inválido. Por favor, verifica tu token de GitHub.', 'error');
      }
      return false;
    }
  } catch (error) {
    console.error('❌ Error de red:', error);
    return false;
  }
}

// Función para cargar desde localStorage (como respaldo)
function loadFromLocalStorage() {
  const comments = JSON.parse(localStorage.getItem('dondeverloComments')) || [];
  const recommendations = { movies: [], series: [] };
  
  comments.forEach(comment => {
    if (comment.type === 'movie') {
      recommendations.movies.push(comment);
    } else {
      recommendations.series.push(comment);
    }
  });
  
  return recommendations;
}

// Función para sincronizar localStorage con GitHub
async function syncWithGitHub() {
  const localComments = JSON.parse(localStorage.getItem('dondeverloComments')) || [];
  
  if (localComments.length === 0) return false;
  
  if (!GITHUB_CONFIG.token) {
    console.error('Token de GitHub no configurado para sincronizar');
    return false;
  }
  
  try {
    // Cargar recomendaciones actuales de GitHub
    const gitHubData = await loadRecommendationsFromGitHub();
    
    // Combinar datos
    localComments.forEach(comment => {
      const targetArray = comment.type === 'movie' ? gitHubData.movies : gitHubData.series;
      
      // Verificar si ya existe (por id)
      const exists = targetArray.some(item => item.id === comment.id);
      if (!exists) {
        targetArray.push(comment);
      }
    });
    
    // Guardar en GitHub
    const success = await saveRecommendationsToGitHub(gitHubData);
    
    if (success) {
      // Limpiar localStorage después de sincronizar
      localStorage.removeItem('dondeverloComments');
      return true;
    }
  } catch (error) {
    console.error('Error en sincronización:', error);
  }
  
  return false;
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
window.GitHubStorage = {
  loadRecommendationsFromGitHub,
  saveRecommendationsToGitHub,
  syncWithGitHub,
  config: GITHUB_CONFIG,
  showNotification
};