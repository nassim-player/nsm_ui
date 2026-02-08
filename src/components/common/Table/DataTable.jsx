
import React from 'react';
import './DataTable.scss';
import PropTypes from 'prop-types';

export const DataTable = ({ columns, data, keyField = 'id', className = '' }) => {
    return (
        <div className={`table-container ${className}`}>
            <table className="data-table">
                <thead>
                    <tr>
                        {columns.map((col, index) => (
                            <th key={index} style={{ textAlign: col.align || 'right' }}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((row, rowIndex) => (
                            <tr key={row[keyField] || rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex} style={{ textAlign: col.align || 'right' }}>
                                        {col.render
                                            ? col.render(row, rowIndex)
                                            : (col.accessor ? row[col.accessor] : null)
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>
                                لا توجد بيانات
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

DataTable.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
        header: PropTypes.string.isRequired,
        accessor: PropTypes.string,
        render: PropTypes.func,
        align: PropTypes.oneOf(['left', 'center', 'right'])
    })).isRequired,
    data: PropTypes.array.isRequired,
    keyField: PropTypes.string,
    className: PropTypes.string
};
