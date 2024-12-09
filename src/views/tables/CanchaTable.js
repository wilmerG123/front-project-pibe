import React from 'react';
import {
  ResultList,
  ResultTable,
  SelectAllCheckbox,
} from '../../styles/tablas'
import CustomThemeProvider from '../../styles/CustomThemeProvider';

const CanchaTable = ({ canchas, selectedCanchas, setSelectedCanchas }) => {

  
  const handleSelectCancha = (canchaId) => {
    setSelectedCanchas((prevSelected) => {
      if (prevSelected.includes(canchaId)) {
        return prevSelected.filter((id) => id !== canchaId);
      } else {
        return [...prevSelected, canchaId];
      }
    });
  };


  const handleSelectAll = () => {
    if (selectedCanchas.length === canchas.length) {
      setSelectedCanchas([]);
    } else {
      const allCanchaIds = canchas.map(cancha => cancha.id);
      selectedCanchas(allCanchaIds);
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
                  checked={selectedCanchas.length === canchas.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {canchas.map(cancha => (
              <tr key={cancha.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCanchas.includes(cancha.id)}
                    onChange={() => handleSelectCancha(cancha.id)}
                  />
                </td>
                <td>{cancha.name}</td>
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultList>
    </CustomThemeProvider>

  );
};

export default CanchaTable;
