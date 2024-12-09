import styled from 'styled-components';

// Contenedor principal de la sección de filtro y búsqueda
export const ContainerFilter = styled.div`
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 1400px;  // Limita el ancho máximo del contenedor
  margin: 0 auto;  // Centra el contenedor en la pantalla
`;

// Título de la sección de gestión de jugadores
export const Title = styled.h2`
  font-family: ${(props) => props.theme.typography.headingFont};
  color: ${(props) => props.theme.colors.primary};
  font-size: 26px;
  font-weight: 600;
  margin-bottom: 20px;
  text-transform: uppercase;
`;

// Barra de búsqueda (contenedor)
export const SearchBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: ${(props) => props.theme.colors.background};
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

// Contenedor de filtro (para mantener las opciones alineadas)
export const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Contenedor individual de cada opción de filtro
export const FilterOption = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// Contenedor para la opción de filtro sin select (solo botón)
export const FilterOptionNoSelect = styled.div`
  display: flex;
  justify-content: flex-end;
`;

// Etiquetas de los filtros
export const Label = styled.label`
  font-size: 14px;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 5px;
  font-weight: 500;
`;

// Input y select de búsqueda (para campos de texto y categorías)
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
  }
`;

// Botón de búsqueda (reutilizable para cualquier botón)
export const Button = styled.button`
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text};
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  
  margin-top: 10px; /* Se agrega un margen superior para separar el botón del input/select */

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

// Contenedor de los botones de gestión (Crear, Modificar, Eliminar)
export const MenuMiddle = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  padding-top: 20px;
`;

// Estilo para los botones del menú (Crear, Modificar, Eliminar)
export const MenuButton = styled(Button)`
  background-color: ${(props) => 
    props.buttonType === 'delete' 
      ? props.theme.colors.secondary // Rojo para eliminar
      : props.theme.colors.primary}; // Verde para crear y modificar

  &:hover {
    background-color: ${(props) => 
      props.buttonType === 'delete' 
        ? props.theme.colors.secondary // Rojo para eliminar (sin cambio en hover)
        : props.theme.colors.hoverPrimary}; // Verde hover para crear y modificar
  }
`;

export const NoResultsMessage = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
`;

export const LoadingMessage = styled.p`
  color: ${(props) => props.theme.colors.text};
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
`;

// Contenedor que agrupa los elementos (Select, Input, Button)
export const SearchContainer = styled.div`
  display: flex;
  align-items: center; /* Alinea los elementos verticalmente al centro */
  gap: 15px; /* Espaciado entre los elementos */
  flex-wrap: wrap; /* Permite que los elementos se ajusten en pantallas pequeñas */
  margin-bottom: 20px; /* Añade margen inferior para separar de otros elementos si es necesario */
`;
