// Mock Data for Distribution module

// Modules per stage
export const STAGE_MODULES = {
    p: ['لغة عربية', 'رياضيات', 'تربية إسلامية'],
    m: ['لغة عربية', 'رياضيات', 'علوم', 'فرنسية', 'إنجليزية', 'تاريخ', 'تربية إسلامية', 'تربية بدنية', 'تربية فنية'],
    pr: ['مربي']
};

export const MOCK_CLASSES = [
    {
        id: '1p_A',
        name: 'الأولى ابتدائي أ',
        stage: 'p',
        level: '1',
        maxCapacity: 30,
        enrolled: 28,
        male: 15,
        female: 13,
        avgLevel: 'متوسط',
        // module -> teacher assignment (null = unassigned)
        assignments: {
            'لغة عربية': null,
            'رياضيات': null,
            'تربية إسلامية': null
        },
        students: [
            { id: 's1', name: 'أحمد علي' },
            { id: 's2', name: 'ليلى مراد' },
            { id: 's3', name: 'يوسف خالد' },
            { id: 's4', name: 'فاطمة الزهراء' }
        ]
    },
    {
        id: '1p_B',
        name: 'الأولى ابتدائي ب',
        stage: 'p',
        level: '1',
        maxCapacity: 30,
        enrolled: 31,
        male: 20,
        female: 11,
        avgLevel: 'جيد',
        assignments: {
            'لغة عربية': { id: 'at1', name: 'أ. خديجة أحمد' },
            'رياضيات': { id: 'at2', name: 'أ. محمد علي' },
            'تربية إسلامية': null
        },
        students: [
            { id: 's5', name: 'سمير جلال' },
            { id: 's6', name: 'منى حسن' },
            { id: 's7', name: 'كمال ياسين' }
        ]
    },
    {
        id: 'pr_A',
        name: 'التحضيري أ',
        stage: 'pr',
        level: 'pr',
        maxCapacity: 25,
        enrolled: 20,
        male: 10,
        female: 10,
        avgLevel: 'متوسط',
        maxAgeGap: '4 أشهر',
        assignments: {
            'مربي': { id: 'at3', name: 'أ. سلمى محمد' }
        },
        students: [
            { id: 's8', name: 'نور الهدى' },
            { id: 's9', name: 'رامي سعيد' }
        ]
    },
    {
        id: 'm_1_A',
        name: 'الأولى متوسط أ',
        stage: 'm',
        level: '1',
        maxCapacity: 35,
        enrolled: 35,
        male: 18,
        female: 17,
        avgLevel: 'جيد جدا',
        assignments: {
            'لغة عربية': null,
            'رياضيات': null,
            'علوم': { id: 'at4', name: 'أ. ياسين كمال' },
            'فرنسية': { id: 'at5', name: 'أ. ليلى حسن' },
            'إنجليزية': null,
            'تاريخ': { id: 'at6', name: 'أ. سمير خالد' },
            'تربية إسلامية': null,
            'تربية بدنية': null,
            'تربية فنية': null
        },
        students: [
            { id: 's10', name: 'عمر المختار' },
            { id: 's11', name: 'سناء عيسى' },
            { id: 's12', name: 'بلال نبيل' }
        ]
    },
];

// Helper to get teachers array from assignments (for backward compat with Manual page)
export const getTeachersFromAssignments = (assignments) => {
    if (!assignments) return [];
    return Object.entries(assignments)
        .filter(([, teacher]) => teacher !== null)
        .map(([subject, teacher]) => ({ ...teacher, subject }));
};

// All available teachers with their module specialization
export const MOCK_ALL_TEACHERS = [
    { id: 't1', name: 'أ. يوسف محمود', subject: 'لغة عربية', stages: ['p'], exp: '5 سنوات' },
    { id: 't2', name: 'أ. فاطمة علي', subject: 'رياضيات', stages: ['p'], exp: '10 سنوات' },
    { id: 't3', name: 'أ. حسين سعيد', subject: 'لغة عربية', stages: ['p', 'm'], exp: '8 سنوات' },
    { id: 't4', name: 'أ. نادية كمال', subject: 'فرنسية', stages: ['p', 'm'], exp: '6 سنوات' },
    { id: 't5', name: 'أ. عمار بن يحيى', subject: 'رياضيات', stages: ['m'], exp: '12 سنوات' },
    { id: 't6', name: 'أ. سارة حمدي', subject: 'علوم', stages: ['m'], exp: '4 سنوات' },
    { id: 't7', name: 'أ. رشيد بوعلام', subject: 'تاريخ', stages: ['m'], exp: '15 سنوات' },
    { id: 't8', name: 'أ. أمينة خالد', subject: 'تربية إسلامية', stages: ['p', 'm'], exp: '7 سنوات' },
    { id: 't9', name: 'أ. كريم جلول', subject: 'تربية بدنية', stages: ['p', 'm'], exp: '3 سنوات' },
    { id: 't10', name: 'أ. وردة بلقاسم', subject: 'مربي', stages: ['pr'], exp: '9 سنوات' },
    { id: 't11', name: 'أ. جمال عيسى', subject: 'إنجليزية', stages: ['m'], exp: '2 سنوات' },
    { id: 't12', name: 'أ. هدى مراد', subject: 'تربية فنية', stages: ['p', 'm'], exp: '11 سنوات' },
    { id: 't13', name: 'أ. مريم بن علي', subject: 'لغة عربية', stages: ['m'], exp: '7 سنوات' },
    { id: 't14', name: 'أ. طارق مسعود', subject: 'رياضيات', stages: ['p', 'm'], exp: '9 سنوات' },
];

// Keep for backward compat
export const MOCK_UNASSIGNED_TEACHERS = [
    { id: 't1', name: 'أ. يوسف محمود', exp: '5 سنوات', pref: 'صباحي' },
    { id: 't2', name: 'أ. فاطمة علي', exp: '10 سنوات', pref: 'بدون تفضيل' },
];
