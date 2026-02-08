
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Download, ChevronDown, ChevronUp, User, Loader, Phone, Layers, Users as UsersIcon, Check, Grid, Settings as SettingsIcon, Eye, EyeOff } from 'react-feather';
import './StudentsOrganization.scss';

// API base URL - using Apache on port 80 since Vite can't serve PHP
const API_URL = 'http://localhost/nsm_ui/api';

// Column configuration
const initialColumns = [
    { key: 'studentId', label: 'الرقم', visible: true, width: 80 },
    { key: 'name', label: 'الاسم الكامل', visible: true, width: 250 },
    { key: 'grade', label: 'المستوى', visible: true, width: 120 },
    { key: 'gender', label: 'الجنس', visible: true, width: 100 },
    { key: 'parentPhone', label: 'هاتف الولي', visible: true, width: 150 },
];

// Main stage definitions with colors
const mainStages = [
    { code: 'pr', label: 'التحضيري', color: '#f97316' },  // Orange
    { code: 'p', label: 'الإبتدائي', color: '#22c55e' },   // Green
    { code: 'm', label: 'المتوسط', color: '#8b5cf6' },     // Purple
];

// Sub-stage definitions (level within each stage)
const subStages = {
    pr: [{ code: 'pr', label: 'التحضيري', color: '#f97316' }],
    p: [
        { code: '1p', label: 'السنة الأولى', color: '#22c55e' },
        { code: '2p', label: 'السنة الثانية', color: '#22c55e' },
        { code: '3p', label: 'السنة الثالثة', color: '#22c55e' },
        { code: '4p', label: 'السنة الرابعة', color: '#22c55e' },
        { code: '5p', label: 'السنة الخامسة', color: '#22c55e' },
    ],
    m: [
        { code: '1m', label: 'السنة الأولى', color: '#8b5cf6' },
        { code: '2m', label: 'السنة الثانية', color: '#8b5cf6' },
        { code: '3m', label: 'السنة الثالثة', color: '#8b5cf6' },
        { code: '4m', label: 'السنة الرابعة', color: '#8b5cf6' },
    ],
};

// Gender options with colors
const genderOptions = [
    { value: '+', label: 'ذكر', color: '#3b82f6' },       // Soft blue
    { value: '-', label: 'أنثى', color: '#ec4899' },      // Pink
];

// Parse grade string to extract sub-stage and class number
const parseGrade = (grade) => {
    if (!grade) return null;

    // Pattern for Arabic grade format: "X Stage Y" where X is stage level, Y is class number
    const match = grade.match(/^(\d+)\s+(التحضيري|الإبتدائي|المتوسط)\s+(\d+)$/);
    if (!match) return null;

    const levelNum = match[1];
    const stageName = match[2];
    const classNum = match[3];

    let stageCode = '';
    if (stageName === 'التحضيري') stageCode = 'pr';
    else if (stageName === 'الإبتدائي') stageCode = 'p';
    else if (stageName === 'المتوسط') stageCode = 'm';

    // Build sub-stage code
    const subStageCode = stageCode === 'pr' ? 'pr' : `${levelNum}${stageCode}`;

    return { stage: stageCode, subStage: subStageCode, classNum, fullGrade: grade };
};

export const StudentsOrganization = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [columns, setColumns] = useState(initialColumns);

    // Filter states - multi-select using Sets
    const [selectedStages, setSelectedStages] = useState(new Set());
    const [selectedSubStages, setSelectedSubStages] = useState(new Set());
    const [selectedClasses, setSelectedClasses] = useState(new Set());
    const [selectedGenders, setSelectedGenders] = useState(new Set());

    // Dropdown open states
    const [stageDropdownOpen, setStageDropdownOpen] = useState(false);
    const [subStageDropdownOpen, setSubStageDropdownOpen] = useState(false);
    const [classDropdownOpen, setClassDropdownOpen] = useState(false);
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false);
    const [configDropdownOpen, setConfigDropdownOpen] = useState(false);

    // Resizing state
    const [resizing, setResizing] = useState(null); // { key: 'studentId', startX: 100, startWidth: 80 }
    const resizingRef = useRef(null); // Ref to keep track of resizing state without re-renders during drag

    // Refs for click outside detection
    const stageDropdownRef = useRef(null);
    const subStageDropdownRef = useRef(null);
    const classDropdownRef = useRef(null);
    const genderDropdownRef = useRef(null);
    const configDropdownRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (stageDropdownRef.current && !stageDropdownRef.current.contains(event.target)) {
                setStageDropdownOpen(false);
            }
            if (subStageDropdownRef.current && !subStageDropdownRef.current.contains(event.target)) {
                setSubStageDropdownOpen(false);
            }
            if (classDropdownRef.current && !classDropdownRef.current.contains(event.target)) {
                setClassDropdownOpen(false);
            }
            if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
                setGenderDropdownOpen(false);
            }
            if (configDropdownRef.current && !configDropdownRef.current.contains(event.target)) {
                setConfigDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

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

    // Fetch students from API
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/students.php`);
                const data = await response.json();

                if (data.success) {
                    setStudents(data.data);
                } else {
                    setError(data.error || 'فشل في جلب البيانات');
                }
            } catch (err) {
                setError('خطأ في الاتصال بالخادم');
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    // Get available sub-stages based on selected stages
    const availableSubStages = useMemo(() => {
        if (selectedStages.size === 0) return [];

        const showStageName = selectedStages.size > 1; // Show stage name when multiple stages selected

        const result = [];
        for (const stageCode of selectedStages) {
            const stage = mainStages.find(s => s.code === stageCode);
            const subs = subStages[stageCode] || [];
            // Only include sub-stages that exist in student data
            subs.forEach(sub => {
                const hasStudents = students.some(s => {
                    const parsed = parseGrade(s.grade);
                    return parsed && parsed.subStage === sub.code;
                });
                if (hasStudents && !result.find(r => r.code === sub.code)) {
                    // Add stage name to label when multiple stages selected
                    const displayLabel = showStageName && stage ? `${sub.label} ${stage.label}` : sub.label;
                    result.push({ ...sub, displayLabel });
                }
            });
        }
        return result;
    }, [selectedStages, students]);

    // Get available classes based on selected sub-stages
    const availableClasses = useMemo(() => {
        if (selectedSubStages.size === 0) return [];

        const classesMap = new Map();
        students.forEach(s => {
            const parsed = parseGrade(s.grade);
            if (parsed && selectedSubStages.has(parsed.subStage)) {
                if (!classesMap.has(s.grade)) {
                    // Get color from sub-stage
                    const subStage = availableSubStages.find(ss => ss.code === parsed.subStage);
                    classesMap.set(s.grade, {
                        grade: s.grade,
                        classNum: parsed.classNum,
                        subStage: parsed.subStage,
                        color: subStage?.color || '#6b7280'
                    });
                }
            }
        });
        return [...classesMap.values()].sort((a, b) => a.grade.localeCompare(b.grade));
    }, [selectedSubStages, students, availableSubStages]);

    // Toggle selection in a Set
    const toggleSelection = (setter, value) => {
        setter(prev => {
            const newSet = new Set(prev);
            if (newSet.has(value)) {
                newSet.delete(value);
            } else {
                newSet.add(value);
            }
            return newSet;
        });
    };

    // Toggle column visibility
    const toggleColumn = (key) => {
        setColumns(prev => prev.map(col =>
            col.key === key ? { ...col, visible: !col.visible } : col
        ));
    };

    // Clear sub-stages and classes when stages change
    useEffect(() => {
        setSelectedSubStages(prev => {
            const validSubs = new Set();
            prev.forEach(subCode => {
                const isValid = availableSubStages.some(s => s.code === subCode);
                if (isValid) validSubs.add(subCode);
            });
            return validSubs;
        });
    }, [availableSubStages]);

    // Clear classes when sub-stages change
    useEffect(() => {
        setSelectedClasses(prev => {
            const validClasses = new Set();
            prev.forEach(grade => {
                const isValid = availableClasses.some(c => c.grade === grade);
                if (isValid) validClasses.add(grade);
            });
            return validClasses;
        });
    }, [availableClasses]);

    // Handle column header click for sorting
    const handleSort = (columnKey) => {
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

    // Filter and sort students
    const processedStudents = useMemo(() => {
        let result = students.filter(student => {
            // Search filter
            const matchesSearch =
                (student.name && student.name.includes(searchQuery)) ||
                (student.studentId && student.studentId.toLowerCase().includes(searchQuery.toLowerCase()));

            const parsed = parseGrade(student.grade);

            // Stage filter
            let matchesStage = true;
            if (selectedClasses.size > 0) {
                // Most specific: filter by class
                matchesStage = selectedClasses.has(student.grade);
            } else if (selectedSubStages.size > 0) {
                // Filter by sub-stage
                matchesStage = parsed && selectedSubStages.has(parsed.subStage);
            } else if (selectedStages.size > 0) {
                // Filter by main stage
                matchesStage = parsed && selectedStages.has(parsed.stage);
            }

            // Gender filter
            const matchesGender = selectedGenders.size === 0 || selectedGenders.has(student.gender);

            return matchesSearch && matchesStage && matchesGender;
        });

        if (sortConfig.key) {
            result = [...result].sort((a, b) => {
                const aVal = a[sortConfig.key] || '';
                const bVal = b[sortConfig.key] || '';

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [students, searchQuery, selectedStages, selectedSubStages, selectedClasses, selectedGenders, sortConfig]);

    // Get visible columns
    const visibleColumns = columns.filter(col => col.visible);

    // Get sort icon for column
    const getSortIcon = (columnKey) => {
        if (sortConfig.key !== columnKey) return null;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} className="sort-icon" />
            : <ChevronDown size={14} className="sort-icon" />;
    };

    // Render gender display
    const renderGender = (gender) => {
        if (!gender) return '-';
        const genderMap = {
            '+': 'ذكر',
            '-': 'أنثى',
            'male': 'ذكر',
            'female': 'أنثى',
            'ذكر': 'ذكر',
            'أنثى': 'أنثى'
        };
        return genderMap[gender.toLowerCase?.()] || gender;
    };

    // Keep dropdown labels functions same
    const getStageLabel = () => {
        if (selectedStages.size === 0) return 'المرحلة';
        if (selectedStages.size === 1) {
            const code = [...selectedStages][0];
            return mainStages.find(s => s.code === code)?.label || code;
        }
        return `${selectedStages.size} مراحل`;
    };

    const getSubStageLabel = () => {
        if (selectedSubStages.size === 0) return 'السنة';
        if (selectedSubStages.size === 1) {
            const code = [...selectedSubStages][0];
            const sub = availableSubStages.find(s => s.code === code);
            return sub?.label || code;
        }
        return `${selectedSubStages.size} سنوات`;
    };

    const getClassLabel = () => {
        if (selectedClasses.size === 0) return 'القسم';
        if (selectedClasses.size === 1) return [...selectedClasses][0];
        return `${selectedClasses.size} أقسام`;
    };

    const getGenderLabel = () => {
        if (selectedGenders.size === 0) return 'الجنس';
        if (selectedGenders.size === 1) {
            const val = [...selectedGenders][0];
            return genderOptions.find(g => g.value === val)?.label || val;
        }
        return 'كلاهما';
    };

    const closeAllDropdowns = () => {
        setStageDropdownOpen(false);
        setSubStageDropdownOpen(false);
        setClassDropdownOpen(false);
        setGenderDropdownOpen(false);
        setConfigDropdownOpen(false);
    };

    return (
        <div className="students-organization">
            <div className="page-header">
                <div className="header-content">
                    <h1>تنظيم الطلاب</h1>
                    <p>عرض وإدارة بيانات جميع الطلاب المسجلين</p>
                </div>
            </div>

            {/* Filter Dropdowns */}
            <div className="filter-bar">
                {/* Stage Dropdown */}
                <div className="filter-dropdown" ref={stageDropdownRef}>
                    <button
                        className={`dropdown-trigger ${selectedStages.size > 0 ? 'active' : ''}`}
                        onClick={() => {
                            closeAllDropdowns();
                            setStageDropdownOpen(!stageDropdownOpen);
                        }}
                    >
                        <Layers size={18} />
                        <span>{getStageLabel()}</span>
                        <ChevronDown size={16} className={`arrow ${stageDropdownOpen ? 'open' : ''}`} />
                    </button>

                    {stageDropdownOpen && (
                        <div className="dropdown-menu multi-select">
                            {mainStages.map(stage => (
                                <label
                                    key={stage.code}
                                    className="dropdown-checkbox"
                                    style={{ '--item-color': stage.color }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedStages.has(stage.code)}
                                        onChange={() => toggleSelection(setSelectedStages, stage.code)}
                                    />
                                    <span className="checkbox-box">
                                        {selectedStages.has(stage.code) && <Check size={14} />}
                                    </span>
                                    <span className="item-label">{stage.label}</span>
                                </label>
                            ))}
                            {selectedStages.size > 0 && (
                                <button
                                    className="dropdown-clear"
                                    onClick={() => {
                                        setSelectedStages(new Set());
                                        setSelectedSubStages(new Set());
                                        setSelectedClasses(new Set());
                                    }}
                                >
                                    مسح الكل
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Sub-Stage Dropdown - Only show when stages are selected */}
                {selectedStages.size > 0 && (
                    <div className="filter-dropdown" ref={subStageDropdownRef}>
                        <button
                            className={`dropdown-trigger ${selectedSubStages.size > 0 ? 'active' : ''}`}
                            onClick={() => {
                                closeAllDropdowns();
                                setSubStageDropdownOpen(!subStageDropdownOpen);
                            }}
                        >
                            <span>{getSubStageLabel()}</span>
                            <ChevronDown size={16} className={`arrow ${subStageDropdownOpen ? 'open' : ''}`} />
                        </button>

                        {subStageDropdownOpen && (
                            <div className="dropdown-menu multi-select">
                                {availableSubStages.length > 0 ? (
                                    <>
                                        {availableSubStages.map(sub => (
                                            <label
                                                key={sub.code}
                                                className="dropdown-checkbox"
                                                style={{ '--item-color': sub.color }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedSubStages.has(sub.code)}
                                                    onChange={() => toggleSelection(setSelectedSubStages, sub.code)}
                                                />
                                                <span className="checkbox-box">
                                                    {selectedSubStages.has(sub.code) && <Check size={14} />}
                                                </span>
                                                <span className="item-label">{sub.displayLabel || sub.label}</span>
                                            </label>
                                        ))}
                                        {selectedSubStages.size > 0 && (
                                            <button
                                                className="dropdown-clear"
                                                onClick={() => {
                                                    setSelectedSubStages(new Set());
                                                    setSelectedClasses(new Set());
                                                }}
                                            >
                                                مسح الكل
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="dropdown-empty">لا توجد سنوات</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Class Dropdown - Only show when sub-stages are selected */}
                {selectedSubStages.size > 0 && (
                    <div className="filter-dropdown" ref={classDropdownRef}>
                        <button
                            className={`dropdown-trigger ${selectedClasses.size > 0 ? 'active' : ''}`}
                            onClick={() => {
                                closeAllDropdowns();
                                setClassDropdownOpen(!classDropdownOpen);
                            }}
                        >
                            <Grid size={18} />
                            <span>{getClassLabel()}</span>
                            <ChevronDown size={16} className={`arrow ${classDropdownOpen ? 'open' : ''}`} />
                        </button>

                        {classDropdownOpen && (
                            <div className="dropdown-menu multi-select">
                                {availableClasses.length > 0 ? (
                                    <>
                                        {availableClasses.map(cls => (
                                            <label
                                                key={cls.grade}
                                                className="dropdown-checkbox"
                                                style={{ '--item-color': cls.color }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClasses.has(cls.grade)}
                                                    onChange={() => toggleSelection(setSelectedClasses, cls.grade)}
                                                />
                                                <span className="checkbox-box">
                                                    {selectedClasses.has(cls.grade) && <Check size={14} />}
                                                </span>
                                                <span className="item-label">{cls.grade}</span>
                                            </label>
                                        ))}
                                        {selectedClasses.size > 0 && (
                                            <button
                                                className="dropdown-clear"
                                                onClick={() => setSelectedClasses(new Set())}
                                            >
                                                مسح الكل
                                            </button>
                                        )}
                                    </>
                                ) : (
                                    <div className="dropdown-empty">لا توجد أقسام</div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Gender Dropdown */}
                <div className="filter-dropdown" ref={genderDropdownRef}>
                    <button
                        className={`dropdown-trigger ${selectedGenders.size > 0 ? 'active' : ''}`}
                        onClick={() => {
                            closeAllDropdowns();
                            setGenderDropdownOpen(!genderDropdownOpen);
                        }}
                    >
                        <UsersIcon size={18} />
                        <span>{getGenderLabel()}</span>
                        <ChevronDown size={16} className={`arrow ${genderDropdownOpen ? 'open' : ''}`} />
                    </button>

                    {genderDropdownOpen && (
                        <div className="dropdown-menu multi-select">
                            {genderOptions.map(option => (
                                <label
                                    key={option.value}
                                    className="dropdown-checkbox"
                                    style={{ '--item-color': option.color }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedGenders.has(option.value)}
                                        onChange={() => toggleSelection(setSelectedGenders, option.value)}
                                    />
                                    <span className="checkbox-box">
                                        {selectedGenders.has(option.value) && <Check size={14} />}
                                    </span>
                                    <span className="item-label">{option.label}</span>
                                </label>
                            ))}
                            {selectedGenders.size > 0 && (
                                <button
                                    className="dropdown-clear"
                                    onClick={() => setSelectedGenders(new Set())}
                                >
                                    مسح الكل
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Controls Bar with New Search and Config */}
            <div className="controls-bar">
                <div className="search-container">
                    <div className={`search-box ${searchQuery ? 'active' : ''}`}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="البحث ..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button className="clear-search" onClick={() => setSearchQuery('')}>×</button>
                        )}
                    </div>
                </div>

                <div className="filter-group">
                    {/* Configuration Dropdown */}
                    <div className="filter-dropdown config-dropdown" ref={configDropdownRef}>
                        <button
                            className={`config-btn ${configDropdownOpen ? 'active' : ''}`}
                            onClick={() => {
                                closeAllDropdowns();
                                setConfigDropdownOpen(!configDropdownOpen);
                            }}
                            title="إعدادات الجدول"
                        >
                            <SettingsIcon size={22} />
                        </button>

                        {configDropdownOpen && (
                            <div className="dropdown-menu config-menu">
                                <div className="menu-header">إظهار الأعمدة</div>
                                {columns.map(col => (
                                    <label key={col.key} className="dropdown-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={col.visible}
                                            onChange={() => toggleColumn(col.key)}
                                        />
                                        <span className="checkbox-box">
                                            {col.visible && <Check size={14} />}
                                        </span>
                                        <span className="item-label">{col.label}</span>
                                        {col.visible ? <Eye size={14} className="visibility-icon" /> : <EyeOff size={14} className="visibility-icon" />}
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="loading-state">
                    <Loader size={32} className="spinner" />
                    <p>جاري تحميل البيانات...</p>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="error-state">
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
                </div>
            )}

            {/* Students Table */}
            {!loading && !error && (
                <>
                    <div className="table-container">
                        <table className="students-table">
                            <thead>
                                <tr>
                                    {visibleColumns.map(col => (
                                        <th
                                            key={col.key}
                                            onClick={() => handleSort(col.key)}
                                            onDoubleClick={handleDoubleClick}
                                            className={sortConfig.key === col.key ? 'sorted' : ''}
                                            style={{ width: col.width }}
                                        >
                                            <div
                                                className={`resize-handle ${resizing === col.key ? 'active' : ''}`}
                                                onMouseDown={(e) => handleResizeStart(e, col.key, col.width)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <span className="th-content">
                                                {col.label}
                                                {getSortIcon(col.key)}
                                            </span>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {processedStudents.map((student, index) => (
                                    <tr key={student.id} className={index % 2 === 1 ? 'row-alt' : ''}>
                                        {columns.find(c => c.key === 'studentId')?.visible && (
                                            <td className="student-id">{student.studentId}</td>
                                        )}
                                        {columns.find(c => c.key === 'name')?.visible && (
                                            <td className="student-name">
                                                <div className="student-avatar">
                                                    <User size={16} />
                                                </div>
                                                <span>{student.name}</span>
                                            </td>
                                        )}
                                        {columns.find(c => c.key === 'grade')?.visible && (
                                            <td>{student.grade || '-'}</td>
                                        )}
                                        {columns.find(c => c.key === 'gender')?.visible && (
                                            <td>
                                                <span className={`gender-badge ${student.gender === '+' || student.gender === 'ذكر' ? 'male' : 'female'}`}>
                                                    {renderGender(student.gender)}
                                                </span>
                                            </td>
                                        )}
                                        {columns.find(c => c.key === 'parentPhone')?.visible && (
                                            <td className="phone-cell">
                                                {student.parentPhone ? (
                                                    <span className="phone-number">
                                                        <Phone size={14} />
                                                        {student.parentPhone}
                                                    </span>
                                                ) : '-'}
                                            </td>
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {processedStudents.length === 0 && (
                            <div className="empty-state">
                                <p>لا توجد نتائج مطابقة</p>
                            </div>
                        )}
                    </div>

                    {/* Footer Stats */}
                    <div className="table-footer">
                        <span>إجمالي النتائج: {processedStudents.length} طالب</span>
                    </div>
                </>
            )}
        </div>
    );
};
