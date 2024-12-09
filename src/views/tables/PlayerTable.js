import React from 'react';
import {
    ResultList,
    ResultTable,
    SelectAllCheckbox,
} from '../../styles/tablas';
import CustomThemeProvider from '../../styles/CustomThemeProvider';

// Componente para mostrar la tabla de jugadores
const PlayerTable = ({ players, selectedPlayer, setSelectedPlayer }) => {

    // Maneja la selección de un jugador individual
    const handleSelectPlayer = (playerId) => {
        setSelectedPlayer((prevSelected) => {
            if (prevSelected.includes(playerId)) {
                // Si ya está seleccionado, lo deseleccionamos
                return prevSelected.filter((id) => id !== playerId);
            } else {
                // Si no está seleccionado, lo agregamos
                return [...prevSelected, playerId];
            }
        });
    };

    // Maneja la selección de todos los jugadores
    const handleSelectAll = () => {
        if (selectedPlayer.length === players.length) {
            // Si ya están seleccionados todos, desmarcamos
            setSelectedPlayer([]);
        } else {
            // Seleccionamos todos los jugadores
            const allPlayerIds = players.map(player => player.id);
            setSelectedPlayer(allPlayerIds);
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
                                    checked={(selectedPlayer ?? []).length === (players ?? []).length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>Apellido</th>
                            <th>Correo</th>
                            <th>Ciudad</th>
                            <th>Edad</th>
                            <th>Categoría</th>
                        </tr>
                    </thead>
                    <tbody>
                        {players.map(player => (
                            <tr key={player.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedPlayer.includes(player.id)}
                                        onChange={() => handleSelectPlayer(player.id)}
                                    />
                                </td>
                                <td>{player.name}</td>
                                <td>{player.userName}</td>
                                <td>{player.lastName || 'No disponible'}</td>
                                <td>{player.mail || 'No disponible'}</td>
                                <td>{player.city?.name || 'No disponible'}</td>
                                <td>{player.age || 'No disponible'}</td>
                                <td>{player.category?.name || 'No disponible'}</td>
                            </tr>
                        ))}
                    </tbody>
                </ResultTable>
            </ResultList>
        </CustomThemeProvider>
    );
};

export default PlayerTable;
