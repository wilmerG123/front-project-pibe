import styled from 'styled-components';

// Contenedor principal de la tabla
export const ResultList = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 12px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
`;

// Estilo para la tabla
export const ResultTable = styled.table`
  width: 100%;
  border-collapse: collapse; /* Elimina los espacios entre celdas */
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 10px;
  overflow: hidden; /* Asegura que las celdas se adapten al borde redondeado */

  th, td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
  }

  th {
    font-size: 16px;
    color: ${(props) => props.theme.colors.primary};
    font-weight: 600;
    text-transform: uppercase;
  }

  td {
    font-size: 14px;
    color: ${(props) => props.theme.colors.text};
  }

  tr:nth-child(even) {
    background-color: ${(props) => props.theme.colors.tableRowEven};
  }

  tr:hover {
    background-color: ${(props) => props.theme.colors.hoverTableRow};
  }

  input[type="checkbox"] {
    transform: scale(1.2);
  }
`;

// Estilo para los botones de acción (como seleccionar todos)
export const SelectAllCheckbox = styled.input`
  transform: scale(1.2);
  margin-right: 8px;
  cursor: pointer;
`;

// Modal Overlay (fondo oscuro)
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); /* Fondo oscuro con opacidad */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que el modal esté por encima del contenido */
  animation: fadeIn 0.3s ease-in-out; /* Animación para la aparición del modal */
`;

// Modal Content (contenido del modal)
export const ModalContent = styled.div`
  background-color: ${(props) => props.theme.colors.modalBackground}; /* Color del fondo según el tema */
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 60%; /* Tamaño del modal */
  max-width: 600px;
  text-align: center;
  animation: slideIn 0.3s ease-out; /* Animación para la aparición del contenido del modal */

  h2 {
    margin-bottom: 20px;
    font-size: 20px;
    color: ${(props) => props.theme.colors.primary};
  }

  p {
    margin-bottom: 10px;
    font-size: 16px;
    color: ${(props) => props.theme.colors.text};
  }

  button {
    padding: 10px 20px;
    background-color: ${(props) => props.theme.colors.primary}; /* Color del botón según el tema */
    color: ${(props) => props.theme.colors.background}; /* Color del texto del botón */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
  }

  button:hover {
    background-color: ${(props) => props.theme.colors.hoverPrimary}; /* Color al pasar el mouse */
  }
`;

// Animación para el desvanecimiento
const fadeIn = `
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

// Animación para el deslizamiento
const slideIn = `
  @keyframes slideIn {
    0% {
      transform: translateY(-20px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Exportamos las animaciones también
export { fadeIn, slideIn };
