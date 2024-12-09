import React from 'react';
import { useNavigate } from 'react-router-dom';

const AccessDenied = () => {
  const navigate = useNavigate();

  // Función para manejar el logout
  const handleLogout = () => {
    // Eliminar el token y el rol de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirigir al login (path "/")
    navigate('/', { replace: true });

    // Recargar la página para hacer una "limpieza" completa
    window.location.reload();
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Acceso Denegado</h2>
      <p>No tienes permisos para acceder a esta página.</p>

      {/* Botón de Logout */}
      <button onClick={handleLogout} style={styles.button}>
        Logout
      </button>
    </div>
  );
};

// Estilos básicos para el botón
const styles = {
  button: {
    backgroundColor: '#ff4d4d',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginTop: '20px',
  }
};

export default AccessDenied;
