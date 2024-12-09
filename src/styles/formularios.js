import styled, { keyframes } from 'styled-components';

// Contenedor general para el overlay del formulario
export const FormOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6); /* Fondo oscuro y semitransparente */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Asegura que el formulario esté por encima de otros elementos */
  padding: 20px;
  `;

// Contenedor del formulario
export const FormContainer = styled.div`
  background-color: ${(props) => props.theme.colors.background}; /* Fondo oscuro */
  padding: 30px;
  border-radius: 10px; /* Bordes redondeados */
  max-width: 500px;
  width: 100%;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3); /* Sombra suave */
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 1000;
  overflow-y: auto;
  transform: translateY(50px);
  animation: fadeIn 0.3s ease-out;
  `;

// Animación para el efecto de aparición
export const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
  `;

// Título del formulario
export const FormTitle = styled.h2`
  font-family: ${(props) => props.theme.typography.headingFont};
  font-size: 24px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  `;

// Estilo para cada campo de entrada (input y select)
export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  `;

// Etiquetas de los campos
export const Label = styled.label`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  font-weight: 500;
  `;

// Inputs y selects
export const Input = styled.input`
  padding: 12px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.hoverPrimary};
    outline: none;
  }
  /* Estilos para el campo de datetime-local */
  &[type="datetime-local"] {
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-size: 16px;
    padding: 12px;
    border: 2px solid ${(props) => props.theme.colors.primary};
    border-radius: 8px;
    cursor: pointer;

    /* Ajustes visuales específicos para datetime-local */
    &::-webkit-datetime-edit {
      padding: 0.4rem;
      font-size: 16px;
    }

    &::-webkit-date-picker,
    &::-webkit-time-picker {
      padding: 0.4rem;
      font-size: 16px;
    }
  }

 `;

  export const Select = styled.select`
  padding: 12px;
  border: 2px solid ${(props) => props.theme.colors.primary};
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.background};
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => props.theme.colors.hoverPrimary};
    outline: none;
  }

  option {
    background-color: ${(props) => props.theme.colors.background};
    padding: 10px;
  }

  /* Resalta las opciones seleccionadas */
  option:checked {
    background-color: ${(props) => props.theme.colors.primary}; /* Color de fondo cuando está seleccionado */
    color: white; /* Color del texto cuando está seleccionado */
  }

  /* Aplica una sombra al select cuando está enfocado */
  &:focus {
    border-color: ${(props) => props.theme.colors.hoverPrimary};
    box-shadow: 0 0 5px 2px ${(props) => props.theme.colors.primary};
  }
`;



// Contenedor de los botones
export const FormButtons = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
  `;

// Botones de acción (Crear y Cancelar)
export const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text};
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  transition: background-color 0.3s ease, transform 0.2s ease;

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

// Botón de cancelar con un color diferente
export const CancelButton = styled(Button)`
  background-color: ${(props) => props.theme.colors.secondary};
  &:hover {
    background-color: ${(props) => props.theme.colors.hoverSecondary};
  }
  `;

// Mensaje de error o éxito (si lo hay)
export const FormMessage = styled.p`
  font-size: 14px;
  color: ${(props) => props.theme.colors.secondary};
  margin-top: 15px;
  text-align: center;
  `;

// Estilo para los inputs y select al estar en foco
export const FocusInput = styled.input`
  &:focus {
    border-color: ${(props) => props.theme.colors.hoverPrimary};
  }
  `;