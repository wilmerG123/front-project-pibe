import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Toolbar, LogoutButton, LogoutButtonContainer , MainContentContainer, AdminDashboardContainer } from '../styles/toolbar'; // Asumiendo que los estilos están en Toolbar.js
import CustomThemeProvider from '../styles/CustomThemeProvider';

const UserDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar el token y el rol de localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    // Redirigir al login con 'replace' para evitar que el usuario pueda volver atrás
    navigate('/', { replace: true });

    // Recargar la página para hacer una "limpieza" completa
    window.location.reload();
  };

  return (
    <CustomThemeProvider>
    <AdminDashboardContainer>
      {/* Barra de navegación con estilo dark */}
      <Toolbar>
        {/* Botón de logout */}
        <LogoutButtonContainer>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </LogoutButtonContainer>
      </Toolbar>

      <MainContentContainer>
        <h2>Bienvenido, Usuario Normal</h2>
      </MainContentContainer>
    </AdminDashboardContainer>

    </CustomThemeProvider>
  );
};

export default UserDashboard;
