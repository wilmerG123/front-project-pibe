import styled from 'styled-components';

// Contenedor principal de la aplicación
export const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

// Contenedor para el formulario de login
export const LoginBox = styled.div`
  background-color: ${(props) => props.theme.colors.cardBackground};
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 30px;  // Aumenté el gap entre los elementos del formulario

  h2 {
    font-family: ${(props) => props.theme.typography.headingFont};
    color: ${(props) => props.theme.colors.primary};
    font-size: 24px;
    text-align: center;
    margin-bottom: 20px;
  }
`;

// Estilos para el grupo de inputs
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;  // Espacio entre cada par de label y input (más separación entre campos)

  label {
    font-size: 16px;  // Tamaño de la fuente
    color: ${(props) => props.theme.colors.text};
    font-weight: 600;  // Peso de la fuente
    line-height: 1.5;  // Para mejorar la legibilidad, no es necesario un margen aquí
    margin-bottom: 1px;  // Espacio entre el label y el input, reducido a 4px
  }

  input {
    padding: 12px;
    border: 2px solid ${(props) => props.theme.colors.primary};
    border-radius: 8px;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    transition: border-color 0.3s ease;
    margin-bottom: 22px;
    &:focus {
      border-color: ${(props) => props.theme.colors.hoverPrimary};
      outline: none;
    }
  }
`;

// Estilos para los mensajes de error y éxito
export const Message = styled.p`
  text-align: center;
  font-size: 14px;
  color: ${(props) => (props.type === 'error' ? props.theme.colors.error : props.theme.colors.success)};
  margin-top: 10px;
`;

// Estilos para el botón de inicio de sesión
export const LoginButton = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text};
  padding: 14px;  // Aumenté el padding para hacerlo más grande
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  width: 100%; /* Ocupa todo el ancho del contenedor */
  margin-top: 20px; /* Agregué un margen superior para separar el botón del input */

  &:hover {
    background-color: ${(props) => props.theme.colors.hoverPrimary};
    transform: scale(1.05);
  }

  &:active {
    background-color: ${(props) => props.theme.colors.primary};
    transform: scale(0.98);
  }

  &:disabled {
    background-color: ${(props) => props.theme.colors.primary};
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
