import React, { useState, useEffect } from 'react';
import EventTable from './tables/EventTable'
import CustomThemeProvider from '../styles/CustomThemeProvider';
import { FormOverlay, FormContainer, FormTitle, FormField, Label, Input, Select, Button, CancelButton, FormButtons, FormMessage } from '../styles/formularios';
import { SearchContainer, ContainerFilter, Title, SearchBar, FilterContainer, FilterOption, FilterOptionNoSelect, MenuMiddle, MenuButton, NoResultsMessage, LoadingMessage } from './../styles/filters';


const Events = () => {

    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [categories, setCategories] = useState([]);
    const [canchas, setCanchas] = useState([]);
    const [canchasLoading, setCanchasLoading] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [showCreateForm, setShowFormCreate] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const [newEvent, setNewEvent] = useState({
        type: '',
        date: '',
        cancha: '',
        categories: [],
    });

    const apiUrlMain = process.env.REACT_APP_API_MAIN;


    const handleCategoryChangeForm = (e) => {
        // Extraemos los IDs de las categorías seleccionadas
        const selectedCategoryIds = Array.from(e.target.selectedOptions, option => option.value);

        // Transformamos los IDs seleccionados en objetos con la forma {id: "1"}
        const selectedCategories = selectedCategoryIds.map(id => ({
            id: id
        }));

        // Actualizamos el estado con los objetos de categorías seleccionadas
        setNewEvent(prevState => ({
            ...prevState,
            categories: selectedCategories  // Guardamos los objetos {id: "1"}
        }));
    };

    const handleCreateEventForm = (e) => {
        e.preventDefault();
        const url = `${apiUrlMain}/events/create-event`;
        const payload = {
            ...newEvent,
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    alert('Evento creado satisfactoriamente.');
                    setNewEvent({
                        type: '',
                        date: '',
                    });
                    setShowFormCreate(false)
                } else {
                    alert('Evento no pudo ser creado satisfactoriamente.');
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al crear el evento.');
                    });
                }
            })
            .catch(error => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleModifyEventForm = (e) => {
        e.preventDefault();
        const eventId = selectedEvent[0];
        const url = `${apiUrlMain}/events/edit-event/${eventId}`;
        const payload = {
            ...newEvent,
        };
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    alert('Evento Modificado satisfactoriamente.');
                    setNewEvent({
                        type: '',
                        date: '',
                        cancha: '',
                        categories: [],
                    });
                    setShowModifyForm(false)
                } else {
                    alert('Evento no pudo ser modificado satisfactoriamente.');
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al modificar el evento.');
                    });
                }
            })
            .catch(error => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setEvents([]);
        setNoResults(false);
        setSearchQuery('');
        setFilterCategory('');
    };

    const handleCategoryChange = (e) => {
        setFilterCategory(e.target.value);
        setEvents([]);
        setNoResults(false);
        setSearchQuery('');
    };

    const handleCreateEvent = () => {
        setNewEvent({
            type: '',
            date: '',
            cancha: '',
            categories: []
        })
        setShowFormCreate(true)
    };

    const handleModifyEvent = () => {
        if (selectedEvent.length === 0) {
            alert('Debes seleccionar al menos un evento.');
        } else if (selectedEvent.length > 1) {
            alert('Solo puedes modificar un evento a la vez.');
        } else {
            const eventToModify = events.find(event => event.id === selectedEvent[0]);

            // Asegurarse de que 'cancha' esté en el formato correcto (si es null, lo dejamos como null)
            const cancha = eventToModify.cancha ? { id: eventToModify.cancha.id } : null;

            // Transformar las categorías para que estén en el formato [{ id: 1 }, { id: 2 }]
            const categoriesWithIds = eventToModify.categories.map(cat => ({ id: cat }));

            // Establecer el estado con los datos del evento en el formato adecuado
            setNewEvent({
                type: eventToModify.type,
                date: eventToModify.date,
                cancha: cancha,   // Si 'cancha' es null, lo dejamos como null
                categories: categoriesWithIds  // Formato [{ id: 17 }]
            });

            setShowModifyForm(true); // Abrir el formulario de modificación
        }
    };

    const handleSearch = () => {
        setNoResults(false)
        setIsLoading(true);
        setEvents([])
        let url = '';

        if (filterType === 'categoria' && filterCategory) {
            const selectedCategory = categories.find(cat => cat.name === filterCategory);
            if (selectedCategory) {
                url = `${apiUrlMain}/events/get-events-by-category/${selectedCategory.id}`;
            }
        } else if (filterType === 'todos') {
            url = `${apiUrlMain}/events/get-all-event`;
        }

        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setEvents(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar jugadores:', error);
                    setIsLoading(false);
                });
        }
    };

    const handleClosedEvent = () => {
        // Validar si se ha seleccionado un solo jugador
        if (selectedEvent.length === 0) {
            alert('Debes seleccionar al menos un evento a Cerrar.');
        } else if (selectedEvent.length > 1) {
            alert('Solo puedes cerrar un evento a la vez.');
        } else {
            // Mostrar una alerta de confirmación antes de eliminar
            const eventId = selectedEvent[0];

            const confirmDelete = window.confirm(`¿Estás seguro de que quieres cerrar el evento ?`);

            if (confirmDelete) {
                // Hacer la solicitud DELETE al servidor si el usuario confirma
                fetch(`${apiUrlMain}/events/closed-event/${eventId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            alert('Evento cerrado satisfactoriamente.');
                            // Actualizar la lista de jugadores después de eliminar
                            setEvents(prevPlayers => prevPlayers.filter(event => event.id !== eventId));
                            setSelectedEvent([]); // Limpiar la selección
                        } else {
                            alert('Algo ha pasado, intenta más tarde.');
                        }
                    })
                    .catch(error => {
                        console.error('Error al cerrar el evento:', error);
                        alert('Algo ha pasado, intenta más tarde.');
                    });
            } else {
                // Si el usuario cancela, simplemente no hacemos nada
                console.log('Cerrado cancelado');
            }
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        if (name === "date") {
            // Almacenar la fecha tal como se proporciona (en la zona horaria local del usuario)
            setNewEvent(prevState => ({
                ...prevState,
                [name]: value // value es el formato 'YYYY-MM-DDTHH:mm'
            }));
        } else if (name === "cancha") {
            // Si el nombre es "cancha", crear un objeto con el ID de la cancha
            setNewEvent(prevState => ({
                ...prevState,
                cancha: { id: value } // Generar un objeto con el ID de la cancha
            }));
        } else {
            setNewEvent(prevState => ({
                ...prevState,
                [name]: value
            }));
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
        setCanchasLoading(true);
        fetch(`${apiUrlMain}/utils/get-all-canchas`)
            .then(response => response.json())
            .then(data => {
                setCanchas(data);
                setCanchasLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar canchas:', error);
                setCanchasLoading(false);
            });
    }, [apiUrlMain]);


    return (
        <>
            <CustomThemeProvider>
                <ContainerFilter>
                    <Title>Gestión de Eventos</Title>
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
                                    <option value="categoria">Categoría</option>
                                    <option value="todos">Todos los eventos</option>
                                </Select>
                            </FilterOption>

                            {filterType === 'todos' && (
                                <FilterOptionNoSelect>
                                    <Button onClick={handleSearch}>Buscar</Button>
                                </FilterOptionNoSelect>

                            )}

                            {(filterType === 'categoria') && (
                                <FilterOption>
                                    <Label htmlFor="searchQuery"> Categoría :</Label>
                                    <SearchContainer>

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
                                        <Button onClick={handleSearch}>Buscar</Button>

                                    </SearchContainer>
                                </FilterOption>
                            )}

                        </FilterContainer>
                    </SearchBar>

                    <MenuMiddle>
                        <MenuButton onClick={handleCreateEvent} buttonType="create">Crear Evento</MenuButton>
                        <MenuButton onClick={handleModifyEvent} buttonType="modify">Modificar Evento</MenuButton>
                        <MenuButton onClick={handleClosedEvent} buttonType="delete">Cerrar Evento</MenuButton>
                    </MenuMiddle>

                    {!isLoading && !noResults && events.length > 0 && (
                        <EventTable events={events} selectedEvent={selectedEvent} setSelectedEvent={setSelectedEvent} />
                    )}

                    {isLoading && <LoadingMessage>Cargando eventos...</LoadingMessage>}
                    {noResults && <NoResultsMessage>No se encontraron eventos</NoResultsMessage>}

                    {/* Formulario de Crear Evento */}
                    {showCreateForm && (
                        <FormOverlay>
                            <FormContainer onClick={null}>
                                <FormTitle>Crear Nuevo Evento</FormTitle>

                                <FormField>
                                    <Label htmlFor="type">Tipo de Evento:</Label>
                                    <Select
                                        name="type"
                                        value={newEvent.type}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Selecciona tipo de evento</option>
                                        <option value="Entrenamiento">Entrenamiento</option>
                                        <option value="Partido">Partido</option>
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="date">Fecha y hora:</Label>
                                    <Input
                                        type="datetime-local"
                                        name="date"
                                        value={newEvent.date || ""}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="cancha">Cancha:</Label>
                                    <Select
                                        name="cancha"
                                        value={newEvent.cancha ? newEvent.cancha.id : ''}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Seleccionar Cancha</option>
                                        {canchas.map(cancha => (
                                            <option key={cancha.id} value={cancha.id}>
                                                {cancha.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="categories">Categorías:</Label>
                                    <Select
                                        id="categorySelect"
                                        multiple
                                        value={newEvent.categories?.map(cat => cat.id)}
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
                                    <Button onClick={handleCreateEventForm}>Crear Evento</Button>
                                    <CancelButton onClick={() => setShowFormCreate(false)}>Cancelar</CancelButton>
                                </FormButtons>

                            </FormContainer>
                        </FormOverlay>
                    )}

                    {/* Formulario de modificar Evento */}
                    {showModifyForm && (
                        <FormOverlay>
                            <FormContainer onClick={null}>
                                <FormTitle>Modificar Evento</FormTitle>

                                <FormField>
                                    <Label htmlFor="type">Tipo de Evento:</Label>
                                    <Select
                                        name="type"
                                        value={newEvent.type || ''}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Selecciona tipo de evento</option>
                                        <option value="Entrenamiento">Entrenamiento</option>
                                        <option value="Partido">Partido</option>
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="date">Fecha y hora:</Label>
                                    <Input
                                        type="datetime-local"
                                        name="date"
                                        value={newEvent.date || ""}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="cancha">Cancha:</Label>
                                    <Select
                                        name="cancha"
                                        value={newEvent.cancha ? newEvent.cancha.id : ''}
                                        onChange={handleFormChange}
                                    >
                                        <option value="">Seleccionar Cancha</option>
                                        {canchas.map(cancha => (
                                            <option key={cancha.id} value={cancha.id}>
                                                {cancha.name}
                                            </option>
                                        ))}
                                    </Select>
                                </FormField>

                                <FormField>
                                    <Label htmlFor="categories">Categorías:</Label>
                                    <Select
                                        id="categorySelect"
                                        multiple
                                        value={newEvent.categories?.map(cat => cat.id) || []}
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
                                    <Button onClick={handleModifyEventForm}>Modificar Evento</Button>
                                    <CancelButton onClick={() => setShowModifyForm(false)}>Cancelar</CancelButton>
                                </FormButtons>

                            </FormContainer>
                        </FormOverlay>
                    )}



                </ContainerFilter>
            </CustomThemeProvider>
        </>
    );

}

export default Events