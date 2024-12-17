import React, { useState, useEffect } from 'react';
import CoachTable from './tables/CoachTable'
import CustomThemeProvider from '../styles/CustomThemeProvider';
import Button from '../styles/Button'
import {
    FormOverlay,
    FormContainer,
    FormTitle,
    FormField,
    Label,
    Input,
    Select,
    FormButtons,
    CancelButton,
    FormMessage
} from '../styles/formularios';
import {
    SearchContainer,
    ContainerFilter,
    Title,
    SearchBar,
    FilterContainer,
    FilterOption,
    FilterOptionNoSelect,
    MenuMiddle,
    MenuButton,
    NoResultsMessage,
    LoadingMessage,

} from '../styles/filters'; // Importar los componentes estilizados de filtros.js


const Coachs = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [categories, setCategories] = useState([]);
    const [coaches, setCoaches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState([]);
    const [newCoach, setNewCoach] = useState({
        userName: '',
        name: '',
        lastName: '',
        mail: '',
        phone: '',
        categories: []
    });
    const [formMessage, setFormMessage] = useState('');

    const apiUrlMain = process.env.REACT_APP_API_MAIN;

    // Handle Search Change
    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    // Handle filter change
    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setSearchQuery('');
        setFilterCategory('');
        setCoaches([]);
        setNoResults(false);
    };

    // Handle form close
    const handleCloseForm = (e) => {
        if (e.target === e.currentTarget) {
            setShowCreateForm(false);
            setShowEditForm(false);
            setFormMessage('');
        }
    };
    

    const handleCategoryChangeForm = (e) => {
        // Extraemos los IDs de las categorías seleccionadas
        const selectedCategoryIds = Array.from(e.target.selectedOptions, option => option.value);
    
        // Transformamos los IDs seleccionados en objetos con la forma {id: "1"}
        const selectedCategories = selectedCategoryIds.map(id => ({
            id: id
        }));
    
        // Actualizamos el estado con los objetos de categorías seleccionadas
        setNewCoach(prevState => ({
            ...prevState,
            categories: selectedCategories  // Guardamos los objetos {id: "1"}
        }));
    };


    // Handle Category Change (Multiple Selection)
    const handleCategoryChange = (e) => {

        setFilterCategory(e.target.value);
        setCoaches([]);
        setNoResults(false);
        setSearchQuery('');
        
    };

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewCoach(prevCoach => ({ ...prevCoach, [name]: value }));
    };


    // Handle Search
    const handleSearch = () => {
        setIsLoading(true);
        setNoResults(false);
        setCoaches([]);
        let url = '';

        if (filterType === 'nombre' && searchQuery) {
            url = `${apiUrlMain}/coach/get-by-name/${searchQuery}`;
        } else if (filterType === 'categoria' && filterCategory) {
            const selectedCategory = categories.find(cat => cat.name === filterCategory);
            if (selectedCategory) {
                url = `${apiUrlMain}/coach/get-by-category-id/${selectedCategory.id}`;
            }
        } else if (filterType === 'todos') {
            url = `${apiUrlMain}/coach/get-all-coach`;
        }

        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setCoaches(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar entrenadores:', error);
                    setIsLoading(false);
                });
        }
    };

    useEffect(() => {
        setCategoriesLoading(true);
        fetch(`${apiUrlMain}/utils/get-all-categories`)
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                setCategoriesLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar categorías:', error);
                setCategoriesLoading(false);
            });
    }, []);

    const handleCreateCoachClick = () => {
        // Limpiar los estados antes de abrir el formulario de creación
        setNewCoach({
            userName: '',
            name: '',
            lastName: '',
            mail: '',
            password: '',
            phone: '',
            categories: []
        });
        setShowCreateForm(true); // Abrir el formulario de creación
    };

    // Handle Coach Editing
    const handleEditCoach = () => {
        if (selectedCoach.length === 0) {
            alert('Debes seleccionar al menos un entrenador');
            return;
        }
        if (selectedCoach.length > 1) {
            alert('Solo puedes modificar un entrenador a la vez');
            return;
        }

        // Pre-cargar los datos del entrenador seleccionado
        const coachToEdit = coaches.find(coach => coach.id === selectedCoach[0]);
        setNewCoach({
            userName: coachToEdit.userName,
            name: coachToEdit.name,
            lastName: coachToEdit.lastName,
            mail: coachToEdit.mail,
            phone: coachToEdit.phone,
            categories: coachToEdit.categories || []
        });
        setShowEditForm(true);
    };

    // Handle Coach Deletion
    const handleDeleteCoach = () => {
        // Validar si se ha seleccionado un solo jugador
        if (selectedCoach.length === 0) {
            alert('Debes seleccionar al menos un coach.');
        } else if (selectedCoach.length > 1) {
            alert('Solo puedes eliminar un coach a la vez.');
        } else {
            // Mostrar una alerta de confirmación antes de eliminar
            const coachId = selectedCoach[0];
            const coachName = coaches.find(coach => coach.id === coachId)?.name || 'Entrenador';

            const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar al Entrenador ${coachName}?`);

            if (confirmDelete) {
                // Hacer la solicitud DELETE al servidor si el usuario confirma
                fetch(`${apiUrlMain}/coach/delete-coach/${coachId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Entrenador eliminado satisfactoriamente.');
                            // Actualizar la lista de jugadores después de eliminar
                            setCoaches(prevCoach => prevCoach.filter(coach => coach.id !== coachId));
                            setSelectedCoach([]); // Limpiar la selección
                        } else {
                            alert('Algo ha pasado, intenta más tarde.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar el Entrenador:', error);
                        alert('Algo ha pasado, intenta más tarde.');
                    });
            } else {
                // Si el usuario cancela, simplemente no hacemos nada
                console.log('Eliminación cancelada');
            }
        }

    };

    // Handle Coach Creation
    const handleCreateCoach = () => {
    
        const url = `${apiUrlMain}/coach/create-coach`;
        const payload = {
            ...newCoach
        };

        // Log antes de la solicitud fetch
        console.log("Enviando solicitud para crear el coach...");

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                console.log("Respuesta del servidor:", response); // Log de la respuesta del servidor
                if (response.ok) {
                    console.log("Coach creado correctamente.");
                    alert('Entrenador Creado Correctamente');

                    // Restablecer los datos del formulario
                    setNewCoach({
                        userName: '',
                        name: '',
                        lastName: '',
                        mail: '',
                        phone: '',
                        categories: [],
                    });
                    setShowCreateForm(false); // Cerrar formulario
                } else {
                    console.log("Respuesta no OK, procesando el error...");
                    // Si la respuesta no es OK, tratar de leer el mensaje de error
                    return response.json().then((data) => {
                        console.error("Error del servidor:", data); // Log detallado del error
                        throw new Error(data.message || 'Error al guardar el entrenador.');
                    });
                }
            })
            .catch((error) => {
                console.error("Error capturado:", error); // Log de error capturado

                // Mostrar mensaje de error en la UI
                setFormMessage(`Error: ${error.message}`);

                // Si se recibe un error de autenticación, podemos hacer algo más aquí
                if (error.message === "Access Denied") {
                    console.error("Acceso denegado, redirigiendo al login...");
                    // Aquí puedes redirigir al login si es necesario
                    // window.location.href = "/login";  // Descomenta si necesitas redirigir
                }
            });
    };


    // Handle Coach Update
    const handleUpdateCoach = () => {
        const coachId = selectedCoach[0];
        const url = `${apiUrlMain}/coach/edit-coach/${coachId}`;
        const payload = { ...newCoach };

        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (response.ok) {
                    alert('Entrenador modificado correctamente');
                    setShowEditForm(false);
                    setSelectedCoach([]);
                    setNewCoach({
                        userName: '',
                        name: '',
                        lastName: '',
                        mail: '',
                        password: '',
                        phone: '',
                        categories: []
                    });
                } else {
                    alert('No se pudo modificar el entrenador');
                }
            })
            .catch((error) => {
                alert(`Error: ${error.message}`);
            });
    };

    return (

        <>
            <CustomThemeProvider>
                <ContainerFilter>
                    <Title>Gestión de Entrenadores</Title>
                    <SearchBar>
                        <FilterContainer>
                            <FilterOption>
                                <Label htmlFor="filterType">Buscar por:</Label>
                                <Select
                                    id="filterType"
                                    value={filterType}
                                    onChange={handleFilterChange}
                                >
                                    <option value="">Seleccionar filtro</option>
                                    <option value="nombre">Nombre</option>
                                    <option value="categoria">Categoría</option>
                                    <option value="todos">Todos los entrenadores</option>
                                </Select>
                            </FilterOption>

                            {filterType && filterType !== 'todos' && (
                                <FilterOption>
                                    <Label htmlFor="searchQuery">
                                        {filterType === 'nombre' ? 'Nombre' : 'Categoría'}:
                                    </Label>
                                    <SearchContainer>
                                        {filterType === 'categoria' ? (
                                            <Select
                                                id="categorySelect"
                                                value={filterCategory}
                                                onChange={handleCategoryChange}
                                            >

                                                <option value="">Seleccionar Categoría</option>
                                                {categoriesLoading ? (
                                                    <option value="">Cargando categorías...</option>
                                                ) : (
                                                    categories.map(category => (
                                                        <option key={category.id} value={category.name}>
                                                            {category.name}
                                                        </option>
                                                    ))
                                                )}
                                            </Select>
                                        ) : (
                                            <Input
                                                type="text"
                                                id="searchQuery"
                                                placeholder={`Buscar por ${filterType === 'nombre' ? 'nombre' : 'categoría'}`}
                                                value={searchQuery}
                                                onChange={handleSearchChange}
                                            />
                                        )}


                                        <Button onClick={handleSearch}>Buscar</Button>

                                    </SearchContainer>
                                </FilterOption>
                            )}

                            {filterType === 'todos' && (
                                <FilterOptionNoSelect>
                                    <Button onClick={handleSearch}>Buscar</Button>
                                </FilterOptionNoSelect>
                            )}
                        </FilterContainer>
                    </SearchBar>

                    <MenuMiddle>
                        <MenuButton onClick={(handleCreateCoachClick)} buttonType="create" >Crear Entrenador</MenuButton>
                        <MenuButton onClick={handleEditCoach} buttonType="modify" >Modificar Entrenador</MenuButton>
                        <MenuButton onClick={handleDeleteCoach}buttonType="delete">Eliminar Entrenador</MenuButton>
                    </MenuMiddle>


                    {!isLoading && !noResults && coaches.length > 0 && (
                        <CoachTable coaches={coaches} selectedCoach={selectedCoach} setSelectedCoach={setSelectedCoach} />
                    )}
                    {isLoading && <LoadingMessage>Cargando entrenadores...</LoadingMessage>}
                    {noResults && <NoResultsMessage>No se encontraron entrenadores.</NoResultsMessage>}

                    {showCreateForm && (
                        <FormOverlay onClick={handleCloseForm}>
                            <FormContainer>
                                <FormTitle>Nuevo Entrenador</FormTitle>

                                <FormField>
                                    <Label htmlFor="userName">Nombre de Usuario:</Label>
                                    <Input
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        value={newCoach.userName}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de usuario"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Nombre:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCoach.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="lastName">Apellido:</Label>
                                    <Input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={newCoach.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Apellido"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="mail">Correo Electrónico:</Label>
                                    <Input
                                        type="email"
                                        id="mail"
                                        name="mail"
                                        value={newCoach.mail}
                                        onChange={handleInputChange}
                                        placeholder="Correo electrónico"
                                    />
                                </FormField>
                                <FormField>
                                    <Label htmlFor="phone">Teléfono:</Label>
                                    <Input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={newCoach.phone}
                                        onChange={handleInputChange}
                                        placeholder="Teléfono"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="categories">Categorías:</Label>
                                    <Select
                                        id="categorySelect"
                                        multiple
                                        value={newCoach.categories.map(cat => cat.id)}
                                        onChange={handleCategoryChangeForm}
                                    >
                                        {categoriesLoading ? (
                                            <option value="">Cargando categorías...</option>
                                        ) : (
                                            categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))
                                        )}
                                    </Select>
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleCreateCoach}>Crear Entrenador</Button>
                                    <CancelButton onClick={() => setShowCreateForm(false)}>Cancelar</CancelButton>
                                </FormButtons>
                            </FormContainer>
                        </FormOverlay>
                    )}

                    {showEditForm && (
                        <FormOverlay onClick={handleCloseForm}>
                            <FormContainer>
                                <FormTitle>Nuevo Entrenador</FormTitle>
                                <FormField>
                                    <Label htmlFor="userName">Nombre de Usuario:</Label>
                                    <Input
                                        type="text"
                                        id="userName"
                                        name="userName"
                                        value={newCoach.userName}
                                        onChange={handleInputChange}
                                        placeholder="Nombre de usuario"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Nombre:</Label>
                                    <Input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={newCoach.name}
                                        onChange={handleInputChange}
                                        placeholder="Nombre"
                                    />
                                </FormField>
                                <FormField>
                                    <Label htmlFor="lastName">Apellido:</Label>
                                    <Input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={newCoach.lastName}
                                        onChange={handleInputChange}
                                        placeholder="Apellido"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="mail">Correo Electrónico:</Label>
                                    <Input
                                        type="email"
                                        id="mail"
                                        name="mail"
                                        value={newCoach.mail}
                                        onChange={handleInputChange}
                                        placeholder="Correo electrónico"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="phone">Teléfono:</Label>
                                    <Input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={newCoach.phone}
                                        onChange={handleInputChange}
                                        placeholder="Teléfono"
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="categories">Categorías:</Label>
                                    <Select
                                        id="categorySelect"
                                        multiple
                                        value={newCoach.categories.map(cat => cat.id)}
                                        onChange={handleCategoryChangeForm}
                                    >
                                        {categoriesLoading ? (
                                            <option value="">Cargando categorías...</option>
                                        ) : (
                                            categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))
                                        )}
                                    </Select>
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleUpdateCoach}>Modificar Jugador</Button>
                                    <CancelButton onClick={() => setShowEditForm(false)}>Cancelar</CancelButton>
                                </FormButtons>
                                {formMessage && <FormMessage>{formMessage}</FormMessage>}

                            </FormContainer>
                        </FormOverlay>
                    )}
                </ContainerFilter>
            </CustomThemeProvider>
        </>


    );
};
export default Coachs;
