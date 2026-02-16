import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp, Loader, Check, Sliders, Eye, EyeOff, Plus, X, Columns, ChevronRight, Grid, RotateCcw, AlertCircle } from 'react-feather';
import PropTypes from 'prop-types';
import './DataTable.scss';

/**
 * DataTable - A reusable, feature-rich data table component
 * 
 * Features:
 * - Search functionality
 * - Sortable columns (click header)
 * - Column visibility configuration  
 * - Column reordering (drag & drop)
 * - Add extra columns from available pool
 * - Resizable columns (drag column borders)
 * - Reset to defaults
 * - Loading, error, and empty states
 * - Alternating row colors
 * - Custom cell rendering
 */
export const DataTable = ({
    data = [],
    columns: initialColumns = [],
    defaultColumns = [], // Original default set for reset
    extraColumns = [],
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
    onRowClick,
    onColumnsChange,
    headerActions,
    selectable = false,
    selectedRows = [],
    onSelectedRowsChange,
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [columns, setColumns] = useState(initialColumns);
    const [configDropdownOpen, setConfigDropdownOpen] = useState(false);
    const [addColumnOpen, setAddColumnOpen] = useState(false);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [resizing, setResizing] = useState(null);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const resizingRef = useRef(null);
    const configDropdownRef = useRef(null);
    const columnListRef = useRef(null);
    const scrollIntervalRef = useRef(null);

    // Update columns when initialColumns change
    useEffect(() => {
        setColumns(initialColumns);
    }, [initialColumns]);

    // Close dropdown when clicking outside & handle resize events
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (configDropdownRef.current && !configDropdownRef.current.contains(event.target)) {
                setConfigDropdownOpen(false);
                setAddColumnOpen(false);
                setExpandedCategory(null);
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

    // Toggle column visibility - Simple on/off switch
    const toggleColumn = (key) => {
        setColumns(prev => {
            const updated = prev.map(col =>
                col.key === key ? { ...col, visible: !col.visible } : col
            );
            onColumnsChange?.(updated);
            return updated;
        });
    };

    // Reset to defaults
    const handleReset = () => {
        if (!defaultColumns || defaultColumns.length === 0) return;
        setColumns(defaultColumns);
        onColumnsChange?.(defaultColumns);
    };

    // Drag and Drop reordering logic
    const handleDragStart = (e, index) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        // Auto-scroll logic with delta calculation
        const container = columnListRef.current;
        if (container) {
            const rect = container.getBoundingClientRect();
            const threshold = 50;
            const topDist = e.clientY - rect.top;
            const bottomDist = rect.bottom - e.clientY;

            clearInterval(scrollIntervalRef.current);

            if (topDist < threshold) {
                const speed = Math.max(2, (threshold - topDist) / 4);
                scrollIntervalRef.current = setInterval(() => {
                    container.scrollTop -= speed;
                }, 10);
            } else if (bottomDist < threshold) {
                const speed = Math.max(2, (threshold - bottomDist) / 4);
                scrollIntervalRef.current = setInterval(() => {
                    container.scrollTop += speed;
                }, 10);
            }
        }

        // Swap columns in state for visual reordering
        const updated = [...columns];
        const itemToMove = updated.splice(draggedIndex, 1)[0];
        updated.splice(index, 0, itemToMove);
        setColumns(updated);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        clearInterval(scrollIntervalRef.current);
        onColumnsChange?.(columns);
    };

    // Add a column from the extra columns pool
    const addExtraColumn = (extraCol) => {
        setColumns(prev => {
            // Don't add if already exists
            if (prev.find(c => c.key === extraCol.key)) return prev;
            const updated = [...prev, { ...extraCol, visible: true }];
            onColumnsChange?.(updated);
            return updated;
        });
        setAddColumnOpen(false);
        setExpandedCategory(null);
    };

    // Remove a column (only extra/added ones)
    const removeColumn = (key) => {
        setColumns(prev => {
            const updated = prev.filter(c => c.key !== key);
            onColumnsChange?.(updated);
            return updated;
        });
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

    // Selection handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            onSelectedRowsChange(processedData.map(row => row.id || data.indexOf(row)));
        } else {
            onSelectedRowsChange([]);
        }
    };

    const handleSelectRow = (e, row) => {
        e.stopPropagation();
        const id = row.id || data.indexOf(row);
        if (e.target.checked) {
            onSelectedRowsChange([...selectedRows, id]);
        } else {
            onSelectedRowsChange(selectedRows.filter(rId => rId !== id));
        }
    };

    const isAllSelected = processedData.length > 0 && selectedRows.length === processedData.length;
    const isSomeSelected = selectedRows.length > 0 && !isAllSelected;

    // Get visible columns - These are the ones shown in the table
    const visibleColumns = columns.filter(col => col.visible);

    // Get available extra columns (not already added)
    const availableExtras = extraColumns.filter(
        extra => !columns.find(c => c.key === extra.key)
    );

    // Group available extras by category
    const groupedExtras = useMemo(() => {
        const groups = {};
        availableExtras.forEach(col => {
            const cat = col.category || 'أخرى';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(col);
        });
        return groups;
    }, [availableExtras]);

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

    // Check if column is removable (was added from extras)
    const isRemovable = (key) => {
        return extraColumns.some(ec => ec.key === key);
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
                    {headerActions && <div className="dt-header-actions">{headerActions}</div>}
                    {/* Configuration Dropdown */}
                    <div className="dt-config-dropdown" ref={configDropdownRef}>
                        <button
                            className={`dt-config-btn ${configDropdownOpen ? 'active' : ''}`}
                            onClick={() => {
                                setConfigDropdownOpen(!configDropdownOpen);
                                setAddColumnOpen(false);
                                setExpandedCategory(null);
                            }}
                            title="إعدادات الأعمدة"
                        >
                            <Sliders size={26} />
                        </button>

                        {configDropdownOpen && (
                            <div className="dt-dropdown-menu">
                                {!addColumnOpen ? (
                                    <>
                                        <div className="dt-menu-header">
                                            <Columns size={16} />
                                            <span>ترتيب و إظهار الأعمدة</span>

                                            {defaultColumns && defaultColumns.length > 0 && (
                                                <button
                                                    className="dt-reset-btn"
                                                    onClick={handleReset}
                                                    title="إعادة ضبط الافتراضيات"
                                                >
                                                    <RotateCcw size={14} />
                                                </button>
                                            )}
                                        </div>
                                        <div
                                            className="dt-column-list"
                                            ref={columnListRef}
                                            onDragLeave={() => clearInterval(scrollIntervalRef.current)}
                                        >
                                            {columns.map((col, index) => (
                                                <div
                                                    key={col.key}
                                                    className={`dt-column-item ${col.visible ? 'dt-col-visible' : 'dt-col-hidden'} ${draggedIndex === index ? 'dragging' : ''}`}
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, index)}
                                                    onDragOver={(e) => handleDragOver(e, index)}
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <div className="dt-item-drag-handle">
                                                        <Grid size={18} />
                                                    </div>

                                                    <button
                                                        className="dt-visibility-toggle"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleColumn(col.key);
                                                        }}
                                                        title="تبديل الظهور"
                                                    >
                                                        {col.visible
                                                            ? <Eye size={18} className="dt-vis-icon on" />
                                                            : <EyeOff size={18} className="dt-vis-icon off" />
                                                        }
                                                    </button>

                                                    <span className="dt-item-label">{col.label}</span>

                                                    <span className="dt-item-order">
                                                        {index + 1}
                                                    </span>

                                                    {isRemovable(col.key) && (
                                                        <button
                                                            className="dt-remove-col-btn"
                                                            onClick={(e) => { e.stopPropagation(); removeColumn(col.key); }}
                                                            title="إزالة العمود"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Column Button */}
                                        {availableExtras.length > 0 && (
                                            <button
                                                className="dt-add-column-btn"
                                                onClick={() => setAddColumnOpen(true)}
                                            >
                                                <Plus size={20} />
                                                <span>إضافة عمود</span>
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    /* Add Column Picker */
                                    <div className="dt-add-column-picker">
                                        <div className="dt-picker-header">
                                            <button className="dt-back-btn" onClick={() => { setAddColumnOpen(false); setExpandedCategory(null); }}>
                                                <ChevronRight size={18} />
                                            </button>
                                            <span>إضافة عمود جديد</span>
                                        </div>

                                        <div className="dt-picker-categories">
                                            {Object.entries(groupedExtras).map(([category, cols]) => (
                                                <div key={category} className="dt-picker-category">
                                                    <button
                                                        className={`dt-category-header ${expandedCategory === category ? 'expanded' : ''}`}
                                                        onClick={() => setExpandedCategory(expandedCategory === category ? null : category)}
                                                    >
                                                        <ChevronRight size={16} className="dt-cat-arrow" />
                                                        <span>{category}</span>
                                                        <span className="dt-cat-count">{cols.length}</span>
                                                    </button>

                                                    {expandedCategory === category && (
                                                        <div className="dt-category-items">
                                                            {cols.map(col => (
                                                                <button
                                                                    key={col.key}
                                                                    className="dt-extra-col-item"
                                                                    onClick={() => addExtraColumn(col)}
                                                                >
                                                                    <Plus size={16} />
                                                                    <span>{col.label}</span>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
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
                        {visibleColumns.length > 0 ? (
                            <table className="dt-table">
                                <thead>
                                    <tr className="dt-header-row">
                                        {selectable && (
                                            <th className="dt-header-cell selection-cell">
                                                <div className="dt-checkbox-wrapper">
                                                    <input
                                                        type="checkbox"
                                                        checked={isAllSelected}
                                                        ref={el => el && (el.indeterminate = isSomeSelected)}
                                                        onChange={handleSelectAll}
                                                    />
                                                    <span className="checkbox-visual"></span>
                                                </div>
                                            </th>
                                        )}
                                        {visibleColumns.map((col, idx) => (
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
                                        <tr
                                            key={row.id || rowIndex}
                                            className={`${rowIndex % 2 === 1 ? 'row-alt' : ''} ${onRowClick ? 'clickable' : ''}`}
                                            onClick={(e) => onRowClick && onRowClick(row, e)}
                                        >
                                            {selectable && (
                                                <td className="dt-body-cell selection-cell">
                                                    <div className="dt-checkbox-wrapper">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedRows.includes(row.id || data.indexOf(row))}
                                                            onChange={(e) => handleSelectRow(e, row)}
                                                            onClick={(e) => e.stopPropagation()}
                                                        />
                                                        <span className="checkbox-visual"></span>
                                                    </div>
                                                </td>
                                            )}
                                            {visibleColumns.map((col) => (
                                                <td key={col.key}>
                                                    {renderCell(col, row, rowIndex)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="dt-no-columns-state">
                                <AlertCircle size={48} />
                                <p>يجب إظهار عمود واحد على الأقل لعرض البيانات</p>
                                {defaultColumns && defaultColumns.length > 0 && (
                                    <button onClick={handleReset}>إعادة ضبط الأعمدة</button>
                                )}
                            </div>
                        )}

                        {processedData.length === 0 && visibleColumns.length > 0 && (
                            <div className="dt-empty-state">
                                {EmptyIcon && <EmptyIcon size={48} />}
                                <p>{emptyTitle}</p>
                                {emptyMessage && <span>{emptyMessage}</span>}
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    {visibleColumns.length > 0 && (
                        <div className="dt-table-footer">
                            <span>{formattedFooterText}</span>
                        </div>
                    )}
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
    defaultColumns: PropTypes.array,
    extraColumns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        category: PropTypes.string,
        width: PropTypes.number,
        render: PropTypes.func,
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
    onRowClick: PropTypes.func,
    onColumnsChange: PropTypes.func,
};
