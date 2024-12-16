import React, { useState, useEffect, useRef } from 'react';
import PagosTable from './tables/PagosTable'
import CustomThemeProvider from '../styles/CustomThemeProvider';
import { FormOverlay, FormContainer, FormTitle, FormField, Label, Input, Select, Button, CancelButton, FormButtons, FormMessage } from '../styles/formularios';
import { SearchContainer, ContainerFilter, Title, SearchBar, FilterContainer, FilterOption, FilterOptionNoSelect, MenuMiddle, MenuButton, NoResultsMessage, LoadingMessage } from './../styles/filters';


const Pagos = () => {

    const [pagos, setPagos] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('');
    const [noResults, setNoResults] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedPago, setSelectedPago] = useState([]);
    const [formMessage, setFormMessage] = useState('');


    const handleSearchChange = (e) => setSearchQuery(e.target.value);

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
        setPagos([]);
        setNoResults(false);
        setSearchQuery('');
        setFilterCategory('');
    };

    const handleSearch = () => {
        setNoResults(false)
        setIsLoading(true);
        setPagos([])
        let url = '';
        if (filterType === 'nombre' && searchQuery) {
            url = `http://localhost:8082/pago/get-pagos-by-player-name/${searchQuery}`;
        }
        if (url) {
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    if (data.length === 0) setNoResults(true);
                    setPagos(data);
                    setIsLoading(false);
                })
                .catch(error => {
                    console.error('Error al cargar pagos:', error);
                    setIsLoading(false);
                });
        }
    };

    const handlerCreateDocumentPDF = async (e) => {

        // Validar si no hay ninguna obligación seleccionada
        if (selectedPago.length === 0) {
            alert("Por favor, selecciona al menos un pago.");
            return;
        }

        // Validar si hay más de una obligación seleccionada
        if (selectedPago.length > 1) {
            alert("Solo se puede crear un recibo a la vez.");
            return;
        }

        // Obtener el id de la obligación seleccionada
        const pagoId = selectedPago[0];

        try {

            // Ahora que tenemos el objeto completo de la obligación, proceder con la solicitud de pago
            const reciboResponse = await fetch(`http://localhost:8082/pago/get-recibo-pago/${pagoId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });

            // Validar la respuesta del servidor
            if (reciboResponse.ok) {
                // El servidor ha devuelto el documento PDF
                const blob = await reciboResponse.blob();  // Obtener el contenido como blob (PDF)

                // Crear un enlace para descargar el archivo
                const link = document.createElement("a");
                const url = window.URL.createObjectURL(blob);
                link.href = url;
                link.download = "pago_cancelado.pdf";  // Puedes darle el nombre que desees
                link.click();  // Hacer clic en el enlace para iniciar la descarga
                alert('Documento Descargado exitosamente.');
                // Liberar el objeto URL creado
                window.URL.revokeObjectURL(url);
            } else {
                // Si la respuesta del pago no es exitosa, mostrar un mensaje de error
                alert("Error al procesar el descargue del documento. Por favor, intente de nuevo.");
            }
        } catch (error) {
            // Manejo de errores en caso de problemas con la solicitud
            console.error("Error de conexión:", error);
            alert("Hubo un error al procesar la solicitud. Por favor, intente más tarde.");
        }
    };


    return (
        <>
            <CustomThemeProvider>
                <ContainerFilter>
                    <Title>Historico de Pagos</Title>
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
                                    <option value="nombre">Nombre Jugador</option>
                                </Select>
                            </FilterOption>

                            {filterType === 'nombre' && (
                                <FilterOption>
                                    <Label htmlFor="searchQuery">Nombre Jugador :</Label>
                                    <SearchContainer>
                                        <Input
                                            type="text"
                                            id="searchQuery"
                                            placeholder={`Buscar por ${filterType === 'categoria' ? 'categoria' : 'nombre'}`}
                                            value={searchQuery}
                                            onChange={handleSearchChange}
                                        />

                                        <Button onClick={handleSearch}>Buscar</Button>

                                    </SearchContainer>
                                </FilterOption>
                            )}

                        </FilterContainer>
                    </SearchBar>

                    <MenuMiddle>
                        <MenuButton onClick={handlerCreateDocumentPDF} buttonType="create">Descargar Recibo</MenuButton>
                    </MenuMiddle>

                    {!isLoading && !noResults && pagos.length > 0 && (
                        <PagosTable pagos={pagos} selectedPago={selectedPago} setSelectedPago={setSelectedPago} />
                    )}


                    {isLoading && <LoadingMessage>Cargando Pagos...</LoadingMessage>}
                    {noResults && <NoResultsMessage>No se encontraron Pagos</NoResultsMessage>}


                </ContainerFilter>
            </CustomThemeProvider>
        </>
    );
}
export default Pagos;