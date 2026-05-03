-- ─── GovTrace Seed Data ──────────────────────────────────────────────────────
-- Run AFTER schema.sql

-- Citizens
insert into citizens values
  ('c1','AXVPS****K','Aditya Sharma',2400000,426000,120000,546000,'30%','Software Engineer','AS',true),
  ('c2','BQRPM****J','Priya Mehta',4200000,1005000,210000,1215000,'30%','Doctor','PM',true),
  ('c3','CJKTN****R','Rajan Kumar',8500000,2310000,425000,2735000,'30%','Business Owner','RK',true),
  ('c4','DLWSD****N','Sunita Devi',800000,37500,40000,77500,'10%','Government Teacher','SD',true),
  ('c5','EMHVP****L','Vikram Patel',3500000,795000,175000,970000,'30%','Lawyer','VP',true),
  ('c6','FNXAR****G','Ananya Rao',2800000,546000,140000,686000,'30%','Architect','AR',true),
  ('c7','GPQMS****H','Mohammed Siddiqui',4500000,1095000,225000,1320000,'30%','Banker','MS',true),
  ('c8','HRTLK****F','Lakshmi Reddy',3200000,696000,160000,856000,'30%','IT Professional','LR',true),
  ('c9','ISVNB****C','Suresh Nair',5500000,1395000,275000,1670000,'30%','Management Consultant','SN',true),
  ('c10','JYWCK****M','Deepa Krishnan',1800000,246000,90000,336000,'20%','University Professor','DK',true);

-- Representatives
insert into representatives values
  ('r1','ward','Raj Kumar Singh','BJP','Hoodi Ward','BBMP',42800000,0.0023,'2022-03-15','2022–2027','RK','Third-term BBMP Corporator. Former resident welfare association president. Focuses on local infrastructure and sanitation.'),
  ('r2','assembly','Byramanagala Ramesh','INC','Krishnarajapura','Karnataka Vidhan Sabha',1840000000,0.0044,'2023-05-10','2023–2028','BR','First-term MLA. Former BBMP Engineer. Focuses on urban infrastructure, traffic decongestion, and youth employment.'),
  ('r3','ls','C.N. Manjunath','BJP','Bangalore East','Lok Sabha',9200000000,0.0018,'2024-06-04','2024–2029','CM','Two-term MP. Former cardiologist turned politician. Serves on the Parliamentary Standing Committee on Health & Family Welfare.'),
  ('r4','rs','G.C. Chandrashekar','INC','Karnataka','Rajya Sabha',187000000000,0.0009,'2022-04-01','2022–2028','GC','Rajya Sabha MP. Economist and former RBI advisor. Focuses on fiscal policy, digital infrastructure, and financial inclusion.');

-- Bills
insert into bills values
  ('b1','Ward Infrastructure Development Plan 2024–25','2024-12-14','ward','Annual development plan approving ₹12 Cr allocation for roads, drainage, parks, and street lighting in Hoodi Ward.','aye','r1',142,18,4,'passed'),
  ('b2','BBMP Property Tax (Amendment) Resolution 2024','2024-11-22','ward','Resolution supporting the revised property tax guidance values for East Bengaluru wards, effective from April 2025.','aye','r1',128,42,10,'passed'),
  ('b3','Karnataka Fiscal Responsibility Amendment Bill 2024','2024-03-18','assembly','Amends the Karnataka Fiscal Responsibility Act to raise the state borrowing ceiling by 0.5% of GSDP and create a Urban Infrastructure Fund.','aye','r2',137,85,2,'passed'),
  ('b4','Karnataka Rent Control (Amendment) Bill 2024','2024-01-30','assembly','Proposed amendments to the Karnataka Rent Control Act to cap annual rent increases at 5% and extend tenant protection periods.','nay','r2',88,136,0,'failed'),
  ('b5','Karnataka Prevention of Slaughter & Preservation of Animals Bill 2024','2024-02-12','assembly','Bill to amend cattle slaughter regulations and strengthen provisions for animal preservation across Karnataka.','aye','r2',141,83,0,'passed'),
  ('b6','Finance Bill 2024','2024-07-23','ls','Union Budget finance bill implementing revised income tax slabs under the new regime, LTCG changes, and infrastructure cess.','aye','r3',293,235,14,'passed'),
  ('b7','Waqf (Amendment) Bill 2024','2024-08-08','ls','Amends the Waqf Act 1995 to strengthen government oversight of Waqf properties, introduce digital registration, and update survey procedures.','aye','r3',288,232,22,'passed'),
  ('b8','Digital Personal Data Protection Act 2023','2023-08-11','ls','Establishes a comprehensive framework for digital personal data protection, consent mechanisms, and the Data Protection Board of India.','aye','r3',312,88,42,'passed');

-- Spending items
insert into spending_items values
  ('s1','Roads & Infrastructure',28,12000000,'#FF9933'),
  ('s2','Public Health',22,9400000,'#D32F2F'),
  ('s3','Education',18,7700000,'#000080'),
  ('s4','Water & Sanitation',15,6400000,'#138808'),
  ('s5','Public Safety & Lighting',10,4300000,'#6b7280'),
  ('s6','Administration & Salaries',7,3000000,'#9ca3af');

-- Spending line items
insert into spending_line_items values
  ('s1-1','s1','Hoodi Main Road Widening (Phase 2)',4200000,35,'Under Construction',340,'KRDCL Infrastructure Ltd','#',38,24,18),
  ('s1-2','s1','Kacharakanahalli Flyover',5800000,48,'Tendered',120,'Tender Open — L1 evaluation pending','#',12,28,8),
  ('s1-3','s1','Ward Office Approach Road Repair',450000,4,'Completed',89,'Srinivasa Civil Works','#',62,8,3),
  ('s1-4','s1','Storm Water Drain Upgrade — Sector 4',1550000,13,'Stalled',421,'BV Constructions','#',4,12,72),
  ('s2-1','s2','Primary Health Centre Equipment Upgrade',1200000,13,'Completed',95,'Medline Healthcare Supplies','#',71,9,4),
  ('s2-2','s2','Mobile Medical Unit — Ward Coverage',850000,9,'Under Construction',210,'Ashwin Vehicle Conversions','#',22,31,14),
  ('s2-3','s2','Maternity & Child Health Centre Upgrade',2400000,26,'Allocated',180,'Procurement in progress','#',8,18,6),
  ('s2-4','s2','Annual Immunisation & Polio Drive',450000,5,'Completed',30,'BBMP Health Dept (Direct)','#',88,5,1),
  ('s2-5','s2','Dengue & Mosquito Control Programme',4500000,48,'Under Construction',60,'Karnataka State Health Dept','#',44,22,18),
  ('s3-1','s3','Govt. Primary School New Building — Hoodi',3200000,42,'Under Construction',520,'KSW Constructions Pvt Ltd','#',28,35,42),
  ('s3-2','s3','Digital Classroom Equipment — 6 Schools',1800000,23,'Completed',75,'Edutech Solutions Bangalore','#',78,10,2),
  ('s3-3','s3','Mid-Day Meal Programme 2023–24',550000,7,'Completed',365,'BBMP Nutrition Board','#',91,4,1),
  ('s3-4','s3','Ward Sports Complex & Playground',2150000,28,'Stalled',680,'Sapthagiri Infrastructure','#',3,9,84),
  ('s4-1','s4','Underground Drainage Network — Phase 3',3800000,59,'Under Construction',480,'BWSSB Direct Works','#',18,32,38),
  ('s4-2','s4','Overhead Water Tank — Kacharakanahalli',1600000,25,'Tendered',95,'L1 yet to be awarded','#',10,22,14),
  ('s4-3','s4','Public Toilet Blocks (6 nos.)',650000,10,'Completed',120,'Swachh Bharat Mission — BBMP','#',55,18,8),
  ('s4-4','s4','Solid Waste Segregation Infrastructure',350000,5,'Completed',45,'BBMP Solid Waste Mgmt','#',48,22,12),
  ('s5-1','s5','CCTV Surveillance Network — 48 cameras',1800000,42,'Under Construction',240,'Hikvision Authorised Integrator','#',62,18,8),
  ('s5-2','s5','LED Street Lighting Upgrade',1300000,30,'Completed',180,'Philips Lighting India Ltd','#',82,10,3),
  ('s5-3','s5','Ward Fire Safety Equipment',1200000,28,'Allocated',150,'Procurement in progress','#',14,28,6),
  ('s6-1','s6','Ward Office Staff Salaries & Allowances',2200000,73,'Completed',365,'BBMP HR Division','#',42,24,12),
  ('s6-2','s6','IT Systems & Record Digitisation',500000,17,'Under Construction',90,'NIC Karnataka','#',38,28,8),
  ('s6-3','s6','Ward Office Renovation',300000,10,'Completed',60,'Srinivasa Civil Works','#',28,14,4);

-- Budget vs Actuals
insert into budget_actuals values
  ('ba1','Roads & Infrastructure',12000000,10820000,'#FF9933'),
  ('ba2','Public Health',9400000,10110000,'#D32F2F'),
  ('ba3','Education',7700000,7595000,'#000080'),
  ('ba4','Water & Sanitation',6400000,7190000,'#138808'),
  ('ba5','Public Safety',4300000,4010000,'#6b7280'),
  ('ba6','Administration',3000000,3095000,'#9ca3af');

-- Agenda items
insert into agenda_items values
  ('ag1','Install speed bumps and pedestrian crossings on Hoodi Gate Road','Three accident-prone stretches near the school zone and market area need immediate traffic calming measures.','AXVPS****K','ward',4820000),
  ('ag2','Build community centre with library in Kacharakanahalli Layout','Layout has no common meeting space. Propose a 2,000 sq ft multi-purpose hall with a small reading room.','BQRPM****J','ward',3210000),
  ('ag3','Plant 500 trees and install benches along ITPL Main Road median','The 3 km stretch has no shade. A green median with seating will reduce heat island effect and improve walkability.','FNXAR****G','ward',2640000),
  ('ag4','Set up anganwadi centre in Srinivasa Nagar sub-locality','Nearest anganwadi is 2.4 km away. 180+ children in the sub-locality are underserved.','DLWSD****N','assembly',18400000),
  ('ag5','Increase BMTC bus frequency on KR Puram–Mahadevapura Route 313K','Current headway is 35 minutes at peak hours. Request reduction to 12 minutes and addition of 4 buses.','HRTLK****F','assembly',12800000);

-- Manifesto promises
insert into manifesto_promises values
  ('mp1','r2','Construct two flyovers to reduce traffic congestion at KR Puram and Mahadevapura junctions','allocated','DPR approved by BDA in Oct 2024. Land acquisition underway. Construction expected Q3 2025.',4,18,22),
  ('mp2','r2','Upgrade all 45 government schools in constituency with smart boards and computer labs','partial','22 of 45 schools completed. Remaining 23 schools in progress — pending ₹2.4 Cr state grant release.',28,54,12),
  ('mp3','r2','Provide free public Wi-Fi at 50 locations including bus stops, parks, and markets','delivered','52 hotspots live as of January 2024. Managed by BSNL. Average uptime 94%.',112,22,8),
  ('mp4','r2','Ensure 24x7 piped water supply to all 28,000 households in constituency','not','BWSSB confirms average daily supply of 8–10 hours. UGD Phase 3 pipeline incomplete.',6,24,138),
  ('mp5','r2','Build a new BMTC bus depot at KR Puram to improve east Bengaluru bus operations','allocated','Land identified near KR Puram railway station. BMTC board approved in Feb 2024. Tender pending.',2,14,28),
  ('mp6','r2','Conduct monthly health camps for senior citizens in every ward','delivered','Health camps running since June 2023. 9,800+ seniors covered across 14 wards. Verified by PHC records.',98,18,4),
  ('mp7','r2','Install 500 additional street lights in dark stretches across the constituency','delivered','523 LED lights installed by Dec 2023. Location data on BBMP StreetLight portal.',88,14,6),
  ('mp8','r2','Set up a skill development and vocational training centre for unemployed youth','partial','Centre opened at KR Puram in Aug 2024 with 3 trade courses. 8 more courses promised but not started.',24,62,18);

-- Comments
insert into comments (id, thread_id, masked_pan_id, name, avatar_initials, tax_contribution, text, weighted_upvotes, created_at) values
  ('cmt1','ag1','CJKTN****R','Rajan Kumar','RK',2735000,'My kids go to school on this road. Three accidents last month alone. This is long overdue — please prioritise the stretch near GEAR School first.',74800,'2024-11-12T09:14:00Z'),
  ('cmt2','ag1','EMHVP****L','Vikram Patel','VP',970000,'Speed bumps alone won''t help unless the street lights are also fixed. Combination of both would be far more effective.',41200,'2024-11-13T14:22:00Z'),
  ('cmt3','ag1','DLWSD****N','Sunita Devi','SD',77500,'As a resident near the market, I fully support this. The junction near Hoodi Gate is especially dangerous in the morning rush.',8200,'2024-11-14T08:55:00Z'),
  ('cmt4','ag2','GPQMS****H','Mohammed Siddiqui','MS',1320000,'A community centre is exactly what the layout needs. Also request a small amphitheatre for cultural events.',28400,'2024-11-08T11:30:00Z'),
  ('cmt5','ag2','ISVNB****C','Suresh Nair','SN',1670000,'Good idea but please ensure disabled access and proper ventilation. Previous BBMP buildings have been poor quality.',22100,'2024-11-09T16:45:00Z'),
  ('cmt6','ag3','HRTLK****F','Lakshmi Reddy','LR',856000,'The median trees are a great idea. Would also suggest native species like neem and peepal that require minimal maintenance.',18600,'2024-11-05T10:20:00Z');

-- Notifications
insert into notifications values
  ('n1','bill',false,'2024-08-08T14:30:00Z','Your MP voted on Waqf (Amendment) Bill','C.N. Manjunath voted AYE. Bill passed 288–232. Your constituency vote weight: 0.0059%.','/bills'),
  ('n2','status',false,'2024-10-22T09:15:00Z','Project status change: Hoodi Main Road Widening','Status updated from Tendered → Under Construction. Contractor: KRDCL Infrastructure Ltd.','/spending'),
  ('n3','agenda',true,'2024-11-12T08:00:00Z','New ward agenda item raised','"Install speed bumps on Hoodi Gate Road" raised by AXVPS****K. 24 citizens have backed it.','/agenda'),
  ('n4','bill',true,'2024-07-23T17:00:00Z','Finance Bill 2024 passed in Lok Sabha','C.N. Manjunath voted AYE. New income tax slabs effective FY 2024–25.','/bills'),
  ('n5','agenda',true,'2024-11-01T11:00:00Z','New assembly agenda item','"Increase BMTC bus frequency on Route 313K" — 48 citizens backing with 12.8M weighted votes.','/agenda');

-- Forum agenda
insert into forum_agenda values
  ('f1','Speed bumps and pedestrian safety on Hoodi Gate Road','Top priority across all tax brackets. School zone safety is the single most consistent demand from ward citizens.','ward',3240,'Multiple citizens'),
  ('f2','Complete the stalled Sports Complex construction','680+ days stalled. Citizens demand accountability from contractor and BBMP. High weighted-vote support across income groups.','ward',2810,'Multiple citizens'),
  ('f3','Upgrade UGD drainage to prevent flooding in Sector 4','Storm water drain stalled for 421 days. Annual monsoon flooding disrupts 1,200+ households.','ward',2450,'Multiple citizens'),
  ('f4','Ensure 24x7 water supply — MLA manifesto promise unfulfilled','Only 8–10 hours supply daily vs manifesto promise of 24x7. Citizens demand accountability.','assembly',2180,'Multiple citizens'),
  ('f5','Set up anganwadi in Srinivasa Nagar','180+ children underserved. Nearest centre is 2.4 km away. Strong support from lower income brackets.','assembly',1920,'Multiple citizens'),
  ('f6','Fly over construction — KR Puram junction','Traffic congestion at KR Puram junction is the worst in the constituency. DPR approved but work not started.','assembly',1680,'Multiple citizens');
