import styled from 'styled-components';

// Contenedor principal de la vista de administrador
export const AdminDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

// Barra de navegación (toolbar)
export const Toolbar = styled.header`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text};
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  .toolbar-logo {
    font-size: 20px;
    font-weight: 600;
  }

  .toolbar-menu {
    ul {
      display: flex;
      list-style: none;
      gap: 20px;

      li {
        a {
          color: ${(props) => props.theme.colors.text};
          font-size: 16px;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;

          &:hover {
            color: ${(props) => props.theme.colors.hoverPrimary};
          }
        }
      }
    }
  }

  .logout-btn {
    background-color: ${(props) => props.theme.colors.danger};
    color: ${(props) => props.theme.colors.text};
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: background-color 0.3s ease, transform 0.2s ease;

    &:hover {
      background-color: ${(props) => props.theme.colors.hoverDanger};
      transform: scale(1.05);
    }

    &:active {
      background-color: ${(props) => props.theme.colors.danger};
      transform: scale(0.98);
    }
  }
`;

// Contenedor principal de contenido (hace que los contenidos de la vista se adapten a la pantalla)
export const MainContent = styled.main`
  flex-grow: 1;
  padding: 30px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
`;

// Botones para cambiar entre "Jugadores" y "Entrenadores"
export const SwitchButton = styled.button`
  background-color: ${(props) => props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.text};
  padding: 12px 24px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  
  &:hover {
    background-color: ${(props) => props.theme.colors.hoverSecondary};
    transform: scale(1.05);
  }

  &:active {
    background-color: ${(props) => props.theme.colors.secondary};
    transform: scale(0.98);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.secondary};
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

// Título de bienvenida
export const WelcomeMessage = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.primary};
  text-align: center;
  margin-top: 40px;
`;

