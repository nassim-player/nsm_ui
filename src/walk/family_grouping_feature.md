# Registration Requests - Family Grouping Feature

## Overview
Restructured the registration requests view to display individual students grouped by family, rather than showing one row per parent application.

## Implementation Changes

### **Backend (API) Changes**

#### `registrationRequests.php`
- Changed from parent-centric to student-centric data structure
- Each row now represents a **single student**
- Added family identification logic
- Uses `INNER JOIN` instead of `LEFT JOIN` to ensure only students with data are shown

#### New Data Fields Returned:
```json
{
    "id": 123,                           // Student ID
    "applicationNumber": "User12345678",  // Parent's application number
    "parentId": 45,                       // Parent ID for grouping
    "familyName": "عائلة أحمد",           // Family identifier
    "studentName": "محمد أحمد علي",      // Student full name
    "studentGender": "ذكر",               // Gender
    "studentBirthday": "2015-05-20",     // Birthday
    "requestedGrade": "السنة الأولى",     // Requested grade
    "parentName": "أحمد علي",            // Parent full name
    "phone": "0551234567",                // Contact phone
    "submissionDate": "2026-02-10",       // Registration date
    "status": "pending"                   // Current status
}
```

### **Frontend Changes**

#### New Column Structure:
| Column | Width | Description |
|--------|-------|-------------|
| **العائلة** (Family) | 150px | Family badge showing "عائلة {parent-first-name}" |
| **اسم التلميذ** (Student Name) | 200px | Individual student name |
| **الجنس** (Gender) | 80px | Student gender |
| **المستوى** (Grade) | 120px | Requested grade level |
| **اسم الولي** (Parent Name) | 180px | Parent/guardian full name |
| **الهاتف** (Phone) | 140px | Contact phone number |
| **تاريخ التسجيل** (Date) | 130px | Submission date |
| **الحالة** (Status) | 120px | Application status |

#### Family Badge Styling:
- **Blue gradient background** (#3b82f6 → #2563eb)
- **Family emoji icon** (👨‍👩‍👧‍👦)
- **Rounded pill shape** with shadow
- **White text** for contrast

### **Key Features**

✅ **Individual Student Rows**: Each student gets their own row
✅ **Family Grouping**: Students from the same parent are visually grouped
✅ **Family Nickname**: Uses parent's first name for easy identification
✅ **Enhanced Search**: Search by family name, student name, parent name, phone, or grade
✅ **Better Data Visibility**: See all student details at a glance

### **Data Flow**

```
Database Tables (reg_parent + reg_student)
            ↓
    INNER JOIN on parent_id
            ↓
One row per student with parent info
            ↓
Family grouping by parentId
            ↓
Display in table with family badges
```

### **Example Display**

```
┌─────────────────────────────────────────────────────────────────┐
│ العائلة        │ اسم التلميذ    │ الجنس │ المستوى      │ ...  │
├─────────────────────────────────────────────────────────────────┤
│ 👨‍👩‍👧‍👦 عائلة أحمد │ محمد أحمد علي  │ ذكر   │ السنة الأولى │ ...  │
│ 👨‍👩‍👧‍👦 عائلة أحمد │ فاطمة أحمد علي │ أنثى  │ السنة الثالثة│ ...  │
│ 👨‍👩‍👧‍👦 عائلة سعيد  │ عمر سعيد حسن   │ ذكر   │ السنة الثانية│ ...  │
└─────────────────────────────────────────────────────────────────┘
```

### **Benefits**

1. **Clear Student View**: Admin can see each student individually
2. **Family Context**: Still understand family relationships via badges
3. **Better Sorting**: Can sort by student name, grade, etc.
4. **Improved Search**: Find specific students easily
5. **Accurate Count**: Footer shows actual number of students registered

### **Future Enhancements**

- [ ] Add row grouping/collapsing by family
- [ ] Color-code families with different badge colors
- [ ] Add "siblings" count badge
- [ ] Click family badge to filter by that family
- [ ] Add parent details modal when clicking parent name
