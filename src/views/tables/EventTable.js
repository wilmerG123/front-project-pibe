import React, { useState, useEffect } from 'react';
import { ResultList, ResultTable, SelectAllCheckbox, ModalOverlay, ModalContent, fadeIn, slideIn } from '../../styles/tablas';
import CustomThemeProvider from '../../styles/CustomThemeProvider';

const EventTable = ({ events, selectedEvent, setSelectedEvent }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventDetails, setSelectedEventDetails] = useState(null);
  const [players, setPlayers] = useState([]); // Estado para los jugadores
  const [loadingPlayers, setLoadingPlayers] = useState(false); // Estado de carga de jugadores

  // Función para abrir el modal
  const openModal = (event, e) => {
    if (e.target.type === 'checkbox') return; // Evitar que se abra el modal al hacer clic en el checkbox

    setSelectedEventDetails(event); // Establecer detalles del evento
    fetchPlayers(event.players); // Obtener los jugadores
    setIsModalOpen(true); // Abrir el modal
  };

  // Obtener los jugadores a partir de los IDs
  const fetchPlayers = (playerIds) => {
    console.log(playerIds); // Verifica si los playerIds son correctos
    // Verificar si 'playerIds' es un array y tiene elementos
    if (Array.isArray(playerIds) && playerIds.length > 0) {
      // Unir los IDs con una coma
      const playerIdsString = playerIds.join(',');

      console.log('Player IDs:', playerIdsString); // Verifica los IDs que se están pasando

      // Realizar la solicitud al endpoint con los IDs
      setLoadingPlayers(true); // Iniciar el estado de carga
      fetch(`http://localhost:8081/player/get-players-events-by-id/${playerIdsString}`)
        .then(response => response.json())
        .then(data => {
          setPlayers(data); // Establecer la lista de jugadores
          setLoadingPlayers(false); // Finalizar carga
        })
        .catch(error => {
          console.error('Error fetching players:', error);
          setLoadingPlayers(false); // Finalizar carga en caso de error
        });
    } else {
      console.error('No valid player IDs found');
      setLoadingPlayers(false);
    }
  };

  // Maneja la selección de un evento
  const handleSelectEvent = (eventId, e) => {
    e.stopPropagation(); // Evitar que se abra el modal al hacer clic en el checkbox
    setSelectedEvent((prevSelected) => {
      if (prevSelected.includes(eventId)) {
        return prevSelected.filter((id) => id !== eventId);
      } else {
        return [...prevSelected, eventId];
      }
    });
  };

  // Maneja la selección de todos los eventos
  const handleSelectAll = () => {
    if (selectedEvent.length === events.length) {
      setSelectedEvent([]);
    } else {
      const allEventsIds = events.map(event => event.id);
      setSelectedEvent(allEventsIds);
    }
  };

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Función para formatear la hora
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEventDetails(null);
    setPlayers([]); // Limpiar los jugadores cuando se cierra el modal
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
                  checked={selectedEvent.length === events.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Cancha</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id} onClick={(e) => openModal(event, e)}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEvent.includes(event.id)}
                    onChange={(e) => handleSelectEvent(event.id, e)}
                  />
                </td>
                <td>{event.type}</td>
                <td>{formatDate(event.date)}</td>
                <td>{formatTime(event.date)}</td>
                <td>{event.cancha?.name}</td>
              </tr>
            ))}
          </tbody>
        </ResultTable>
      </ResultList>

      {/* Modal con detalles del evento y la lista de jugadores */}
      {isModalOpen && (
        <ModalOverlay style={{ animation: fadeIn }}>
          <ModalContent style={{ animation: slideIn }}>
            <h2>Detalles del Evento</h2>
            {selectedEventDetails ? (
              <>
                <p><strong>Tipo:</strong> {selectedEventDetails.type}</p>
                <p><strong>Fecha:</strong> {formatDate(selectedEventDetails.date)}</p>
                <p><strong>Hora:</strong> {formatTime(selectedEventDetails.date)}</p>

                {/* Tabla de jugadores */}
                <h3>Participantes</h3>
                {loadingPlayers ? (
                  <p>Cargando participantes...</p>
                ) : (
                  <ResultTable>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {players.length > 0 ? (
                        players.map(player => (
                          <tr key={player.id}>
                            <td>{player.name}</td>
                           
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2">No se encontraron jugadores para este evento.</td>
                        </tr>
                      )}
                    </tbody>
                  </ResultTable>
                )}
              </>
            ) : (
              <p>Cargando detalles...</p>
            )}

            <button onClick={closeModal}>Cerrar</button>
          </ModalContent>
        </ModalOverlay>
      )}
    </CustomThemeProvider>
  );
};

export default EventTable;
