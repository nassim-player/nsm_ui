# 📋 Registration System — Database Report

> **Generated:** 2026-02-10  
> **Database:** `u515444634_elfadilaSQL`  
> **Host:** `srv1423.hstgr.io`  
> **User:** `u515444634_elfadilaSQL`  
> **API Endpoint:** `/api/registerStudent.php`

---

## 🔗 Database Connection

```php
$host = "srv1423.hstgr.io";
$user = "u515444634_elfadilaSQL";
$pass = "nsm0002007@Elfadila";
$db   = "u515444634_elfadilaSQL";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");
```

---

## 📊 Tables Overview

The registration system uses **2 tables** linked by a parent-child relationship:

| Table | Purpose | Relationship |
|---|---|---|
| `reg_parent` | Stores parent/guardian data + family info | Primary (1) |
| `reg_student` | Stores student data | Child (Many) → `reg_parent.id` |

---

## 🟢 Table 1: `reg_parent`

Stores all parent, guardian, and family information in a single record per registration.

### Columns

| # | Column | Type | Required | Description (AR) |
|---|---|---|---|---|
| 1 | `id` | INT (AUTO_INCREMENT, PK) | Auto | المعرف الفريد |
| 2 | `application_number` | VARCHAR(50) | ✅ | رقم الطلب (مثال: User12345678) |
| — | **بيانات الأب** | — | — | — |
| 3 | `father_status` | VARCHAR | ✅ | حالة الأب (alive / deceased / unknown) |
| 4 | `father_first_name_ar` | VARCHAR | ❌ (إختياري) | إسم الأب بالعربية |
| 5 | `father_first_name_lat` | VARCHAR | ❌ (إختياري) | إسم الأب باللاتينية |
| 6 | `father_last_name_ar` | VARCHAR | ❌ (إختياري) | لقب الأب بالعربية |
| 7 | `father_last_name_lat` | VARCHAR | ❌ (إختياري) | لقب الأب باللاتينية |
| 8 | `father_job` | VARCHAR | ❌ (إختياري) | مهنة الأب |
| 9 | `father_phone` | VARCHAR | ❌ (إختياري) | هاتف الأب |
| 10 | `father_email` | VARCHAR | ❌ (إختياري) | بريد الأب الإلكتروني |
| — | **بيانات الأم** | — | — | — |
| 11 | `mother_status` | VARCHAR | ✅ | حالة الأم (alive / deceased / unknown) |
| 12 | `mother_first_name_ar` | VARCHAR | ❌ (إختياري) | إسم الأم بالعربية |
| 13 | `mother_first_name_lat` | VARCHAR | ❌ (إختياري) | إسم الأم باللاتينية |
| 14 | `mother_last_name_ar` | VARCHAR | ❌ (إختياري) | لقب الأم بالعربية |
| 15 | `mother_last_name_lat` | VARCHAR | ❌ (إختياري) | لقب الأم باللاتينية |
| 16 | `mother_job` | VARCHAR | ❌ (إختياري) | مهنة الأم |
| 17 | `mother_phone` | VARCHAR | ❌ (إختياري) | هاتف الأم |
| 18 | `mother_email` | VARCHAR | ❌ (إختياري) | بريد الأم الإلكتروني |
| — | **بيانات الولي/مقدم الطلب** | — | — | — |
| 19 | `primary_role` | VARCHAR | ✅ | صلة مقدم الطلب (father / mother / guardian) |
| 20 | `guardian_relation` | VARCHAR | شرطي | العلاقة بالتلميذ (كفيل / جد / عم / أخ / آخر) |
| 21 | `guardian_relation_other` | VARCHAR | ❌ | تفاصيل العلاقة إذا اختار "آخر" |
| 22 | `is_unknown_parentage` | VARCHAR | شرطي | مجهول النسب (yes / no) — يظهر فقط عند اختيار كفيل |
| 23 | `guardian_first_name_ar` | VARCHAR | شرطي | إسم الولي بالعربية |
| 24 | `guardian_first_name_lat` | VARCHAR | شرطي | إسم الولي باللاتينية |
| 25 | `guardian_last_name_ar` | VARCHAR | شرطي | لقب الولي بالعربية |
| 26 | `guardian_last_name_lat` | VARCHAR | شرطي | لقب الولي باللاتينية |
| 27 | `guardian_job` | VARCHAR | شرطي | مهنة الولي |
| 28 | `guardian_phone` | VARCHAR | شرطي | هاتف الولي |
| 29 | `guardian_email` | VARCHAR | شرطي | بريد الولي الإلكتروني |
| — | **بيانات العائلة والسكن** | — | — | — |
| 30 | `family_members` | INT | ✅ | عدد أفراد الأسرة |
| 31 | `family_status` | VARCHAR | شرطي | الحالة العائلية (متزوجان / مطلقان) — مخفي عند اختيار كفيل |
| 32 | `address` | VARCHAR | ✅ | عنوان السكن الحالي |
| — | **الإستبيان (إختياري)** | — | — | — |
| 33 | `discovery_source` | VARCHAR | ❌ | كيف سمعت بالمدرسة |
| 34 | `reason_for_choice` | TEXT | ❌ | سبب اختيار المدرسة |
| 35 | `additional_requests` | TEXT | ❌ | ملاحظات إضافية |

> **ملاحظة:** بيانات الولي المسئوول (primary) تُخزن في حقول الأب أو الأم حسب `primary_role`. إذا كان الولي "guardian"، تُخزن بياناته في حقول `guardian_*`.

---

## 🔵 Table 2: `reg_student`

Stores individual student data. Multiple students can be linked to one parent record (up to 5).

### Columns

| # | Column | Type | Required | Description (AR) |
|---|---|---|---|---|
| 1 | `id` | INT (AUTO_INCREMENT, PK) | Auto | المعرف الفريد |
| 2 | `parent_id` | INT (FK → reg_parent.id) | ✅ | مفتاح أجنبي لسجل الولي |
| — | **المعلومات الشخصية** | — | — | — |
| 3 | `first_name` | VARCHAR | ✅ | إسم التلميذ بالعربية |
| 4 | `first_name_lat` | VARCHAR | ✅ | إسم التلميذ باللاتينية |
| 5 | `last_name` | VARCHAR | ✅ | لقب التلميذ بالعربية |
| 6 | `last_name_lat` | VARCHAR | ✅ | لقب التلميذ باللاتينية |
| 7 | `birthday` | DATE | ✅ | تاريخ الميلاد |
| 8 | `birth_city` | VARCHAR | ✅ | بلدية الميلاد |
| 9 | `birth_wilaya` | VARCHAR | ✅ | ولاية الميلاد |
| 10 | `gender` | VARCHAR | ✅ | الجنس (ذكر / أنثى) |
| 11 | `nationality` | VARCHAR | ✅ | الجنسية |
| — | **المعلومات الدراسية** | — | — | — |
| 12 | `current_grade` | VARCHAR | ❌ | المستوى الدراسي الحالي |
| 13 | `requested_grade` | VARCHAR | ✅ | المستوى المطلوب |
| 14 | `repeater` | VARCHAR | ✅ | هل هو معيد (نعم / لا) |
| 15 | `previous_school` | VARCHAR | ✅ | المدرسة السابقة |
| 16 | `term_1_result` | VARCHAR | ✅ | نتيجة الفصل الأول |
| 17 | `term_2_result` | VARCHAR | ✅ | نتيجة الفصل الثاني |
| 18 | `term_3_result` | VARCHAR | ✅ | نتيجة الفصل الثالث |
| 19 | `studied_elsewhere` | VARCHAR | ✅ | هل درس في مدرسة أخرى (نعم / لا) |
| 20 | `studied_here_before` | VARCHAR | ✅ | هل درس في مدرستنا سابقاً (نعم / لا) |
| — | **الحالة الصحية** | — | — | — |
| 21 | `medical_status` | TEXT | ✅ | أمراض مزمنة أو مشاكل نفسية |
| 22 | `medical_special` | TEXT | ✅ | إعاقات أو إحتياجات خاصة |
| 23 | `medical_surgery` | VARCHAR | ✅ | هل خضع لعمليات جراحية (نعم / لا) |
| 24 | `surgery_year` | INT | شرطي | سنة إجراء العملية (يظهر إذا medical_surgery = نعم) |
| 25 | `surgery_details` | TEXT | شرطي | نوع العملية (يظهر إذا medical_surgery = نعم) |
| 26 | `food_allergy` | VARCHAR | ✅ | حساسية أغذية (نعم / لا) |
| 27 | `food_allergy_details` | TEXT | شرطي | تفاصيل الحساسية (يظهر إذا food_allergy = نعم) |
| 28 | `blood_type` | VARCHAR | ✅ | فصيلة الدم (A+ / A- / B+ / B- / AB+ / AB- / O+ / O- / غير معروف) |
| 29 | `weight` | VARCHAR | ✅ | الوزن (كلغ) |
| 30 | `height` | VARCHAR | ✅ | الطول (سم) |
| 31 | `needs_special_care` | VARCHAR | ✅ | هل يحتاج رعاية خاصة (نعم / لا) |
| 32 | `takes_medication` | VARCHAR | ✅ | هل يتناول أدوية مستمرة (نعم / لا) |
| — | **خدمة النقل** | — | — | — |
| 33 | `needs_bus` | VARCHAR | ✅ | هل يحتاج خدمة النقل (نعم / لا) |
| 34 | `bus_line` | VARCHAR | شرطي | خط النقل (يظهر إذا needs_bus = نعم) |
| — | **ملاحظات** | — | — | — |
| 35 | `notes` | TEXT | ❌ | ملاحظات إضافية |

---

## 🔄 Data Flow Summary

```
[Frontend Form]  →  POST /api/registerStudent.php  →  [Database]

1. JSON Payload received
2. Turnstile verification (currently DISABLED for testing)
3. Transaction begins
4. INSERT INTO reg_parent (1 record)
5. INSERT INTO reg_student (1-5 records, linked by parent_id)
6. Transaction committed
7. Response: { success: true, application_number: "UserXXXXXXXX" }
```

---

## 📈 Total Fields Collected

| Category | Fields Count |
|---|---|
| 🔑 Application Number | 1 |
| 👨 Father Info | 8 (all optional if not primary) |
| 👩 Mother Info | 8 (all optional if not primary) |
| 👤 Guardian Info | 9 (conditional) |
| 🏠 Family & Address | 3 |
| 📝 Survey (Optional) | 3 |
| 👦 Student Personal | 9 per student |
| 📚 Student Academic | 8 per student |
| 🏥 Student Health | 12 per student |
| 🚌 Student Transport | 2 per student |
| 📋 Student Notes | 1 per student |
| **Total (1 parent + 1 student)** | **~64 fields** |
| **Total (1 parent + 5 students)** | **~192 fields** |

---

## ⚠️ Notes

- **Turnstile Security** is currently **DISABLED** for testing. Must be re-enabled before production.
- **Secondary parent info** (father/mother not being the primary contact) is **optional**.
- **Family Status** field is **hidden** when the primary contact's relationship is "كفيل" (Sponsor).
- **Conditional fields** (surgery details, allergy details, bus line) only appear and are required when their parent toggle is set to "نعم".
- All data is sanitized via `mysqli::real_escape_string()` and uses prepared statements with `bind_param()`.
