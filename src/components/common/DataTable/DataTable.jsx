
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Loader, Check, Settings as SettingsIcon, Eye, EyeOff } from 'react-feather';
import PropTypes from 'prop-types';
import './DataTable.scss';

/**
 * DataTable - A reusable, feature-rich data table component
 * 
 * Features:
 * - Search functionality
 * - Sortable columns (click header)
 * - Column visibility configuration
 * - Resizable columns (drag column borders)
 * - Loading, error, and empty states
 * - Alternating row colors
 * - Custom cell rendering
 * 
 * @param {Object} props
 * @param {Array} props.data - Array of data objects to display
 * @param {Array} props.columns - Column configuration array:
 *   - key: string - The data key to display
 *   - label: string - Column header label
 *   - visible: boolean - Whether column is visible by default
 *   - width: number - Initial column width in pixels
 *   - render: function(value, row, index) - Optional custom render function
 *   - sortable: boolean - Whether column is sortable (default: true)
 * @param {boolean} props.loading - Show loading state
 * @param {string} props.error - Error message to display
 * @param {string} props.searchPlaceholder - Search input placeholder
 * @param {function} props.searchFilter - Custom search filter function(row, query)
 * @param {string} props.emptyIcon - React component for empty state icon
 * @param {string} props.emptyTitle - Empty state title
 * @param {string} props.emptyMessage - Empty state message
 * @param {string} props.footerText - Footer text (use {count} for row count)
 * @param {string} props.className - Additional CSS class for container
 */
export const DataTable = ({
    data = [],
    columns: initialColumns = [],
    loading = false,
    error = null,
    searchPlaceholder = 'البحث ...',
    searchFilter,
    emptyIcon: EmptyIcon,
    emptyTitle = 'لا توجد بيانات',
    emptyMessage = '',
    footerText = 'إجمالي النتائج: {count}',
    className = '',
    onRetry,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [columns, setColumns] = useState(initialColumns);
    const [configDropdownOpen, setConfigDropdownOpen] = useState(false);
    const [resizing, setResizing] = useState(null);
    const resizingRef = useRef(null);
    const configDropdownRef = useRef(null);

    // Update columns when initialColumns change
    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    // Close dropdown when clicking outside & handle resize events
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (configDropdownRef.current && !configDropdownRef.current.contains(event.target)) {
                setConfigDropdownOpen(false);
            }
        };

        const handleMouseMove = (e) => {
            if (resizingRef.current) {
                const { key, startX, startWidth } = resizingRef.current;
                // RTL: dragging left (negative delta) increases width
                const delta = startX - e.clientX;

                setColumns(prev => prev.map(col => {
                    if (col.key === key) {
                        return { ...col, width: Math.max(50, startWidth + delta) };
                    }
                    return col;
                }));
            }
        };

        const handleMouseUp = () => {
            if (resizingRef.current) {
                setResizing(null);
                resizingRef.current = null;
                document.body.style.cursor = 'default';
                document.body.style.userSelect = 'auto';
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleResizeStart = (e, columnKey, startWidth) => {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        resizingRef.current = { key: columnKey, startX, startWidth };
        setResizing(columnKey);

        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    };

    // Toggle column visibility
    const toggleColumn = (key) => {
        setColumns(prev => prev.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
        ));
    };

    // Handle column header click for sorting
    const handleSort = (columnKey) => {
        const column = columns.find(c => c.key === columnKey);
        if (column?.sortable === false) return;

        setSortConfig(prev => {
            if (prev.key !== columnKey) {
                return { key: columnKey, direction: 'asc' };
            } else if (prev.direction === 'asc') {
                return { key: columnKey, direction: 'desc' };
            } else {
                return { key: columnKey, direction: 'asc' };
            }
        });
    };

    // Handle double-click to reset sorting
    const handleDoubleClick = () => {
        setSortConfig({ key: null, direction: null });
    };

    // Default search filter
    const defaultSearchFilter = (row, query) => {
        return Object.values(row).some(value =>
            value && String(value).toLowerCase().includes(query.toLowerCase())
        );
    };

    // Filter and sort data
    const processedData = useMemo(() => {
        let result = data;

        // Apply search filter
        if (searchQuery) {
            const filterFn = searchFilter || defaultSearchFilter;
            result = result.filter(row => filterFn(row, searchQuery));
        }

        // Apply sorting
        if (sortConfig.key) {
            result = [...result].sort((a, b) => {
                const aVal = a[sortConfig.key] ?? '';
                const bVal = b[sortConfig.key] ?? '';

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [data, searchQuery, sortConfig, searchFilter]);

    // Get visible columns
    const visibleColumns = columns.filter(col => col.visible);

    // Get sort icon for column
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} className="sort-icon" />
            : <ChevronDown size={14} className="sort-icon" />;
    };

    // Render cell content
    const renderCell = (column, row, rowIndex) => {
        const value = row[column.key];
        if (column.render) {
            return column.render(value, row, rowIndex);
        }
        return value ?? '-';
    };

    // Format footer text
    const formattedFooterText = footerText.replace('{count}', processedData.length);

    return (
        <div className={`data-table-wrapper ${className}`}>
            {/* Controls Bar */}
            <div className="dt-controls-bar">
                <div className="dt-search-container">
                    <div className={`dt-search-box ${searchQuery ? 'active' : ''}`}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="dt-clear-search" onClick={() => setSearchQuery('')}>×</button>
                        )}
                    </div>
                </div>

                <div className="dt-filter-group">
                    {/* Configuration Dropdown */}
                    <div className="dt-config-dropdown" ref={configDropdownRef}>
                        <button
                            className={`dt-config-btn ${configDropdownOpen ? 'active' : ''}`}
                            onClick={() => setConfigDropdownOpen(!configDropdownOpen)}
                            title="إعدادات الجدول"
                        >
                            <SettingsIcon size={22} />
                        </button>

                        {configDropdownOpen && (
                            <div className="dt-dropdown-menu">
                                <div className="dt-menu-header">إظهار الأعمدة</div>
                                {columns.map(col => (
                                    <label key={col.key} className="dt-dropdown-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={col.visible}
                                            onChange={() => toggleColumn(col.key)}
                                        />
                                        <span className="dt-checkbox-box">
                                            {col.visible && <Check size={14} />}
                                        </span>
                                        <span className="dt-item-label">{col.label}</span>
                                        {col.visible ? <Eye size={14} className="dt-visibility-icon" /> : <EyeOff size={14} className="dt-visibility-icon" />}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="dt-loading-state">
                    <Loader size={32} className="dt-spinner" />
                    <p>جاري تحميل البيانات...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="dt-error-state">
                    <p>{error}</p>
                    <button onClick={onRetry || (() => window.location.reload())}>إعادة المحاولة</button>
                </div>
            )}

            {/* Data Table */}
            {!loading && !error && (
                <>
                    <div className="dt-table-container">
                        <table className="dt-table">
                            <thead>
                                <tr>
                                    {visibleColumns.map(col => (
                                        <th
                                            key={col.key}
                                            onClick={() => handleSort(col.key)}
                                            onDoubleClick={handleDoubleClick}
                                            className={`${sortConfig.key === col.key ? 'sorted' : ''} ${col.sortable === false ? 'no-sort' : ''}`}
                                            style={{ width: col.width }}
                                        >
                                            <div
                                                className={`dt-resize-handle ${resizing === col.key ? 'active' : ''}`}
                                                onMouseDown={(e) => handleResizeStart(e, col.key, col.width)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="dt-th-content">
                                                {col.label}
                                                {col.sortable !== false && getSortIcon(col.key)}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {processedData.map((row, rowIndex) => (
                                    <tr key={row.id || rowIndex} className={rowIndex % 2 === 1 ? 'row-alt' : ''}>
                                        {visibleColumns.map(col => (
                                            <td key={col.key}>
                                                {renderCell(col, row, rowIndex)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {processedData.length === 0 && (
                            <div className="dt-empty-state">
                                {EmptyIcon && <EmptyIcon size={48} />}
                                <p>{emptyTitle}</p>
                                {emptyMessage && <span>{emptyMessage}</span>}
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    <div className="dt-table-footer">
                        <span>{formattedFooterText}</span>
                    </div>
                </>
            )}
        </div>
    );
};

DataTable.propTypes = {
    data: PropTypes.array,
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        visible: PropTypes.bool,
        width: PropTypes.number,
        render: PropTypes.func,
        sortable: PropTypes.bool,
    })),
    loading: PropTypes.bool,
    error: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    searchFilter: PropTypes.func,
    emptyIcon: PropTypes.elementType,
    emptyTitle: PropTypes.string,
    emptyMessage: PropTypes.string,
    footerText: PropTypes.string,
    className: PropTypes.string,
    onRetry: PropTypes.func,
};
