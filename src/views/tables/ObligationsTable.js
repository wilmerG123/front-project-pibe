import React from 'react';
import {
  ResultList,
  ResultTable,
  SelectAllCheckbox,
} from '../../styles/tablas'
import CustomThemeProvider from '../../styles/CustomThemeProvider';

const ObligationsTable = ({ obligations, selectedObligation, setSelectedObligation }) => {

  
  const handleSelectObligation = (obligationId) => {
    setSelectedObligation((prevSelected) => {
      if (prevSelected.includes(obligationId)) {
        return prevSelected.filter((id) => id !== obligationId);
      } else {
        return [...prevSelected, obligationId];
      }
    });
  };


  const handleSelectAll = () => {
    if (selectedObligation.length === obligations.length) {
      setSelectedObligation([]);
    } else {
      const allObligationsIds = obligations.map(obligation => obligation.id);
      setSelectedObligation(allObligationsIds);
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
                  checked={selectedObligation.length === obligations.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Nombre Deuda</th>
              <th>Nombre Jugador</th>
            </tr>
          </thead>
          <tbody>
            {obligations.map(obligation => (
              <tr key={obligation.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedObligation.includes(obligation.id)}
                    onChange={() => handleSelectObligation(obligation.id)}
                  />
                </td>
                <td>{obligation.name}</td>
                <td>{obligation.player?.name}</td>
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultList>
    </CustomThemeProvider>

  );
};

export default ObligationsTable;
