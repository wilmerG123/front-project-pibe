import React, { useState, useEffect, useRef } from 'react';
import ObligationsTable from './tables/ObligationsTable'
import CustomThemeProvider from '../styles/CustomThemeProvider';
import { FormOverlay, FormContainer, FormTitle, FormField, Label, Input, Select, Button, CancelButton, FormButtons, FormMessage } from '../styles/formularios';
import { SearchContainer, ContainerFilter, Title, SearchBar, FilterContainer, FilterOption, FilterOptionNoSelect, MenuMiddle, MenuButton, NoResultsMessage, LoadingMessage } from './../styles/filters';


const Obligations = () => {

    const [obligations, setObligations] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [noResults, setNoResults] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [players, setPlayers] = useState([]);
    const [selectedObligation, setSelectedObligation] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showModifyForm, setShowModifyForm] = useState(false);
    const [formMessage, setFormMessage] = useState('');
    const [categoriesForm, setCategoriesForm] = useState([]);
    const [newObligation, setNewObligation] = useState({
        name: '',
        description: '',
        value: '',
        categories: [],
        players: [],
    });


    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setObligations([]);
        setNoResults(false);
        setSearchQuery('');
        setFilterCategory('');
    };

    const handleSearch = () => {
        setNoResults(false)
        setIsLoading(true);
        setObligations([])
        let url = '';

        if (filterType === 'categoria' && filterCategory) {
            const selectedCategory = categories.find(cat => cat.name === filterCategory);
            if (selectedCategory) {
                url = `http://localhost:8082/obligations/get-by-category/${selectedCategory.id}`;
            }

        } else if (filterType === 'nombre' && searchQuery) {
            url = `http://localhost:8082/obligations/get-by-player-name/${searchQuery}`;
        } 
        
        else if (filterType === 'todos') {
            url = 'http://localhost:8082/obligations/get-all-obligations';
        }

        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setObligations(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar obligacions:', error);
                    setIsLoading(false);
                });
        }
    };

    const handleCategoryChange = (e) => {
        setFilterCategory(e.target.value);
        setObligations([]);
        setNoResults(false);
        setSearchQuery('');
    };

    const handleCreateObligation = () => {
        setNewObligation({
            name: '',
            description: '',
            value: '',
            categories: [],
            players: [],
        })
        setShowCreateForm(true)
    };

    const handleCreateObligationForm = (e) => {
        e.preventDefault();
        const url = 'http://localhost:8082/obligations/create-obligation';
        const payload = {
            ...newObligation,
        };
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    alert('Obligacion creado satisfactoriamente.');
                    setNewObligation({
                        name: '',
                        description: '',
                        value: '',
                        categories: [],
                    });
                    setShowCreateForm(false)
                } else {
                    alert('Obligacion no pudo ser creado satisfactoriamente.');
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al crear la obligacion.');
                    });
                }
            })
            .catch(error => {
                setFormMessage(`Error: ${error.message}`);
            });

    };

    const handleModifyObligation = () => {
        if (selectedObligation.length === 0) {
            alert('Debes seleccionar al menos una obligacion.');
        } else if (selectedObligation.length > 1) {
            alert('Solo puedes modificar una Obligacion a la vez.');
        } else {
            const obligationToModify = obligations.find(obligation => obligation.id === selectedObligation[0]);

            // Establecer el estado con los datos del obligacion en el formato adecuado
            setNewObligation({
                name: obligationToModify.name,
                description: obligationToModify.description,
                value: obligationToModify.value,  
                maxDate: obligationToModify.maxDate, 
                dateCreation:obligationToModify.dateCreation,
                player:obligationToModify.player,

            });

            setShowModifyForm(true); // Abrir el formulario de modificación
        }
    };

    const handleModifyObligationForm = (e) => {
        e.preventDefault();
        const ObligationId = selectedObligation[0];
        const url = `http://localhost:8082/obligations/edit-obligation/${ObligationId}`;
        const payload = {
            ...newObligation,
        };
        fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(response => {
                if (response.ok) {
                    alert('Obligacion Modificado satisfactoriamente.');
                    setNewObligation({
                        name: '',
                        description: '',
                        value: '',
                        maxDate : '',
                        dateCreation:'',
                        player: '',
                    });
                    setShowModifyForm(false)
                } else {
                    alert('Obligacion no pudo ser modificado satisfactoriamente.');
                    return response.json().then((data) => {
                        throw new Error(data.message || 'Error al modificar el obligacion.');
                    });
                }
            })
            .catch(error => {
                setFormMessage(`Error: ${error.message}`);
            });
    };

    const handleCancelledObligation = async (e) => {

        // Validar si no hay ninguna obligación seleccionada
        if (selectedObligation.length === 0) {
            alert("Por favor, selecciona al menos una obligación.");
            return;
        }
    
        // Validar si hay más de una obligación seleccionada
        if (selectedObligation.length > 1) {
            alert("Solo se puede pagar una obligación a la vez.");
            return;
        }
    
        // Obtener el id de la obligación seleccionada
        const obligationId = selectedObligation[0];
    
        try {
            // Consultar la obligación completa desde el backend
            const obligationResponse = await fetch(`http://localhost:8082/obligations/get-obligations/${obligationId}`);
    
            if (!obligationResponse.ok) {
                // Si la respuesta no es exitosa, mostrar un mensaje de error
                alert("Error al obtener la obligación. Por favor, intente nuevamente.");
                return;
            }
    
            // Obtener la obligación desde la respuesta
            const obligationData = await obligationResponse.json();
    
            // Validar si la obligación existe
            if (!obligationData || !obligationData.id) {
                alert("La obligación seleccionada no existe o no es válida.");
                return;
            }
        
            // Ahora que tenemos el objeto completo de la obligación, proceder con la solicitud de pago
            const paymentResponse = await fetch("http://localhost:8082/pago/create-pago", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obligationData)  // Enviar la obligación completa como JSON
            });
    
            // Validar la respuesta del servidor
            if (paymentResponse.ok) {
                // El servidor ha devuelto el documento PDF
                const blob = await paymentResponse.blob();  // Obtener el contenido como blob (PDF)
    
                // Crear un enlace para descargar el archivo
                const link = document.createElement("a");
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.download = "pago_cancelado.pdf";  // Puedes darle el nombre que desees
                link.click();  // Hacer clic en el enlace para iniciar la descarga
                alert('Pago hecho satisfactoriamente.');
                // Liberar el objeto URL creado
                window.URL.revokeObjectURL(url);
                setObligations(prevObligations => prevObligations.filter(obligation => obligation.id !== obligationId));
            } else {
                // Si la respuesta del pago no es exitosa, mostrar un mensaje de error
                alert("Error al procesar el pago. Por favor, intente de nuevo.");
            }
        } catch (error) {
            // Manejo de errores en caso de problemas con la solicitud
            console.error("Error de conexión:", error);
            alert("Hubo un error al procesar la solicitud. Por favor, intente más tarde.");
        }
    };
    

    const handleCategoryChangeForm = async (e) => {
        // Extraemos los IDs de las categorías seleccionadas
        const selectedCategoryIds = Array.from(e.target.selectedOptions, option => option.value);

        // Transformamos los IDs seleccionados en objetos con la forma {id: "1"}
        const selectedCategories = selectedCategoryIds.map(id => ({
            id: id
        }));

        // Actualizamos el estado con los objetos de categorías seleccionadas
        setNewObligation(prevState => ({
            ...prevState,
            categories: selectedCategories  // Guardamos los objetos {id: "1"}
        }));

        // Hacer la solicitud a la API para obtener los jugadores de las categorías seleccionadas
    try {
        const response = await fetch(`http://localhost:8081/player/get-player-from-categories/${selectedCategoryIds.join(',')}`);
        const data = await response.json();

        // Si la respuesta tiene jugadores, actualizamos el estado de filteredPlayers
        if (data) {
            setPlayers(data);  // Asumimos que la API devuelve un objeto {players: [...]}
        } else {
            setPlayers([]);  // Si no hay jugadores, vaciamos el estado
        }
    } catch (error) {
        console.error("Error al obtener los jugadores:", error);
        setPlayers([]);  // Manejo de errores
    }
    console.log(players)
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;

        if (name === "maxDate") {
            // Almacenar la fecha tal como se proporciona (en la zona horaria local del usuario)
            setNewObligation(prevState => ({
                ...prevState,
                [name]: value // value es el formato 'YYYY-MM-DDTHH:mm'
            }));
        }
        setNewObligation(prevState => ({
            ...prevState,
            [name]: value // Para los demás campos, actualizamos solo el valor
        }));
    };

    const handleFormPlayerObligations = (e) => {
        // Obtener los valores seleccionados (ID de los jugadores)
        const selectedPlayerIds = Array.from(e.target.selectedOptions, option => option.value);
    
        // Actualizar el estado de newObligation con los jugadores seleccionados
        setNewObligation(prevState => ({
            ...prevState,
            players: selectedPlayerIds.map(id => ({ id }))  // Solo almacenamos los IDs como objetos
        }));
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
    }, [filterType]);


    return (
        <>
            <CustomThemeProvider>
                <ContainerFilter>
                    <Title>Gestión de Obligaciones y Deudores</Title>
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
                                    <option value="nombre">Nombre Jugador</option>
                                    <option value="todos">Todas Obligaciones</option>
                                </Select>
                            </FilterOption>

                            {filterType === 'todos' && (
                                <FilterOptionNoSelect>
                                    <Button onClick={handleSearch}>Buscar</Button>
                                </FilterOptionNoSelect>

                            )}

                            {(filterType === 'categoria' || filterType === 'nombre') && (
                                <FilterOption>
                                    <Label htmlFor="searchQuery"> {filterType === 'nombre' ? 'Nombre' : 'Categoría'} :</Label>
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
                                                placeholder={`Buscar por ${filterType === 'categoria' ? 'categoria' : 'nombre'}`}
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
                        <MenuButton onClick={handleCreateObligation} buttonType="create">Crear Obligacion</MenuButton>
                        <MenuButton onClick={handleModifyObligation} buttonType="modify">Modificar Obligacion</MenuButton>
                        <MenuButton onClick={handleCancelledObligation} buttonType="delmodifyete">Pagar Obligacion</MenuButton>
                    </MenuMiddle>

                    {!isLoading && !noResults && obligations.length > 0 && (
                        <ObligationsTable obligations={obligations} selectedObligation={selectedObligation} setSelectedObligation={setSelectedObligation} />
                    )}


                    {isLoading && <LoadingMessage>Cargando Obligaciones...</LoadingMessage>}
                    {noResults && <NoResultsMessage>No se encontraron obligaciones</NoResultsMessage>}

                    {/* Formulario de Crear Obligation */}
                    {showCreateForm && (
                        <FormOverlay>
                            <FormContainer onClick={null}>
                                <FormTitle>Crear Nueva Obligacion</FormTitle>

                                <FormField>
                                    <Label htmlFor="name">Nombre Obligacion:</Label>
                                    <Input
                                        type="name"
                                        name="name"
                                        value={newObligation.name}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="description">Descripcion :</Label>
                                    <Input
                                        type="description"
                                        name="description"
                                        value={newObligation.description}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="value">Valor :</Label>
                                    <Input
                                        type="value"
                                        name="value"
                                        value={newObligation.value}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="maxDate">Fecha de Pago</Label>
                                    <Input
                                        type="date"
                                        name="maxDate"
                                        value={newObligation.maxDate || ""}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="categories">Categorías:</Label>
                                    <Select
                                        id="categorySelect"
                                        multiple
                                        value={newObligation.categories?.map(cat => cat.id)}
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

                                <FormField>
                                    <Label htmlFor="players">Jugadores:</Label>
                                    <Select
                                        id="playerSelect"
                                        multiple
                                        value={newObligation.players?.map(player => player.id)}  // Valor: IDs de jugadores seleccionados
                                        onChange={handleFormPlayerObligations}  // Manejador de cambio
                                    >
                                        {players.length === 0 ? (
                                            <option value="">No hay jugadores disponibles</option>
                                        ) : (
                                            players.map(player => (
                                                <option key={player.id} value={player.id}>
                                                    {player.name}  {/* Mostrar el nombre del jugador */}
                                                </option>
                                            ))
                                        )}
                                    </Select>
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleCreateObligationForm}>Crear Obligacion</Button>
                                    <CancelButton onClick={() => setShowCreateForm(false)}>Cancelar</CancelButton>
                                </FormButtons>

                            </FormContainer>
                        </FormOverlay>
                    )}

                     {/* Formulario de Editar Obligation */}
                     {showModifyForm && (
                        <FormOverlay>
                            <FormContainer onClick={null}>
                                <FormTitle>Editar Obligacion</FormTitle>

                                <FormField>
                                    <Label htmlFor="name">Nombre Obligacion:</Label>
                                    <Input
                                        type="name"
                                        name="name"
                                        value={newObligation.name}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="description">Descripcion :</Label>
                                    <Input
                                        type="description"
                                        name="description"
                                        value={newObligation.description}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="value">Valor :</Label>
                                    <Input
                                        type="value"
                                        name="value"
                                        value={newObligation.value}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormField>
                                    <Label htmlFor="maxDate">Fecha de Pago</Label>
                                    <Input
                                        type="date"
                                        name="maxDate"
                                        value={newObligation.maxDate || ""}
                                        onChange={handleFormChange}
                                    />
                                </FormField>

                                <FormButtons>
                                    <Button onClick={handleModifyObligationForm}>Editar Obligacion</Button>
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
export default Obligations;