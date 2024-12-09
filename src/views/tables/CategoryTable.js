import React from 'react';
import {
  ResultList,
  ResultTable,
  SelectAllCheckbox,
} from '../../styles/tablas'
import CustomThemeProvider from '../../styles/CustomThemeProvider';

const CategoryTable = ({ categories, selectedCategory, setSelectedCategory }) => {

  // Maneja la selección de un entrenador individual
  const handleSelectCategory = (categoryId) => {
    setSelectedCategory((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        // Si ya está seleccionado, lo deseleccionamos
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        // Si no está seleccionado, lo agregamos
        return [...prevSelected, categoryId];
      }
    });
  };

  // Maneja la selección de todos los categorias
  const handleSelectAll = () => {
    if (selectedCategory.length === categories.length) {
      // Si ya están seleccionados todos, desmarcamos
      setSelectedCategory([]);
    } else {
      // Seleccionamos todos los categorias
      const allCategoriesIds = categories.map(category => category.id);
      setSelectedCategory(allCategoriesIds);
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
                  checked={selectedCategory.length === categories.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Nombre</th>
              <th>Año</th>
              <th>Genero</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedCategory.includes(category.id)}
                    onChange={() => handleSelectCategory(category.id)}
                  />
                </td>
                <td>{category.name}</td>
                <td>{category.year || 'No disponible'}</td>
                <td>{category.gender || 'No disponible'}</td>
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultList>
    </CustomThemeProvider>

  );
};

export default CategoryTable;
