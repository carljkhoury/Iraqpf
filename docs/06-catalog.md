# Initial Catalog: Categories, Attributes, Amenities, Deed Types

> Status: **Draft by Claude, to be reviewed by the Iraq team (E-03, E-04).** Everything here is admin-editable after launch; this is only the starting seed data.

## 1. Purposes (transaction types)

| Key | Arabic | English | Applies to |
|-----|--------|---------|-----------|
| `sale` | للبيع | For sale | All categories |
| `rent` | للإيجار | For rent | All except land (configurable) |
| `key_money` | سرقفلية | Key money (goodwill transfer) | Shops, showrooms, offices (E-06) |

## 2. Categories

| Group | Key | Arabic | English | Purposes |
|-------|-----|--------|---------|----------|
| **Residential** سكني | `apartment` | شقة | Apartment | sale, rent |
| | `house` | بيت | House | sale, rent |
| | `villa` | فيلا | Villa | sale, rent |
| | `floor` | طابق | Floor (part of a house) | sale, rent |
| | `annex` | مشتمل | Annex unit | rent, sale |
| | `residential_building` | عمارة سكنية | Residential building | sale, rent |
| | `residential_land` | أرض سكنية | Residential land | sale |
| **Commercial** تجاري | `office` | مكتب | Office | sale, rent, key_money |
| | `shop` | محل تجاري | Shop | sale, rent, key_money |
| | `showroom` | معرض | Showroom | sale, rent, key_money |
| | `warehouse` | مخزن | Warehouse | sale, rent |
| | `commercial_building` | عمارة تجارية | Commercial building | sale, rent |
| | `commercial_land` | أرض تجارية | Commercial land | sale, rent |
| | `hotel` | فندق | Hotel | sale, rent |
| | `factory` | معمل | Factory / workshop | sale, rent |
| | `other_commercial` | تجاري آخر | Other commercial | sale, rent |
| **Land & agriculture** أراضي وزراعي | `agricultural_land` | أرض زراعية | Agricultural land | sale, rent |
| | `farm` | بستان / مزرعة | Farm / orchard | sale, rent |
| | `industrial_land` | أرض صناعية | Industrial land | sale, rent |

**Search shortcuts on the homepage:** *Buy* (residential, sale), *Rent* (residential, rent), *Commercial* (commercial group, any purpose), *Land* (land categories + residential land).

## 3. Title deed types (E-03)

Required for sale listings.

| Key | Arabic | English | Note |
|-----|--------|---------|------|
| `tabu_sirf` | طابو صرف | Freehold title (Tabu) | Full registered ownership |
| `agricultural` | زراعي | Agricultural title | Building may not be legally permitted |
| `musha` | مشاع | Shared ownership (Musha') | Owned jointly; share unspecified |
| `investment` | استثمار | Investment | Investment-licence property |
| `contract` | عقد / حجة | Contract / informal deed | Not registered at the land registry |
| `allocation` | تخصيص | Government allocation | |
| `other` | أخرى | Other | |

## 4. Core attributes (typed columns, used in many categories)

✅ = shown & required, ○ = shown & optional, — = not shown

| Attribute | Apartment | House/Villa | Floor/Annex | Res. building | Res. land | Office | Shop/Showroom | Warehouse | Comm. building | Comm./Ind. land | Hotel/Factory | Agri land/Farm |
|-----------|---|---|---|---|---|---|---|---|---|---|---|---|
| Area (m²) | ✅ | ✅ (built) | ✅ | ✅ | — | ✅ | ✅ | ✅ | ✅ | — | ✅ | — |
| Plot area (m²/dunam/olk) | — | ✅ | — | ✅ | ✅ | — | — | ○ | ○ | ✅ | ○ | ✅ |
| Bedrooms | ✅ | ✅ | ✅ | — | — | — | — | — | — | — | — | — |
| Bathrooms | ✅ | ✅ | ✅ | ○ | — | ○ | ○ | ○ | ○ | — | — | — |
| Furnishing | ○ | ○ | ○ | — | — | ○ | — | — | — | — | — | — |
| Condition | ○ | ○ | ○ | ○ | — | ○ | ○ | ○ | ○ | — | ○ | — |
| Title deed | ✅ sale | ✅ sale | ✅ sale | ✅ sale | ✅ sale | ✅ sale | ✅ sale | ✅ sale | ✅ sale | ✅ sale | ✅ sale | ✅ sale |

## 5. Category-specific attributes (flexible, stored in `attributes`)

| Key | Arabic | English | Type | Categories | Filterable |
|-----|--------|---------|------|-----------|-----------|
| `floor_number` | الطابق | Floor number | int (0 = ground) | Apartment, office, floor | ✓ |
| `total_floors` | عدد الطوابق | Number of floors | int | House, villa, buildings, apartment (building floors) | ○ |
| `building_age` | عمر البناء | Building age | select: new, 1–5, 6–10, 11–20, 20+ years | Built property | ✓ |
| `frontage_m` | الواجهة | Frontage (m) | decimal | House, villa, land, shop, buildings | ○ |
| `depth_m` | النزال (العمق) | Depth (m) | decimal | House, villa, land, buildings | — |
| `street_width_m` | عرض الشارع | Street width (m) | decimal | House, villa, land, shop, buildings | ○ |
| `corner_plot` | ركن | Corner plot | boolean | House, villa, land, shop, buildings | ✓ |
| `facing` | الاتجاه | Facing direction | select: N, S, E, W, NE, NW, SE, SW | House, villa, land | ✓ |
| `number_of_streets` | عدد الشوارع | Streets bordering the property | int 1–4 | House, villa, land | — |
| `has_annex` | يوجد مشتمل | Includes annex | boolean | House, villa | ✓ |
| `living_rooms` | صالات | Living rooms | int | Apartment, house, villa | — |
| `kitchen_type` | نوع المطبخ | Kitchen | select: open, closed | Apartment, house, villa | — |
| `units_count` | عدد الوحدات | Number of units | int | Buildings | ○ |
| `occupancy` | الإشغال | Occupancy | select: vacant, tenanted | Sale of built property | ○ |
| `monthly_income` | الدخل الشهري | Current rental income | money | Buildings (sale) | — |
| `ceiling_height_m` | ارتفاع السقف | Ceiling height (m) | decimal | Warehouse, factory | ○ |
| `loading_access` | منفذ تحميل | Truck loading access | boolean | Warehouse, factory | ○ |
| `power_capacity` | القدرة الكهربائية | Power capacity (amps/kVA) | text | Warehouse, factory, office | — |
| `mezzanine` | ميزانين | Mezzanine | boolean | Shop, showroom | — |
| `land_use` | جنس الأرض | Land use (zoning) | select: residential, commercial, agricultural, industrial, mixed | Land | ✓ |
| `water_source` | مصدر المياه | Water source | multi: river, well, canal, network | Agricultural land, farm | ○ |
| `trees_count` | عدد الأشجار | Number of trees / palms | int | Farm | — |
| `has_farmhouse` | يوجد بيت ريفي | Has farmhouse | boolean | Farm | ○ |
| `deposit_amount` | التأمين | Security deposit | money | Rent | — |
| `available_from` | متاح من | Available from | date | Rent | — |

## 6. Amenities (yes/no features)

| Group | Amenities (Arabic / English) |
|-------|------------------------------|
| **Utilities** الخدمات | مولدة أهلية (اشتراك) / Neighbourhood generator subscription · خط ذهبي / Dedicated ("golden line") power · مولدة خاصة / Private generator · منظومة طاقة شمسية / Solar power system · خزان ماء / Water tank · بئر ماء / Water well · مقياس كهرباء مستقل / Separate electricity meter · مقياس ماء مستقل / Separate water meter · غاز مركزي / Central gas · إنترنت فايبر / Fibre internet |
| **Comfort** الراحة | تبريد مركزي / Central A/C · سبلت / Split A/C units · تدفئة مركزية / Central heating · مطبخ مجهز / Fitted kitchen · غرفة خادمة / Maid's room · غرفة سائق / Driver's room · مخزن / Storage room · بلكونة / Balcony · سطح / Roof access |
| **Outdoor** الخارج | حديقة / Garden · مسبح / Swimming pool · كراج / Garage · موقف سيارات / Parking · ساحة / Courtyard |
| **Building & security** البناية والأمان | مصعد / Elevator · حارس / Guard · كاميرات مراقبة / CCTV · مجمع سكني مسور / Gated compound · بوابة إلكترونية / Electronic gate · نظام إطفاء / Fire system |
| **Nearby** قريب من | مدرسة / School · مستشفى / Hospital · جامع / Mosque · سوق / Market · شارع رئيسي / Main road · جامعة / University |

## 7. Filters shown per search context

| Context | Filters (in order) |
|---------|--------------------|
| Residential buy | Location · Category · Price · Bedrooms · Bathrooms · Area · Title deed · Condition · Furnishing · Building age · Corner · Facing · Amenities |
| Residential rent | Location · Category · Price + period (monthly/yearly) · Bedrooms · Bathrooms · Furnishing · Tenant preference · Area · Amenities |
| Commercial | Location · Category · Purpose (sale/rent/key money) · Price · Area · Floor · Condition · Amenities |
| Land | Location · Category · Land use · Price (total or per m²) · Plot area · Title deed · Corner · Street width · Facing |
| Farms/agricultural | Location · Price · Plot area (dunam) · Water source · Title deed |

## 8. Questions for the Iraq team review

1. Is **olk** (أولك) used in your areas, and what conversion do people use? Is dunam always 2,500 m²?
2. Are the title deed types right? Anything missing (e.g. *نسق*, *أميرية*) or worded differently locally?
3. Is "النزال" the term people use for plot depth in Baghdad?
4. Are there common house layouts we should capture (e.g. *بيت عربي* vs *بيت حديث*, "ربع/نص بناء")?
5. Which amenities do buyers actually ask about first? (We'll show those on cards.)
