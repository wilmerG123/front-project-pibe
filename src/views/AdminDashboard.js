import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//import '../css-views/admin.css'; // Asegúrate de tener esta referencia para los estilos CSS
import Players from './Players'; // Importamos el componente de Jugadores
import Coachs from './Coachs'; // Importamos el componente de Entrenadores
import Utils from './Utils'; // Importamos el componente de Entrenadores
import Events from './Events';// Importar componente Eventos!
import Obligations from './Obligations'; //Importar el componente de Obligaciones
import { Toolbar, ToolbarMenu, LogoutButton, LogoutButtonContainer, MainContentContainer, AdminDashboardContainer } from '../styles/toolbar'; // Asumiendo que los estilos están en Toolbar.js
import CustomThemeProvider from '../styles/CustomThemeProvider';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [showPlayers, setShowPlayers] = useState(false); // Estado para mostrar el componente de Jugadores
  const [showTrainers, setShowTrainers] = useState(false); // Estado para mostrar el componente de Entrenadores
  const [showUtils, setShowUtils] = useState(false); // Estado para mostrar el componente de Entrenadores
  const [showEvents, setShowEvents] = useState(false); // Estado para mostrar el componente de Eventos
  const [showObligations, setShowObligations] = useState(false) // Estado para mostrar el componente de Obligaciones


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/', { replace: true });
    // Recargar la página para hacer una "limpieza" completa
    window.location.reload();
  };

  // Función para mostrar el componente de jugadores
  const handleShowPlayers = () => {
    setShowPlayers(true);
    setShowTrainers(false); // Ocultar Entrenadores
    setShowUtils(false)
    setShowEvents(false)
    setShowObligations(false)
  };

  // Función para mostrar el componente de entrenadores
  const handleShowTrainers = () => {
    setShowTrainers(true);
    setShowPlayers(false); // Ocultar Jugadores
    setShowUtils(false)
    setShowEvents(false)
    setShowObligations(false)
  };

  const handleShowUtils = () => {
    setShowUtils(true)
    setShowTrainers(false);
    setShowPlayers(false);
    setShowEvents(false)
    setShowObligations(false)
  }

  const handleShowEvents = () => {
    setShowUtils(false)
    setShowTrainers(false);
    setShowPlayers(false);
    setShowEvents(true)
    setShowObligations(false)
  }
  const handleShowObligations = () => {
    setShowUtils(false)
    setShowTrainers(false);
    setShowPlayers(false);
    setShowEvents(false)
    setShowObligations(true)
  }


  return (

    <CustomThemeProvider>
      <AdminDashboardContainer>
        <Toolbar>

          {/* Menú desplegable */}
          <ToolbarMenu>
            <ul>
              <li><a href="#" onClick={handleShowPlayers}>Jugadores</a></li>
              <li><a href="#" onClick={handleShowTrainers}>Entrenadores</a></li>
              <li><a href="#" onClick={handleShowObligations}>Obligaciones</a></li>
              <li><a href="#" onClick={handleShowEvents}>Eventos</a></li>
              <li><a href="#" onClick={handleShowUtils}>Varios</a></li>
            </ul>
          </ToolbarMenu>

          {/* Botón de logout */}
          <LogoutButtonContainer>
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </LogoutButtonContainer>
        </Toolbar>

        <MainContentContainer>
          {showPlayers ? (
            <Players /> // Mostrar el componente de Jugadores si showPlayers es true
          ) : showTrainers ? (
            <Coachs /> // Mostrar el componente de Entrenadores si showTrainers es true
          ) : showUtils ? (
            <Utils />
          ) : showEvents ? (
            <Events />
          ) : showObligations ? (
            <Obligations/>
          ) : (
            <h2>Bienvenido, Administrador</h2>
          )}
        </MainContentContainer>
      </AdminDashboardContainer>
    </CustomThemeProvider>

  );
};

export default AdminDashboard;
