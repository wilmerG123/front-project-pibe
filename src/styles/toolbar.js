import styled from 'styled-components';

// Contenedor principal de la barra de herramientas
export const Toolbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.primary};
  position: relative;
  z-index: 10;
`;

// Menú de la barra
export const ToolbarMenu = styled.div`
  display: flex;
  align-items: center;

  ul {
    display: flex;
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    margin-left: 20px;
  }

  a {
    text-decoration: none;
    color: ${(props) => props.theme.colors.text};
    font-size: 18px;
    font-weight: 500;

    &:hover {
      color: ${(props) => props.theme.colors.hover};
    }
  }

  // Menú desplegable, oculto por defecto
  &.active {
    display: block; // Mostrar el menú cuando se activa
  }

  // Estilos para pantallas pequeñas (hasta 768px)
  @media (max-width: 768px) {
    display: none; // Ocultar el menú por defecto

    &.active {
      display: block; // Mostrar el menú cuando el estado menuOpen sea verdadero
    }

    ul {
      flex-direction: column;
      background-color: ${(props) => props.theme.colors.primary};
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;
      padding: 10px 0;
      margin: 0;
    }

    li {
      text-align: center;
      margin: 10px 0;
    }

    a {
      color: ${(props) => props.theme.colors.text};
      font-size: 16px;
    }
  }

  // Estilos para pantallas de escritorio (más de 768px)
  @media (min-width: 769px) {
    display: flex; // El menú es visible por defecto

    ul {
      flex-direction: row;
    }

    li {
      margin-left: 30px;
    }

    a {
      color: ${(props) => props.theme.colors.text};
      font-size: 16px;
    }
  }
`;

// Estilo para el botón de logout
export const LogoutButton = styled.button`
  background-color: ${(props) => props.theme.colors.danger};
  color: ${(props) => props.theme.colors.text || '#fff'};  /* Asegúrate de que el texto sea visible */
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: ${(props) => props.theme.colors.dangerHover};
    transform: scale(1.05);
  }

  &:active {
    background-color: ${(props) => props.theme.colors.danger};
    transform: scale(0.98);
  }
`;

// Contenedor para el botón de logout
export const LogoutButtonContainer = styled.div`
  margin-left: auto;  // Esto empuja el botón a la derecha del contenedor
`;

// Contenedor principal del panel de administración
export const AdminDashboardContainer = styled.div`
 
  height: 100vh; /* Para que ocupe toda la altura de la ventana */
  background-color: ${(props) => props.theme.colors.background}; /* Fondo de la página */
  overflow: auto; /* Cambié a auto para permitir el desplazamiento si es necesario */
`;

// Contenedor del main para los componentes o vistas
export const MainContentContainer = styled.main`
  flex-grow: 1; /* Hace que el contenedor principal ocupe el resto del espacio
  padding: 20px;
  overflow-y: auto; /* Permite el desplazamiento vertical si el contenido es largo */
  background-color: ${(props) => props.theme.colors.secondaryBackground};
  color: ${(props) => props.theme.colors.text};

  /* Evitar que afecte a otras vistas, solo es para el contenedor principal */
  min-height: 0; /* Evitar que se estire a 100vh y afecte a otras vistas */
  height: auto; /* El contenedor de contenido no debe ocupar toda la altura */
  box-sizing: border-box; /* Asegura que los márgenes y el relleno no afecten el tamaño */

  h2 {
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    color: ${(props) => props.theme.colors.text};
  }

  /* Opcional: Espaciado adicional */
  .admin-dashboard__greeting {
    text-align: center;
    margin-top: 20px;
  }
`;

