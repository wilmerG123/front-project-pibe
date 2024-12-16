import React from 'react';
import {
    ResultList,
    ResultTable,
    SelectAllCheckbox,
} from '../../styles/tablas';
import CustomThemeProvider from '../../styles/CustomThemeProvider';

// Componente para mostrar la tabla de los pagos
const PagosTable = ({ pagos, selectedPago, setSelectedPago }) => {

    // Maneja la selección de un jugador individual
    const handleSelectPago = (pagoId) => {
        setSelectedPago((prevSelected) => {
            if (prevSelected.includes(pagoId)) {
                // Si ya está seleccionado, lo deseleccionamos
                return prevSelected.filter((id) => id !== pagoId);
            } else {
                // Si no está seleccionado, lo agregamos
                return [...prevSelected, pagoId];
            }
        });
    };

    // Maneja la selección de todos los pagos
    const handleSelectAll = () => {
        if (selectedPago.length === pagos.length) {
            // Si ya están seleccionados todos, desmarcamos
            setSelectedPago([]);
        } else {
            // Seleccionamos todos los jugadores
            const allPagosIds = pagos.map(pago => pago.id);
            setSelectedPago(allPagosIds);
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
                                    checked={(selectedPago ?? []).length === (pagos ?? []).length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Fecha Pago</th>
                            <th>Nombre</th>
            
                        </tr>
                    </thead>
                    <tbody>
                        {pagos.map(pago => (
                            <tr key={pago.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedPago.includes(pago.id)}
                                        onChange={() => handleSelectPago(pago.id)}
                                    />
                                </td>
                                <td>{pago.cancelledDate}</td>
                                <td>{pago.obligation?.player?.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </ResultTable>
            </ResultList>
        </CustomThemeProvider>
    );
};

export default PagosTable;
