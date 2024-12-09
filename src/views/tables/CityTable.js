import React from 'react';
import {
  ResultList,
  ResultTable,
  SelectAllCheckbox,
} from '../../styles/tablas'
import CustomThemeProvider from '../../styles/CustomThemeProvider';

const CityTable = ({ citys, selectedCity, setSelectedCity }) => {

  
  const handleSelectCity = (cityId) => {
    setSelectedCity((prevSelected) => {
      if (prevSelected.includes(cityId)) {
        return prevSelected.filter((id) => id !== cityId);
      } else {
        return [...prevSelected, cityId];
      }
    });
  };


  const handleSelectAll = () => {
    if (selectedCity.length === citys.length) {
     
      setSelectedCity([]);
    } else {
     
      const allCitysIds = citys.map(city => city.id);
      setSelectedCity(allCitysIds);
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
                  checked={selectedCity.length === citys.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Nombre</th>
              <th>Depaprtamento</th>
              <th>Pais</th>
            </tr>
          </thead>
          <tbody>
            {citys.map(city => (
              <tr key={city.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCity.includes(city.id)}
                    onChange={() => handleSelectCity(city.id)}
                  />
                </td>
                <td>{city.name}</td>
                <td>{city.department?.name}</td>
                <td>{city.department?.country?.name}</td>
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultList>
    </CustomThemeProvider>

  );
};

export default CityTable;
