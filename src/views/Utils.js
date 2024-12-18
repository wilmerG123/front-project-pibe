import React, { useState } from 'react';
import CustomThemeProvider from '../styles/CustomThemeProvider';
import CategoryTable from './tables/CategoryTable'
import CanchaTable from './tables/CanchaTable'
import CityTable from './tables/CityTable'
import DepartmentTable from './tables/DepartmentTable'
import CountryTable from './tables/CountryTable'

import {
    FormOverlay,
    FormContainer,
    FormTitle,
    FormField,
    Label,
    Input,
    Select,
    Button,
    CancelButton,
    FormButtons,
} from '../styles/formularios';

import { FilterOptionNoSelect, ContainerFilter, Title, SearchBar, FilterContainer, FilterOption, MenuMiddle, MenuButton, NoResultsMessage, LoadingMessage } from './../styles/filters';



const Utils = () => {

    
    const [filterType, setFilterType] = useState('');
    const [categories, setCategories] = useState([]);
    const [citys, setCitys] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [countrys, setCountrys] = useState([]);
    const [departmentsForm, setDepartmentsform] = useState([]);
    const [countrysForm, setCountrysForm] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [ setFormMessage] = useState('');
    const [selectedCanchas, setSelectedCanchas] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [selectedCity, setSelectedCity] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    const [newCategory, setNewCategory] = useState({});
    const [newCancha, setNewcancha] = useState({});
    const [newDepartment, setNewDepartment] = useState({});
    const [newCity, setNewCity] = useState({
        name: '',
        department: {
            id: '',
            country: {
                id: ''
            }
        }
    });
    const [newCountry, setNewCountry] = useState({});

    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [showCreateCancha, setShowCreateCancha] = useState(false);
    const [showCreateCity, setShowCreateCity] = useState(false);
    const [showCreateDepartment, setShowCreateDepartment] = useState(false);
    const [showCreateCountry, setShowCreateCountry] = useState(false);

    const [showModifyCategory, setShowModifyCategory] = useState(false);
    const [showModifyCancha, setShowModifyCancha] = useState(false);
    const [showModifyCity, setShowModifyCity] = useState(false);
    const [showModifyDepartment, setShowModifyDepartment] = useState(false);
    const [showModifyCountry, setShowModifyCountry] = useState(false);

    const apiUrlMain = process.env.REACT_APP_API_MAIN;

    // Handle filter change
    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setCanchas([]);
        setCategories([]);
        setCitys([]);
        setDepartments([]);
        setCountrys([]);
        setNoResults(false);
    };

    const handleFormChangeCountry = (e) => {

        const { name, value } = e.target;

        const selectedItem = countrysForm.find(item => item.id.toString() === value);

        if (name === "country") {
            setNewDepartment(prevState => ({
                ...prevState,
                [name]: selectedItem
            }));
        }
    };

    const handleFormChangeCountryCity = (e) => {

        const { value } = e.target;  // Obtener el valor del input

        // Buscar el país seleccionado en el array de países
        const selectedItem = countrysForm.find(item => item.id.toString() === value);

        // Verificar si `selectedItem` es válido antes de proceder

        if (selectedItem && selectedItem.id) {
            // Actualizar el estado de newCity con el país seleccionado
            setNewCity(prevState => ({
                ...prevState,
                department: {
                    ...prevState.department,
                    country: {
                        ...prevState.department?.country,
                        id: selectedItem.id // Asegurarse de que el id se actualice correctamente
                    }
                }
            }));
            setDepartmentsform([])
            // Construir la URL solo cuando `selectedItem.id` es válido
            const url = `${apiUrlMain}/utils/get-all-departments-by-country/${selectedItem.id}`;

            // Realizar la solicitud solo si la URL es válida
            if (url) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        if (!data || data.length === 0) {
                            setNoResults(true);
                            setDepartmentsform([]); // Establecer un arreglo vacío si no hay resultados
                        } else {
                            setDepartmentsform(data); // Si hay datos, actualiza el estado
                        }
                    })
                    .catch(error => {
                        console.error('Error al cargar departamentos:', error);
                        setIsLoading(false);
                    });
            }
        } else {
            // Si no se selecciona un país válido, limpiar departamentos
            setDepartmentsform([]);
            setNoResults(false);
        }
    };

    const handleFormChangeDepartment = (e) => {
        const { name, value } = e.target;
    
        // Verifica que departmentsForm sea un arreglo antes de llamar a find
        const selectedItem = Array.isArray(departmentsForm)
            ? departmentsForm.find(item => item.id.toString() === value)
            : null;
    
        if (selectedItem) {
            setNewCity(prevState => ({
                ...prevState,
                [name]: selectedItem
            }));
        }
    };

    const handleInputChange = (e) => {

        const selectedFilterType = filterType;
        const { name, value } = e.target;

        if (selectedFilterType === 'Categoria') {
            setNewCategory(prevCoach => ({ ...prevCoach, [name]: value }));
        } else if (selectedFilterType === 'Ciudad') {
            setNewCity(prevCoach => ({ ...prevCoach, [name]: value }));
        } else if (selectedFilterType === 'Departamento') {
            setNewDepartment(prevCoach => ({ ...prevCoach, [name]: value }));
        } else if (selectedFilterType === 'Cancha') {
            setNewcancha(prevCoach => ({ ...prevCoach, [name]: value }));
        } else if (selectedFilterType === 'Pais') {
            setNewCountry(prevCoach => ({ ...prevCoach, [name]: value }));
        } else {
            console.log('Filtro desconocido');
        }

    };

    const handleSearch = (e) => {
        const selectedFilterType = filterType;

        if (selectedFilterType === 'Categoria') {
            handleSearchCategories(e);
        } else if (selectedFilterType === 'Ciudad') {
            handleSearchCitys(e);
        } else if (selectedFilterType === 'Departamento') {
            handleSearchDepartments(e);
        } else if (selectedFilterType === 'Cancha') {
            handleSearchCanchas(e);
        } else if (selectedFilterType === 'Pais') {
            handleSearchCountrys(e);
        } else {
            // Si filterType no coincide con ninguno de los casos
            console.log('Filtro desconocido');
        }

    };

    const handleGeneriCreate = (e) => {

        const selectedFilterType = filterType;

        if (selectedFilterType === 'Categoria') {
            setNewCategory({ name: '', year: '', gender: '' })
            setShowCreateCategory(true);
        } else if (selectedFilterType === 'Ciudad') {
            setNewCity({ name: '',
            department: {
                id: '',
                country: {
                    id: ''
                }
            }})
            setNoResults(false);
            setCountrys([]);
            let url = `${apiUrlMain}/utils/get-all-countries`;
            if (url) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        setCountrysForm(data)
                    })
                    .catch(error => {
                        console.error('Error al cargar paises:', error);
                        setIsLoading(false);
                    });
            }
            setShowCreateCity(true)
        } else if (selectedFilterType === 'Departamento') {
            setNoResults(false);
            setCountrysForm([]);
            let url = `${apiUrlMain}/utils/get-all-countries`;
            if (url) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        setCountrysForm(data)
                    })
                    .catch(error => {
                        console.error('Error al cargar paises:', error);
                        setIsLoading(false);
                    });
            }
            setNewDepartment({ name: '' })
            setShowCreateDepartment(true)
        } else if (selectedFilterType === 'Cancha') {
            setNewcancha({ name: '' })
            setShowCreateCancha(true)
        } else if (selectedFilterType === 'Pais') {
            setNewCountry({ name: '' })
            setShowCreateCountry(true)
        } else {
            // Si filterType no coincide con ninguno de los casos
            console.log('Filtro desconocido');
        }

    };

    const handleGeneriModify = (e) => {

        const selectedFilterType = filterType;

        if (selectedFilterType === 'Categoria') {
            if (selectedCategory.length === 0) {
                alert('Debes seleccionar al menos una Categoria');
                return;
            }
            if (selectedCategory.length > 1) {
                alert('Solo puedes modificar una categoria a la vez');
                return;
            }
            // Pre-cargar los datos de la categoria seleccionada
            const categoryToedit = categories.find(category => category.id === selectedCategory[0]);
            setNewCategory({
                name: categoryToedit.name,
                year: categoryToedit.year,
                gender: categoryToedit.gender
            });
            setShowModifyCategory(true);
        } else if (selectedFilterType === 'Ciudad') {
            if (selectedCity.length === 0) {
                alert('Debes seleccionar al menos una Ciudad');
                return;
            }
            if (selectedCity.length > 1) {
                alert('Solo puedes modificar una ciudad a la vez');
                return;
            }
            // Pre-cargar los datos de la categoria seleccionada
            const cityToEdit = citys.find(city => city.id === selectedCity[0]);
            setNewCity({
                name: cityToEdit.name,
                department: cityToEdit.department?.id,
                country: cityToEdit.department?.country?.id
            });
            setNoResults(false);
            setCountrys([]);
            let url = `${apiUrlMain}/utils/get-all-countries`;
            if (url) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        setCountrysForm(data)
                    })
                    .catch(error => {
                        console.error('Error al cargar paises:', error);
                        setIsLoading(false);
                    });
            }
            setShowModifyCity(true);
        } else if (selectedFilterType === 'Departamento') {
            if (selectedDepartments.length === 0) {
                alert('Debes seleccionar al menos un Departamento');
                return;
            }
            if (selectedDepartments.length > 1) {
                alert('Solo puedes modificar un departamento a la vez');
                return;
            }
            // Pre-cargar los datos de la categoria seleccionada
            const departmentToEdit = departments.find(department => department.id === selectedDepartments[0]);
            setNewDepartment({
                name: departmentToEdit.name,
                country: departmentToEdit.country?.id
            });
            setNoResults(false);
            setCountrys([]);
            let url = `${apiUrlMain}/utils/get-all-countries`;
            if (url) {
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        setCountrysForm(data)
                    })
                    .catch(error => {
                        console.error('Error al cargar paises:', error);
                        setIsLoading(false);
                    });
            }
            setShowModifyDepartment(true);
        } else if (selectedFilterType === 'Cancha') {
            if (selectedCanchas.length === 0) {
                alert('Debes seleccionar al menos una Cancha');
                return;
            }
            if (selectedCanchas.length > 1) {
                alert('Solo puedes modificar una Cancha a la vez');
                return;
            }
            // Pre-cargar los datos de la categoria seleccionada
            const canchaToEdit = canchas.find(cancha => cancha.id === selectedCanchas[0]);
            setNewcancha({
                name: canchaToEdit.name,
            });
            setShowModifyCancha(true);
        } else if (selectedFilterType === 'Pais') {
            if (selectedCountry.length === 0) {
                alert('Debes seleccionar al menos un Pais');
                return;
            }
            if (selectedCountry.length > 1) {
                alert('Solo puedes modificar un Pais a la vez');
                return;
            }
            setNoResults(false);
            setCountrys([]);
            
            // Pre-cargar los datos de la categoria seleccionada
            const countryToEdit = countrys.find(country => country.id === selectedCountry[0]);
            setNewCountry({
                name: countryToEdit.name,
            });
            setShowModifyCountry(true);
        } else {
            // Si filterType no coincide con ninguno de los casos
            console.log('Filtro desconocido');
        }

    };

    const handleGeneriDelete = (e) => {

        const selectedFilterType = filterType;

        if (selectedFilterType === 'Categoria') {
            handleDeleteCategory();
        } else if (selectedFilterType === 'Ciudad') {
            handleDeleteCity();
        } else if (selectedFilterType === 'Departamento') {
            handleDeleteDepartment();
        } else if (selectedFilterType === 'Cancha') {
            handleDeleteCancha();
        } else if (selectedFilterType === 'Pais') {
            handleDeleteCountry();
        } else {
            // Si filterType no coincide con ninguno de los casos
            console.log('Filtro desconocido');
        }

    };

    const handleCreate = (e) => {
        const selectedFilterType = filterType;

        if (selectedFilterType === 'Categoria') {
            handleCreateCategory();
        } else if (selectedFilterType === 'Ciudad') {
            handleCreateCity();
        } else if (selectedFilterType === 'Departamento') {
            handleCreateDepartment();
        } else if (selectedFilterType === 'Cancha') {
            handleCreateCancha();
        } else if (selectedFilterType === 'Pais') {
            handleCreateCountry();
        } else {
            // Si filterType no coincide con ninguno de los casos
            console.log('Filtro desconocido');
        }

    };

    const handleModify = (e) => {
        const selectedFilterType = filterType;

        if (selectedFilterType === 'Categoria') {
            handleModifyCategory();
        } else if (selectedFilterType === 'Ciudad') {
            handleModifyCity();
        } else if (selectedFilterType === 'Departamento') {
            handleModifyDepartment();
        } else if (selectedFilterType === 'Cancha') {
            handleModifyCancha();
        } else if (selectedFilterType === 'Pais') {
            handleModifyCountry();
        } else {
            // Si filterType no coincide con ninguno de los casos
            console.log('Filtro desconocido');
        }
    };

    const handleSearchCategories = (e) => {
        setIsLoading(true);
        setNoResults(false);
        setCategories([]);
        let url = `${apiUrlMain}/utils/get-all-categories`;

        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setCategories(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar categorias:', error);
                    setIsLoading(false);
                });
        }
    };

    const handleSearchCitys = (e) => {
        setIsLoading(true);
        setNoResults(false);
        setCitys([]);
        let url = `${apiUrlMain}/utils/get-all-cities`;

        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setCitys(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar ciudades:', error);
                    setIsLoading(false);
                });
        }
    };

    const handleSearchCountrys = (e) => {
        setIsLoading(true);
        setNoResults(false);
        setCountrys([]);
        let url = `${apiUrlMain}/utils/get-all-countries`;
        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setCountrys(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar paises:', error);
                    setIsLoading(false);
                });
        }
    };

    const handleSearchDepartments = (e) => {
        setIsLoading(true);
        setNoResults(false);
        setDepartments([]);
        let url = `${apiUrlMain}/utils/get-all-departments`;
        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0)
                        setNoResults(true);
                    setDepartments(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar departamentos:', error);
                    setIsLoading(false);
                });
        }
    };

    const handleSearchCanchas = (e) => {
        setIsLoading(true);
        setNoResults(false);
        setCanchas([]);
        let url = `${apiUrlMain}/utils/get-all-canchas`;
        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setCanchas(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar canchas:', error);
                    setIsLoading(false);
                });
        }
    };

    const handleCreateCategory = () => {
        const url = `${apiUrlMain}/utils/create-category`;
        const payload = {
            ...newCategory
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Categoria Creada Correctamente');
                    setNewCategory({
                        name: '',
                        year: '',
                        gender: '',
                    });
                    setShowCreateCategory(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al guardar el entrenador.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleCreateCountry = () => {
        const url = `${apiUrlMain}/utils/create-country`;
        const payload = {
            ...newCountry
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Pais Creado Correctamente');
                    setNewCountry({
                        name: '',
                    });
                    setShowCreateCountry(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al guardar el pais.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleCreateDepartment = () => {
        const url = `${apiUrlMain}/utils/create-department`;
        const payload = {
            ...newDepartment
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Departamento Creado Correctamente');
                    setNewDepartment({
                        name: '',
                        country: {
                            id: ''
                        }
                    });
                    setShowCreateCity(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al guardar el Depaprtamento.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleCreateCity = () => {
        const url = `${apiUrlMain}/utils/create-city`;
        const payload = {
            ...newCity
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Ciudad Creado Correctamente');
                    setNewCity({
                        name: '',
                        department: {
                            id: '',
                            country: {
                                id: ''
                            }
                        }
                    });
                    setShowCreateDepartment(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al guardar la ciudad.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });

    };

    const handleCreateCancha =()=>{

        const url = `${apiUrlMain}/utils/create-cancha`;
        const payload = {
            ...newCancha
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Cancha Creado Correctamente');
                    setNewcancha({
                        name: ''
                    });
                    setShowCreateDepartment(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al guardar la cancha.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });

    };

    const handleModifyCity = () => {
        const cityId = selectedCity[0] 
        const url = `${apiUrlMain}/utils/edit-country/${cityId}`;
        const payload = {
            ...newCity
        };
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Ciudad editada Correctamente');
                    setNewCity({
                        name: '',
                        department: {
                            id: '',
                            country: {
                                id: ''
                            }
                        }
                    });
                    setNewCountry(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al editar la ciudad.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleModifyCountry = () => {
        const countryId = selectedCountry[0] 
        const url = `${apiUrlMain}/utils/edit-country/${countryId}`;
        const payload = {
            ...newCountry
        };
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Pais editado Correctamente');
                    setNewCountry({
                        name: '',
                    });
                    setNewCountry(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al editar el Pais.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleModifyDepartment = () => {
        const departmentId = selectedDepartments[0] 
        const url = `${apiUrlMain}/utils/edit-department/${departmentId}`;
        const payload = {
            ...newDepartment
        };
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Departamento editada Correctamente');
                    setNewDepartment({
                        name: '',
                        country: {
                            id: ''
                        }
                    });
                    setShowModifyDepartment(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al editar el departamento.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleModifyCancha = () => {
        const canchaId = selectedCanchas[0] 
        const url = `${apiUrlMain}/utils/edit-cancha/${canchaId}`;
        const payload = {
            ...newCancha
        };
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Cancha editada Correctamente');
                    setNewCategory({
                        name: '',
                    });
                    setShowModifyCancha(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al editar la cancha.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleModifyCategory = () => {
        const categoryId = selectedCategory[0] 
        const url = `${apiUrlMain}/utils/edit-category/${categoryId}`;
        const payload = {
            ...newCategory
        };
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Categoria editada Correctamente');
                    setNewCategory({
                        name: '',
                        year: '',
                        gender: '',
                    });
                    setSelectedCategory([]); 
                    setShowModifyCategory(false);
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al editar la categoria.');
                    });
                }
            })
            .catch((error) => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleDeleteCountry = () => {
        // Validar si se ha seleccionado un solo pais
        if (selectedCountry.length === 0) {
            alert('Debes seleccionar al menos un Pais');
        } else if (selectedCountry.length > 1) {
            alert('Solo puedes eliminar un Pais a la vez.');
        } else {

            const countryId = selectedCountry[0];
            const countryName = countrys.find(country => country.id === countryId)?.name || 'Pais';

            const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar el pais : ${countryName}?`);

            if (confirmDelete) {
               
                fetch(`${apiUrlMain}/utils/delete-country/${countryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Pais eliminado satisfactoriamente.');
                            setCountrys(prevCountry => prevCountry.filter(country => country.id !== countryId));
                            setSelectedCountry([]); 
                        } else {
                            alert('Algo ha pasado, intenta más tarde.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar el Pais:', error);
                        alert('Algo ha pasado, intenta más tarde.');
                    });
            } else {
                // Si el usuario cancela, simplemente no hacemos nada
                console.log('Eliminación cancelada');
            }
        }
    };

    const handleDeleteCity = () => {
        // Validar si se ha seleccionado una sola ciudad
        if (selectedCity.length === 0) {
            alert('Debes seleccionar al menos una Ciudad');
        } else if (selectedCity.length > 1) {
            alert('Solo puedes eliminar una ciudad a la vez.');
        } else {

            const cityId = selectedCity[0];
            const cityName = citys.find(city => city.id === cityId)?.name || 'Ciudad';

            const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar a la ciudad ${cityName}?`);

            if (confirmDelete) {
               
                fetch(`${apiUrlMain}}/utils/delete-city/${cityId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Ciudad eliminada satisfactoriamente.');
                            setCitys(prevCity => prevCity.filter(city => city.id !== cityId));
                            setSelectedCity([]); 
                        } else {
                            alert('Algo ha pasado, intenta más tarde.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar la Ciudad:', error);
                        alert('Algo ha pasado, intenta más tarde.');
                    });
            } else {
                // Si el usuario cancela, simplemente no hacemos nada
                console.log('Eliminación cancelada');
            }
        }
    };

    const handleDeleteDepartment = () => {
        // Validar si se ha seleccionado un solo departamento
        if (selectedDepartments.length === 0) {
            alert('Debes seleccionar al menos un departamento');
        } else if (selectedDepartments.length > 1) {
            alert('Solo puedes eliminar un departamento a la vez.');
        } else {

            const departmentId = selectedDepartments[0];
            const departmentName = departments.find(department => department.id === departmentId)?.name || 'Deaprtamento';

            const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar departamento :  ${departmentName}?`);

            if (confirmDelete) {
               
                fetch(`${apiUrlMain}/utils/delete-department/${departmentId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Departamento eliminado satisfactoriamente.');
                            setDepartments(prevDepartament => prevDepartament.filter(department => department.id !== departmentId));
                            setSelectedDepartments([]); 
                        } else {
                            alert('Algo ha pasado, intenta más tarde.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar el departamento:', error);
                        alert('Algo ha pasado, intenta más tarde.');
                    });
            } else {
                // Si el usuario cancela, simplemente no hacemos nada
                console.log('Eliminación cancelada');
            }
        }
    };

    const handleDeleteCancha = () => {
        // Validar si se ha seleccionado una sola cancha
        if (selectedCanchas.length === 0) {
            alert('Debes seleccionar al menos una Cancha');
        } else if (selectedCanchas.length > 1) {
            alert('Solo puedes eliminar una cancha a la vez.');
        } else {

            const canchaId = selectedCanchas[0];
            const canchaName = canchas.find(cancha => cancha.id === canchaId)?.name || 'Cancha';

            const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar a la cancha ${canchaName}?`);

            if (confirmDelete) {
               
                fetch(`${apiUrlMain}/utils/delete-cancha/${canchaId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Cancha eliminado satisfactoriamente.');
                            setCanchas(prevCancha => prevCancha.filter(cancha => cancha.id !== canchaId));
                            setSelectedCanchas([]); 
                        } else {
                            alert('Algo ha pasado, intenta más tarde.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar la Cancha:', error);
                        alert('Algo ha pasado, intenta más tarde.');
                    });
            } else {
                // Si el usuario cancela, simplemente no hacemos nada
                console.log('Eliminación cancelada');
            }
        }
    };

    const handleDeleteCategory = () => {
        // Validar si se ha seleccionado una sola categoria
        if (selectedCategory.length === 0) {
            alert('Debes seleccionar al menos una Categoria');
        } else if (selectedCategory.length > 1) {
            alert('Solo puedes eliminar una categoria a la vez.');
        } else {

            const categoryId = selectedCategory[0];
            const categoryName = categories.find(category => category.id === categoryId)?.name || 'Category';

            const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar a la categoria ${categoryName}?`);

            if (confirmDelete) {
               
                fetch(`${apiUrlMain}/utils/delete-category/${categoryId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Categoria eliminado satisfactoriamente.');
                            setCategories(prevCategory => prevCategory.filter(category => category.id !== categoryId));
                            setSelectedCategory([]); 
                        } else {
                            alert('Algo ha pasado, intenta más tarde.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar la Categoria:', error);
                        alert('Algo ha pasado, intenta más tarde.');
                    });
            } else {
                // Si el usuario cancela, simplemente no hacemos nada
                console.log('Eliminación cancelada');
            }
        }
    };


    return (
        <>
            <CustomThemeProvider>
                <ContainerFilter>
                    <Title>Gestión de Varios</Title>
                    <SearchBar>
                        <FilterContainer>
                            <FilterOption>
                                <Label htmlFor="filterType">Buscar:</Label>
                                <Select
                                    id="filterType"
                                    value={filterType}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Selecciona</option>
                                    <option value="Categoria">Categorias</option>
                                    <option value="Cancha">Canchas</option>
                                    <option value="Ciudad">Ciudad</option>
                                    <option value="Departamento">Departamento</option>
                                    <option value="Pais">Pais</option>
                                </Select>
                            </FilterOption  >

                            {filterType && filterType !== '' && (

                                <FilterOptionNoSelect>
                                    <Button onClick={handleSearch}>Buscar</Button>
                                </FilterOptionNoSelect>

                            )}

                        </FilterContainer>
                    </SearchBar>

                    <MenuMiddle>
                        <MenuButton onClick={handleGeneriCreate} buttonType="create"> Crear {filterType} </MenuButton>
                        <MenuButton onClick={handleGeneriModify} buttonType="modify">Modificar {filterType}</MenuButton>
                        <MenuButton onClick={handleGeneriDelete} buttonType="delete"> Eliminar {filterType}</MenuButton>
                    </MenuMiddle>

                    {!isLoading && !noResults && categories.length > 0 && (
                        <CategoryTable categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
                    )}


                    {!isLoading && !noResults && canchas.length > 0 && (
                        <CanchaTable canchas={canchas} selectedCanchas={selectedCanchas} setSelectedCanchas={setSelectedCanchas} />
                    )}


                    {!isLoading && !noResults && citys.length > 0 && (
                        <CityTable citys={citys} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
                    )}


                    {!isLoading && !noResults && departments.length > 0 && (
                        <DepartmentTable departments={departments} selectedDepartments={selectedDepartments} setSelectedDepartments={setSelectedDepartments} />
                    )}


                    {!isLoading && !noResults && countrys.length > 0 && (
                        <CountryTable countrys={countrys} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry} />
                    )}

                    {isLoading && <LoadingMessage>Cargando...</LoadingMessage>}
                    {noResults && <NoResultsMessage>No se encontraron resultados ...</NoResultsMessage>}

                    {showCreateCategory && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Nueva Categoria</FormTitle>

                                <FormField>
                                    <Label htmlFor="userName">Nombre de Categoria:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCategory.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Categoria"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Genero:</Label>
                                    <Input
                                        type="text"
                                        id="gender"
                                        name="gender"
                                        value={newCategory.gender}
                                        onChange={handleInputChange}
                                        placeholder="Genero"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="lastName">Año:</Label>
                                    <Input
                                        type="text"
                                        id="year"
                                        name="year"
                                        value={newCategory.year}
                                        onChange={handleInputChange}
                                        placeholder="Año"
                                    />
                                </FormField>


                                <FormButtons>
                                    <Button onClick={handleCreate}>Crear Categoria</Button>
                                    <CancelButton onClick={() => setShowCreateCategory(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showCreateCountry && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Nuevo Pais</FormTitle>

                                <FormField>
                                    <Label htmlFor="name">Nombre de Pais:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCountry.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Pais"
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleCreate}>Crear Pais</Button>
                                    <CancelButton onClick={() => setShowCreateCountry(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showCreateDepartment && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Nuevo Departamento</FormTitle>

                                <FormField>
                                    <Label htmlFor="country">Pais:</Label>
                                    <Select
                                        name="country"
                                        value={newDepartment.country ? newDepartment.country.id : ''}
                                        onChange={handleFormChangeCountry}
                                    >
                                        <option value="">Seleccionar Pais</option>
                                        {countrysForm.map(country => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Nombre de Departamento:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newDepartment.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Pais"
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleCreate}>Crear Departamento</Button>
                                    <CancelButton onClick={() => setShowCreateDepartment(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showCreateCity && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Nueva Ciudad</FormTitle>

                                <FormField>
                                    <Label htmlFor="country">Pais:</Label>
                                    <Select
                                        name="country"
                                        value={newCity.department?.country?.id || ''}  // Asegúrate de manejar el valor correctamente
                                        onChange={handleFormChangeCountryCity} // Llama al manejador del cambio
                                    >
                                        <option value="">Seleccionar Pais</option>
                                        {countrysForm.map(country => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="department">Departamento:</Label>
                                    <Select
                                        name="department"
                                        value={newCity.department ? newCity.department.id : ''}
                                        onChange={handleFormChangeDepartment}
                                    >
                                        <option value="">Seleccionar Departament</option>
                                        {departmentsForm.map(department => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Nombre de Ciudad:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCity.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Pais"
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleCreate}>Crear Ciudad</Button>
                                    <CancelButton onClick={() => setShowCreateCity(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showCreateCancha && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Nueva Cancha</FormTitle>

                                <FormField>
                                    <Label htmlFor="name">Nombre de Cancha:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCancha.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Cancha"
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleCreate}>Crear Cancha</Button>
                                    <CancelButton onClick={() => setShowCreateCancha(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showModifyCategory && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Editar Categoria</FormTitle>

                                <FormField>
                                    <Label htmlFor="userName">Nombre de Categoria:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCategory.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Categoria"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Genero:</Label>
                                    <Input
                                        type="text"
                                        id="gender"
                                        name="gender"
                                        value={newCategory.gender}
                                        onChange={handleInputChange}
                                        placeholder="Genero"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="lastName">Año:</Label>
                                    <Input
                                        type="text"
                                        id="year"
                                        name="year"
                                        value={newCategory.year}
                                        onChange={handleInputChange}
                                        placeholder="Año"
                                    />
                                </FormField>


                                <FormButtons>
                                    <Button onClick={handleModify}>Editar Categoria</Button>
                                    <CancelButton onClick={() => setShowModifyCategory(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showModifyCountry && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Editar Pais</FormTitle>

                                <FormField>
                                    <Label htmlFor="name">Nombre de Pais:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCountry.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Pais"
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleModify}>Editar Pais</Button>
                                    <CancelButton onClick={() => setShowModifyCountry(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showModifyDepartment && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Editar Pais</FormTitle>

                                <FormField>
                                    <Label htmlFor="city">Pais:</Label>
                                    <Select
                                        name="country"
                                        value={newDepartment.country?.id}
                                        onChange={handleInputChange}
                                    >
                                        <option value="">Seleccionar Pais</option>
                                        {countrysForm.map(country => (
                                            <option key={country.id} value={country.name}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Nombre de Departamento:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newDepartment.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Departamento"
                                    />
                                </FormField>

                                

                                <FormButtons>
                                    <Button onClick={handleModify}>Editar Departamento</Button>
                                    <CancelButton onClick={() => setShowModifyDepartment(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showModifyCity && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Editar Ciudad</FormTitle>

                                <FormField>
                                    <Label htmlFor="country">Pais:</Label>
                                    <Select
                                        name="country"
                                        value={newCity.department?.country?.id || ''}  // Asegúrate de manejar el valor correctamente
                                        onChange={handleFormChangeCountryCity} // Llama al manejador del cambio
                                    >
                                        <option value="">Seleccionar Pais</option>
                                        {countrysForm.map(country => (
                                            <option key={country.id} value={country.id}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="department">Departamento:</Label>
                                    <Select
                                        name="department"
                                        value={newCity.department ? newCity.department.id : ''}
                                        onChange={handleFormChangeDepartment}
                                    >
                                        <option value="">Seleccionar Departament</option>
                                        {departmentsForm.map(department => (
                                            <option key={department.id} value={department.id}>
                                                {department.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Nombre de Ciudad:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCity.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Pais"
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleModify}>Editar Ciudad</Button>
                                    <CancelButton onClick={() => setShowModifyCity(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showModifyCancha && (
                        <FormOverlay onClick={null}>
                            <FormContainer>
                                <FormTitle>Editar Cancha</FormTitle>

                                <FormField>
                                    <Label htmlFor="name">Nombre de Cancha:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCancha.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de Cancha"
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleModify}>Editar Cancha</Button>
                                    <CancelButton onClick={() => setShowModifyCancha(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}





                </ContainerFilter>
            </CustomThemeProvider>
        </>
    );


}
export default Utils