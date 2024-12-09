import React, { useState, useEffect, useRef } from 'react';
import CustomThemeProvider from '../styles/CustomThemeProvider';
import PlayerTable from '../views/tables/PlayerTable';
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
    FormMessage
} from '../styles/formularios';

import { SearchContainer, ContainerFilter, Title, SearchBar, FilterContainer, FilterOption, FilterOptionNoSelect, MenuMiddle, MenuButton, NoResultsMessage, LoadingMessage } from './../styles/filters';


const Players = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [categories, setCategories] = useState([]);
    const [cities, setCities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [players, setPlayers] = useState([]);
    const [noResults, setNoResults] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [showForm, setShowForm] = useState(false); // Para msotrar el formulario de creacion
    const [showModifyForm, setShowModifyForm] = useState(false);  // Para mostrar el formulario de modificación
    const [newPlayer, setNewPlayer] = useState({
        userName: '',
        name: '',
        lastName: '',
        mail: '',
        phone: '',
        category: '',
        city: '',
        age: ''
    });
    const [selectedPlayer, setSelectedPlayer] = useState([]);
    const [formMessage, setFormMessage] = useState('');


    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setPlayers([]);
        setNoResults(false);
        setSearchQuery('');
        setFilterCategory('');
    };

    // Handle form close
    const handleCloseForm = (e) => {
        if (e.target === e.currentTarget) {
            setShowForm(false);
            setShowModifyForm(false);
            setFormMessage('');
        }
    };

    const handleCategoryChange = (e) => {
        setFilterCategory(e.target.value);
        setPlayers([]);
        setNoResults(false);
        setSearchQuery('');
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        if (name === "category" || name === "city") {
            // Buscamos el objeto completo en las listas de categorías o ciudades
            const selectedItem = (name === "category" ? categories : cities).find(item => item.id.toString() === value);

            setNewPlayer(prevState => ({
                ...prevState,
                [name]: selectedItem // Almacenamos el objeto completo, no solo el id
            }));
        } else {
            setNewPlayer(prevState => ({
                ...prevState,
                [name]: value // Para los demás campos, actualizamos solo el valor
            }));
        }
    };


    const handleSearch = () => {
        setNoResults(false)
        setIsLoading(true);
        setPlayers([])
        let url = '';

        if (filterType === 'nombre' && searchQuery) {
            url = `http://localhost:8081/player/get-players-name/${searchQuery}`;
        } else if (filterType === 'categoria' && filterCategory) {
            const selectedCategory = categories.find(cat => cat.name === filterCategory);
            if (selectedCategory) {
                url = `http://localhost:8081/player/get-players-category/${selectedCategory.id}`;
            }
        } else if (filterType === 'todos') {
            url = 'http://localhost:8081/player/get-all-player';
        }

        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setPlayers(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar jugadores:', error);
                    setIsLoading(false);
                });

        }
    };

    useEffect(() => {
        setCategoriesLoading(true);
        fetch('http://localhost:8081/utils/get-all-categories')
            .then(response => response.json())
            .then(data => {
                setCategories(data);
                setCategoriesLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar categorías:', error);
                setCategoriesLoading(false);
            });
        setCitiesLoading(true);
        fetch('http://localhost:8081/utils/get-all-cities')
            .then(response => response.json())
            .then(data => {
                setCities(data);
                setCitiesLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar ciudades:', error);
                setCitiesLoading(false);
            });
    }, [filterType]);


    const handleCreatePlayerClick = () => {
        // Limpiar los estados antes de abrir el formulario de creación
        setNewPlayer({
            userName: '',
            name: '',
            lastName: '',
            mail: '',
            phone: '',
            category: '',
            city: '',
            age: ''
        });

        setShowForm(true); // Abrir el formulario de creación
    };

    // Función para manejar el clic en "Modificar Jugador"
    const handleModifyPlayerClick = () => {
        if (selectedPlayer.length === 0) {
            alert('Debes seleccionar al menos un jugador.');
        } else if (selectedPlayer.length > 1) {
            alert('Solo puedes modificar un jugador a la vez.');
        } else {
            const playerToModify = players.find(player => player.id === selectedPlayer[0]);
            setNewPlayer({
                userName: playerToModify.userName,
                name: playerToModify.name,
                lastName: playerToModify.lastName,
                mail: playerToModify.mail,
                phone: playerToModify.phone,
                category: playerToModify.category || [],
                city: playerToModify.city || [],
                age: playerToModify.age
            });
            setShowModifyForm(true); // Abrir el formulario de modificación
        }
    };

    const handleDeletePlayerClick = () => {
        // Validar si se ha seleccionado un solo jugador
        if (selectedPlayer.length === 0) {
            alert('Debes seleccionar al menos un jugador.');
        } else if (selectedPlayer.length > 1) {
            alert('Solo puedes eliminar un jugador a la vez.');
        } else {
            // Mostrar una alerta de confirmación antes de eliminar
            const playerId = selectedPlayer[0];
            const playerName = players.find(player => player.id === playerId)?.name || 'Jugador';

            const confirmDelete = window.confirm(`¿Estás seguro de que quieres eliminar al jugador ${playerName}?`);

            if (confirmDelete) {
                // Hacer la solicitud DELETE al servidor si el usuario confirma
                fetch(`http://localhost:8081/player/delete-player/${playerId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Jugador eliminado satisfactoriamente.');
                            // Actualizar la lista de jugadores después de eliminar
                            setPlayers(prevPlayers => prevPlayers.filter(player => player.id !== playerId));
                            setSelectedPlayer([]); // Limpiar la selección
                        } else {
                            alert('Algo ha pasado, intenta más tarde.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al eliminar el jugador:', error);
                        alert('Algo ha pasado, intenta más tarde.');
                    });
            } else {
                // Si el usuario cancela, simplemente no hacemos nada
                console.log('Eliminación cancelada');
            }
        }
    };

    const handleCreatePlayer = (e) => {
        e.preventDefault();
        const url = 'http://localhost:8081/player/create-player';
        const payload = {
            ...newPlayer,
            category: newPlayer.category ? { id: newPlayer.category.id } : null,
            city: newPlayer.city ? { id: newPlayer.city.id } : null
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    alert('Jugador creado satisfactoriamente.');
                    setNewPlayer({
                        userName: '',
                        name: '',
                        lastName: '',
                        mail: '',
                        phone: '',
                        category: '',
                        city: '',
                        age: ''
                    });
                    setShowForm(false)
                } else {
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al guardar el jugador.');
                    });
                }
            })
            .catch(error => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    // Función para manejar la actualización del jugador seleccionado
    const handleModifyPlayer = (e) => {
        const playerId = selectedPlayer[0];
        const url = `http://localhost:8081/player/edit-player/${playerId}`;
        const payload = { ...newPlayer };

        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(response => {
                if (response.ok) {

                    alert('Jugador modificado correctamente');
                    setShowModifyForm(false);
                    setSelectedPlayer([]);
                    setNewPlayer({
                        userName: '',
                        name: '',
                        lastName: '',
                        mail: '',
                        phone: '',
                        category: '',
                        city: '',
                        age: ''
                    });
                } else {
                    throw new Error('No se pudo modificar el Jugador');
                }
            })
            .catch(error => {
                alert(`Error: ${error.message}`);
            });
    };

    return (
        <>
            <CustomThemeProvider>
                <ContainerFilter>
                    <Title>Gestión de Jugadores</Title>
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
                                    <option value="todos">Todos los Jugadores</option>
                                </Select>
                            </FilterOption  >

                            {filterType === 'todos' && (
                                <FilterOptionNoSelect>
                                    <Button onClick={handleSearch}>Buscar</Button>
                                </FilterOptionNoSelect>

                            )}

                            {(filterType === 'nombre' || filterType === 'categoria') && (
                                <FilterOption>
                                    <Label htmlFor="searchQuery">{filterType === 'nombre' ? 'Nombre' : 'Categoría'}:</Label>
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
                        </FilterContainer>
                    </SearchBar>

                    <MenuMiddle>
                        <MenuButton onClick={handleCreatePlayerClick} buttonType="create">Crear Jugador</MenuButton>
                        <MenuButton onClick={handleModifyPlayerClick} buttonType="modify">Modificar Jugador</MenuButton>
                        <MenuButton onClick={handleDeletePlayerClick}buttonType="delete">Eliminar Jugador</MenuButton>
                    </MenuMiddle>

                    {!isLoading && !noResults && players.length > 0 && (
                        <PlayerTable players={players} selectedPlayer={selectedPlayer} setSelectedPlayer={setSelectedPlayer} />
                    )}
                    {isLoading && <LoadingMessage>Cargando jugadores...</LoadingMessage>}
                    {noResults && <NoResultsMessage>No se encontraron jugadores</NoResultsMessage>}

                    {/* Formulario de Crear Jugador */}
                    {showForm && (
                        <FormOverlay>
                            <FormContainer onClick={handleCloseForm}>
                                <FormTitle>Crear Nuevo Jugador</FormTitle>
                        
                                <FormField>
                                    <Label htmlFor="userName">Usuario:</Label>
                                    <Input
                                        type="text"
                                        name="userName"
                                        value={newPlayer.userName}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Nombre:</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={newPlayer.name}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="lastName">Apellido:</Label>
                                    <Input
                                        type="text"
                                        name="lastName"
                                        value={newPlayer.lastName}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="mail">Email:</Label>
                                    <Input
                                        type="email"
                                        name="mail"
                                        value={newPlayer.mail}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="phone">Teléfono:</Label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={newPlayer.phone}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="category">Categoría:</Label>
                                    <Select
                                        name="category"
                                        value={newPlayer.category ? newPlayer.category.id : ''}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Seleccionar Categoría</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="city">Ciudad:</Label>
                                    <Select
                                        name="city"
                                        value={newPlayer.city ? newPlayer.city.id : ''}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Seleccionar Ciudad</option>
                                        {cities.map(city => (
                                            <option key={city.id} value={city.id}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="age">Edad:</Label>
                                    <Input
                                        type="number"
                                        name="age"
                                        value={newPlayer.age}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleCreatePlayer}>Guardar Jugador</Button>
                                    <CancelButton onClick={() => setShowForm(false)}>Cancelar</CancelButton>
                                </FormButtons>

                            </FormContainer>
                        </FormOverlay>
                    )}

                    {/* Formulario de Modificar Jugador */}
                    {showModifyForm && (
                        <FormOverlay>
                            <FormContainer onClick={handleCloseForm}>
                                <FormTitle>Modificar Jugador</FormTitle>
                                <FormField>
                                    <Label htmlFor="userName">Usuario:</Label>
                                    <Input
                                        type="text"
                                        name="userName"
                                        value={newPlayer.userName}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="name">Nombre:</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={newPlayer.name}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="lastName">Apellido:</Label>
                                    <Input
                                        type="text"
                                        name="lastName"
                                        value={newPlayer.lastName}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="mail">Email:</Label>
                                    <Input
                                        type="email"
                                        name="mail"
                                        value={newPlayer.mail}
                                        onChange={handleFormChange}
                                    />
                                </FormField>
                                <FormField>
                                    <Label htmlFor="phone">Teléfono:</Label>
                                    <Input
                                        type="tel"
                                        name="phone"
                                        value={newPlayer.phone}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="category">Categoría:</Label>
                                    <Select
                                        name="category"
                                        value={newPlayer.category}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Seleccionar Categoría</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="city">Ciudad:</Label>
                                    <Select
                                        name="city"
                                        value={newPlayer.city}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Seleccionar Ciudad</option>
                                        {cities.map(city => (
                                            <option key={city.id} value={city.name}>
                                                {city.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="age">Edad:</Label>
                                    <Input
                                        type="number"
                                        name="age"
                                        value={newPlayer.age}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Button onClick={handleModifyPlayer}>Modificar Jugador</Button>
                                    <CancelButton type="button" onClick={() => setShowModifyForm(false)}>Cancelar</CancelButton>
                                </FormField>

                            </FormContainer>
                        </FormOverlay>
                    )}
                </ContainerFilter>
            </CustomThemeProvider>
        </>
    );
};

export default Players;
