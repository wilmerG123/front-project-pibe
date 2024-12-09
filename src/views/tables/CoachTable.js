import React from 'react';
import {
  ResultList,
  ResultTable,
  SelectAllCheckbox,
} from '../../styles/tablas'
import CustomThemeProvider from '../../styles/CustomThemeProvider';

const CoachTable = ({ coaches, selectedCoach, setSelectedCoach }) => {

  // Maneja la selección de un entrenador individual
  const handleSelectCoach = (coachId) => {
    setSelectedCoach((prevSelected) => {
      if (prevSelected.includes(coachId)) {
        // Si ya está seleccionado, lo deseleccionamos
        return prevSelected.filter((id) => id !== coachId);
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prevSelected, coachId];
      }
    });
  };

  // Maneja la selección de todos los entrenadores
  const handleSelectAll = () => {
    if (selectedCoach.length === coaches.length) {
      // Si ya están seleccionados todos, desmarcamos
      setSelectedCoach([]);
    } else {
      // Seleccionamos todos los entrenadores
      const allCoachIds = coaches.map(coach => coach.id);
      setSelectedCoach(allCoachIds);
    }
  };

  return (
    <CustomThemeProvider>
      <ResultList>
        <ResultTable>
          <thead>
            <tr>
              <th>
                <SelectAllCheckbox
                  type="checkbox"
                  checked={selectedCoach.length === coaches.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Apellido</th>
              <th>Correo</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map(coach => (
              <tr key={coach.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCoach.includes(coach.id)}
                    onChange={() => handleSelectCoach(coach.id)}
                  />
                </td>
                <td>{coach.name}</td>
                <td>{coach.userName}</td>
                <td>{coach.lastName || 'No disponible'}</td>
                <td>{coach.mail || 'No disponible'}</td>
                <td>{coach.phone || 'No disponible'}</td>
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultList>
    </CustomThemeProvider>

  );
};

export default CoachTable;
