import React from 'react';
import {
  ResultList,
  ResultTable,
  SelectAllCheckbox,
} from '../../styles/tablas'
import CustomThemeProvider from '../../styles/CustomThemeProvider';

const CountryTable = ({ countrys, selectedCountry, setSelectedCountry }) => {

  
  const handleSelectCountry = (countryId) => {
    setSelectedCountry((prevSelected) => {
      if (prevSelected.includes(countryId)) {
        return prevSelected.filter((id) => id !== countryId);
      } else {
        return [...prevSelected, countryId];
      }
    });
  };


  const handleSelectAll = () => {
    if (selectedCountry.length === countrys.length) {
      setSelectedCountry([]);
    } else {
      const allCountrysIds = countrys.map(country => country.id);
      setSelectedCountry(allCountrysIds);
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
                  checked={selectedCountry.length === countrys.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {countrys.map(country => (
              <tr key={country.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCountry.includes(country.id)}
                    onChange={() => handleSelectCountry(country.id)}
                  />
                </td>
                <td>{country.name}</td>
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultList>
    </CustomThemeProvider>

  );
};

export default CountryTable;
