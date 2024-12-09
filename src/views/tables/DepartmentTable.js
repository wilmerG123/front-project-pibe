import React from 'react';
import {
  ResultList,
  ResultTable,
  SelectAllCheckbox,
} from '../../styles/tablas'
import CustomThemeProvider from '../../styles/CustomThemeProvider';

const DepartmentTable = ({ departments, selectedDepartments, setSelectedDepartments }) => {

  
  const handleSelectDepartment = (departmentId) => {
    setSelectedDepartments((prevSelected) => {
      if (prevSelected.includes(departmentId)) {
        return prevSelected.filter((id) => id !== departmentId);
      } else {
        return [...prevSelected, departmentId];
      }
    });
  };


  const handleSelectAll = () => {
    if (selectedDepartments.length === departments.length) {
      setSelectedDepartments([]);
    } else {
      const allDepartmentsIds = departments.map(department => department.id);
      setSelectedDepartments(allDepartmentsIds);
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
                  checked={selectedDepartments.length === departments.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Nombre</th>
              <th>Pais</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(department => (
              <tr key={department.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedDepartments.includes(department.id)}
                    onChange={() => handleSelectDepartment(department.id)}
                  />
                </td>
                <td>{department.name}</td>
                <td>{department.country.name}</td>
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultList>
    </CustomThemeProvider>

  );
};

export default DepartmentTable;
