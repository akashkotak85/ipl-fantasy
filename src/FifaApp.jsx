/*
  FifaApp.jsx — FIFA World Cup 2026 Fantasy Predictor
  Firebase prefix: fifa26_
  Passwords shared with IPL: ipl26_pw_
  Tokens shared with IPL: ipl26_token_

  Scoring:
    Winner: 20pts | MOTM: 30pts | Goals Band: 10pts | All correct streak: 15pts
    Bonus Question: 15pts | Double match: 2×
  Season:
    Champion: 200pts | Top 4: 50pts each | Wooden Spoon: 50pts | Golden Boot: 100pts
*/

import * as React from "react";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ─── TEAMS ──────────────────────────────────────────────────── */
const TEAMS = [
  // Group A
  "Mexico","South Africa","South Korea","Czechia",
  // Group B
  "Canada","Bosnia and Herzegovina","Qatar","Switzerland",
  // Group C
  "Brazil","Morocco","Haiti","Scotland",
  // Group D
  "USA","Paraguay","Australia","Turkiye",
  // Group E
  "Germany","Curacao","Ivory Coast","Ecuador",
  // Group F
  "Netherlands","Japan","Sweden","Tunisia",
  // Group G
  "Belgium","Egypt","Iran","New Zealand",
  // Group H
  "Spain","Cape Verde","Saudi Arabia","Uruguay",
  // Group I
  "France","Senegal","Iraq","Norway",
  // Group J
  "Argentina","Algeria","Austria","Jordan",
  // Group K
  "Portugal","DR Congo","Uzbekistan","Colombia",
  // Group L
  "England","Croatia","Ghana","Panama",
];

const FLAGS = {
  Mexico:"🇲🇽","South Africa":"🇿🇦","South Korea":"🇰🇷",Czechia:"🇨🇿",
  Canada:"🇨🇦","Bosnia and Herzegovina":"🇧🇦",Qatar:"🇶🇦",Switzerland:"🇨🇭",
  Brazil:"🇧🇷",Morocco:"🇲🇦",Haiti:"🇭🇹",Scotland:"🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  USA:"🇺🇸",Paraguay:"🇵🇾",Australia:"🇦🇺",Turkiye:"🇹🇷",
  Germany:"🇩🇪",Curacao:"🇨🇼","Ivory Coast":"🇨🇮",Ecuador:"🇪🇨",
  Netherlands:"🇳🇱",Japan:"🇯🇵",Sweden:"🇸🇪",Tunisia:"🇹🇳",
  Belgium:"🇧🇪",Egypt:"🇪🇬",Iran:"🇮🇷","New Zealand":"🇳🇿",
  Spain:"🇪🇸","Cape Verde":"🇨🇻","Saudi Arabia":"🇸🇦",Uruguay:"🇺🇾",
  France:"🇫🇷",Senegal:"🇸🇳",Iraq:"🇮🇶",Norway:"🇳🇴",
  Argentina:"🇦🇷",Algeria:"🇩🇿",Austria:"🇦🇹",Jordan:"🇯🇴",
  Portugal:"🇵🇹","DR Congo":"🇨🇩",Uzbekistan:"🇺🇿",Colombia:"🇨🇴",
  England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",Croatia:"🇭🇷",Ghana:"🇬🇭",Panama:"🇵🇦",
};

const TEAM_COLORS = {
  Mexico:{bg:"#006847",dk:"#fff"},"South Africa":{bg:"#007A4D",dk:"#FFB81C"},
  "South Korea":{bg:"#CD2E3A",dk:"#fff"},Czechia:{bg:"#D7141A",dk:"#fff"},
  Canada:{bg:"#FF0000",dk:"#fff"},"Bosnia and Herzegovina":{bg:"#002395",dk:"#FCDD09"},
  Qatar:{bg:"#8D1B3D",dk:"#fff"},Switzerland:{bg:"#FF0000",dk:"#fff"},
  Brazil:{bg:"#009c3b",dk:"#FFDF00"},Morocco:{bg:"#C1272D",dk:"#006233"},
  Haiti:{bg:"#00209F",dk:"#D21034"},Scotland:{bg:"#003F87",dk:"#fff"},
  USA:{bg:"#002868",dk:"#BF0A30"},Paraguay:{bg:"#D52B1E",dk:"#fff"},
  Australia:{bg:"#00843D",dk:"#FFB81C"},Turkiye:{bg:"#E30A17",dk:"#fff"},
  Germany:{bg:"#000000",dk:"#DD0000"},Curacao:{bg:"#003DA5",dk:"#F9E813"},
  "Ivory Coast":{bg:"#F77F00",dk:"#fff"},Ecuador:{bg:"#FFD100",dk:"#003893"},
  Netherlands:{bg:"#FF6600",dk:"#fff"},Japan:{bg:"#BC002D",dk:"#fff"},
  Sweden:{bg:"#006AA7",dk:"#FECC02"},Tunisia:{bg:"#E70013",dk:"#fff"},
  Belgium:{bg:"#000000",dk:"#FFD700"},Egypt:{bg:"#CE1126",dk:"#fff"},
  Iran:{bg:"#239F40",dk:"#fff"},"New Zealand":{bg:"#00247D",dk:"#fff"},
  Spain:{bg:"#AA151B",dk:"#F1BF00"},"Cape Verde":{bg:"#003893",dk:"#CF2027"},
  "Saudi Arabia":{bg:"#006C35",dk:"#fff"},Uruguay:{bg:"#5EB6E4",dk:"#fff"},
  France:{bg:"#002395",dk:"#fff"},Senegal:{bg:"#00853F",dk:"#FDEF42"},
  Iraq:{bg:"#007A3D",dk:"#fff"},Norway:{bg:"#EF2B2D",dk:"#fff"},
  Argentina:{bg:"#74ACDF",dk:"#fff"},Algeria:{bg:"#006233",dk:"#fff"},
  Austria:{bg:"#ED2939",dk:"#fff"},Jordan:{bg:"#007A3D",dk:"#fff"},
  Portugal:{bg:"#006600",dk:"#FF0000"},"DR Congo":{bg:"#007FFF",dk:"#FFCD00"},
  Uzbekistan:{bg:"#1EB53A",dk:"#fff"},Colombia:{bg:"#FCD116",dk:"#003087"},
  England:{bg:"#CF081F",dk:"#fff"},Croatia:{bg:"#FF0000",dk:"#fff"},
  Ghana:{bg:"#006B3F",dk:"#FCD116"},Panama:{bg:"#DA121A",dk:"#fff"},
};

// Groups
// Groups
const GROUPS = {
  A:["Mexico","South Africa","South Korea","Czechia"],
  B:["Canada","Bosnia and Herzegovina","Qatar","Switzerland"],
  C:["Brazil","Morocco","Haiti","Scotland"],
  D:["USA","Paraguay","Australia","Turkiye"],
  E:["Germany","Curacao","Ivory Coast","Ecuador"],
  F:["Netherlands","Japan","Sweden","Tunisia"],
  G:["Belgium","Egypt","Iran","New Zealand"],
  H:["Spain","Cape Verde","Saudi Arabia","Uruguay"],
  I:["France","Senegal","Iraq","Norway"],
  J:["Argentina","Algeria","Austria","Jordan"],
  K:["Portugal","DR Congo","Uzbekistan","Colombia"],
  L:["England","Croatia","Ghana","Panama"],
};

/* ─── MATCHES (Group Stage M1-M72, Knockouts M73-M104) ───────── */
const BASE_MATCHES = [
  // ── GROUP A ─────────────────────────────────────────────────
  {id:1,mn:"M1",home:"Mexico",away:"South Africa",date:"2026-06-11",time:"15:00",venue:"Estadio Azteca, Mexico City",group:"A"},
  {id:2,mn:"M2",home:"South Korea",away:"Czechia",date:"2026-06-11",time:"22:00",venue:"Estadio Akron, Guadalajara",group:"A"},
  {id:3,mn:"M3",home:"Czechia",away:"South Africa",date:"2026-06-18",time:"12:00",venue:"Mercedes-Benz Stadium, Atlanta",group:"A"},
  {id:4,mn:"M4",home:"Mexico",away:"South Korea",date:"2026-06-18",time:"21:00",venue:"Estadio Akron, Guadalajara",group:"A"},
  {id:5,mn:"M5",home:"Czechia",away:"Mexico",date:"2026-06-24",time:"21:00",venue:"Estadio Azteca, Mexico City",group:"A"},
  {id:6,mn:"M6",home:"South Africa",away:"South Korea",date:"2026-06-24",time:"21:00",venue:"AT&T Stadium, Dallas",group:"A"},
  // ── GROUP B ─────────────────────────────────────────────────
  {id:7,mn:"M7",home:"Canada",away:"Bosnia and Herzegovina",date:"2026-06-12",time:"15:00",venue:"BMO Field, Toronto",group:"B"},
  {id:8,mn:"M8",home:"Qatar",away:"Switzerland",date:"2026-06-13",time:"15:00",venue:"Levi's Stadium, San Francisco",group:"B"},
  {id:9,mn:"M9",home:"Switzerland",away:"Bosnia and Herzegovina",date:"2026-06-19",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"B"},
  {id:10,mn:"M10",home:"Canada",away:"Qatar",date:"2026-06-19",time:"15:00",venue:"BMO Field, Toronto",group:"B"},
  {id:11,mn:"M11",home:"Bosnia and Herzegovina",away:"Qatar",date:"2026-06-24",time:"17:00",venue:"Estadio BBVA, Monterrey",group:"B"},
  {id:12,mn:"M12",home:"Switzerland",away:"Canada",date:"2026-06-24",time:"17:00",venue:"Levi's Stadium, San Francisco",group:"B"},
  // ── GROUP C ─────────────────────────────────────────────────
  {id:13,mn:"M13",home:"Brazil",away:"Morocco",date:"2026-06-13",time:"18:00",venue:"MetLife Stadium, New York",group:"C"},
  {id:14,mn:"M14",home:"Haiti",away:"Scotland",date:"2026-06-13",time:"21:00",venue:"Gillette Stadium, Boston",group:"C"},
  {id:15,mn:"M15",home:"Morocco",away:"Haiti",date:"2026-06-20",time:"15:00",venue:"NRG Stadium, Houston",group:"C"},
  {id:16,mn:"M16",home:"Brazil",away:"Scotland",date:"2026-06-20",time:"18:00",venue:"SoFi Stadium, Los Angeles",group:"C"},
  {id:17,mn:"M17",home:"Scotland",away:"Haiti",date:"2026-06-24",time:"21:00",venue:"Gillette Stadium, Boston",group:"C"},
  {id:18,mn:"M18",home:"Morocco",away:"Brazil",date:"2026-06-24",time:"21:00",venue:"MetLife Stadium, New York",group:"C"},
  // ── GROUP D ─────────────────────────────────────────────────
  {id:19,mn:"M19",home:"USA",away:"Paraguay",date:"2026-06-12",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"D"},
  {id:20,mn:"M20",home:"Australia",away:"Turkiye",date:"2026-06-13",time:"03:00",venue:"AT&T Stadium, Dallas",group:"D"},
  {id:21,mn:"M21",home:"USA",away:"Australia",date:"2026-06-19",time:"21:00",venue:"Lumen Field, Seattle",group:"D"},
  {id:22,mn:"M22",home:"Paraguay",away:"Turkiye",date:"2026-06-19",time:"18:00",venue:"Estadio BBVA, Monterrey",group:"D"},
  {id:23,mn:"M23",home:"Turkiye",away:"USA",date:"2026-06-25",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"D"},
  {id:24,mn:"M24",home:"Paraguay",away:"Australia",date:"2026-06-25",time:"21:00",venue:"AT&T Stadium, Dallas",group:"D"},
  // ── GROUP E ─────────────────────────────────────────────────
  {id:25,mn:"M25",home:"Germany",away:"Curacao",date:"2026-06-14",time:"13:00",venue:"NRG Stadium, Houston",group:"E"},
  {id:26,mn:"M26",home:"Ivory Coast",away:"Ecuador",date:"2026-06-14",time:"19:00",venue:"Lincoln Financial Field, Philadelphia",group:"E"},
  {id:27,mn:"M27",home:"Germany",away:"Ivory Coast",date:"2026-06-20",time:"21:00",venue:"MetLife Stadium, New York",group:"E"},
  {id:28,mn:"M28",home:"Ecuador",away:"Curacao",date:"2026-06-21",time:"15:00",venue:"Arrowhead Stadium, Kansas City",group:"E"},
  {id:29,mn:"M29",home:"Curacao",away:"Ivory Coast",date:"2026-06-25",time:"17:00",venue:"Lincoln Financial Field, Philadelphia",group:"E"},
  {id:30,mn:"M30",home:"Ecuador",away:"Germany",date:"2026-06-25",time:"17:00",venue:"NRG Stadium, Houston",group:"E"},
  // ── GROUP F ─────────────────────────────────────────────────
  {id:31,mn:"M31",home:"Netherlands",away:"Japan",date:"2026-06-14",time:"16:00",venue:"AT&T Stadium, Dallas",group:"F"},
  {id:32,mn:"M32",home:"Sweden",away:"Tunisia",date:"2026-06-14",time:"22:00",venue:"Estadio BBVA, Monterrey",group:"F"},
  {id:33,mn:"M33",home:"Netherlands",away:"Sweden",date:"2026-06-20",time:"21:00",venue:"Gillette Stadium, Boston",group:"F"},
  {id:34,mn:"M34",home:"Tunisia",away:"Japan",date:"2026-06-21",time:"13:00",venue:"Arrowhead Stadium, Kansas City",group:"F"},
  {id:35,mn:"M35",home:"Japan",away:"Sweden",date:"2026-06-25",time:"19:00",venue:"AT&T Stadium, Dallas",group:"F"},
  {id:36,mn:"M36",home:"Tunisia",away:"Netherlands",date:"2026-06-25",time:"19:00",venue:"Estadio BBVA, Monterrey",group:"F"},
  // ── GROUP G ─────────────────────────────────────────────────
  {id:37,mn:"M37",home:"Belgium",away:"Egypt",date:"2026-06-15",time:"18:00",venue:"Lumen Field, Seattle",group:"G"},
  {id:38,mn:"M38",home:"Iran",away:"New Zealand",date:"2026-06-16",time:"00:00",venue:"SoFi Stadium, Los Angeles",group:"G"},
  {id:39,mn:"M39",home:"Belgium",away:"Iran",date:"2026-06-22",time:"21:00",venue:"BC Place, Vancouver",group:"G"},
  {id:40,mn:"M40",home:"New Zealand",away:"Egypt",date:"2026-06-22",time:"15:00",venue:"Lincoln Financial Field, Philadelphia",group:"G"},
  {id:41,mn:"M41",home:"Egypt",away:"Iran",date:"2026-06-26",time:"23:00",venue:"Lumen Field, Seattle",group:"G"},
  {id:42,mn:"M42",home:"New Zealand",away:"Belgium",date:"2026-06-26",time:"23:00",venue:"BC Place, Vancouver",group:"G"},
  // ── GROUP H ─────────────────────────────────────────────────
  {id:43,mn:"M43",home:"Spain",away:"Cape Verde",date:"2026-06-15",time:"13:00",venue:"Mercedes-Benz Stadium, Atlanta",group:"H"},
  {id:44,mn:"M44",home:"Saudi Arabia",away:"Uruguay",date:"2026-06-15",time:"18:00",venue:"Hard Rock Stadium, Miami",group:"H"},
  {id:45,mn:"M45",home:"Spain",away:"Saudi Arabia",date:"2026-06-22",time:"17:00",venue:"Arrowhead Stadium, Kansas City",group:"H"},
  {id:46,mn:"M46",home:"Cape Verde",away:"Uruguay",date:"2026-06-22",time:"17:00",venue:"Estadio Azteca, Mexico City",group:"H"},
  {id:47,mn:"M47",home:"Uruguay",away:"Spain",date:"2026-06-26",time:"20:00",venue:"Estadio Akron, Guadalajara",group:"H"},
  {id:48,mn:"M48",home:"Cape Verde",away:"Saudi Arabia",date:"2026-06-26",time:"20:00",venue:"NRG Stadium, Houston",group:"H"},
  // ── GROUP I ─────────────────────────────────────────────────
  {id:49,mn:"M49",home:"France",away:"Senegal",date:"2026-06-16",time:"15:00",venue:"MetLife Stadium, New York",group:"I"},
  {id:50,mn:"M50",home:"Iraq",away:"Norway",date:"2026-06-16",time:"18:00",venue:"Gillette Stadium, Boston",group:"I"},
  {id:51,mn:"M51",home:"France",away:"Iraq",date:"2026-06-22",time:"21:00",venue:"Levi's Stadium, San Francisco",group:"I"},
  {id:52,mn:"M52",home:"Norway",away:"Senegal",date:"2026-06-22",time:"21:00",venue:"Hard Rock Stadium, Miami",group:"I"},
  {id:53,mn:"M53",home:"Norway",away:"France",date:"2026-06-26",time:"15:00",venue:"Gillette Stadium, Boston",group:"I"},
  {id:54,mn:"M54",home:"Senegal",away:"Iraq",date:"2026-06-26",time:"15:00",venue:"BMO Field, Toronto",group:"I"},
  // ── GROUP J ─────────────────────────────────────────────────
  {id:55,mn:"M55",home:"Argentina",away:"Algeria",date:"2026-06-16",time:"21:00",venue:"Arrowhead Stadium, Kansas City",group:"J"},
  {id:56,mn:"M56",home:"Austria",away:"Jordan",date:"2026-06-17",time:"21:00",venue:"Levi's Stadium, San Francisco",group:"J"},
  {id:57,mn:"M57",home:"Argentina",away:"Austria",date:"2026-06-22",time:"13:00",venue:"MetLife Stadium, New York",group:"J"},
  {id:58,mn:"M58",home:"Jordan",away:"Algeria",date:"2026-06-22",time:"13:00",venue:"BC Place, Vancouver",group:"J"},
  {id:59,mn:"M59",home:"Algeria",away:"Austria",date:"2026-06-27",time:"22:00",venue:"Arrowhead Stadium, Kansas City",group:"J"},
  {id:60,mn:"M60",home:"Jordan",away:"Argentina",date:"2026-06-27",time:"22:00",venue:"AT&T Stadium, Dallas",group:"J"},
  // ── GROUP K ─────────────────────────────────────────────────
  {id:61,mn:"M61",home:"Portugal",away:"DR Congo",date:"2026-06-17",time:"13:00",venue:"NRG Stadium, Houston",group:"K"},
  {id:62,mn:"M62",home:"Uzbekistan",away:"Colombia",date:"2026-06-17",time:"18:00",venue:"Lumen Field, Seattle",group:"K"},
  {id:63,mn:"M63",home:"Portugal",away:"Uzbekistan",date:"2026-06-23",time:"15:00",venue:"Hard Rock Stadium, Miami",group:"K"},
  {id:64,mn:"M64",home:"Colombia",away:"DR Congo",date:"2026-06-23",time:"15:00",venue:"Lincoln Financial Field, Philadelphia",group:"K"},
  {id:65,mn:"M65",home:"Colombia",away:"Portugal",date:"2026-06-27",time:"19:30",venue:"Hard Rock Stadium, Miami",group:"K"},
  {id:66,mn:"M66",home:"DR Congo",away:"Uzbekistan",date:"2026-06-27",time:"19:30",venue:"Mercedes-Benz Stadium, Atlanta",group:"K"},
  // ── GROUP L ─────────────────────────────────────────────────
  {id:67,mn:"M67",home:"England",away:"Croatia",date:"2026-06-17",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"L"},
  {id:68,mn:"M68",home:"Ghana",away:"Panama",date:"2026-06-17",time:"21:00",venue:"Mercedes-Benz Stadium, Atlanta",group:"L"},
  {id:69,mn:"M69",home:"England",away:"Ghana",date:"2026-06-23",time:"21:00",venue:"Lumen Field, Seattle",group:"L"},
  {id:70,mn:"M70",home:"Panama",away:"Croatia",date:"2026-06-23",time:"21:00",venue:"Gillette Stadium, Boston",group:"L"},
  {id:71,mn:"M71",home:"Panama",away:"England",date:"2026-06-27",time:"17:00",venue:"MetLife Stadium, New York",group:"L"},
  {id:72,mn:"M72",home:"Croatia",away:"Ghana",date:"2026-06-27",time:"17:00",venue:"Lincoln Financial Field, Philadelphia",group:"L"},
  // ── ROUND OF 32 (placeholders) ──────────────────────────────
  {id:73,mn:"R32-1",home:"TBD",away:"TBD",date:"2026-06-28",time:"15:00",venue:"SoFi Stadium, Los Angeles"},
  {id:74,mn:"R32-2",home:"TBD",away:"TBD",date:"2026-06-29",time:"16:30",venue:"Gillette Stadium, Boston"},
  {id:75,mn:"R32-3",home:"TBD",away:"TBD",date:"2026-06-29",time:"21:00",venue:"Estadio BBVA, Monterrey"},
  {id:76,mn:"R32-4",home:"TBD",away:"TBD",date:"2026-06-29",time:"13:00",venue:"NRG Stadium, Houston"},
  {id:77,mn:"R32-5",home:"TBD",away:"TBD",date:"2026-06-30",time:"17:00",venue:"MetLife Stadium, New York"},
  {id:78,mn:"R32-6",home:"TBD",away:"TBD",date:"2026-06-30",time:"13:00",venue:"AT&T Stadium, Dallas"},
  {id:79,mn:"R32-7",home:"TBD",away:"TBD",date:"2026-06-30",time:"21:00",venue:"Estadio Azteca, Mexico City"},
  {id:80,mn:"R32-8",home:"TBD",away:"TBD",date:"2026-07-01",time:"12:00",venue:"Mercedes-Benz Stadium, Atlanta"},
  {id:81,mn:"R32-9",home:"TBD",away:"TBD",date:"2026-07-01",time:"16:30",venue:"Hard Rock Stadium, Miami"},
  {id:82,mn:"R32-10",home:"TBD",away:"TBD",date:"2026-07-01",time:"21:00",venue:"Estadio Akron, Guadalajara"},
  {id:83,mn:"R32-11",home:"TBD",away:"TBD",date:"2026-07-02",time:"13:00",venue:"BC Place, Vancouver"},
  {id:84,mn:"R32-12",home:"TBD",away:"TBD",date:"2026-07-02",time:"17:00",venue:"Levi's Stadium, San Francisco"},
  {id:85,mn:"R32-13",home:"TBD",away:"TBD",date:"2026-07-02",time:"21:00",venue:"Estadio BBVA, Monterrey"},
  {id:86,mn:"R32-14",home:"TBD",away:"TBD",date:"2026-07-03",time:"13:00",venue:"Lincoln Financial Field, Philadelphia"},
  {id:87,mn:"R32-15",home:"TBD",away:"TBD",date:"2026-07-03",time:"17:00",venue:"Arrowhead Stadium, Kansas City"},
  {id:88,mn:"R32-16",home:"TBD",away:"TBD",date:"2026-07-03",time:"21:00",venue:"BMO Field, Toronto"},
  // ── ROUND OF 16 ─────────────────────────────────────────────
  {id:89,mn:"R16-1",home:"TBD",away:"TBD",date:"2026-07-04",time:"15:00",venue:"MetLife Stadium, New York"},
  {id:90,mn:"R16-2",home:"TBD",away:"TBD",date:"2026-07-05",time:"15:00",venue:"SoFi Stadium, Los Angeles"},
  {id:91,mn:"R16-3",home:"TBD",away:"TBD",date:"2026-07-05",time:"21:00",venue:"AT&T Stadium, Dallas"},
  {id:92,mn:"R16-4",home:"TBD",away:"TBD",date:"2026-07-06",time:"15:00",venue:"Levi's Stadium, San Francisco"},
  {id:93,mn:"R16-5",home:"TBD",away:"TBD",date:"2026-07-06",time:"21:00",venue:"NRG Stadium, Houston"},
  {id:94,mn:"R16-6",home:"TBD",away:"TBD",date:"2026-07-07",time:"12:00",venue:"Mercedes-Benz Stadium, Atlanta"},
  {id:95,mn:"R16-7",home:"TBD",away:"TBD",date:"2026-07-07",time:"17:00",venue:"Arrowhead Stadium, Kansas City"},
  {id:96,mn:"R16-8",home:"TBD",away:"TBD",date:"2026-07-07",time:"21:00",venue:"Gillette Stadium, Boston"},
  // ── QUARTER FINALS ──────────────────────────────────────────
  {id:97,mn:"QF-1",home:"TBD",away:"TBD",date:"2026-07-09",time:"15:00",venue:"SoFi Stadium, Los Angeles"},
  {id:98,mn:"QF-2",home:"TBD",away:"TBD",date:"2026-07-10",time:"15:00",venue:"NRG Stadium, Houston"},
  {id:99,mn:"QF-3",home:"TBD",away:"TBD",date:"2026-07-11",time:"17:00",venue:"Hard Rock Stadium, Miami"},
  {id:100,mn:"QF-4",home:"TBD",away:"TBD",date:"2026-07-11",time:"21:00",venue:"Arrowhead Stadium, Kansas City"},
  // ── SEMI FINALS ─────────────────────────────────────────────
  {id:101,mn:"SF-1",home:"TBD",away:"TBD",date:"2026-07-14",time:"15:00",venue:"AT&T Stadium, Dallas"},
  {id:102,mn:"SF-2",home:"TBD",away:"TBD",date:"2026-07-15",time:"15:00",venue:"Mercedes-Benz Stadium, Atlanta"},
  // ── THIRD PLACE & FINAL ──────────────────────────────────────
  {id:103,mn:"3rd Place",home:"TBD",away:"TBD",date:"2026-07-18",time:"17:00",venue:"Hard Rock Stadium, Miami"},
  {id:104,mn:"Final",home:"TBD",away:"TBD",date:"2026-07-19",time:"15:00",venue:"MetLife Stadium, New York"},
];


/* squadS */
const SQUADS = {
  Mexico:["Guillermo Ochoa","Raul Rangel","Carlos Acevedo","Jesus Gallardo","Cesar Montes","Jorge Sanchez","Johan Vasquez","Israel Reyes","Mateo Chavez","Edson Alvarez","Orbelin Pineda","Luis Romo","Roberto Alvarado","Luis Chavez","Eric Lira","Gilberto Mora","Brian Gutierrez","Obed Vargas","Alvaro Fidalgo","Raul Jimenez","Alexis Vega","Santiago Gimenez","Cesar Huerta","Julian Quinones","Guillermo Martinez","Armando Gonzalez"],
  "South Africa":["Ronwen Williams","Ricardo Goss","Sipho Chaine","Aubrey Modiba","Khuliso Mudau","Nkosinathi Sibisi","Mbekezeli Mbokazi","Ime Okon","Samukele Kabini","Khulumani Ndamane","Thabang Matuludi","Kamogelo Sebelebele","Bradley Cross","Olwethu Makhanya","Teboho Mokoena","Sphephelo Sithole","Thalente Mbatha","Jayden Adams","Themba Zwane","Lyle Foster","Evidence Makgopa","Oswin Appollis","Iqraam Rayners","Relebohile Mofokeng","Thapelo Maseko","Tshepang Moremi"],
  "South Korea":["Kim Seung-Gyu","Jo Hyeon-woo","Song Bum-keun","Kim Min-jae","Kim Moon-hwan","Seol Young-woo","Cho Yu-min","Lee Tae-seok","Park Jin-seob","Kim Tae-hyeon","Lee Han-beom","Jens Castrop","Lee Ki-hyuk","Lee Jae-sung","Hwang Hee-chan","Hwang In-beom","Lee Kang-in","Paik Seung-ho","Kim Jin-gyu","Lee Dong-gyeong","Bae Jun-ho","Yang Hyun-jun","Son Heung-min","Cho Gue-sung","Oh Hyeon-gyu","Eom Ji-Sung"],
  Czechia:["Matej Kovar","Jindrich Stanek","Lukas Hornicek","Vladimir Coufal","Tomas Holes","Ladislav Krejci","David Zima","Jaroslav Zeleny","David Jurasek","David Doudera","Robin Hranac","Stepan Chaloupek","Tomas Soucek","Vladimir Darida","Lukas Provod","Michal Sadilek","Pavel Sulc","Hugo Sochurek","Alexandr Sojka","Denis Visinsky","Patrik Schick","Adam Hlozek","Jan Kuchta","Mojmir Chytil","Tomas Chory","Lukas Cerv"],
  Canada:["Dayne St Clair","Maxime Crepeau","Owen Goodman","Alistair Johnston","Luc de Fougerolles","Alfie Jones","Joel Waterman","Derek Cornelius","Moise Bombito","Alphonso Davies","Richie Laryea","Niko Sigur","Mathieu Choiniere","Stephen Eustaquio","Ismael Kone","Liam Millar","Jacob Schaffelburg","Tajon Buchanan","Ali Ahmed","Jonathan Osorio","Nathan Saliba","Cyle Larin","Jonathan David","Tani Oluwaseyi","Promise David","Marcelo Flores"],
  "Bosnia and Herzegovina":["Nikola Vasilj","Martin Zlomislic","Osman Hadzikic","Sead Kolasinac","Dennis Hadzikadunic","Amar Dedic","Nikola Katic","Tarik Muharemovic","Nihad Mujakic","Stjepan Radeljic","Nidal Celik","Amir Hadziahmetovic","Benjamin Tahirovic","Armin Gigovic","Dzenis Burnic","Ivan Basic","Esmir Bajraktarevic","Amar Memic","Ivan Sunjic","Kerim Alajbegovic","Ermin Mahmic","Edin Dzeko","Ermedin Demirovic","Samed Bazdar","Haris Tabakovic","Jovo Lukic"],
  Qatar:["Meshaal Barsham","Yousef Hassan","Mohammed Al-Bakri","Pedro Miguel","Bassam Al-Rawi","Abdelkarim Hassan","Tarek Salman","Ismail Mohammad","Musaab Khidir","Karim Boudiaf","Assim Madibo","Hassan Al-Haydos","Akram Afif","Abdulaziz Hatem","Ali Asad","Ahmed Alaaeldin","Salem Al-Hajri","Jassem Gaber","Mohammed Muntari","Almoez Ali","Ismail Mohamad","Ahmed Alganehi","Tariq Salman","Salmeen Al-Enezi","Khaled Mohammed","Yusuf Abdurisag"],
  Switzerland:["Marvin Keller","Gregor Kobel","Yvon Mvogo","Manuel Akanji","Aurele Amenda","Eray Comert","Nico Elvedi","Luca Jaquez","Miro Muheim","Ricardo Rodriguez","Silvan Widmer","Michel Aebischer","Christian Fassnacht","Remo Freuler","Ardon Jashari","Johan Manzambi","Fabian Rieder","Djibril Sow","Ruben Vargas","Granit Xhaka","Denis Zakaria","Zeki Amdouni","Breel Embolo","Cedric Itten","Dan Ndoye","Noah Okafor"],
  Brazil:["Alisson","Ederson","Weverton","Marquinhos","Danilo","Alex Sandro","Gabriel Magalhaes","Bremer","Wesley","Roger Ibanez","Douglas Santos","Leo Pereira","Casemiro","Lucas Paqueta","Bruno Guimaraes","Fabinho","Danilo Santos","Neymar","Vinicius Jr","Raphinha","Gabriel Martinelli","Matheus Cunha","Endrick","Luiz Henrique","Igor Thiago","Rayan"],
  Morocco:["Yassine Bounou","Munir Mohamedi","Ahmed Reda Tagnaouti","Achraf Hakimi","Nayef Aguerd","Noussair Mazraoui","Youssef Belammari","Anass Salah-Eddine","Chadi Riad","Issa Diop","Zakaria El Ouahdi","Redouane Halhal","Sofyan Amrabat","Azzedine Ounahi","Bilal El Khannouss","Ismael Saibari","Neil El Aynaoui","Samir El Mourabet","Ayyoub Bouaddi","Ayoub El Kaabi","Soufiane Rahimi","Brahim Diaz","Abde Ezzalzouli","Chemsdine Talbi","Yassine Gessim","Ayoube Amaimouni"],
  Haiti:["Johny Placide","Alexandre Pierre","Josue Duverger","Ricardo Ade","Carlens Arcus","Martin Experience","Jean-Kevin Duverne","Duke Lacroix","Wilguens Paugain","Hannes Delcroix","Keeto Thermoncy","Leverton Pierre","Danley Jean Jacques","Carl Sainte","Jean-Ricner Bellegarde","Woodensky Pierre","Dominique Simon","Duckens Nazon","Frantzdy Pierrot","Derrick Etienne Jr","Louicius Deedson","Ruben Providence","Josue Casimir","Yassin Fortune","Wilson Isidor","Lenny Joseph"],
  Scotland:["Angus Gunn","Craig Gordon","Liam Kelly","Andy Robertson","Kieran Tierney","Anthony Ralston","John Souttar","Scott McKenna","Jack Hendry","Aaron Hickey","Nathan Patterson","Grant Hanley","Dominic Hyam","Scott McTominay","John McGinn","Kenny McLean","Lewis Ferguson","Ryan Christie","Findlay Curtis","Ben Gannon-Doak","Tyler Fletcher","Lawrence Shankland","George Hirst","Che Adams","Ross Stewart","Lyndon Dykes"],
  USA:["Matt Turner","Chris Brady","Matt Freese","Sergino Dest","Chris Richards","Antonee Robinson","Auston Trusty","Miles Robinson","Tim Ream","Alex Freeman","Mark McKenzie","Joe Scally","Tyler Adams","Weston McKennie","Christian Pulisic","Sebastian Berhalter","Cristian Roldan","Malik Tillman","Gio Reyna","Ricardo Pepi","Brenden Aaronson","Max Arfsten","Haji Wright","Folarin Balogun","Tim Weah","Alex Zendejas"],
  Paraguay:["Anthony Silva","Alfredo Aguilar","Roberto Fernandez","Junior Alonso","Omar Alderete","Santiago Caceres","Gustavo Velazquez","Jorge Morel","Robert Rojas","Matias Espinoza","Alberto Espinola","Andres Cubas","Miguel Almiron","Mathias Villasanti","Damian Bobadilla","Diego Leon","Julio Enciso","Braian Ojeda","Gabriel Avalos","Cecilio Dominguez","Jose Rivas","Antonio Sanabria","Cepita Sanchez","Ivan Gonzalez","Adrian Cubas","Fabrizio Angileri"],
  Australia:["Mathew Ryan","Paul Izzo","Patrick Beach","Aziz Behich","Milos Degenek","Harry Souttar","Jordan Bos","Cameron Burgess","Jason Geria","Alessandro Circati","Kai Trewin","Jacob Italiano","Lucas Herrington","Jackson Irvine","Ajdin Hrustic","Connor Metcalfe","Aiden O'Neill","Paul Okon-Engstler","Cameron Devlin","Mathew Leckie","Awer Mabil","Nestory Irankunda","Mohamed Toure","Nishan Velupillay","Cristian Volpato","Tete Yengi"],
  Turkiye:["Ugurcan Cakir","Altay Bayindir","Mert Gunok","Ferdi Kadioglu","Merih Demiral","Zeki Celik","Ozan Kabak","Mert Muldur","Abdulkerim Bardakci","Rasmus Cakmak","Emirhan Topcu","Hakan Calhanoglu","Salih Ozcan","Ismail Yuksek","Arda Guler","Orkun Kokcu","Kenan Yildiz","Barish Yilmaz","Baris Alper Yilmaz","Irfan Can Kahveci","Cengiz Under","Yunus Akgun","Okay Yokuslu","Efekan Karaduman","Yusuf Yazici","Umut Nayir"],
  Germany:["Manuel Neuer","Oliver Baumann","Alexander Nuebel","Nico Schlotterbeck","David Raum","Nathaniel Brown","Jonathan Tah","Waldemar Anton","Joshua Kimmich","Malick Thiaw","Antonio Rudiger","Pascal Gross","Leon Goretzka","Felix Nmecha","Jamal Musiala","Nadiem Amiri","Jamie Leweling","Florian Wirtz","Leroy Sane","Aleksandar Pavlovic","Angelo Stiller","Kai Havertz","Nick Woltemade","Deniz Undav","Maximilian Beier","Lennart Karl"],
  Curacao:["Eloy Room","Trevor Doornbusch","Tyrick Bodack","Riechedly Bazoer","Joshua Brenet","Roshon van Eijma","Sherel Floranus","Deveron Fonville","Jurien Gaari","Armando Obispo","Shurandy Sambo","Juninho Bacuna","Leandro Bacuna","Livano Comenencia","Kevin Felida","Arjany Martha","Tyrese Noslin","Godfried Roemeratoe","Jeremy Antonisse","Tahith Chong","Kenji Gorre","Sontje Hansen","Gervane Kastaneer","Brandley Kuwas","Jurgen Locadia","Jearl Margaritha"],
  "Ivory Coast":["Yahia Fofana","Mohamed Kone","Alban Lafont","Emmanuel Agbadou","Christopher Operi","Ousmane Diomande","Guela Doue","Ghislain Konan","Odilon Kossounou","Wilfried Singo","Evan Ndicka","Seko Fofana","Parfait Guiagon","Franck Kessie","Ibrahim Sangare","Jean Michael Seri","Simon Adingra","Ange-Yoan Bonny","Amad Diallo","Oumar Diakite","Yan Diomande","Evann Guessand","Nicolas Pepe","Bazoumana Toure","Elye Wahi","Christ Inao Oulai"],
  Ecuador:["Hernan Galindez","Moises Ramirez","Gonzalo Valle","Piero Hincapie","Willian Pacho","Pervis Estupinan","Felix Torres","Joel Ordonez","Jackson Porozo","Angelo Preciado","Yaimar Medina","Moises Caicedo","Alan Franco","Kendry Paez","Gonzalo Plata","Pedro Vite","Jordy Alcivar","Denil Castillo","John Yeboah","Nilson Angulo","Alan Minda","Enner Valencia","Kevin Rodriguez","Jordy Caicedo","Anthony Valencia","Jeremy Arevalo"],
  Netherlands:["Mark Flekken","Robin Roefs","Bart Verbruggen","Nathan Ake","Virgil van Dijk","Denzel Dumfries","Jan Paul van Hecke","Jurrien Timber","Jorrel Hato","Micky van de Ven","Ryan Gravenberch","Frenkie de Jong","Teun Koopmeiners","Tijjani Reijnders","Marten de Roon","Guus Til","Quinten Timber","Mats Wieffer","Brian Brobbey","Memphis Depay","Cody Gakpo","Noa Lang","Donyell Malen","Crysencio Summerville","Wout Weghorst","Justin Kluivert"],
  Japan:["Tomoki Hayakawa","Keisuke Osako","Zion Suzuki","Ko Itakura","Hiroki Ito","Yuto Nagatomo","Ayumu Seko","Yukinari Sugawara","Junnosuke Suzuki","Shogo Taniguchi","Takehiro Tomiyasu","Tsuyoshi Watanabe","Ritsu Doan","Wataru Endo","Junya Ito","Daichi Kamada","Takefusa Kubo","Keito Nakamura","Kaishu Sano","Ao Tanaka","Keisuke Goto","Daizen Maeda","Koki Ogawa","Kento Shiogai","Yuito Suzuki","Ayase Ueda"],
  Sweden:["Viktor Johansson","Kristoffer Nordfeldt","Jacob Widell Zetterström","Hjalmar Ekdal","Gabriel Gudmundsson","Isak Hien","Emil Holm","Gustaf Lagerbielke","Victor Lindelof","Eric Smith","Carl Starfelt","Daniel Svensson","Jesper Kalstrom","Yasin Ayari","Mattias Svanberg","Lucas Bergvall","Besfort Zeneli","Taha Ali","Alexander Bernhardsson","Anthony Elanga","Viktor Gyokeres","Alexander Isak","Gustaf Nilsson","Benjamin Nygren","Ken Sema","Elliot Stroud"],
  Tunisia:["Aymen Dahmen","Bechir Ben Said","Mouez Hassen","Dylan Bronn","Montassar Talbi","Yassine Meriah","Ali Maaloul","Ghaylane Chaalali","Nader Ghandri","Mohamed Ali Ben Romdhane","Ellyes Skhiri","Aissa Laidouni","Hannibal Mejbri","Firas Chaouat","Rayan Elloumi","Hazem Mastouri","Elias Saad","Elias Achouri","Khalil Ayari","Sebastian Tounekti","Issam Jebali","Seifeddine Jaziri","Taha Yassine Khenissi","Hamza Rafia","Naim Sliti","Sayfallah Ltaief"],
  Belgium:["Thibaut Courtois","Senne Lammens","Mike Penders","Timothy Castagne","Zeno Debast","Maxim De Cuyper","Koni De Winter","Brandon Mechele","Thomas Meunier","Nathan Ngoy","Joaquin Seys","Arthur Theate","Kevin De Bruyne","Amadou Onana","Nicolas Raskin","Youri Tielemans","Hans Vanaken","Axel Witsel","Charles De Ketelaere","Jeremy Doku","Matias Fernandez-Pardo","Romelu Lukaku","Dodi Lukebakio","Diego Moreira","Alexis Saelemaekers","Leandro Trossard"],
  Egypt:["Mohamed El Shenawy","Mostafa Shobeir","Mohamed Alaa","Mohamed Abdelmonem","Mohamed Hany","Yasser Ibrahim","Hossam Abdelmaguid","Ahmed Fattouh","Tarek Alaa","Rami Rabia","Karim Hafez","Marwan Attia","Ahmed Sayed Zizo","Trezeguet","Emam Ashour","Mostafa Abdel Raouf","Mohannad Lasheen","Haitham Hassan","Mahmoud Saber","Ibrahim Adel","Nabil Emad","Hamdi Fathi","Mohamed Salah","Omar Marmoush","Hamza Abdel Karim","El Mahdy Soliman"],
  Iran:["Alireza Beiranvand","Seyed Hossein Hosseini","Payam Niazmand","Danial Eiri","Ehsan Hajsafi","Saleh Hardani","Hossein Kanaani","Shoja Khalilzadeh","Milad Mohammadi","Ali Nemati","Ramin Rezaeian","Rouzbeh Cheshmi","Saeid Ezatolahi","Mehdi Ghaedi","Saman Ghoddos","Mohammad Ghorbani","Alireza Jahanbakhsh","Mohammad Mohebi","Mehdi Torabi","Aria Yousefi","Amir Mohammad Razzaghinia","Ali Alipour","Dennis Dargahi","Amirhossein Hosseinzadeh","Mehdi Taremi","Shahriar Moghanlou"],
  "New Zealand":["Max Crocombe","Alex Paulsen","Michael Woud","Tyler Bindon","Michael Boxall","Liberato Cacace","Francis de Vries","Callan Elliot","Tim Payne","Nando Pijnaker","Tommy Smith","Finn Surman","Lachlan Bayliss","Joe Bell","Matt Garbett","Eli Just","Callum McCowatt","Ben Old","Alex Rufer","Marko Stamenic","Sarpreet Singh","Ryan Thomas","Chris Wood","Myer Bevan","Kosta Barbarouses","Marko Grgic"],
  Spain:["David Raya","Alex Remiro","Unai Simon","Dani Carvajal","Robin Le Normand","Aymeric Laporte","David Garcia","Marc Cucurella","Alex Grimaldo","Pedro Porro","Fabian Ruiz","Rodri","Pedri","Mikel Merino","Martin Zubimendi","Aleix Garcia","Nico Williams","Lamine Yamal","Mikel Oyarzabal","Alvaro Morata","Ferran Torres","Ayoze Perez","Dani Olmo","Joselu","Bryan Zaragoza","Yeremy Pino"],
  "Cape Verde":["CJ dos Santos","Marcio Rosa","Vozinha","Sidny Cabral","Diney Borges","Logan Costa","Roberto Lopes","Steven Moreira","Wagner Pina","Kelvin Pires","Joao Paulo Fernandes","Stopira","Telmo Arcanjo","Deroy Duarte","Laros Duarte","Jamiro Monteiro","Kevin Pina","Yannick Semedo","Gilson Benchimol","Jovane Cabral","Dailon Livramento","Ryan Mendes","Nuno da Costa","Garry Rodrigues","Willy Semedo","Helio Varela"],
  "Saudi Arabia":["Mohammed Al-Owais","Nawaf Al-Aqidi","Ahmed Al-Kassar","Saud Abdulhamid","Hassan Al-Tambakti","Abdulelah Al-Amri","Nawaf Boushal","Ali Lajami","Ali Majrashi","Hassan Kadesh","Moteb Al-Harbi","Jehad Thakri","Mohammed Abu Al-Shamat","Salem Al-Dawsari","Abdullah Al-Khaibari","Mohamed Kanno","Nasser Al-Dawsari","Musab Al-Juwayr","Ayman Yahya","Ziyad Al-Johani","Sultan Mandesh","Alaa Al-Hejji","Firas Al-Buraikan","Saleh Al-Shehri","Abdullah Al-Hamdan","Khalid Al-Ghannam"],
  Uruguay:["Fernando Muslera","Sebastian Sosa","Sergio Rochet","Jose Maria Gimenez","Ronald Araujo","Diego Godin","Mathias Olivera","Guillermo Varela","Sebastian Caceres","Maximiliano Araujo","Nicolas de la Cruz","Federico Valverde","Rodrigo Bentancur","Lucas Torreira","Nahitan Nandez","Giorgian De Arrascaeta","Manuel Ugarte","Darwin Nunez","Edinson Cavani","Luis Suarez","Facundo Torres","Brian Rodriguez","Maximiliano Gomez","Agustin Canobbio","Fernando Gorriaran","Santiago Bueno"],
  France:["Mike Maignan","Robin Risser","Brice Samba","Lucas Digne","Malo Gusto","Lucas Hernandez","Theo Hernandez","Ibrahima Konate","Maxence Lacroix","Jules Kounde","William Saliba","Dayot Upamecano","N'Golo Kante","Manu Kone","Adrien Rabiot","Aurelien Tchouameni","Warren Zaire-Emery","Maghnes Akliouche","Bradley Barcola","Rayan Cherki","Ousmane Dembele","Desire Doue","Michael Olise","Kylian Mbappe","Jean-Philippe Mateta","Marcus Thuram"],
  Senegal:["Edouard Mendy","Alfred Gomis","Seny Dieng","Kalidou Koulibaly","Abdou Diallo","Yoro Diallo","Ismail Jakobs","Formose Mendy","Moussa Niakhate","Saliou Ciss","Pathe Ciss","Pape Gueye","Lamine Camara","Idrissa Gueye","Nampalys Mendy","Krepin Diatta","Ismaila Sarr","Sadio Mane","Boulaye Dia","Nicolas Jackson","Habib Diallo","Amadou Diallo","Cheikhou Kouyate","Iliman Ndiaye","Famara Diedhiou","Niane Habib"],
  Iraq:["Fahad Talib","Jalal Hassan","Ahmed Basil","Hussein Ali","Manaf Younis","Zaid Tahseen","Rebin Sulaka","Akam Hashem","Merchas Doski","Ahmed Yahya","Zaid Ismail","Frans Putros","Mustafa Saadoon","Amir Al Ammari","Kevin Yakob","Zidane Iqbal","Aimar Sher","Ibrahim Bayesh","Ahmed Qasim","Youssef Amyn","Marko Farji","Ali Jassim","Ali Al Hamadi","Ali Yousef","Aymen Hussein","Mohanad Ali"],
  Norway:["Orjan Nyland","Pal Hafstad","Ole Selvik","Leo Ostigard","Stian Gregersen","Andreas Hanche-Olsen","Marcus Holmgren Pedersen","Birger Meling","Fredrik Aursnes","Sander Berge","Patrick Berg","Martin Odegaard","Mathias Normann","Alexander Sorloth","Erling Haaland","Mohamed Elyounoussi","Antonio Nusa","Jens Petter Hauge","Ola Solbakken","Victor Torp","Andreas Schjelderup","Julian Ryerson","Kristoffer Ajer","Veton Berisha","Leander Dendoncker","Marcus Pedersen"],
  Argentina:["Emiliano Martinez","Geronimo Rulli","Juan Musso","Leonardo Balerdi","Gonzalo Montiel","Nicolas Tagliafico","Lisandro Martinez","Cristian Romero","Nicolas Otamendi","Facundo Medina","Nahuel Molina","Leandro Paredes","Rodrigo De Paul","Valentin Barco","Giovani Lo Celso","Exequiel Palacios","Alexis Mac Allister","Enzo Fernandez","Julian Alvarez","Lionel Messi","Nicolas Gonzalez","Thiago Almada","Giuliano Simeone","Nicolas Paz","Lautaro Martinez","Jose Manuel Lopez"],
  Algeria:["Oussama Benbot","Melvin Masstil","Luca Zidane","Achraf Abada","Rayan Ait Nouri","Zinedine Belaid","Rafik Belghali","Ramy Bensebaini","Samir Chergui","Jaouen Hadjam","Aissa Mandi","Mohamed Amine Tougai","Houssem Aouar","Nabil Bentaleb","Hicham Boudaoui","Fares Chaibi","Ibrahim Maza","Yassine Titraoui","Ramiz Zerrouki","Mohamed Amine Amoura","Nadir Benbouali","Adil Boulbina","Fares Ghedjemis","Amine Gouiri","Riyad Mahrez","Anis Hadj Moussa"],
  Austria:["Patrick Pentz","Alexander Schlager","Florian Wiegele","David Affengruber","David Alaba","Kevin Danso","Marco Friedl","Philipp Lienhart","Phillipp Mwene","Stefan Posch","Alexander Prass","Michael Svoboda","Christoph Baumgartner","Carney Chukwuemeka","Florian Grillitsch","Konrad Laimer","Marcel Sabitzer","Xaver Schlager","Romano Schmid","Alessandro Schopf","Nicolas Seiwald","Paul Wanner","Patrick Wimmer","Marko Arnautovic","Michael Gregoritsch","Sasa Kalajdzic"],
  Jordan:["Yazid Abulaila","Noor Bani Attiah","Abdallah Al Fakhouri","Mohammad Abu Hashish","Abdullah Nasib","Hussam Abu Dhahab","Yazan Al Arab","Mohammad Abu Alnadi","Salem Obaid","Saed Al Rosan","Ehsan Haddad","Anas Badawi","Amer Jamous","Noor Al Rawabdeh","Rajaei Ayed","Ibrahim Sadeh","Mohannad Abu Taha","Nizar Al Rashdan","Mohammad Al Dawoud","Mahmoud Mardahi","Mohammad Abu Zraiq","Ali Olwan","Mousa Al Tamari","Odeh Fakhoury","Ibrahim Sabra","Ali Azaizeh"],
  Portugal:["Diogo Costa","Jose Sa","Rui Patricio","Joao Cancelo","Ruben Dias","William Carvalho","Pepe","Nuno Mendes","Diogo Dalot","Antonio Silva","Bernardo Silva","Joao Palhinha","Bruno Fernandes","Vitinha","Joao Neves","Ruben Neves","Rafael Leao","Cristiano Ronaldo","Goncalo Ramos","Diogo Jota","Pedro Neto","Joao Felix","Francisco Conceicao","Chiquinho","Andre Silva","Renato Sanches"],
  "DR Congo":["Matthieu Epolo","Timothy Fayulu","Lionel Mpasi","Dylan Batubinsika","Gedeon Kalulu","Steve Kapuadi","Joris Kayembe","Arthur Masuaku","Chancel Mbemba","Axel Tuanzebe","Aaron Wan-Bissaka","Brian Cipenga","Meshack Elia","Gael Kakuta","Edo Kayembe","Nathanael Mbuku","Samuel Moutoussamy","Ngal'ayel Mukau","Charles Pickel","Noah Sadiki","Aaron Tshibola","Cedric Bakambu","Simon Banza","Fiston Mayele","Yoane Wissa","Theo Bongonda"],
  Uzbekistan:["Utkir Yusupov","Otabek Shukurov","Eldor Shomurodov","Jasurbek Yakhshiboev","Sherzod Nasrullayev","Azizbek Turgunboev","Khojiakbar Alijonov","Ibrohim Rabimov","Abbosbek Fayzullayev","Otabek Norqoziev","Jamshid Iskanderov","Shamsiddin Shokirjonov","Behruz Abdullayev","Ruslan Nishonov","Islom Tuygunov","Doniyor Tursunov","Zafarjon Tursunov","Khayrulla Ismoilov","Farrukhjon Tashkentov","Bobur Abdixoliqov","Nodir Nishonov","Jakhongir Sidikov","Khusan Khudoyberdiyev","Dostonbek Khamdamov","Jasur Yaxshibayev","Ravshan Akramov"],
  Colombia:["Camilo Vargas","Alvaro Montero","David Ospina","Davinson Sanchez","Jhon Lucumi","Yerry Mina","Willer Ditta","Daniel Munoz","Santiago Arias","Johan Mojica","Deiver Machado","Richard Rios","Jefferson Lerma","Kevin Castano","Juan Camilo Portilla","Gustavo Puerta","Jhon Arias","Jorge Carrascal","Juan Fernando Quintero","James Rodriguez","Jaminton Campaz","Juan Camilo Hernandez","Luis Diaz","Carlos Gomez","Jhon Cordoba","Luis Suarez Charris"],
  England:["Jordan Pickford","Dean Henderson","James Trafford","Reece James","Ezri Konsa","Jarell Quansah","John Stones","Marc Guehi","Dan Burn","Nico O'Reilly","Djed Spence","Tino Livramento","Declan Rice","Elliot Anderson","Kobbie Mainoo","Jordan Henderson","Morgan Rogers","Jude Bellingham","Eberechi Eze","Harry Kane","Ivan Toney","Ollie Watkins","Bukayo Saka","Marcus Rashford","Anthony Gordon","Noni Madueke"],
  Croatia:["Dominik Livakovic","Dominik Kotarski","Ivor Pandur","Josko Gvardiol","Duje Caleta-Car","Josip Sutalo","Josip Stanisic","Marin Pongracic","Martin Erlic","Luka Vuskovic","Luka Modric","Mateo Kovacic","Mario Pasalic","Nikola Vlasic","Luka Sucic","Martin Baturina","Kristijan Jakic","Petar Sucic","Nikola Moro","Toni Fruk","Ivan Perisic","Andrej Kramaric","Ante Budimir","Marco Pasalic","Petar Musa","Igor Matanovic"],
  Ghana:["Joseph Anang","Benjamin Asare","Lawrence Ati-Zigi","Jonas Adjetey","Derrick Luckassen","Gideon Mensah","Abdul Mumin","Jerome Opoku","Kojo Oppong Preprah","Baba Abdul Rahman","Alidu Seidu","Marvin Senaya","Augustine Boakye","Abdul Fatawu Issahaku","Elisha Owusu","Thomas Partey","Kwasi Sibo","Kamal Deen Sulemana","Caleb Yirenkyi","Prince Kwabena Adu","Jordan Ayew","Christopher Bonsu Baah","Ernest Nuamah","Antoine Semenyo","Brandon Thomas-Asante","Inaki Williams"],
  Panama:["Luis Mejia","Orlando Mosquera","Cesar Samudio","Jorge Gutierrez","Amir Murillo","Fidel Escobar","Andres Andrade","Edgardo Farina","Jose Cordoba","Eric Davis","Roderick Miller","Anibal Godoy","Adalberto Carrasquilla","Carlos Harvey","Cristian Martinez","Jose Luis Rodriguez","Yoel Barcenas","Alberto Quintero","Armando Cooper","Ismael Diaz","Fredrick Pinto","Harold Cummings","Cecilio Waterman","Gabriel Torres","Alberto Quintero Jr","David Gracia"],
};

const PLAYERS = Object.values(SQUADS).flat().filter((p,i,a)=>a.indexOf(p)===i).sort();
const GOALKEEPERS = [
  "Alisson","Ederson","Weverton","Yassine Bounou","Munir Mohamedi","Ahmed Reda Tagnaouti",
  "Jordan Pickford","Dean Henderson","James Trafford","Mike Maignan","Robin Risser","Brice Samba",
  "Manuel Neuer","Oliver Baumann","Alexander Nuebel","Thibaut Courtois","Senne Lammens","Mike Penders",
  "Emiliano Martinez","Geronimo Rulli","Juan Musso","Diogo Costa","Jose Sa","Rui Patricio",
  "Fernando Muslera","Sebastian Sosa","Sergio Rochet","Dayne St Clair","Maxime Crepeau","Owen Goodman",
  "Mathew Ryan","Paul Izzo","Patrick Beach","David Raya","Alex Remiro","Unai Simon",
  "Angus Gunn","Craig Gordon","Liam Kelly","Kim Seung-Gyu","Jo Hyeon-woo","Song Bum-keun",
  "Orjan Nyland","Pal Hafstad","Ole Selvik","Matej Kovar","Jindrich Stanek","Lukas Hornicek",
  "Mohammed Al-Owais","Nawaf Al-Aqidi","Ahmed Al-Kassar","Guillermo Ochoa","Raul Rangel","Carlos Acevedo",
  "Ronwen Williams","Ricardo Goss","Sipho Chaine","Mark Flekken","Robin Roefs","Bart Verbruggen",
  "Tomoki Hayakawa","Keisuke Osako","Zion Suzuki","Alireza Beiranvand","Seyed Hossein Hosseini","Payam Niazmand",
  "Max Crocombe","Alex Paulsen","Michael Woud","Ugurcan Cakir","Altay Bayindir","Mert Gunok",
  "Eloy Room","Trevor Doornbusch","Tyrick Bodack","Yahia Fofana","Mohamed Kone","Alban Lafont",
  "Camilo Vargas","Alvaro Montero","David Ospina","Matthieu Epolo","Timothy Fayulu","Lionel Mpasi",
  "Matt Turner","Chris Brady","Matt Freese","Edouard Mendy","Alfred Gomis","Seny Dieng",
  "Fahad Talib","Jalal Hassan","Ahmed Basil","Johny Placide","Alexandre Pierre","Josue Duverger",
  "Dominik Livakovic","Dominik Kotarski","Ivor Pandur","Joseph Anang","Benjamin Asare","Lawrence Ati-Zigi",
  "Nikola Vasilj","Martin Zlomislic","Osman Hadzikic","Mohamed El Shenawy","Mostafa Shobeir","Mohamed Alaa",
  "Aymen Dahmen","Bechir Ben Said","Mouez Hassen","Hernan Galindez","Moises Ramirez","Gonzalo Valle",
  "Utkir Yusupov","Otabek Shukurov","Marvin Keller","Gregor Kobel","Yvon Mvogo",
  "Meshaal Barsham","Yousef Hassan","Mohammed Al-Bakri","CJ dos Santos","Marcio Rosa","Vozinha",
  "Viktor Johansson","Kristoffer Nordfeldt","Jacob Widell Zetterström","Luis Mejia","Orlando Mosquera","Cesar Samudio",
  "Anthony Silva","Alfredo Aguilar","Roberto Fernandez",
];

/* ─── FSP LOGO ───────────────────────────────────────────────── */
const FSP_LOGO_LG = "data:image/png;base64,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";
const FSP_LOGO_MD = "data:image/png;base64,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";
const FSP_LOGO_SM = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAIAAADYYG7QAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAALyklEQVR42u1ZaZBc1XX+zr3vvV6me1qzapkNobFGy2gzEUZYwghZUBQ4AszmRLHLqFI2ppKUnbhSRZICx7jA2CogLgwxJo5lByWAIYgYW4IAWpA1QoyENNIIbbP1TM/aM9PTy9vuPfnRrWEkpBktVCU/cn+97vfuvd8975zvnO880loDYGZ8YhARMxNR/uf5rieO/Drnm3jOXcb3KjyplML/pSHOedBLGPxpAbr8JTQDgBRQ/L8NSDM0w5BEhGEbpiQCFF+WtYxLeTsMDUiCIQng5n79wnHd72JtNX1ljjAlwPA0CCDCxToEaa0ncf5x/xh/RBCEyO/C+/r4tVOcdPCn86g2zM+2ojODm2twa52IWpTH7mmATyO7AHxTAGJAACSAwlLMjFOj+EMvf9DPgvjGWnFTnQDgutoSfGAIm09wxygWlNINNfTZSgqbZyynNCaPoikACQGlMWSjL4eOFJ8YRU+aNaM+RquqsLCMAGKGZtiu9jWiFgmJzlF+s5ObEpz2UBGkuSVYUEZ1MZoRQdiE1pcEiBlC0okR/bPDHJAIGygPUl0U80qornjcYIUnAdhufh9iICghDAK4J4XWJB9L8tEBHvMwmMH6RXT3AuEpSLpIQPnw2dKmuzP4xkISEwytNXyGIXBiVCmN+aVSM3yftYYQRIA+zcmWhNLcM6rryiWAF1v0e9381E2G57M8T3yLyT1aMcpDJIg8jazHWY81QwhYEoJIM9SE6UIAxApaEEAImHR0QJU/bP9zk9IMMGZGqMDDdKk8pE8HhiR4im2fCfRum7c37gOYVyIbywzmQoQLgZyPPQlkfZiCiPDKQe+W+XTvMoNOJyylaVI8UwBiIQqzNSMWlKUhyeCTSe4YYWb2NZQuHFgQGYIEwfUhBUmJ776WnVksXlgfbKgQng8QNLMgvixiDBo85lOefg70uLNLZSwoN1xl5j3JEAAwYvPJEW4oIUdDgqcFyZL8N69kl9YY65cH9vTw7GKUBQHAUTAlT574JrcQhQ04ujC9fUTbXt4wBAghKOdxyuGQSakcGwYO9bMQVB7m77yUWTHbXL88YHsM8HiYj7kcNmnyVDzFK4tayKgCH962IDA9KonIENjU7OyL+5ZB3Rm8cdj98dbcloPuounCIPzwt9mVc4x1i+SHfTppc0CCAAYDnLQRC0xRGRjnr5gAoMSktM/5+slXMCSNOfrZJrfIpC2HvfZh1ZnUvSP+T+4KPr/L6RjS8QHvruWRlta2F5NqxcoGz/MJAlzgqt406qZdXrYvC8DWbCsIwJDUPqJ+/aG7eo7xrRXW364OHEponwKPr4taIfMH6yKuL25ZHFhSTdv3J25bWZPOsiEIzCg4MvWmuaaYxk97kRYCtEbUhCD021xbJI4Pum0j+s+WmJEAdaV0Mofv3Rgc7j0xcCLpcqif0/dfu7C0OPbYqx2NtaFwUViNemSxAIGFJLJdjNg8Z9plhL1iEKHUoo4sHE9ZEevG+mAwIB2IALEgYWdTyaO7/Owo4nvt4b6RY+/1Zfy3/nDq5s/XpxxlWiYFLWGZrFkKdKUYwKwo9KT5dTJAeU6tj+DIiA6YcvjAvhMfvN/X0XVqX3MoakTCxMoLFUXL6hqN4hmltfPh5/qTPf94Q//MGCEgw86A1/J2INFihAwW1JzQ1cUkRYG6LgkQAeDGYsRdOZToOfbC0zzQdeTnjw5t/fXOBx8QY0MiPM23M25mRPlqbKjXghOQ3oKS4aztxV96Wv7kC+72H8R/enfPM98mVnvivKIKk+eNqS2kFGaEyWJqHtRVq9Y0v/xC36EDRv2iosrKbQ/cPTo0zCS9XNb3PM91S8rLZuWONR2zB/oHKmvnxBrWDMXH+pyiwRef3PvL5+KedV0NM0PQZURZPjFcHfX2GdXH9+/b8eY7dtbZ88QjdqC46DPzNz/4XU2GnU1n05lw6fSiiNV7uNmsmHf91fNfOuFvKbszG1kUaztqMJ78TUvjdJQUwVdTFI1TAJIErfn6WehNIztnVX8md7h7eCjHv9/42N633xXF0+Kd3anRVCadKY4KOL1PvbzraH/Oc72X/v03jz26seLeB+Op0Lae0Mml9391ATMLMVUNO3WRrxkBU36pwntl7peX3/W713/xy8qS4sorZn/tgb+sjZbKK6qSXiY7tEMlytq37okcdxZ9tdKwzGc3/v1gcmQolTuU0r+t++tv3No4O+p5vpRTyRz50EMPTVF1E5RGfSnt7tbWkrVzVNd/727+h3/9lxXr7vCzWeofNq+ss9sPiqffMdPhNeGw/erWLbaPUKimpu7Jxx99q3/mvD9/8olbQCzOKPMuGVDevZnp2hn88yMBq27xqoUVy65dEYmE2TT6Wlt1RenxTdsqdraGl1yZTGfVBx/96JXXX4331sQC+3qD7nWP/GK9VVlEmklcgCa6IF1GADPClnjqC+rrb9TOXPNXhtPS1aXIR386O3bo4EenTunkaEnzR66nBlJjFXV11Q1Vrx+04zUbnvuTQH05PJ/khWnSi2g2aIYhMZzTD2wju6ftnvIWYyTRcqAtE4Ju3Z3dMxSrjKpkJjM8uHzjI7vE5/cPzXj+vuKl1XThaC4O0DgmsP7+dr15R3djZvdN9XpWbVXOp/d3NI3t363TmZ7q64aWfXNudekPb6fyiPB8yIvR6xfdjtEMIkiBg33ix+/BtdU9jVjzGdLK3XoovXmfTuvo/SvFl6+SwEWjOQcgZhZCMLPWTFRoPU1oKeULda00AiYA/c4x/tVevzfpk+ZYkfnHS8w7lgnLJF8VdLc+Tc35C+aPBbXmgjrj8wESggCybUdKaZoGAK21EIUzKqWklJ7n528pzVIQ4AI0kDY8TbOKVZ5pMw4HTcg8GkHjTTRfsSELmjp/K+exIc4QjWcIRcf1Hv+nTWMj6fu+tu7dXc3Do2N/952v3/cX3//2/ffu2vOhFPLVN7bfvOaaz13V+NTP/mPTMw8/8czmrs7etTdcE4/Ha6unt3UNfnPDnRvfzA5kxNoFcucpPWzj5gZ6q42zHm5bIN7sgEGYX4HftdOy6WwQBl36yjxaWiGULhiyIBS1ZiFER1fiv7buqqmd6Tjuy1vebmvvTvQN7t1/5OHHnuvtG7zjS9eXxCLf2nDnc796rbOrt7Mr0ZMYYNZLG+s9Td/buOme279oCBxLKIv9bE4dbHPJ8Z7Z7tzdKK+ejn9r8ob7vWTSX1ZBMeVvWCyP92nK+LNCNLGELBCj1iyleGfnPtM0br919dPPv1wSi46ls8OjqZWfW9LSenLxwvry8rLBweGc7e7YfWBaccTzVV3NjP98Y8c1yxdLKa6sq1q96qreYbcvqXYe9QZHVXmY1q8I2hm/6YgzlNElAe4eUnPLcF298d4R95ZG81Sn8/sWd+18szIq8rHysQ/lfTne0x+NhKfFooePnlw4b053T186nampqszmbCFkOGiMpp1cNntF3axszo3HE12JZHlpZMmi+fF4oqgoVFISS9vq7RZ3YY0ZMrksKgOmHMmopo+cebWmJVEWEYlRFQvJtKNjIfFuqztnulxQZUzsh5zl1AKA6/mWaaRznmmZIGRybBrkKd56MHv7HxU1nfKjpppdab7f7t24MLC3nS1yGmYFUznteqpryL92bmjbwcxnr7CSGd0x6K+aF9p1LNcww6woNtO2DlsEsGUQM5uGyAfHxIxiTAhsKKU0w/F5JGPbPuWG7ZyHjIuAgSILo2nP99XhjrHZFda0MB04Mba6Qba2p8uisjRMo1ntKAymfF8xAYYUbf1OIumnMtbeY07EorSD/pSOhihsIWhQkcWmQeGANM7McGfzEOUJ5xNZUCmWkgD4viYiBsZyOhYWqZwOmcIyoTSkoMGUXxaVmmEIOD5sV8eKpK8YyDckz+7P6U/0Xs7N1BP1N49XavlWIQF5ciPSmoUgMGvOy1MIQXlGLZSq9LHG0LqwFJ0+On0qqWNi44woj+3sPyce7GK7sJfepz5n5+msAuwSPhJ8Cp38T/lbx/8DmmL8D/EqWbjefjdCAAAAAElFTkSuQmCC";
function FspLogo({size=80,style={}}){
  return<img src={FSP_LOGO_LG} alt="FSP" style={{width:size,height:size,objectFit:"contain",...style}}/>;
}

/* ─── CONSTANTS ─────────────────────────────────────────────── */
const PFX = "fifa26_";
const SHARED_PFX = "ipl26_";
const SUPER_ADMIN = "akashkotak@gmail.com";

const GOAL_BANDS = [
  {id:"0",label:"0 Goals",short:"0",emoji:"🫙"},
  {id:"1",label:"1 Goal",short:"1",emoji:"⚽"},
  {id:"2",label:"2 Goals",short:"2",emoji:"⚽⚽"},
  {id:"3",label:"3 Goals",short:"3",emoji:"🔥"},
  {id:"4+",label:"4+ Goals",short:"4+",emoji:"💥"},
];

const BONUS_QUESTIONS = {
  // Group Stage — M1 to M72
  1:"Will Mexico score in the first half against South Africa?",
  2:"Will this match produce fewer than 3 goals combined?",
  3:"Will South Africa register a shot on target in the first 20 minutes?",
  4:"Will Mexico win by 2 or more goals?",
  5:"Will this final Group A match end in a draw?",
  6:"Will the Group A decider produce 3+ goals?",
  7:"Will Canada keep a clean sheet in their opening match?",
  8:"Will Qatar score their first-ever World Cup goal against Switzerland?",
  9:"Will Switzerland win this match by 2+ goals?",
  10:"Will Canada score in the first half vs Qatar?",
  11:"Will Bosnia and Herzegovina score first against Qatar?",
  12:"Will Canada qualify from Group B after this match?",
  13:"Will Brazil score 2+ goals against Morocco?",
  14:"Will Haiti concede 2+ goals against Scotland?",
  15:"Will Morocco keep a clean sheet vs Haiti?",
  16:"Will Brazil win without conceding a goal?",
  17:"Will Scotland secure qualification with a win here?",
  18:"Will Brazil top Group C with a win or draw here?",
  19:"Will the USA score inside the opening 20 minutes vs Paraguay?",
  20:"Will Turkiye score first against Australia?",
  21:"Will USA win this match to stay top of Group D?",
  22:"Will this match produce an own goal?",
  23:"Will Turkiye score a late winner (80+ min) against USA?",
  24:"Will Paraguay qualify from this group?",
  25:"Will Germany score 3 or more goals against Curacao?",
  26:"Will Ivory Coast cause an upset against Ecuador?",
  27:"Will Germany win this crunch Group E match?",
  28:"Will Ecuador record a comfortable 2+ goal win vs Curacao?",
  29:"Will Curacao register their first World Cup point here?",
  30:"Will Ecuador hold Germany to qualify from Group E?",
  31:"Will Netherlands win comfortably by 2+ goals vs Japan?",
  32:"Will Sweden keep a clean sheet against Tunisia?",
  33:"Will Netherlands vs Sweden produce 3+ goals?",
  34:"Will Japan record a famous World Cup upset vs Tunisia?",
  35:"Will Japan qualify by beating Sweden here?",
  36:"Will Tunisia beat Netherlands to reach the knockouts?",
  37:"Will Belgium score 3+ goals against Egypt?",
  38:"Will Iran keep a clean sheet vs New Zealand?",
  39:"Will Belgium vs Iran be decided by a single goal?",
  40:"Will New Zealand claim a shock point or win vs Egypt?",
  41:"Will this match produce a red card?",
  42:"Will New Zealand cause the biggest upset of the group stage vs Belgium?",
  43:"Will Spain score first in their opening match vs Cape Verde?",
  44:"Will Uruguay beat Saudi Arabia to go top of Group H?",
  45:"Will Spain qualify from Group H after beating Saudi Arabia?",
  46:"Will Uruguay score first against Cape Verde?",
  47:"Will Uruguay vs Spain produce 2+ goals?",
  48:"Will Saudi Arabia qualify from Group H in this decider?",
  49:"Will France score 2 or more goals vs Senegal?",
  50:"Will Norway score first against Iraq?",
  51:"Will France win to go top of Group I?",
  52:"Will Norway qualify from Group I by beating Senegal?",
  53:"Will this Norway vs France clash end in a draw?",
  54:"Will Senegal record a 2+ goal win vs Iraq to progress?",
  55:"Will Argentina score in the first 15 minutes vs Algeria?",
  56:"Will Austria win their opening match against Jordan?",
  57:"Will Argentina avoid defeat and secure top spot in Group J?",
  58:"Will Jordan register their first World Cup win vs Algeria?",
  59:"Will Algeria qualify by beating Austria in this decider?",
  60:"Will Jordan cause the shock of the group stage by beating Argentina?",
  61:"Will Portugal score 3+ goals in their opener vs DR Congo?",
  62:"Will Colombia claim an upset win vs Uzbekistan?",
  63:"Will Portugal vs Uzbekistan end with a clean sheet for Portugal?",
  64:"Will Colombia score first against DR Congo?",
  65:"Will Colombia top Group K with a win or draw here?",
  66:"Will DR Congo secure qualification in this dead-rubber?",
  67:"Will England win their opening match vs Croatia by 2+ goals?",
  68:"Will Ghana beat Panama in this Group L opener?",
  69:"Will England score first against Ghana?",
  70:"Will Croatia vs Panama produce fewer than 3 goals?",
  71:"Will England qualify from Group L with a win here?",
  72:"Will Croatia secure a top-2 finish by beating Ghana?",
  // Round of 32 — R32-1 to R32-16
  73:"Will this Round of 32 match be decided in 90 minutes?",
  74:"Will either team score in the first 20 minutes of this match?",
  75:"Will this match produce 3 or more goals?",
  76:"Will there be a red card in this knockout match?",
  77:"Will the match winner keep a clean sheet?",
  78:"Will this match go to extra time?",
  79:"Will there be a penalty in this Round of 32 match?",
  80:"Will the favourite (higher-ranked team) win this match?",
  81:"Will this match produce a goal in the final 10 minutes?",
  82:"Will any player score a brace (2 goals) in this match?",
  83:"Will this match be decided by a penalty shootout?",
  84:"Will both teams score in this Round of 32 clash?",
  85:"Will there be 2+ goals in the second half of this match?",
  86:"Will the winning team win by 2+ goals?",
  87:"Will this match be goalless at half time?",
  88:"Will a substitute score the decisive goal in this match?",
  // Round of 16 — R16-1 to R16-8
  89:"Will this Round of 16 match go to extra time?",
  90:"Will the first goal in this match come from a set piece?",
  91:"Will both teams score in this Round of 16 clash?",
  92:"Will this match be decided by a penalty shootout?",
  93:"Will there be a red card in this match?",
  94:"Will the winning team keep a clean sheet in this Round of 16?",
  95:"Will this match produce 3+ goals in 90 minutes?",
  96:"Will a penalty be awarded and scored in this match?",
  // Quarter Finals — QF-1 to QF-4
  97:"Will this Quarter Final go to extra time?",
  98:"Will the first goal in this Quarter Final come in the second half?",
  99:"Will this Quarter Final be decided by a penalty shootout?",
  100:"Will both teams score in this Quarter Final?",
  // Semi Finals — SF-1, SF-2
  101:"Will this Semi Final produce 2+ goals in 90 minutes?",
  102:"Will this Semi Final be decided by a penalty shootout?",
  // 3rd Place & Final
  103:"Will the 3rd Place match produce 3 or more goals?",
  104:"Will the Final be decided by a penalty shootout?",
};

const CHAT_MAX = 400;
const CHAT_CAP = 500;
const NR = "NO_RESULT";

const PTS = {
  win:20, motm:30, goals:10, streak:15,
  bonus:15, season:200, top4:50,
  woodenSpoon:50, goldenBoot:100,
  goldenGlove:75,
};

const TRASH_TALK = [
  (perfs,zeros,lone,mn)=>`⚽ ${mn} FULL TIME!\n${perfs.length?`🎯 ${perfs.join(" & ")} nailed all 3! Class.`:"Nobody got a perfect. The beautiful game humbled us all. 💀"}\n${zeros.length?`😅 Moment of silence for ${zeros.join(", ")} — 0 from 3.`:""}\n${lone?`🐉 Lone wolf: ${lone} was the only one who called it. Respect.`:""}`,
  (perfs,zeros,lone,mn)=>`🏟 ${mn} DONE!\n${perfs.length?`🏆 Perfect picks: ${perfs.join(", ")}. Someone's been watching the group stage properly.`:"Not a single perfect pick. Football remains delightfully unpredictable."}\n${zeros.length?`🪦 Pour one out for ${zeros.join(", ")} (0/3). The ref wasn't the only one having a bad day.`:""}\n${lone?`🐉 ${lone} backed the winner alone. Absolute scenes.`:""}`,
  (perfs,zeros,lone,mn)=>`⚡ ${mn} FINAL WHISTLE!\n${perfs.length?`🎯 PERFECTS: ${perfs.join(", ")} — read the game perfectly!`:"Nobody called it perfectly. VAR couldn't save your predictions either."}\n${zeros.length?`💀 Complete whitewash for ${zeros.join(", ")}. Didn't get a single one.`:""}\n${lone?`🔮 Only ${lone} predicted the winner. Fortune favours the bold.`:""}`,
];

/* ─── UTILS ──────────────────────────────────────────────────── */
const encodeEmail = e => (e||"").trim().toLowerCase().replace(/\./g,"_dot_").replace(/@/g,"_at_");
const ek = encodeEmail;
const normalizeEmail = e => (e||"").trim().toLowerCase();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isNR = v => !v || v === NR;
const isTBD = m => (m.home||"").startsWith("TBD") || (m.away||"").startsWith("TBD");

function validateEmail(e){if(!e?.trim())return"Email is required";if(!EMAIL_RE.test(e.trim()))return"Enter a valid email";return"";}
function validatePassword(p,mode="login"){if(!p)return"Password is required";if(mode==="register"){if(p.length<8)return"Min 8 characters";if(!/[A-Z]/.test(p))return"Add an uppercase letter";if(!/[0-9]/.test(p))return"Add a number";if(!/[^A-Za-z0-9]/.test(p))return"Add a special character";}return"";}
function validateName(n){if(!n||n.trim().length<2)return"Name must be at least 2 characters";return"";}
async function sha256(str){const buf=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(str));return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");}
const capChat = arr => arr.length>CHAT_CAP?arr.slice(arr.length-CHAT_CAP):arr;

function parseMatchDate(date,time){try{const t=(time||"00:00").trim(),p=t.length===4?"0"+t:t;const d=new Date(date+"T"+p+":00-05:00");return isNaN(d.getTime())?null:d;}catch{return null;}}
const cutoff = m => {const d=parseMatchDate(m.date,m.time);return d?new Date(d-35*60*1000):new Date(0);};
const isMatchLocked = (m,lm={}) => {if(m.result)return true;const st=lm[m.id]??lm[String(m.id)];if(st==="unlocked")return false;if(st==="locked")return true;return new Date()>=cutoff(m);};
const isToday = m => m.date===new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"});

const motmMatch = (a,b) => {
  if(!a||!b||isNR(a)||isNR(b)) return false;
  const na=a.trim().toLowerCase(),nb=b.trim().toLowerCase();
  return na===nb||na.endsWith(" "+nb)||nb.endsWith(" "+na)||na.includes(nb)||nb.includes(na);
};

/* ─── FIREBASE ───────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey:"AIzaSyCzDq7yWYOTfVp5kfs_BPsnLzc5ka6HyKQ",
  authDomain:"ipl2026-fantasy-20c9b.firebaseapp.com",
  databaseURL:"https://ipl2026-fantasy-20c9b-default-rtdb.firebaseio.com",
  projectId:"ipl2026-fantasy-20c9b",
  storageBucket:"ipl2026-fantasy-20c9b.firebasestorage.app",
  messagingSenderId:"973930153403",
  appId:"1:973930153403:web:872ce26072b07e1adf309e"
};

const firebaseReady = (async()=>{
  const [app,db] = await Promise.all([
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"),
    import("https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js"),
  ]);
  const _app = app.getApps().length ? app.getApp() : app.initializeApp(firebaseConfig);
  return {db:db.getDatabase(_app),dbMod:db};
})();

const DB = {
  // FIFA game data — uses fifa26_ prefix in the shared IPL database
  get: async k=>{try{const{db,dbMod}=await firebaseReady;const s=await dbMod.get(dbMod.ref(db,PFX+k));return s.exists()?s.val():null;}catch(e){console.error("DB.get",k,e);return null;}},
  set: async(k,v)=>{try{const{db,dbMod}=await firebaseReady;if(v==null)await dbMod.remove(dbMod.ref(db,PFX+k));else await dbMod.set(dbMod.ref(db,PFX+k),v);}catch(e){console.error("DB.set",k,e);}},
  setUserPick: async(userKey,matchId,pick)=>{
    try{const{db,dbMod}=await firebaseReady;await dbMod.set(dbMod.ref(db,PFX+"ap/"+userKey+"/"+String(matchId)),pick);return true;}catch(e){console.error("DB.setUserPick",e);return false;}
  },
  // Shared user/auth data — uses ipl26_ prefix (same accounts across both apps)
  getPw: async k=>{try{const{db,dbMod}=await firebaseReady;const s=await dbMod.get(dbMod.ref(db,SHARED_PFX+"pw_"+k));return s.exists()?s.val():null;}catch(e){return null;}},
  setPw: async(k,v)=>{try{const{db,dbMod}=await firebaseReady;await dbMod.set(dbMod.ref(db,SHARED_PFX+"pw_"+k),v);}catch(e){console.error("DB.setPw",e);}},
  getToken: async k=>{try{const{db,dbMod}=await firebaseReady;const s=await dbMod.get(dbMod.ref(db,SHARED_PFX+"token_"+k));return s.exists()?s.val():null;}catch(e){return null;}},
  setToken: async(k,v)=>{try{const{db,dbMod}=await firebaseReady;if(v==null)await dbMod.remove(dbMod.ref(db,SHARED_PFX+"token_"+k));else await dbMod.set(dbMod.ref(db,SHARED_PFX+"token_"+k),v);}catch(e){console.error("DB.setToken",e);}},
  getIpl: async k=>{try{const{db,dbMod}=await firebaseReady;const s=await dbMod.get(dbMod.ref(db,SHARED_PFX+k));return s.exists()?s.val():null;}catch(e){return null;}},
};

/* ─── SCORING ────────────────────────────────────────────────── */
function calcScore(uPicks,ms,dbl=null){
  let pts=0,ok=0,tot=0;
  ms.forEach(m=>{
    if(!m.result)return;
    const p=uPicks[String(m.id)]??uPicks[Number(m.id)];
    if(!p||(!p.win&&!p.motm))return;
    const mult=(dbl!=null&&Number(dbl)===Number(m.id))?2:1;
    tot++;let base=0,h=0;
    const wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
    if(wA&&p.win===m.result.win){base+=PTS.win;h++;}
    if(mA&&motmMatch(p.motm,m.result.motm)){base+=PTS.motm;h++;}
    const avail=[wA,mA].filter(Boolean).length;
    const correct=[wA&&p.win===m.result.win,mA&&motmMatch(p.motm,m.result.motm)].filter(Boolean).length;
    if(avail>0&&correct===avail)base+=PTS.streak;
    if(h>0)ok++;pts+=base*mult;
  });
  return{pts,acc:tot?Math.round(ok/tot*100):0};
}

/* ─── CSS ────────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@700;800&family=Barlow:wght@400;600;700&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#F0F4F8;}
.fifa-app{font-family:'Barlow',sans-serif;background:#F0F4F8;min-height:100vh;color:#0a1628;max-width:430px;margin:0 auto;}
.C{font-family:'Bebas Neue',sans-serif;letter-spacing:1px;}
.inp{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1px solid #d0d8e8;color:#0a1628;font-size:14px;font-family:'Barlow',sans-serif;outline:none;transition:border .2s;}
.inp:focus{border-color:#004B87;box-shadow:0 0 0 3px rgba(0,75,135,.08);}
.inp.err{border-color:#ef4444;background:#fef2f2;}
.sel{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1px solid #d0d8e8;color:#0a1628;font-size:14px;font-family:'Barlow',sans-serif;outline:none;cursor:pointer;}
.pbtn{width:100%;padding:12px;border-radius:10px;background:linear-gradient(135deg,#004B87,#006BB6);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;}
.pbtn:disabled{opacity:.45;cursor:default;}
.lbtn{width:100%;padding:13px;border-radius:10px;background:linear-gradient(135deg,#004B87,#006BB6);color:#fff;font-family:'Bebas Neue',sans-serif;font-size:18px;letter-spacing:2px;text-transform:uppercase;border:none;cursor:pointer;}
.dbtn{width:100%;padding:10px;border-radius:10px;background:#fef2f2;color:#dc2626;font-family:'Bebas Neue',sans-serif;font-size:15px;letter-spacing:1px;text-transform:uppercase;border:1px solid #fecaca;cursor:pointer;}
.tbtn{flex:1;padding:9px 2px;border:none;background:transparent;color:#94a3b8;border-bottom:2px solid transparent;font-family:'Barlow',sans-serif;font-weight:600;font-size:10px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;transition:all .2s;}
.tbtn.on{color:#004B87;border-bottom:2px solid #004B87;}
.mcard{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:14px;margin-bottom:12px;position:relative;overflow:hidden;box-shadow:0 2px 8px rgba(0,75,135,.07);}
.mcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,#004B87,#006BB6,#C5A028);}
.tmbtn{flex:1;padding:12px 6px;border-radius:12px;background:#f8faff;border:1.5px solid #d0d8e8;display:flex;flex-direction:column;align-items:center;gap:7px;cursor:pointer;transition:all .15s;}
.tmbtn.on{border-color:#004B87;background:#E6F0FB;}
.nav{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:430px;background:#fff;border-top:1px solid #e2e8f0;display:flex;padding:8px 0 10px;z-index:100;box-shadow:0 -4px 16px rgba(0,75,135,.08);}
.ni{flex:1;background:none;border:none;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;padding:2px 0;}
.nl{font-size:9px;font-family:'Barlow',sans-serif;font-weight:600;letter-spacing:.4px;text-transform:uppercase;}
.st{font-family:'Bebas Neue',sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#004B87;margin:0 0 10px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;}
.ac{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px;margin-bottom:14px;}
.at{flex:1;padding:8px 2px;border:none;background:transparent;color:#94a3b8;border-bottom:2px solid transparent;font-family:'Barlow',sans-serif;font-weight:600;font-size:9px;cursor:pointer;text-transform:uppercase;letter-spacing:.3px;transition:all .2s;}
.at.on{color:#004B87;border-bottom:2px solid #004B87;}
.bd{position:absolute;top:-3px;right:-3px;width:8px;height:8px;border-radius:50%;background:#ef4444;border:1.5px solid #fff;}
.ferr{color:#ef4444;font-size:11px;margin-top:4px;font-weight:600;}
.dd-wrap{position:relative;}
.dd-list{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1.5px solid #004B87;border-radius:12px;max-height:220px;overflow-y:auto;z-index:200;box-shadow:0 8px 24px rgba(0,75,135,.15);}
.dd-item{display:flex;align-items:center;gap:10px;padding:10px 14px;cursor:pointer;border-bottom:1px solid #f1f5f9;font-size:13px;}
.dd-item:last-child{border-bottom:none;}
.dd-item:hover,.dd-item.sel{background:#E6F0FB;}
.dd-trigger{width:100%;padding:11px 14px;border-radius:10px;background:#f8faff;border:1.5px solid #d0d8e8;color:#0a1628;font-size:13px;font-family:'Barlow',sans-serif;outline:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;text-align:left;}
.dd-trigger.open{border-color:#004B87;}
.ot{display:flex;flex-direction:column;align-items:center;gap:5px;padding:10px 6px;border-radius:12px;border:2px solid #e2e8f0;background:#fff;cursor:pointer;width:76px;transition:all .15s;}
.ot.on{border-color:#004B87;background:#E6F0FB;}
.bq-btn{flex:1;padding:9px 6px;border-radius:10px;border:2px solid #e2e8f0;background:#f8faff;font-family:'Bebas Neue',sans-serif;font-size:14px;cursor:pointer;letter-spacing:.5px;text-transform:uppercase;transition:all .15s;}
.bq-btn.yes.on{border-color:#15803d;background:#f0fdf4;color:#15803d;}
.bq-btn.no.on{border-color:#dc2626;background:#fef2f2;color:#dc2626;}
.tog{width:44px;height:24px;border-radius:12px;border:none;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;}
.tog-knob{position:absolute;top:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:left .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
.ctrl-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #f1f5f9;}
.ctrl-row:last-child{border-bottom:none;}
.form-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.bubble{display:inline-block;padding:9px 13px;border-radius:18px;font-size:13px;line-height:1.5;white-space:pre-wrap;}
.bubble.me{background:linear-gradient(135deg,#004B87,#006BB6);color:#fff;border-bottom-right-radius:4px;}
.bubble.them{background:#fff;color:#0a1628;border:1px solid #e2e8f0;border-bottom-left-radius:4px;}
.bubble.sys{background:#E6F0FB;color:#004B87;border:1px solid #004B8720;border-radius:10px;padding:8px 14px;font-size:11px;text-align:center;font-weight:600;}
.chat-row{display:flex;flex-direction:column;gap:3px;max-width:82%;word-break:break-word;}
.chat-row.me{align-self:flex-end;align-items:flex-end;}
.chat-row.them{align-self:flex-start;align-items:flex-start;}
.chat-row.sys{align-self:center;align-items:center;max-width:94%;}
.bar-bg{height:7px;border-radius:4px;background:#e2e8f0;overflow:hidden;}
.bar-fill{height:100%;border-radius:4px;transition:width .6s;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.fade-in{animation:fadeIn .4s ease forwards;}
.spin{animation:spin .8s linear infinite;}
`;

/* ─── SUB-COMPONENTS ─────────────────────────────────────────── */
/* ─── COUNTRY ABBREVIATIONS (replaces emoji flags — fixes ?? on Android) ── */
const ABBR = {
  Argentina:"ARG",France:"FRA",Brazil:"BRA",England:"ENG",Spain:"ESP",
  Portugal:"POR",Germany:"GER",Netherlands:"NED",Belgium:"BEL",Croatia:"CRO",
  Uruguay:"URU",Denmark:"DEN",Switzerland:"SUI",USA:"USA",Mexico:"MEX",
  Canada:"CAN",Morocco:"MAR",Senegal:"SEN",Japan:"JPN","South Korea":"KOR",
  Australia:"AUS",Serbia:"SRB",Poland:"POL",Ecuador:"ECU",Ghana:"GHA",
  Cameroon:"CMR",Tunisia:"TUN","Saudi Arabia":"KSA",Iran:"IRN",Qatar:"QAT",
  "Costa Rica":"CRC",Panama:"PAN",Honduras:"HON","El Salvador":"SLV",
  Jamaica:"JAM",Guatemala:"GUA","New Zealand":"NZL",Indonesia:"IDN",
  Uzbekistan:"UZB",Iraq:"IRQ",Oman:"OMA",Yemen:"YEM",Venezuela:"VEN",
  Bolivia:"BOL",Chile:"CHI",Paraguay:"PAR",Peru:"PER",Egypt:"EGY",
};

// SVG flag images (lipis CDN, ISO 3166-1 alpha-2). Rendered over the
// abbreviation box; on load failure the abbreviation shows through.
const FLAG_URLS = {
  Mexico:"https://flagicons.lipis.dev/flags/4x3/mx.svg",
  "South Africa":"https://flagicons.lipis.dev/flags/4x3/za.svg",
  "South Korea":"https://flagicons.lipis.dev/flags/4x3/kr.svg",
  Czechia:"https://flagicons.lipis.dev/flags/4x3/cz.svg",
  Canada:"https://flagicons.lipis.dev/flags/4x3/ca.svg",
  "Bosnia and Herzegovina":"https://flagicons.lipis.dev/flags/4x3/ba.svg",
  Qatar:"https://flagicons.lipis.dev/flags/4x3/qa.svg",
  Switzerland:"https://flagicons.lipis.dev/flags/4x3/ch.svg",
  Brazil:"https://flagicons.lipis.dev/flags/4x3/br.svg",
  Morocco:"https://flagicons.lipis.dev/flags/4x3/ma.svg",
  Haiti:"https://flagicons.lipis.dev/flags/4x3/ht.svg",
  Scotland:"https://flagicons.lipis.dev/flags/4x3/gb-sct.svg",
  USA:"https://flagicons.lipis.dev/flags/4x3/us.svg",
  Paraguay:"https://flagicons.lipis.dev/flags/4x3/py.svg",
  Australia:"https://flagicons.lipis.dev/flags/4x3/au.svg",
  Turkiye:"https://flagicons.lipis.dev/flags/4x3/tr.svg",
  Germany:"https://flagicons.lipis.dev/flags/4x3/de.svg",
  Curacao:"https://flagicons.lipis.dev/flags/4x3/cw.svg",
  "Ivory Coast":"https://flagicons.lipis.dev/flags/4x3/ci.svg",
  Ecuador:"https://flagicons.lipis.dev/flags/4x3/ec.svg",
  Netherlands:"https://flagicons.lipis.dev/flags/4x3/nl.svg",
  Japan:"https://flagicons.lipis.dev/flags/4x3/jp.svg",
  Sweden:"https://flagicons.lipis.dev/flags/4x3/se.svg",
  Tunisia:"https://flagicons.lipis.dev/flags/4x3/tn.svg",
  Belgium:"https://flagicons.lipis.dev/flags/4x3/be.svg",
  Egypt:"https://flagicons.lipis.dev/flags/4x3/eg.svg",
  Iran:"https://flagicons.lipis.dev/flags/4x3/ir.svg",
  "New Zealand":"https://flagicons.lipis.dev/flags/4x3/nz.svg",
  Spain:"https://flagicons.lipis.dev/flags/4x3/es.svg",
  "Cape Verde":"https://flagicons.lipis.dev/flags/4x3/cv.svg",
  "Saudi Arabia":"https://flagicons.lipis.dev/flags/4x3/sa.svg",
  Uruguay:"https://flagicons.lipis.dev/flags/4x3/uy.svg",
  France:"https://flagicons.lipis.dev/flags/4x3/fr.svg",
  Senegal:"https://flagicons.lipis.dev/flags/4x3/sn.svg",
  Iraq:"https://flagicons.lipis.dev/flags/4x3/iq.svg",
  Norway:"https://flagicons.lipis.dev/flags/4x3/no.svg",
  Argentina:"https://flagicons.lipis.dev/flags/4x3/ar.svg",
  Algeria:"https://flagicons.lipis.dev/flags/4x3/dz.svg",
  Austria:"https://flagicons.lipis.dev/flags/4x3/at.svg",
  Jordan:"https://flagicons.lipis.dev/flags/4x3/jo.svg",
  Portugal:"https://flagicons.lipis.dev/flags/4x3/pt.svg",
  "DR Congo":"https://flagicons.lipis.dev/flags/4x3/cd.svg",
  Uzbekistan:"https://flagicons.lipis.dev/flags/4x3/uz.svg",
  Colombia:"https://flagicons.lipis.dev/flags/4x3/co.svg",
  England:"https://flagicons.lipis.dev/flags/4x3/gb-eng.svg",
  Croatia:"https://flagicons.lipis.dev/flags/4x3/hr.svg",
  Ghana:"https://flagicons.lipis.dev/flags/4x3/gh.svg",
  Panama:"https://flagicons.lipis.dev/flags/4x3/pa.svg",
};

function TeamFlag({team,sz=40}){
  const tc = TEAM_COLORS[team]||{bg:"#94a3b8",dk:"#fff"};
  const abbr = ABBR[team]||(team||"?").slice(0,3).toUpperCase();
  return(
    <div style={{
      width:sz,height:sz,borderRadius:8,background:tc.bg,
      display:"flex",alignItems:"center",justifyContent:"center",
      flexShrink:0,boxShadow:"0 2px 6px rgba(0,0,0,.2)",
      fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,
      fontSize:sz*.28,color:tc.dk||"#fff",letterSpacing:.5,
      textAlign:"center",lineHeight:1,
    }}>
      {abbr}
    </div>
  );
}

function FlagBox({team,sz=20}){
  const tc=TEAM_COLORS[team]||{bg:"#94a3b8",dk:"#fff"};
  const abbr=ABBR[team]||(team||"?").slice(0,3).toUpperCase();
  const url=FLAG_URLS[team];
  return(
    <div style={{
      width:sz,height:sz,borderRadius:4,background:tc.bg,
      display:"inline-flex",alignItems:"center",justifyContent:"center",
      flexShrink:0,fontFamily:"'Barlow Condensed',sans-serif",
      fontWeight:900,fontSize:sz*.38,color:tc.dk||"#fff",
      letterSpacing:.3,lineHeight:1,verticalAlign:"middle",overflow:"hidden",position:"relative",
    }}>
      {abbr}
      {url&&<img src={url} alt={team} loading="lazy"
        onError={e=>{e.target.style.display="none";}}
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover"}}/>}
    </div>
  );
}

function Av({name,sz=32}){
  const ini=(name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const c=["#004B87","#006BB6","#C5A028","#0a4f2e","#7c3aed"];
  return(
    <div style={{width:sz,height:sz,borderRadius:"50%",background:c[(name||"").charCodeAt(0)%c.length],display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Bebas Neue',sans-serif",fontSize:sz*.38,color:"#fff",flexShrink:0,letterSpacing:1}}>
      {ini}
    </div>
  );
}

function Tst({t}){
  const bg=t.type==="error"?"#fef2f2":t.type==="ok"?"#f0fdf4":"#E6F0FB";
  const cl=t.type==="error"?"#991b1b":t.type==="ok"?"#166534":"#1e40af";
  const br=t.type==="error"?"#fecaca":t.type==="ok"?"#bbf7d0":"#bfdbfe";
  return(
    <div style={{position:"fixed",bottom:86,left:"50%",transform:"translateX(-50%)",padding:"10px 20px",borderRadius:12,fontSize:13,fontWeight:600,fontFamily:"'Barlow',sans-serif",whiteSpace:"nowrap",zIndex:999,maxWidth:"90vw",overflow:"hidden",textOverflow:"ellipsis",background:bg,color:cl,border:"1px solid "+br,boxShadow:"0 8px 32px rgba(0,75,135,.15)"}}>
      {t.msg}
    </div>
  );
}

function Toggle({on,onChange}){
  return(
    <button className="tog" onClick={()=>onChange(!on)} style={{background:on?"#004B87":"#e2e8f0"}}>
      <div className="tog-knob" style={{left:on?"23px":"3px"}}/>
    </button>
  );
}

function useCd(ts){
  const[tl,sT]=useState("");
  useEffect(()=>{
    const tick=()=>{
      const d=ts-Date.now();
      if(d<=0){sT("NOW");return;}
      const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000),s=Math.floor((d%60000)/1000);
      sT(h>0?h+"h "+m+"m":m>0?m+"m "+s+"s":s+"s");
    };
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[ts]);
  return tl;
}

function MotmDropdown({team1,team2,value,onChange}){
  const[open,setOpen]=useState(false);
  const ref=useRef();
  // If both teams provided, show only those squads; otherwise show all players
  const players=(team1&&team2&&SQUADS[team1]&&SQUADS[team2])
    ?[...(SQUADS[team1]||[]).map(p=>({p,t:team1})),...(SQUADS[team2]||[]).map(p=>({p,t:team2}))]
    :PLAYERS.map(p=>({p,t:""}));
  useEffect(()=>{
    const close=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false);};
    document.addEventListener("mousedown",close);
    return()=>document.removeEventListener("mousedown",close);
  },[]);
  return(
    <div className="dd-wrap" ref={ref}>
      <button type="button" className={"dd-trigger"+(open?" open":"")} onClick={()=>setOpen(o=>!o)}>
        <span style={{color:value?"#004B87":"#94a3b8",fontWeight:value?700:400}}>{value||"Select Player of the Match…"}</span>
        <span style={{fontSize:12,color:"#94a3b8"}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div className="dd-list">
          {players.map(({p,t})=>(
            <div key={p+t} className={"dd-item"+(value===p?" sel":"")}
              onMouseDown={e=>{e.preventDefault();onChange(p);setOpen(false);}}>
              {t&&TEAM_COLORS[t]&&<div style={{width:8,height:8,borderRadius:"50%",background:TEAM_COLORS[t].bg,flexShrink:0}}/>}
              <span style={{flex:1,color:value===p?"#004B87":"#475569",fontWeight:value===p?600:400}}>{p}</span>
              {t&&<span style={{fontSize:9,background:TEAM_COLORS[t]?.bg||"#ccc",color:TEAM_COLORS[t]?.dk||"#fff",padding:"1px 5px",borderRadius:4}}>{t}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN MANUAL PICK ENTRY (FIFA) ─────────────────────────
   Lets admin enter a player's prediction (winner + goals band + scorer +
   bonus) from screenshot evidence, bypassing the lock. Mirrors the cricket
   manual-pick panel but uses FIFA fields: win / gb / motm. */
function AdminManualPickPanel({ms,users,allPicks,allBonusPicks,doubleMatch,onSave,toast2}){
  const[selUser,setSelUser]=useState("");
  const[selMatch,setSelMatch]=useState(null);
  const[draft,setDraft]=useState({win:"",gb:"",motm:"",bqAns:null});
  const[saving,setSaving]=useState(false);
  const[userSearch,setUserSearch]=useState("");
  const[matchSearch,setMatchSearch]=useState("");

  const approvedUsers=Object.values(users).filter(u=>u?.email&&u.approved!==false).sort((a,b)=>a.name.localeCompare(b.name));
  const filteredUsers=approvedUsers.filter(u=>u.name.toLowerCase().includes(userSearch.toLowerCase())||u.email.toLowerCase().includes(userSearch.toLowerCase()));
  const playableMs=ms.filter(m=>!isTBD(m));
  const filteredMs=playableMs.filter(m=>(m.mn+m.home+m.away+m.date).toLowerCase().includes(matchSearch.toLowerCase()));

  const getUP=(emk,id)=>{const up=allPicks[emk]||{};return up[String(id)]??up[Number(id)]??null;};
  const existingPick=selUser&&selMatch?getUP(ek(selUser),selMatch.id):null;
  const existingBQ=selUser&&selMatch?(allBonusPicks[ek(selUser)]||{})[String(selMatch.id)]:undefined;
  const hasBQ=selMatch&&!!BONUS_QUESTIONS[selMatch.id];
  const allReady=!!(draft.win&&draft.gb&&draft.motm&&(!hasBQ||draft.bqAns!==null));

  function selectUser(email){setSelUser(email);setSelMatch(null);setDraft({win:"",gb:"",motm:"",bqAns:null});setUserSearch("");}

  async function handleSave(){
    if(!selUser||!selMatch){toast2("Select a user and match","error");return;}
    if(!draft.win||!draft.gb||!draft.motm){toast2("Fill winner, goals band and scorer","error");return;}
    if(hasBQ&&draft.bqAns===null){toast2("Answer the bonus question","error");return;}
    setSaving(true);
    const ok=await onSave(selUser,selMatch,{win:draft.win,gb:draft.gb,motm:draft.motm},draft.bqAns);
    if(ok){setSelMatch(null);setDraft({win:"",gb:"",motm:"",bqAns:null});}
    setSaving(false);
  }

  return(
    <div>
      <div className="ac">
        <p className="st" style={{marginBottom:12}}>📸 MANUAL PICK ENTRY (SCREENSHOT EVIDENCE)</p>
        <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:12,color:"#92400E"}}>
          ⚠️ Use only when a player sent screenshot proof before lock time. This bypasses the lock — use responsibly.
        </div>

        {/* Step 1: User */}
        <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Step 1 — Select Player</p>
        <input className="inp" placeholder="Search player…" value={userSearch} onChange={e=>setUserSearch(e.target.value)} style={{marginBottom:8}}/>
        <div style={{maxHeight:160,overflowY:"auto",border:"1px solid #e2e8f0",borderRadius:10,marginBottom:14}}>
          {filteredUsers.map(u=>{
            const emk=ek(u.email);const pickCount=Object.keys(allPicks[emk]||{}).length;
            return(
              <div key={u.email} onClick={()=>selectUser(u.email)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",cursor:"pointer",background:selUser===u.email?"#E6F0FA":"#fff",borderBottom:"1px solid #f1f5f9"}}>
                <div style={{flex:1}}>
                  <p style={{fontSize:13,fontWeight:600,color:"#0a1628",margin:0}}>{u.name}</p>
                  <p style={{fontSize:10,color:"#94a3b8",margin:0}}>{u.email} · {pickCount} picks</p>
                </div>
                {selUser===u.email&&<span style={{color:"#004B87",fontSize:14}}>✅</span>}
              </div>
            );
          })}
        </div>

        {/* Step 2: Match */}
        {selUser&&<>
          <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.5,marginBottom:6}}>Step 2 — Select Match</p>
          <input className="inp" placeholder="Search match (M17, teams…)" value={matchSearch} onChange={e=>setMatchSearch(e.target.value)} style={{marginBottom:8}}/>
          <div style={{maxHeight:180,overflowY:"auto",border:"1px solid #e2e8f0",borderRadius:10,marginBottom:14}}>
            {filteredMs.map(m=>{
              const hasPick=!!getUP(ek(selUser),m.id);
              return(
                <div key={m.id} onClick={()=>{setSelMatch(m);setDraft({win:"",gb:"",motm:"",bqAns:null});setMatchSearch("");}} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",cursor:"pointer",background:selMatch?.id===m.id?"#E6F0FA":"#fff",borderBottom:"1px solid #f1f5f9"}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,color:"#004B87"}}>{m.mn}</span>
                      <span style={{fontSize:12,color:"#0a1628",fontWeight:600}}>{m.home} vs {m.away}</span>
                    </div>
                    <p style={{fontSize:10,color:"#94a3b8",margin:0}}>{m.date} · {m.time}</p>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                    {hasPick&&<span style={{background:"#f0fdf4",color:"#15803d",fontSize:9,padding:"2px 6px",borderRadius:8,fontWeight:700}}>Has pick</span>}
                    {m.result&&<span style={{background:"#dbeafe",color:"#1e40af",fontSize:9,padding:"2px 6px",borderRadius:8,fontWeight:700}}>Done</span>}
                    {selMatch?.id===m.id&&<span style={{color:"#004B87",fontSize:14}}>✅</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </>}

        {/* Existing pick warning */}
        {existingPick&&<div style={{background:"#FEF3C7",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:12,fontSize:12,color:"#92400E"}}>
          ℹ️ Existing pick for {selMatch?.mn}: <b>{existingPick.win}</b> winner · <b>{GOAL_BANDS.find(b=>b.id===existingPick.gb)?.short||existingPick.gb}</b> goals · MOTM: <b>{existingPick.motm}</b>. Saving will overwrite.
          {existingBQ!==undefined&&<span> · Bonus: {existingBQ?"Yes":"No"}</span>}
        </div>}

        {/* Step 3: Pick entry */}
        {selUser&&selMatch&&<>
          <div style={{background:"#E6F0FA",border:"1px solid #bfdbfe",borderRadius:12,padding:"14px",marginBottom:14}}>
            <p style={{fontSize:11,fontWeight:700,color:"#1e40af",textTransform:"uppercase",letterSpacing:.5,marginBottom:14}}>
              Step 3 — Enter Picks · {selMatch.mn}: {selMatch.home} vs {selMatch.away}
            </p>

            {/* Winner */}
            <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6}}>Match Winner</p>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              {[selMatch.home,"Draw",selMatch.away].map(v=>(
                <button key={v} onClick={()=>setDraft(d=>({...d,win:v}))} style={{flex:1,padding:"10px 4px",borderRadius:10,border:"2px solid "+(draft.win===v?"#004B87":"#e2e8f0"),background:draft.win===v?"#E6F0FA":"#f8faff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  {v!=="Draw"&&<FlagBox team={v} sz={26}/>}
                  <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,color:draft.win===v?"#004B87":"#64748b"}}>{v==="Draw"?"🤝 Draw":v}</span>
                </button>
              ))}
            </div>

            {/* Goals band (scoreline) */}
            <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6}}>⚽ Total Goals Band</p>
            <div style={{display:"flex",gap:6,marginBottom:14}}>
              {GOAL_BANDS.map(band=>(
                <button key={band.id} onClick={()=>setDraft(d=>({...d,gb:d.gb===band.id?"":band.id}))} style={{flex:1,padding:"8px 4px",borderRadius:10,border:"2px solid "+(draft.gb===band.id?"#004B87":"#e2e8f0"),background:draft.gb===band.id?"#E6F0FA":"#f8faff",cursor:"pointer",textAlign:"center"}}>
                  <div style={{fontSize:14}}>{band.emoji}</div>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,color:draft.gb===band.id?"#004B87":"#64748b"}}>{band.short}</div>
                </button>
              ))}
            </div>
            {!draft.gb&&<p style={{fontSize:10,color:"#ef4444",margin:"-8px 0 14px",fontWeight:600}}>⚠️ Required</p>}

            {/* Scorer / MOTM */}
            <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:6}}>Player of the Match / Scorer</p>
            <div style={{marginBottom:14}}>
              <MotmDropdown team1={selMatch.home} team2={selMatch.away} value={draft.motm} onChange={v=>setDraft(d=>({...d,motm:v}))}/>
            </div>

            {/* Bonus */}
            {hasBQ&&<>
              <p style={{fontSize:11,color:"#64748b",fontWeight:600,marginBottom:4}}>Bonus Question</p>
              <p style={{fontSize:11,color:"#475569",marginBottom:8,lineHeight:1.4,fontStyle:"italic"}}>{BONUS_QUESTIONS[selMatch.id]}</p>
              <div style={{display:"flex",gap:8,marginBottom:draft.bqAns===null?4:10}}>
                <button className={"bq-btn yes"+(draft.bqAns===true?" on":"")} onClick={()=>setDraft(d=>({...d,bqAns:d.bqAns===true?null:true}))}>✅ Yes</button>
                <button className={"bq-btn no"+(draft.bqAns===false?" on":"")} onClick={()=>setDraft(d=>({...d,bqAns:d.bqAns===false?null:false}))}>❌ No</button>
              </div>
              {draft.bqAns===null&&<p style={{fontSize:10,color:"#ef4444",marginBottom:10,fontWeight:600}}>⚠️ Required</p>}
            </>}

            {allReady&&<div style={{background:"#fff",borderRadius:10,padding:"10px 12px",marginTop:4,border:"1px solid #bfdbfe",fontSize:12}}>
              <p style={{color:"#1e40af",fontWeight:700,margin:"0 0 6px",fontSize:11,textTransform:"uppercase"}}>Will save:</p>
              <p style={{color:"#0a1628",margin:0,lineHeight:1.6}}>
                <b>{Object.values(users).find(u=>u.email===selUser)?.name||selUser}</b> → {selMatch.mn}:{" "}
                <b>{draft.win}</b> winner · <b>{GOAL_BANDS.find(b=>b.id===draft.gb)?.short}</b> goals · <b>{draft.motm}</b> MOTM{hasBQ?` · Bonus: ${draft.bqAns?"Yes":"No"}`:""}
              </p>
            </div>}
          </div>

          <button className="pbtn" disabled={saving||!allReady} onClick={handleSave}>
            {saving?"Saving…":"💾 Save Pick for "+(Object.values(users).find(u=>u.email===selUser)?.name||"")}
          </button>
        </>}
      </div>
    </div>
  );
}

function FormDots({form,align="left"}){
  if(!form||form.length===0) return null;
  return(
    <div style={{display:"flex",gap:3,alignItems:"center",justifyContent:align==="right"?"flex-end":"flex-start"}}>
      {form.map((r,i)=>(
        <div key={i} className="form-dot" style={{
          background:r==="W"?"#22c55e":r==="D"?"#f59e0b":r==="L"?"#ef4444":"#94a3b8"
        }}/>
      ))}
    </div>
  );
}

function getTeamForm(team,matches,n=5){
  return matches
    .filter(m=>m.result&&(m.home===team||m.away===team))
    .slice(-n)
    .map(m=>{
      if(isNR(m.result.win)) return "D"; // draw
      if(m.result.win===team) return "W";
      if(m.result.win==="Draw") return "D";
      return "L";
    });
}

/* ─── FIFA MATCH INTEL ───────────────────────────────────────── */
function FifaMatchIntel({m,allMs}){
  const [open,setOpen] = useState(false);
  if(isTBD(m)) return null;

  const fifa_rankings = {
    Argentina:1,France:2,Spain:3,England:4,Brazil:5,Portugal:6,
    Netherlands:7,Belgium:8,Germany:9,Croatia:10,Uruguay:11,
    USA:13,Mexico:15,Morocco:12,Japan:17,"South Korea":22,
    Denmark:21,Switzerland:18,Senegal:20,Australia:25,
    Canada:49,Ecuador:42,Ghana:60,Cameroon:55,
    Serbia:33,Poland:26,Tunisia:34,"Saudi Arabia":56,
    Iran:21,Qatar:37,"Costa Rica":45,Panama:83,
    Honduras:82,"El Salvador":73,Jamaica:57,Guatemala:114,
    "New Zealand":93,Indonesia:134,Uzbekistan:68,Iraq:64,
    Oman:79,Yemen:162,Venezuela:70,Bolivia:88,
    Chile:31,Paraguay:60,Peru:72,Egypt:34,
  };

  const h2h = allMs.filter(m2=>m2.result&&((m2.home===m.home&&m2.away===m.away)||(m2.home===m.away&&m2.away===m.home)));
  const homeWins = h2h.filter(m2=>m2.result.win===m.home).length;
  const awayWins = h2h.filter(m2=>m2.result.win===m.away).length;
  const draws = h2h.filter(m2=>m2.result.win==="Draw"||isNR(m2.result.win)).length;

  const homeForm = getTeamForm(m.home,allMs,5);
  const awayForm = getTeamForm(m.away,allMs,5);
  const homeRank = fifa_rankings[m.home]||"N/A";
  const awayRank = fifa_rankings[m.away]||"N/A";
  const homeGroup = Object.entries(GROUPS).find(([,teams])=>teams.includes(m.home))?.[0];
  const awayGroup = Object.entries(GROUPS).find(([,teams])=>teams.includes(m.away))?.[0];

  return(
    <div style={{marginBottom:8}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:"#E6F0FB",border:"1px solid #bfdbfe",borderRadius:10,padding:"8px 12px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:11,color:"#004B87"}}>
        <span>📊 Match Intel</span>
        <span>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{background:"#E6F0FB",border:"1px solid #bfdbfe",borderRadius:"0 0 10px 10px",padding:"12px",marginTop:-4}}>
          {/* FIFA Rankings */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,background:"rgba(255,255,255,.7)",borderRadius:8,padding:"8px",textAlign:"center"}}>
              <p style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",margin:"0 0 2px"}}>FIFA Rank</p>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"#004B87",margin:0}}>#{homeRank}</p>
              <p style={{fontSize:10,color:"#475569",margin:0,fontWeight:600}}>{m.home}</p>
            </div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px"}}>
              <span style={{fontSize:11,color:"#64748b",fontWeight:600}}>vs</span>
            </div>
            <div style={{flex:1,background:"rgba(255,255,255,.7)",borderRadius:8,padding:"8px",textAlign:"center"}}>
              <p style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",margin:"0 0 2px"}}>FIFA Rank</p>
              <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:"#004B87",margin:0}}>#{awayRank}</p>
              <p style={{fontSize:10,color:"#475569",margin:0,fontWeight:600}}>{m.away}</p>
            </div>
          </div>

          {/* Recent Form */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <div style={{flex:1,background:"rgba(255,255,255,.7)",borderRadius:8,padding:"8px"}}>
              <p style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",margin:"0 0 4px"}}>Form (last 5)</p>
              <FormDots form={homeForm}/>
              {homeForm.length===0&&<span style={{fontSize:10,color:"#94a3b8"}}>No data</span>}
            </div>
            <div style={{flex:1,background:"rgba(255,255,255,.7)",borderRadius:8,padding:"8px"}}>
              <p style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",margin:"0 0 4px"}}>Form (last 5)</p>
              <FormDots form={awayForm}/>
              {awayForm.length===0&&<span style={{fontSize:10,color:"#94a3b8"}}>No data</span>}
            </div>
          </div>

          {/* H2H */}
          {h2h.length>0&&(
            <div style={{background:"rgba(255,255,255,.7)",borderRadius:8,padding:"8px",marginBottom:10}}>
              <p style={{fontSize:9,color:"#64748b",fontWeight:600,textTransform:"uppercase",margin:"0 0 6px"}}>Head to Head ({h2h.length} matches)</p>
              <div style={{display:"flex",gap:6}}>
                {[
                  [m.home,homeWins,"#15803d"],
                  ["Draws",draws,"#f59e0b"],
                  [m.away,awayWins,"#dc2626"],
                ].map(([lbl,cnt,cl])=>(
                  <div key={lbl} style={{flex:1,textAlign:"center",background:"rgba(255,255,255,.5)",borderRadius:6,padding:"4px"}}>
                    <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:16,color:cl,margin:0}}>{cnt}</p>
                    <p style={{fontSize:9,color:"#64748b",margin:0}}>{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Group Stage Info */}
          {(homeGroup||awayGroup)&&(
            <div style={{display:"flex",gap:8}}>
              {homeGroup&&<div style={{flex:1,background:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
                <p style={{fontSize:9,color:"#64748b",margin:"0 0 1px"}}>Group</p>
                <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:"#004B87",margin:0}}>Group {homeGroup}</p>
              </div>}
              {awayGroup&&homeGroup!==awayGroup&&<div style={{flex:1,background:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
                <p style={{fontSize:9,color:"#64748b",margin:"0 0 1px"}}>Group</p>
                <p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:18,color:"#004B87",margin:0}}>Group {awayGroup}</p>
              </div>}
            </div>
          )}

          {/* Form legend */}
          <div style={{display:"flex",gap:8,marginTop:8,justifyContent:"center"}}>
            {[["#22c55e","W"],["#f59e0b","D"],["#ef4444","L"]].map(([c,l])=>(
              <div key={l} style={{display:"flex",alignItems:"center",gap:3}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:c}}/>
                <span style={{fontSize:9,color:"#64748b"}}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── LEADERBOARD CARD ───────────────────────────────────────── */
function LbCard({u,i,isMe,sw,actualTop4,actualWs,actualGb,actualGg,actualGball,PTS,onboardSc}){
  const[open,setOpen]=React.useState(false);
  const hasSp=!!(u.userSp&&u.userSp!=="__skip__");
  const hasT4=(u.userT4||[]).length>0;
  const hasWs=!!u.userWs;
  const hasGb=(u.userGb||[]).length>0;
  const hasGg=(u.userGg||[]).length>0;
  const hasGball=(u.userGball||[]).length>0;
  const hasAny=hasSp||hasT4||hasWs||hasGb||hasGg||hasGball;
  const canExpand=hasAny&&(hasGb||hasGg||hasGball||hasWs);

  const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":null;
  const cardBg=isMe?"linear-gradient(135deg,#EBF4FF,#E0EDFF)":"#fff";
  const borderCol=isMe?"#004B8750":"#e8edf5";

  // Points breakdown chips
  const top4Correct=actualTop4.length>0?(u.userT4||[]).filter(t=>actualTop4.includes(t)).length:0;

  return(
    <div style={{background:cardBg,border:"1px solid "+borderCol,borderRadius:14,
      marginBottom:10,overflow:"hidden",
      boxShadow:isMe?"0 2px 12px #004B8720":"0 1px 4px #0000000A"}}>

      {/* ── Main row ── */}
      <div style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}>
        {/* Rank */}
        <div style={{width:30,textAlign:"center",flexShrink:0}}>
          {medal
            ?<span style={{fontSize:20}}>{medal}</span>
            :<span style={{fontSize:12,fontWeight:700,color:"#94a3b8"}}>#{i+1}</span>}
        </div>

        {/* Avatar */}
        <Av name={u.name} sz={36}/>

        {/* Name + season summary */}
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
            <span style={{fontWeight:700,fontSize:13,color:"#0a1628",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{u.name}</span>
            {isMe&&<span style={{fontSize:9,background:"#004B87",color:"#fff",borderRadius:10,padding:"1px 7px",flexShrink:0}}>YOU</span>}
          </div>
          {hasSp
            ?<div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:4}}>
                  <span style={{fontSize:10,color:"#94a3b8"}}>🏆</span>
                  <FlagBox team={u.userSp} sz={14}/>
                  <span style={{fontSize:10,fontWeight:600,color:sw&&u.userSp===sw?"#15803d":"#1a2540"}}>
                    {u.userSp.split(" ").slice(0,2).join(" ")}{sw&&u.userSp===sw?" ✅":""}
                  </span>
                </div>
                {hasWs&&<>
                  <span style={{color:"#d1d5db",fontSize:10}}>·</span>
                  <div style={{display:"flex",alignItems:"center",gap:4}}>
                    <span style={{fontSize:10,color:"#94a3b8"}}>🪵</span>
                    <FlagBox team={u.userWs} sz={14}/>
                    <span style={{fontSize:10,fontWeight:600,
                      color:actualWs&&u.userWs===actualWs?"#15803d":actualWs?"#dc2626":"#1a2540"}}>
                      {u.userWs.split(" ")[0]}{actualWs?(u.userWs===actualWs?" ✅":" ✗"):""}
                    </span>
                  </div>
                </>}
              </div>
            :<span style={{fontSize:10,color:"#94a3b8"}}>
                {isMe?"⏳ Set your picks in My Game →":"⏳ Picks not set yet"}
              </span>}
        </div>

        {/* Points */}
        <div style={{textAlign:"right",flexShrink:0}}>
          <p className="C" style={{fontSize:24,fontWeight:800,color:"#004B87",margin:0,lineHeight:1}}>{u.pts}</p>
          <p style={{fontSize:9,color:"#94a3b8",margin:0,textTransform:"uppercase",letterSpacing:.5}}>pts</p>
        </div>
      </div>

      {/* ── Top 4 bar (always visible when set) ── */}
      {hasT4&&<div
        onClick={()=>canExpand&&setOpen(o=>!o)}
        style={{cursor:canExpand?"pointer":"default",padding:"8px 14px 10px",borderTop:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",flexShrink:0}}>Top 4</span>
        {(u.userT4||[]).map(t=>{
          const ok=actualTop4.length>0&&actualTop4.includes(t);
          const bad=actualTop4.length>0&&!ok;
          return<div key={t} style={{display:"flex",alignItems:"center",gap:3,
            background:ok?"#EAF3DE":bad?"#FEF2F2":"#f1f5f9",
            borderRadius:20,padding:"3px 8px 3px 4px",
            border:"1px solid "+(ok?"#86EFAC":bad?"#FECACA":"#e2e8f0")}}>
            <FlagBox team={t} sz={14}/>
            <span style={{fontSize:9,fontWeight:600,color:ok?"#166534":bad?"#991B1B":"#475569"}}>
              {t.length>8?t.split(" ")[0]:t}
            </span>
            {ok&&<span style={{fontSize:8}}>✅</span>}
            {bad&&<span style={{fontSize:8}}>✗</span>}
          </div>;
        })}
        {top4Correct>0&&<span style={{fontSize:10,fontWeight:700,color:"#15803d",marginLeft:2}}>+{top4Correct*PTS.top4}pts</span>}
        {canExpand&&<span style={{marginLeft:"auto",fontSize:11,color:"#94a3b8"}}>{open?"▲":"▼"}</span>}
      </div>}

      {/* ── Expanded: Boot / Glove / Ball ── */}
      {open&&hasAny&&<div style={{padding:"0 14px 12px",borderTop:"1px solid #f1f5f9",display:"flex",flexDirection:"column",gap:6,paddingTop:8}}>
        {hasGb&&<PlayerRow label="👟 Boot" items={u.userGb} winner={actualGb} pts={PTS.goldenBoot}/>}
        {hasGg&&<PlayerRow label="🧤 Glove" items={u.userGg} winnerArr={actualGg} pts={PTS.goldenGlove}/>}
        {hasGball&&<PlayerRow label="🏅 Ball" items={u.userGball} winner={actualGball} pts={PTS.goldenGlove}/>}
      </div>}
    </div>
  );
}

function PlayerRow({label,items,winner,winnerArr,pts}){
  const winners=winnerArr||[];
  return(
    <div style={{display:"flex",alignItems:"flex-start",gap:8,flexWrap:"wrap"}}>
      <span style={{fontSize:9,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",flexShrink:0,paddingTop:3,minWidth:52}}>{label}</span>
      <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
        {items.map(p=>{
          const isW=winner?p===winner:winners.includes(p);
          const isBad=(winner&&!isW)||(winnerArr&&winnerArr.length>0&&!isW);
          return<span key={p} style={{fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:isW?700:400,
            background:isW?"#DCFCE7":isBad?"#FEF2F2":"#f8faff",
            border:"1px solid "+(isW?"#86EFAC":isBad?"#FECACA":"#e2e8f0"),
            color:isW?"#166534":isBad?"#991B1B":"#475569"}}>
            {p.split(" ").slice(-1)[0]}{isW?" ✅":""}
          </span>;
        })}
        {(winner||(winnerArr&&winnerArr.length>0))&&items.some(p=>winner?p===winner:winners.includes(p))&&
          <span style={{fontSize:10,fontWeight:700,color:"#15803d",alignSelf:"center"}}>+{pts}pts</span>}
      </div>
    </div>
  );
}

function InlineReveal({m,allPicks,allBonusPicks,bonusAnswers,goalBandAnswers,users}){
  const approved=Object.values(users).filter(u=>u?.email&&u.approved!==false).sort((a,b)=>a.name.localeCompare(b.name));
  const bonusAns=bonusAnswers?.[String(m.id)]??bonusAnswers?.[Number(m.id)];
  const picks=approved.map(u=>{
    const emk=ek(u.email);
    const p=allPicks[emk]?.[String(m.id)]??allPicks[emk]?.[Number(m.id)];
    const bq=(allBonusPicks?.[emk]||{})[String(m.id)];
    const winOk=m.result&&!isNR(m.result.win)&&p?.win===m.result.win;
    const motmOk=m.result&&!isNR(m.result.motm)&&motmMatch(p?.motm,m.result.motm);
    const gbAns=goalBandAnswers?.[String(m.id)];
    const gbOk=!!(gbAns&&p?.gb&&p.gb===gbAns);
    const bqOk=bonusAns!=null&&bq!=null&&bq===bonusAns;
    const perfect=winOk&&motmOk;
    return{u,p,winOk,motmOk,gbOk,bqOk,perfect};
  });
  const hasPicks=picks.some(d=>d.p);
  if(!hasPicks) return null;

  return(
    <div style={{borderTop:"1px solid #f1f5f9",paddingTop:10,marginTop:4}}>
      <div style={{marginBottom:8}}>
        <span style={{fontSize:10,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:.5}}>🎭 Group Picks</span>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {picks.filter(d=>d.p).map(({u,p,winOk,motmOk,gbOk,bqOk,perfect})=>{
          const hasResult=!!m.result;
          const cardBg=hasResult?(perfect?"#f0fdf4":winOk?"#E6F0FB":"#fef2f2"):"#f8faff";
          const borderCol=hasResult?(perfect?"#bbf7d0":winOk?"#bfdbfe":"#fecaca"):"#e2e8f0";
          const gbAns=goalBandAnswers?.[String(m.id)];
          const bandShort=p.gb?GOAL_BANDS.find(b=>b.id===p.gb)?.short||p.gb:null;
          return(
            <div key={u.email} style={{background:cardBg,border:"1px solid "+borderCol,borderRadius:10,padding:"8px 10px",display:"flex",alignItems:"center",gap:8}}>
              <Av name={u.name} sz={24}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:11,fontWeight:700,color:"#0a1628",margin:0}}>{u.name}{perfect&&" 🎯"}</p>
                <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                  {[
                    ["W",p.win,winOk,!isNR(m.result?.win)],
                    ["P",p.motm?.split(" ").slice(-1)[0],motmOk,!isNR(m.result?.motm)],
                  ].map(([lbl,val,ok,avail])=>(
                    <span key={lbl} style={{fontSize:9,padding:"1px 5px",borderRadius:4,fontWeight:700,
                      background:!hasResult?"#e2e8f0":!avail?"#f1f5f9":ok?"#dcfce7":"#fee2e2",
                      color:!hasResult?"#475569":!avail?"#94a3b8":ok?"#15803d":"#dc2626"}}>
                      {lbl}: {val||"—"}{hasResult&&avail?(ok?" ✓":" ✗"):""}
                    </span>
                  ))}
                  {bandShort&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:4,fontWeight:700,
                    background:!gbAns?"#f1f5f9":gbOk?"#dcfce7":"#fee2e2",
                    color:!gbAns?"#94a3b8":gbOk?"#15803d":"#dc2626"}}>
                    ⚽{bandShort}{gbAns?(gbOk?" ✓":" ✗"):""}
                  </span>}
                  {bq!=null&&<span style={{fontSize:9,padding:"1px 5px",borderRadius:4,fontWeight:700,
                    background:bonusAns==null?"#f1f5f9":bqOk?"#dcfce7":"#fee2e2",
                    color:bonusAns==null?"#94a3b8":bqOk?"#15803d":"#dc2626"}}>
                    ❓{bq?"Yes":"No"}{bonusAns!=null?(bqOk?" ✓":" ✗"):""}
                  </span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── MATCH CARD ─────────────────────────────────────────────── */
function MCard({m,pred,myPicks,allPicks,rxns,doubleMatch,lockedMatches,email,allMs,onPredict,onReact,bonusAnswers,myBonusPicks,allBonusPicks,goalBandAnswers,onBonusPick,users}){
  const[lk,setLk]=useState(()=>isMatchLocked(m,lockedMatches));
  useEffect(()=>{
    if(m.result){setLk(true);return;}
    const tick=()=>setLk(isMatchLocked(m,lockedMatches));
    tick();const id=setInterval(tick,1000);return()=>clearInterval(id);
  },[m,lockedMatches]);

  const myP=myPicks?.[String(m.id)]??myPicks?.[Number(m.id)];
  const ct=cutoff(m);
  const cStr=ct.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:true,timeZone:"America/New_York"});
  const cd=useCd(ct.getTime());
  const EMOJIS=["⚽","🔥","😭","🎯","👏","🤯"];
  const mr=rxns[m.id]||{};
  const isDouble=doubleMatch!=null&&Number(doubleMatch)===Number(m.id);
  const mult=isDouble?2:1;

  const ae=Object.entries(allPicks);
  const tot=ae.filter(([,up])=>(up?.[String(m.id)]??up?.[Number(m.id)])!=null).length;
  const autoLocked=new Date()>=cutoff(m);

  const homeForm=getTeamForm(m.home,allMs||[],5);
  const awayForm=getTeamForm(m.away,allMs||[],5);

  let earned=0;
  if(m.result&&myP){
    const wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
    let base=0;
    if(wA&&myP.win===m.result.win)base+=PTS.win;
    if(mA&&motmMatch(myP.motm,m.result.motm))base+=PTS.motm;
    const avail=[wA,mA].filter(Boolean).length;
    const correct=[wA&&myP.win===m.result.win,mA&&motmMatch(myP.motm,m.result.motm)].filter(Boolean).length;
    if(avail>0&&correct===avail)base+=PTS.streak;
    const gbAns=goalBandAnswers?.[String(m.id)];
    if(gbAns&&myP.gb&&myP.gb===gbAns)base+=PTS.goals;
    earned=base*mult;
  }

  const hints=!m.result&&(lk||autoLocked)&&tot>0?{
    tot,
    wA:ae.filter(([,up])=>(up?.[String(m.id)]??up?.[Number(m.id)])?.win===m.home).length,
    wB:ae.filter(([,up])=>(up?.[String(m.id)]??up?.[Number(m.id)])?.win===m.away).length,
    wDraw:ae.filter(([,up])=>(up?.[String(m.id)]??up?.[Number(m.id)])?.win==="Draw").length,
  }:null;

  const showIntel=!isTBD(m);
  const hasBQ=!!BONUS_QUESTIONS[m.id];
  const bonusAns=bonusAnswers?.[String(m.id)]??bonusAnswers?.[Number(m.id)];
  const myBQ=myBonusPicks?.[String(m.id)];
  const bqPts=m.result&&bonusAns!=null&&myBQ!=null?(myBQ===bonusAns?PTS.bonus:0):null;
  const stageLabel=m.group?`Group ${m.group}`:m.stage||"Knockout";

  return(
    <div className="mcard fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{color:"#64748b",fontSize:11,fontWeight:600}}>{m.mn} · {stageLabel} · {m.date} · {m.time} ET</span>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          {isDouble&&<span style={{background:"linear-gradient(135deg,#C5A028,#E8C547)",color:"#fff",fontSize:9,padding:"2px 7px",borderRadius:20,fontWeight:800}}>⚡ 2×</span>}
          {m.result
            ?<span style={{background:"#dbeafe",color:"#1e40af",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Done</span>
            :lk
            ?<span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>🔒 Locked</span>
            :<span style={{background:"#dcfce7",color:"#166534",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>🟢 Open</span>
          }
        </div>
      </div>

      {!m.result&&!lk&&cd&&cd!=="NOW"&&(
        <div style={{background:"linear-gradient(135deg,#FFF9E6,#FEF3C7)",border:"1px solid #FDE68A",borderRadius:10,padding:"8px 14px",marginBottom:8,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontSize:14}}>⏱</span>
            <span style={{fontSize:12,fontWeight:600,color:"#92400E"}}>Locks at {cStr} ET</span>
          </div>
          <span style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:20,color:cd.includes("m")&&!cd.includes("h")&&parseInt(cd)<6?"#dc2626":"#d97706",letterSpacing:1}}>{cd}</span>
        </div>
      )}

      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",margin:"4px 0 6px"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
          <TeamFlag team={m.home} sz={48}/>
          <p className="C" style={{color:"#0a1628",fontSize:16,fontWeight:700,margin:0}}>{m.home}</p>
          <FormDots form={homeForm} align="left"/>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <p className="C" style={{color:"#cbd5e1",fontSize:20,fontWeight:800,letterSpacing:2,margin:0}}>VS</p>
          {m.result?.score&&<p style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:28,color:"#0a1628",letterSpacing:2,margin:0}}>{m.result.score}</p>}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
          <TeamFlag team={m.away} sz={48}/>
          <p className="C" style={{color:"#0a1628",fontSize:16,fontWeight:700,margin:0}}>{m.away}</p>
          <FormDots form={awayForm} align="right"/>
        </div>
      </div>

      <p style={{color:"#94a3b8",fontSize:11,borderTop:"1px solid #f1f5f9",paddingTop:8,marginBottom:10}}>📍 {m.venue}</p>

      {m.result&&(
        <div style={{background:"#F4F6FB",borderRadius:8,padding:"8px 12px",fontSize:12,marginBottom:8}}>
          <span style={{color:"#64748b"}}>Winner: </span>
          <b style={{color:isNR(m.result.win)?"#64748b":"#15803d"}}>{isNR(m.result.win)?"Draw":m.result.win}</b>
          <span style={{color:"#94a3b8",margin:"0 6px"}}>·</span>
          <span style={{color:"#64748b"}}>MOTM: </span>
          <b style={{color:isNR(m.result.motm)?"#64748b":"#C5A028"}}>{m.result.motm||"—"}</b>
          {myP&&<span style={{color:earned>0?"#15803d":"#94a3b8",fontWeight:700,float:"right",fontFamily:"'Bebas Neue',sans-serif",fontSize:15}}>+{earned}pts</span>}
        </div>
      )}

      {myP&&(
        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"7px 12px",fontSize:12,color:"#15803d",marginBottom:8}}>
          <p style={{fontSize:10,fontWeight:700,color:"#15803d",textTransform:"uppercase",letterSpacing:.5,margin:"0 0 8px"}}>🔒 Your Locked Picks</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {[
              ["🏆 Winner",myP.win==="Draw"?"Draw":myP.win],
              ["⭐ MOTM",myP.motm?.split(" ").slice(-1)[0]||"—"],
              ["⚽ Goals",myP.gb?GOAL_BANDS.find(b=>b.id===myP.gb)?.short||myP.gb:"—"],
              ["❓ Bonus",myBQ!=null?(myBQ?"Yes":"No"):"—"],
            ].map(([l,v])=>(
              <div key={l} style={{background:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 8px"}}>
                <p style={{fontSize:9,color:"#64748b",fontWeight:600,margin:0}}>{l}</p>
                <p style={{fontSize:11,fontWeight:700,color:"#0a1628",margin:"2px 0 0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {hints&&(
        <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:10,padding:"10px 12px",marginBottom:8}}>
          <p style={{color:"#92400E",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.5,margin:"0 0 8px"}}>
            💡 Group Leans · {hints.tot} picks
          </p>
          {(()=>{
            const tot2=(hints.wA+hints.wB+hints.wDraw)||1;
            return(
              <div>
                <span style={{fontSize:10,fontWeight:600,color:"#92400E",display:"block",marginBottom:4}}>Winner</span>
                <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                  {[
                    [m.home,hints.wA,"#004B87"],
                    ["Draw",hints.wDraw,"#f59e0b"],
                    [m.away,hints.wB,"#006BB6"],
                  ].map(([lbl,cnt,cl])=>{
                    const pct=Math.round(cnt/tot2*100);
                    return(
                      <div key={lbl} style={{flex:1,textAlign:"center",background:"rgba(255,255,255,.6)",borderRadius:8,padding:"6px 4px",border:"1px solid #FDE68A"}}>
                        <p style={{fontSize:10,fontWeight:700,color:cl,margin:0}}>{pct}%</p>
                        <p style={{fontSize:9,color:"#92400E",margin:0}}>{lbl} ({cnt})</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {showIntel&&<FifaMatchIntel m={m} allMs={allMs||[]}/>}

      {m.result&&(
        <div style={{borderTop:"1px solid #f1f5f9",paddingTop:10,marginTop:4,display:"flex",gap:6,flexWrap:"wrap"}}>
          {EMOJIS.map(k=>{
            const cnt=(mr[k]||[]).length,mine=(mr[k]||[]).includes(email);
            return(
              <button key={k} onClick={()=>onReact(m.id,k)} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 10px",borderRadius:20,border:"1px solid "+(mine?"#004B87":"#e2e8f0"),background:mine?"#E6F0FB":"#f8faff",cursor:"pointer",fontSize:13,fontWeight:mine?700:400,color:mine?"#004B87":"#475569"}}>
                {k}{cnt>0&&<span style={{fontSize:11,fontWeight:700}}>{cnt}</span>}
              </button>
            );
          })}
        </div>
      )}

      {hasBQ&&(
        <div style={{background:"#F4F6FB",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 12px",marginBottom:8,marginTop:8}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
            <span style={{fontSize:12}}>❓</span>
            <span style={{fontSize:10,fontWeight:700,color:"#004B87",textTransform:"uppercase",letterSpacing:.5}}>Bonus Question · +{PTS.bonus}pts</span>
            {bqPts!==null&&<span style={{marginLeft:"auto",fontFamily:"'Bebas Neue',sans-serif",fontSize:14,color:bqPts>0?"#15803d":"#dc2626"}}>+{bqPts}pts</span>}
          </div>
          <p style={{fontSize:12,color:"#0a1628",fontWeight:600,margin:"0 0 8px",lineHeight:1.4}}>{BONUS_QUESTIONS[m.id]}</p>
          {myBQ!=null
            ?<div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                <span className={"bq-btn "+(myBQ?"yes":"no")+" on"} style={{display:"inline-block",textAlign:"center",padding:"6px 14px",fontSize:12}}>{myBQ?"✅ Yes":"❌ No"}</span>
                {bonusAns!=null&&<span style={{fontSize:11,color:bqPts>0?"#15803d":"#dc2626",fontWeight:700}}>{bonusAns?"Correct: Yes":"Correct: No"}{bqPts!==null?" · "+(bqPts>0?"✓ +"+bqPts+"pts":"✗ 0pts"):""}</span>}
              </div>
            :<p style={{fontSize:11,color:"#94a3b8",margin:0,fontStyle:"italic"}}>{lk?"Answered in prediction":"Answer inside Make Prediction →"}</p>
          }
        </div>
      )}

      {lk&&!isTBD(m)&&<InlineReveal m={m} allPicks={allPicks} allBonusPicks={allBonusPicks} bonusAnswers={bonusAnswers} goalBandAnswers={goalBandAnswers} users={users}/>}

      {pred&&!lk&&!myP&&<button className="pbtn" style={{marginTop:10}} onClick={()=>onPredict(m)}>Make Prediction</button>}
      {pred&&lk&&!myP&&!m.result&&<div style={{textAlign:"center",padding:"8px",fontSize:12,color:"#991b1b",marginTop:4}}>🔒 Prediction window closed</div>}
    </div>
  );
}

/* ─── PICK STATUS PANEL ──────────────────────────────────────── */
function PickStatusPanel({ms,users,allPicks,lockedMatches,adminEmail,goalBandAnswers,bonusAnswers,allBonusPicks}){
  const playableMs=ms.filter(m=>!isTBD(m)&&TEAMS.includes(m.home)&&TEAMS.includes(m.away)).sort((a,b)=>Number(a.id)-Number(b.id));
  const[psMatch,setPsMatch]=useState(()=>playableMs[0]?.id??null);
  const approvedUsers=Object.values(users).filter(u=>u?.email&&u.approved!==false).sort((a,b)=>a.name.localeCompare(b.name));
  const selM=playableMs.find(m=>Number(m.id)===Number(psMatch))||null;

  const ae=Object.entries(allPicks);
  const tot=approvedUsers.length;
  const picked=selM?ae.filter(([emk])=>approvedUsers.some(u=>ek(u.email)===emk)&&(allPicks[emk]?.[String(selM.id)]??allPicks[emk]?.[Number(selM.id)])!=null).length:0;

  return(
    <div>
      <div className="ac" style={{marginBottom:12}}>
        <p className="st" style={{marginBottom:8}}>SELECT MATCH</p>
        <select className="sel" value={psMatch??""} onChange={e=>setPsMatch(Number(e.target.value))}>
          {playableMs.map(m=><option key={m.id} value={m.id}>{m.mn}: {m.home} vs {m.away} ({m.date}){m.result?" ✅":""}</option>)}
        </select>
      </div>

      {selM&&<>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {[["✅","Picked",picked],["⏳","No Pick",tot-picked],["👥","Total",tot]].map(([ic,lb,val])=>(
            <div key={lb} style={{flex:1,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
              <p style={{fontSize:16,margin:0}}>{ic}</p>
              <p className="C" style={{color:"#004B87",fontSize:18,margin:"2px 0 0"}}>{val}</p>
              <p style={{color:"#64748b",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lb}</p>
            </div>
          ))}
        </div>

        <div className="ac">
          <p className="st" style={{marginBottom:10}}>USER PICKS — {selM.mn}: {selM.home} vs {selM.away}</p>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{borderBottom:"2px solid #e2e8f0"}}>
                  {["Player","Win","MOTM","Goals","❓",selM.result?"Pts":""].filter(Boolean).map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"6px 6px",color:"#64748b",fontWeight:700,fontSize:9,textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {approvedUsers.map(u=>{
                  const emk=ek(u.email);
                  const p=allPicks[emk]?.[String(selM.id)]??allPicks[emk]?.[Number(selM.id)];
                  let rowPts=0,winOk=false,motmOk=false;
                  if(p&&selM.result){
                    const wA=!isNR(selM.result.win),mA=!isNR(selM.result.motm);
                    winOk=wA&&p.win===selM.result.win;
                    motmOk=mA&&motmMatch(p.motm,selM.result.motm);
                    let base=0;
                    if(winOk)base+=PTS.win;
                    if(motmOk)base+=PTS.motm;
                    const avail=[wA,mA].filter(Boolean).length;
                    const correct=[winOk,motmOk].filter(Boolean).length;
                    if(avail>0&&correct===avail)base+=PTS.streak;
                    const gbAns=goalBandAnswers?.[String(selM.id)];
                    if(gbAns&&p.gb&&p.gb===gbAns)base+=PTS.goals;
                    const bqAns=bonusAnswers?.[String(selM.id)];
                    const userBQ=(allBonusPicks?.[emk]||{})[String(selM.id)];
                    if(bqAns!=null&&userBQ!=null&&userBQ===bqAns)base+=PTS.bonus;
                    rowPts=base;
                  }
                  return(
                    <tr key={u.email} style={{borderBottom:"1px solid #f1f5f9",background:p?(selM.result?(rowPts>0?"#f0fdf4":"#fff7f7"):"#FFFBEB"):"#fafafa"}}>
                      <td style={{padding:"8px 6px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:6}}>
                          <Av name={u.name} sz={22}/>
                          <p style={{fontSize:11,fontWeight:600,color:"#0a1628",margin:0}}>{u.name}</p>
                        </div>
                      </td>
                      {p?<>
                        <td style={{padding:"6px"}}>
                          <span style={{fontSize:10,fontWeight:700,padding:"2px 5px",borderRadius:5,
                            color:selM.result?(winOk?"#15803d":"#dc2626"):"#0a1628",
                            background:selM.result?(winOk?"#dcfce7":"#fee2e2"):"#f1f5f9"}}>
                            {p.win==="Draw"?"Draw":p.win}
                          </span>
                        </td>
                        <td style={{padding:"6px",fontSize:10,color:selM.result?(motmOk?"#15803d":"#dc2626"):"#475569",fontWeight:selM.result?700:400}}>
                          {p.motm?.split(" ").slice(-1)[0]||"—"}
                        </td>
                        <td style={{padding:"6px",fontSize:10,fontWeight:700,color:"#94a3b8"}}>
                          {p.gb?GOAL_BANDS.find(b=>b.id===p.gb)?.emoji+(p.gb):"—"}
                        </td>
                        <td style={{padding:"6px",fontSize:10}}>
                          {(()=>{const bqA=bonusAnswers?.[String(selM.id)];const uBQ=(allBonusPicks?.[emk]||{})[String(selM.id)];const bqOk=bqA!=null&&uBQ!=null&&uBQ===bqA;return uBQ!=null?<span style={{fontWeight:700,color:bqA!=null?(bqOk?"#15803d":"#dc2626"):"#0a1628"}}>{uBQ?"Y":"N"}{bqA!=null&&<span style={{fontSize:9}}>{bqOk?" ✓":" ✗"}</span>}</span>:<span style={{color:"#94a3b8"}}>—</span>;})()}
                        </td>
                        {selM.result&&<td style={{padding:"6px"}}><span className="C" style={{fontSize:14,fontWeight:800,color:rowPts>0?"#15803d":"#94a3b8"}}>+{rowPts}</span></td>}
                      </>:<td colSpan={selM.result?5:4} style={{textAlign:"center",padding:"8px 4px",color:"#94a3b8",fontSize:11,fontStyle:"italic"}}>no pick</td>}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </>}
    </div>
  );
}

/* ─── GOLDEN BOOT SEARCH COMPONENT ──────────────────────────── */
function GbSearch({selected,onToggle}){
  const[q,setQ]=useState("");
  const filtered=q.trim()?PLAYERS.filter(p=>p.toLowerCase().includes(q.toLowerCase())):PLAYERS;
  return(
    <div>
      <input className="inp" placeholder="Search players…" value={q} onChange={e=>setQ(e.target.value)} style={{marginBottom:8}}/>
      <div style={{maxHeight:180,overflowY:"auto",display:"flex",flexWrap:"wrap",gap:5,padding:2}}>
        {filtered.map(p=>{
          const sel=selected.includes(p);
          return(
            <button key={p} onClick={()=>onToggle(p)}
              style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 9px",borderRadius:8,
                background:sel?"#004B87":"#fff",border:"1.5px solid "+(sel?"#004B87":"#e2e8f0"),
                cursor:"pointer",fontSize:11,fontWeight:sel?700:400,color:sel?"#fff":"#475569",transition:"all .15s"}}>
              {sel&&<span style={{fontSize:9}}>✓</span>}
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GgSearch({selected,onToggle}){
  const[q,setQ]=useState("");
  const filtered=q.trim()?GOALKEEPERS.filter(g=>g.toLowerCase().includes(q.toLowerCase())):GOALKEEPERS;
  return(
    <div>
      <input className="inp" placeholder="Search goalkeepers…" value={q} onChange={e=>setQ(e.target.value)} style={{marginBottom:8}}/>
      <div style={{maxHeight:180,overflowY:"auto",display:"flex",flexWrap:"wrap",gap:5,padding:2}}>
        {filtered.map(g=>{
          const sel=selected.includes(g);
          return(
            <button key={g} onClick={()=>onToggle(g)}
              style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 9px",borderRadius:8,
                background:sel?"#006BB6":"#fff",border:"1.5px solid "+(sel?"#006BB6":"#e2e8f0"),
                cursor:"pointer",fontSize:11,fontWeight:sel?700:400,color:sel?"#fff":"#475569",transition:"all .15s"}}>
              {sel&&<span style={{fontSize:9}}>🧤</span>}
              {g}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN FIFA APP
   ════════════════════════════════════════════════════════════════ */
export default function FifaApp({user,email,isAdmin,onBack,onLogout}){
  const[sc,setSc]=useState("home");
  const[ms,setMs]=useState(()=>BASE_MATCHES.map(m=>({...m,result:null})));
  const[users,setUsers]=useState({});
  const[myPicks,setMyPicks]=useState({});
  const[allPicks,setAllPicks]=useState({});
  const[myBonusPicks,setMyBonusPicks]=useState({});
  const[allBonusPicks,setAllBonusPicks]=useState({});
  const[bonusAnswers,setBonusAnswers]=useState({});
  const[goalBandAnswers,setGoalBandAnswers]=useState({});
  const[spk,setSpk]=useState({});const[mySp,setMySp]=useState("");
  const[t4pk,setT4pk]=useState({});const[myT4,setMyT4]=useState([]);
  const[myWs,setMyWs]=useState("");const[wspk,setWspk]=useState({});
  const[myGb,setMyGb]=useState([]);const[gbpk,setGbpk]=useState({});
  const[myGg,setMyGg]=useState([]);const[ggpk,setGgpk]=useState({});const[myGball,setMyGball]=useState([]);const[gballpk,setGballpk]=useState({});
  const[sw,setSw]=useState(null);const[actualTop4,setActualTop4]=useState([]);
  const[actualWs,setActualWs]=useState("");const[actualGb,setActualGb]=useState("");const[actualGg,setActualGg]=useState([]);const[actualGball,setActualGball]=useState("");
  const[lockedMatches,setLockedMatches]=useState({});
  const[repairLoading,setRepairLoading]=useState(false);
  const[doubleMatch,setDoubleMatch]=useState(null);
  const[rxns,setRxns]=useState({});
  const[chat,setChat]=useState([]);const[chatIn,setChatIn]=useState("");
  const[chatU,setChatU]=useState(0);const[chatSeenTs,setChatSeenTs]=useState(()=>Date.now());
  const[bc,setBc]=useState([]);const[bcMsg,setBcMsg]=useState("");
  const[pinnedBc,setPinnedBc]=useState(null);
  const[maintenance,setMaintenance]=useState(false);
  const[loaded,setLoaded]=useState(false);
  const[manualPtsAdj,setManualPtsAdj]=useState({});
  const[pendingUsers,setPendingUsers]=useState({});
  const[toast,setToast]=useState(null);
  const[htab,setHtab]=useState("today");
  const[ptab,setPtab]=useState("pending");
  const[admTab,setAdmTab]=useState("approvals");
  const[am,setAm]=useState(null);
  const[draft,setDraft]=useState({});
  const[obStep,setObStep]=useState(0);
  const[obSp,setObSp]=useState("");const[obT4,setObT4]=useState([]);
  const[obWs,setObWs]=useState("");const[obGb,setObGb]=useState([]);const[obGg,setObGg]=useState([]);const[obGball,setObGball]=useState([]);
  const[chatMuted,setChatMuted]=useState(false);
  const[mutedUsers,setMutedUsers]=useState({});
  const[onlineUsers,setOnlineUsers]=useState({});
  const[userSearch,setUserSearch]=useState("");
  const[bracket,setBracket]=useState(null);
  const[admResultForm,setAdmResultForm]=useState({});

  const tRef=useRef();const chatRef=useRef();const pollRef=useRef(null);
  const lastPendingCount=useRef(0);
  const justOnboarded=useRef(false);

  const toast2=useCallback((msg,type="info")=>{setToast({msg,type});clearTimeout(tRef.current);tRef.current=setTimeout(()=>setToast(null),3500);},[]);
  const myEk=useMemo(()=>ek(email),[email]);

  /* ─── Load shared data ─────────────────────────────────────── */
  const reloadShared=useCallback(async()=>{
    const[u,ap,rm,bc2,ch,sp2,t4,ws,gb,gg,sw2,lk,rx,mnt,pts,dm,cm,mu,bq,bans,gban,at4,gball,aws,agb,agg,agball,pu,pbc]=await Promise.all([
      DB.get("u"),DB.get("ap"),DB.get("rm"),DB.get("bc"),DB.get("ch"),
      DB.get("sp"),DB.get("t4"),DB.get("ws"),DB.get("gb"),DB.get("gg"),DB.get("sw"),
      DB.get("lockedm"),DB.get("rx"),DB.get("maintenance"),DB.get("ptsadj"),
      DB.get("doublematch"),DB.get("chatmuted"),DB.get("mutedusers"),
      DB.get("bq"),DB.get("bonusans"),DB.get("goalbanans"),
      DB.get("actualtop4"),DB.get("gball"),
      DB.get("actualws"),DB.get("actualgb"),DB.get("actualgg"),DB.get("actualgball"),DB.get("pending"),DB.get("pinnedbc"),
    ]);

    if(u){const nu={};Object.keys(u).forEach(k=>{const e=u[k];if(e?.email)nu[ek(e.email)]=e;});setUsers(nu);}
    if(pu)setPendingUsers(pu);else setPendingUsers({});

    // normalise picks
    const normAP={};
    if(ap&&typeof ap==="object"){
      Object.keys(ap).forEach(k=>{
        const ck=ek(k);
        const userPicks=ap[k];
        if(!userPicks||typeof userPicks!=="object"){normAP[ck]={};return;}
        normAP[ck]={};
        Object.keys(userPicks).forEach(mid=>{
          const p=userPicks[mid];
          if(p&&typeof p==="object"&&(p.win||p.motm)){normAP[ck][String(mid)]=p;}
        });
      });
    }
    setAllPicks(normAP);
    setMyPicks(normAP[myEk]||{});

    // match results
    if(rm){
      setMs(prev=>prev.map(m=>{
        const r=rm[m.id]??rm[String(m.id)];
        if(!r)return{...m,result:null};
        if(r.result&&typeof r.result==="object")return{...m,...r,result:r.result};
        if(r.status==="completed"&&r.win)return{...m,result:{win:r.win,motm:r.motm,score:r.score||""}};
        return{...m,result:null};
      }));
    }

    if(bc2)setBc(bc2);if(ch)setChat(ch);
    const nsp={};if(sp2)Object.keys(sp2).forEach(k=>{nsp[ek(k)]=sp2[k];});setSpk(nsp);setMySp(nsp[myEk]||"");
    const nt4={};if(t4)Object.keys(t4).forEach(k=>{nt4[ek(k)]=t4[k];});setT4pk(nt4);setMyT4(nt4[myEk]||[]);
    const nws={};if(ws)Object.keys(ws).forEach(k=>{nws[ek(k)]=ws[k];});setWspk(nws);setMyWs(nws[myEk]||"");
    const ngb={};if(gb)Object.keys(gb).forEach(k=>{ngb[ek(k)]=gb[k];});setGbpk(ngb);setMyGb(ngb[myEk]||[]);
    const ngg={};if(gg)Object.keys(gg).forEach(k=>{ngg[ek(k)]=gg[k];});setGgpk(ngg);setMyGg(ngg[myEk]||[]);
    const ngball={};if(gball)Object.keys(gball).forEach(k=>{ngball[ek(k)]=gball[k];});setGballpk(ngball);setMyGball(ngball[myEk]||[]);
    if(sw2!=null)setSw(sw2);
    if(lk)setLockedMatches(lk);
    if(rx)setRxns(rx);
    if(mnt!=null)setMaintenance(!!mnt);
    if(pts){const np={};Object.keys(pts).forEach(k=>{np[ek(k)]=pts[k];});setManualPtsAdj(np);}
    if(dm!=null)setDoubleMatch(dm);
    if(cm!=null)setChatMuted(!!cm);
    if(mu){const nm={};Object.keys(mu).forEach(k=>{nm[ek(k)]=mu[k];});setMutedUsers(nm);}
    if(bans)setBonusAnswers(bans);
    if(gban)setGoalBandAnswers(gban);
    const normBQ={};if(bq&&typeof bq==="object"){Object.keys(bq).forEach(k=>{normBQ[ek(k)]=bq[k];});}setAllBonusPicks(normBQ);setMyBonusPicks(normBQ[myEk]||{});

    if(at4&&Array.isArray(at4))setActualTop4(at4);
    if(aws)setActualWs(aws);
    if(agb)setActualGb(agb);
    if(agg&&Array.isArray(agg))setActualGg(agg);
    if(agball)setActualGball(agball);
    setPinnedBc(pbc||null);
    setLoaded(true);
  },[myEk]);

  useEffect(()=>{reloadShared();},[reloadShared]);
  useEffect(()=>{if(["home","lb","picks","chat","wof","adm","rules"].includes(sc))reloadShared();},[sc]);// eslint-disable-line

  // Sync ALL approved cricket users into FIFA users on login
  useEffect(()=>{
    if(!email||!user)return;
    const syncCricketUsers=async()=>{
      // Read cricket users (ipl26_u)
      const iplUsers=await DB.getIpl("u")||{};
      const fifaUsers=await DB.get("u")||{};
      let changed=false;
      const updated={...fifaUsers};
      Object.values(iplUsers).forEach(u=>{
        if(!u?.email||u.approved===false)return;
        const emk=ek(u.email);
        // Add to FIFA if not already there
        if(!updated[u.email]&&!updated[emk]){
          updated[u.email]={email:u.email,name:u.name,joined:u.joined||new Date().toISOString(),approved:true,autoApproved:true};
          changed=true;
        }
      });
      if(changed){
        await DB.set("u",updated);
        const nu={};Object.keys(updated).forEach(k=>{const e=updated[k];if(e?.email)nu[ek(e.email)]=e;});
        setUsers(nu);
      }
    };
    syncCricketUsers();
  },[email,user]);// eslint-disable-line

  useEffect(()=>{
    if(!isAdmin||!user)return;
    const poll=async()=>{const pu=await DB.get("pending")||{};const cnt=Object.keys(pu).length;setPendingUsers(pu);if(cnt>lastPendingCount.current)toast2("🔔 New FIFA registration pending","info");lastPendingCount.current=cnt;};
    poll();const id=setInterval(poll,20000);return()=>clearInterval(id);
  },[isAdmin,user]);// eslint-disable-line

  useEffect(()=>{
    if(sc==="chat"){
      setChatU(0);setChatSeenTs(Date.now());
      const poll=async()=>{const[c,ou]=await Promise.all([DB.get("ch"),DB.get("online")||{}]);if(c)setChat(c);if(ou){const now=Date.now();Object.keys(ou).forEach(k=>{if(now-ou[k].ts>90000)delete ou[k];});setOnlineUsers({...ou});}};
      poll();if(pollRef.current)clearInterval(pollRef.current);
      pollRef.current=setInterval(poll,8000);
      return()=>{if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}};
    }else{if(pollRef.current){clearInterval(pollRef.current);pollRef.current=null;}}
  },[sc]);
  useEffect(()=>{if(sc!=="chat")setChatU(chat.filter(m=>m.ts>chatSeenTs).length);},[chat,sc,chatSeenTs]);
  useEffect(()=>{chatRef.current?.scrollIntoView({behavior:"smooth"});},[chat,sc]);

  /* ─── Onboarding check ─────────────────────────────────────── */
  const hasOnboarded=!!(spk[myEk]);
  useEffect(()=>{
    if(!loaded)return;
    if(justOnboarded.current)return;
    if(!hasOnboarded&&sc!=="onboard")setSc("onboard");
  },[loaded,hasOnboarded,sc,email]);// eslint-disable-line

  /* ─── Computed ─────────────────────────────────────────────── */
  const done=useMemo(()=>ms.filter(m=>m.result),[ms]);
  const todayMs=useMemo(()=>ms.filter(isToday),[ms]);
  const upMs=useMemo(()=>ms.filter(m=>!m.result&&!isToday(m)&&!isTBD(m)),[ms]);
  const pendingCount=Object.keys(pendingUsers).length;
  const getManualAdj=useCallback(em=>manualPtsAdj[ek(em)]||0,[manualPtsAdj]);
  const unbc=bc.filter(b=>b.ts>chatSeenTs).length;

  const calcMyPts=useCallback(()=>{
    const{pts}=calcScore(myPicks,ms,doubleMatch);
    const seasonPts=(mySp&&sw&&mySp===sw)?PTS.season:0;
    const t4pts=actualTop4.length>0?(myT4||[]).filter(t=>actualTop4.includes(t)).length*PTS.top4:0;
    const wsPts=(myWs&&actualWs&&myWs===actualWs)?PTS.woodenSpoon:0;
    const gbPts=actualGb&&(myGb||[]).includes(actualGb)?PTS.goldenBoot:0;
    const ggPts=actualGg.length>0?(myGg||[]).filter(g=>actualGg.includes(g)).length>0?PTS.goldenGlove:0:0;
    const bonusPts=done.reduce((s,m)=>{
      const ans=bonusAnswers[String(m.id)];if(ans==null)return s;
      const myAns=myBonusPicks[String(m.id)];if(myAns==null)return s;
      return s+(myAns===ans?PTS.bonus:0);
    },0);
    const goalPts=done.reduce((s,m)=>{
      const ans=goalBandAnswers[String(m.id)];if(!ans)return s;
      const p=myPicks[String(m.id)]??myPicks[Number(m.id)];if(!p?.gb)return s;
      return s+(p.gb===ans?PTS.goals:0);
    },0);
    const gballPts=actualGball&&myGball.includes(actualGball)?PTS.goldenGlove:0; // reuse goldenGlove pts value (75)
    return pts+seasonPts+t4pts+wsPts+gbPts+ggPts+gballPts+bonusPts+goalPts+getManualAdj(email);
  },[myPicks,ms,doubleMatch,mySp,sw,myT4,actualTop4,myWs,actualWs,myGb,actualGb,myGg,actualGg,myGball,actualGball,bonusAnswers,myBonusPicks,goalBandAnswers,done,getManualAdj,email]);

  const myPts=useMemo(calcMyPts,[calcMyPts]);

  const getLb=useCallback(()=>{
    return Object.values(users).filter(u=>u?.email&&u.approved!==false).map(u=>{
      const emk=ek(u.email);
      const up=allPicks[emk]||{};
      const{pts:mPts}=calcScore(up,ms,doubleMatch);
      const userSp=spk[emk]||"";
      const userT4=t4pk[emk]||[];
      const userWs=wspk[emk]||"";
      const userGb=gbpk[emk]||[];
      const userGg=ggpk[emk]||[];
      const sp2=(userSp&&userSp!=="__skip__"&&sw&&userSp===sw)?PTS.season:0;
      const t4p=actualTop4.length>0?userT4.filter(t=>actualTop4.includes(t)).length*PTS.top4:0;
      const wsp=(userWs&&actualWs&&userWs===actualWs)?PTS.woodenSpoon:0;
      const gbp=actualGb&&userGb.includes(actualGb)?PTS.goldenBoot:0;
      const ggp=actualGg.length>0&&userGg.filter(g=>actualGg.includes(g)).length>0?PTS.goldenGlove:0;
      const bonusPts=done.reduce((s,m)=>{
        const ans=bonusAnswers[String(m.id)];if(ans==null)return s;
        const uAns=(allBonusPicks[emk]||{})[String(m.id)];if(uAns==null)return s;
        return s+(uAns===ans?PTS.bonus:0);
      },0);
      const goalPts=done.reduce((s,m)=>{
        const ans=goalBandAnswers[String(m.id)];if(!ans)return s;
        const p=up[String(m.id)]??up[Number(m.id)];if(!p?.gb)return s;
        return s+(p.gb===ans?PTS.goals:0);
      },0);
      const userGball=(gballpk[emk]||[]);
      const gballPts2=actualGball&&userGball.includes(actualGball)?PTS.goldenGlove:0;
      const total=mPts+sp2+t4p+wsp+gbp+ggp+gballPts2+bonusPts+goalPts+getManualAdj(u.email);
      return{...u,pts:total,userSp,userT4,userWs,userGb,userGg,userGball};
    }).sort((a,b)=>b.pts-a.pts);
  },[users,allPicks,ms,doubleMatch,spk,sw,t4pk,wspk,gbpk,ggpk,gballpk,actualTop4,actualWs,actualGb,actualGg,actualGball,bonusAnswers,allBonusPicks,goalBandAnswers,done,getManualAdj]);

  /* ─── Actions ──────────────────────────────────────────────── */
  async function submitPick(){
    if(!am)return;
    const existingPick=myPicks[String(am.id)]??myPicks[Number(am.id)];
    if(existingPick){toast2("Prediction already locked","error");return;}
    const freshRm=await DB.get("rm")||{};
    const freshMatch={...am,...(freshRm[am.id]??freshRm[String(am.id)]??{})};
    if(isMatchLocked(freshMatch,lockedMatches)){toast2("Match is now locked","error");setAm(null);setSc("home");return;}
    if(!draft.win||!draft.motm||!draft.gb){toast2("Fill all prediction fields","error");return;}
    if(BONUS_QUESTIONS[am.id]&&draft.bqAns===null){toast2("Answer the bonus question too","error");return;}
    const sid=String(am.id);
    const pick={win:draft.win,motm:draft.motm,gb:draft.gb};
    const ok=await DB.setUserPick(myEk,sid,pick);
    if(!ok){toast2("Save failed, try again","error");return;}
    if(BONUS_QUESTIONS[am.id]&&draft.bqAns!==null){
      await DB.set("bq/"+myEk+"/"+sid,draft.bqAns);
      const freshBQ=await DB.get("bq")||{};
      const normBQ={};Object.keys(freshBQ).forEach(k=>{normBQ[ek(k)]=freshBQ[k];});
      setAllBonusPicks(normBQ);setMyBonusPicks(normBQ[myEk]||{});
    }
    const freshAP=await DB.get("ap");
    const normAP={};
    if(freshAP&&typeof freshAP==="object"){
      Object.keys(freshAP).forEach(k=>{
        const ck=ek(k);const up=freshAP[k];
        normAP[ck]={};
        if(up&&typeof up==="object")Object.keys(up).forEach(mid=>{const p=up[mid];if(p&&(p.win||p.motm))normAP[ck][String(mid)]=p;});
      });
    }
    setMyPicks(normAP[myEk]||{});setAllPicks(normAP);
    toast2("Prediction locked! ⚽","ok");setAm(null);setSc("home");
  }

  async function reactFn(mid,key){
    const mr=rxns[mid]||{},list=mr[key]||[];
    const upd={...rxns,[mid]:{...mr,[key]:list.includes(email)?list.filter(e=>e!==email):[...list,email]}};
    setRxns(upd);await DB.set("rx",upd);
  }

  async function sendChat(){
    if(!chatIn.trim()||!user)return;
    if(chatMuted||(mutedUsers||{})[myEk]){toast2("Chat is muted","error");return;}
    const text=chatIn.trim().slice(0,CHAT_MAX);
    const latest=await DB.get("ch")||[];
    const nc=capChat([...latest,{id:Date.now(),email,name:user.name,text,ts:Date.now()}]);
    setChat(nc);setChatIn("");await DB.set("ch",nc);setChatSeenTs(Date.now());
  }

  async function delMsg(id){
    const latest=await DB.get("ch")||[];
    const nc=latest.filter(m=>m.id!==id);setChat(nc);await DB.set("ch",nc);
  }

  /* Admin manual pick save — bypasses lock, atomic write + re-fetch */
  async function adminSavePick(targetEmail,match,pick,bqAns){
    const targetEmk=ek(targetEmail);
    const sid=String(match.id);
    const ok=await DB.setUserPick(targetEmk,sid,{win:pick.win,gb:pick.gb,motm:pick.motm});
    if(!ok){toast2("Save failed","error");return false;}
    if(BONUS_QUESTIONS[match.id]&&bqAns!==null&&bqAns!==undefined){
      await DB.set("bq/"+targetEmk+"/"+sid,bqAns);
      const bqAll=await DB.get("bq")||{};
      const normBQ={};Object.keys(bqAll).forEach(k=>{normBQ[ek(k)]=bqAll[k];});
      setAllBonusPicks(normBQ);if(targetEmail===email)setMyBonusPicks(normBQ[myEk]||{});
    }
    const freshAP=await DB.get("ap");const normAP={};
    if(freshAP&&typeof freshAP==="object"){
      Object.keys(freshAP).forEach(k=>{const ck=ek(k);const up=freshAP[k];normAP[ck]={};
        if(up&&typeof up==="object")Object.keys(up).forEach(mid=>{const p=up[mid];if(p&&(p.win||p.motm))normAP[ck][String(mid)]=p;});});
    }
    setAllPicks(normAP);if(targetEmail===email)setMyPicks(normAP[myEk]||{});
    const targetName=Object.values(users).find(u=>u.email===targetEmail)?.name||targetEmail;
    toast2("✅ Pick saved for "+targetName,"ok");
    return true;
  }

  async function doneOnboard(){
    if(!obSp){toast2("Pick a champion first","error");return;}
    if(obT4.length!==4){toast2("Select exactly 4 teams for Top 4","error");return;}
    if(!obWs){toast2("Pick Wooden Spoon team","error");return;}
    if(!obGb||obGb.length!==5){toast2("Pick exactly 5 Golden Boot candidates","error");return;}
    if(obGg.length!==3){toast2("Pick exactly 3 Golden Glove goalkeepers","error");return;}
    if(obGball.length===0){toast2("Pick at least 1 Golden Ball candidate","error");return;}
    // Update local state optimistically
    setSpk(p=>({...p,[myEk]:obSp}));setMySp(obSp);
    setT4pk(p=>({...p,[myEk]:obT4}));setMyT4(obT4);
    setWspk(p=>({...p,[myEk]:obWs}));setMyWs(obWs);
    setGbpk(p=>({...p,[myEk]:obGb}));setMyGb(obGb);
    setGgpk(p=>({...p,[myEk]:obGg}));setMyGg(obGg);
    setGballpk(p=>({...p,[myEk]:obGball}));setMyGball(obGball);
    // Write only this user's slot — never overwrite other users' picks
    await Promise.all([
      DB.set("sp/"+myEk,obSp),
      DB.set("t4/"+myEk,obT4),
      DB.set("ws/"+myEk,obWs),
      DB.set("gb/"+myEk,obGb),
      DB.set("gg/"+myEk,obGg),
      DB.set("gball/"+myEk,obGball),
    ]);
    justOnboarded.current=true;
    setSc("home");toast2("All picks locked! Vamos! ⚽","ok");
  }

  async function approveUser(emk){
    const pu=await DB.get("pending")||{};const entry=pu[emk];if(!entry)return;
    delete pu[emk];const u2=await DB.get("u")||{};
    u2[entry.email]={...entry,approved:true};
    await DB.set("u",u2);await DB.set("pending",pu);
    setUsers({...users,[ek(entry.email)]:{...entry,approved:true}});setPendingUsers({...pu});
    toast2(entry.name+" approved! ✅","ok");
    const latest=await DB.get("ch")||[];
    const nc=capChat([...latest,{id:Date.now(),email:"__sys__",name:"FIFA Bot",text:"🎉 "+entry.name+" has joined the FIFA Fantasy! Welcome!",ts:Date.now(),sys:true}]);
    setChat(nc);await DB.set("ch",nc);
  }

  async function rejectUser(emk){
    const pu=await DB.get("pending")||{};const entry=pu[emk];if(!entry)return;
    delete pu[emk];await DB.set("pending",pu);await DB.setPw(emk,null);
    setPendingUsers({...pu});toast2(entry.name+" rejected","error");
  }

  async function setManualResult(mid){
    const f=admResultForm[mid];
    if(!f?.win||!f?.motm){toast2("Fill result fields","error");return;}
    const result={win:f.win,motm:f.motm,score:f.score||""};
    const numMid=Number(mid)||mid;
    const rm=(await DB.get("rm"))||{};
    rm[numMid]={win:result.win,motm:result.motm,score:result.score,status:"completed"};
    await DB.set("rm",rm);
    const nm=ms.map(m=>Number(m.id)===Number(mid)?{...m,result,_partial:null}:m);setMs(nm);
    setAdmResultForm(prev=>{const n={...prev};delete n[mid];return n;});
    // Trash talk in chat
    const trashMsg=generateTrashTalk(result,nm.find(x=>Number(x.id)===Number(mid)));
    const latest=await DB.get("ch")||[];
    const gbAnsSet=goalBandAnswers?.[String(numMid)];
    const bqAnsSet=bonusAnswers?.[String(numMid)];
    const nc=capChat([...latest,{id:Date.now(),email:"__sys__",name:"FIFA Bot",text:trashMsg+(gbAnsSet?`\n⚽ Goals Band: ${GOAL_BANDS.find(b=>b.id===gbAnsSet)?.label||gbAnsSet}`:"")+((bqAnsSet!=null)?`\n❓ Bonus: ${bqAnsSet?"YES":"NO"}`:""  ),ts:Date.now(),sys:true}]);
    setChat(nc);await DB.set("ch",nc);
    toast2("Result saved! ✅","ok");
    await reloadShared();
  }

  function generateTrashTalk(result,matchObj){
    if(!matchObj)return"⚽ Result in!";
    const ae=Object.entries(allPicks);
    const sidStr=String(matchObj.id);
    const wA=!isNR(result.win),mA=!isNR(result.motm);
    const avail=[wA,mA].filter(Boolean).length;
    const allUsers=Object.values(users).filter(u=>u?.email&&u.approved!==false);
    const getUserName=emk=>allUsers.find(u=>ek(u.email)===emk)?.name||emk;
    const perfs=ae.filter(([emk])=>{
      const p=(allPicks[emk]||{})[sidStr];if(!p)return false;
      const correct=[wA&&p.win===result.win,mA&&motmMatch(p.motm,result.motm)].filter(Boolean).length;
      return avail>0&&correct===avail;
    }).map(([emk])=>getUserName(emk));
    const zeros=ae.filter(([emk])=>{
      const p=(allPicks[emk]||{})[sidStr];if(!p)return false;
      return wA&&mA&&p.win!==result.win&&!motmMatch(p.motm,result.motm);
    }).map(([emk])=>getUserName(emk));
    const winPickers=ae.filter(([emk])=>(allPicks[emk]||{})[sidStr]?.win===result.win);
    const lone=wA&&winPickers.length===1?getUserName(winPickers[0][0]):null;
    const mn=matchObj.mn+": "+matchObj.home+" vs "+matchObj.away;
    return TRASH_TALK[Math.floor(Math.random()*TRASH_TALK.length)](perfs,zeros,lone,mn);
  }

  async function sendBc(pin=false){
    if(!bcMsg.trim())return;
    const nb=[...bc,{id:Date.now(),msg:bcMsg.trim(),ts:Date.now(),type:"admin"}];
    setBc(nb);await DB.set("bc",nb);
    if(pin){setPinnedBc(bcMsg.trim());await DB.set("pinnedbc",bcMsg.trim());}
    setBcMsg("");toast2(pin?"📌 Pinned!":"Sent!","ok");
  }

  async function savePartialResult(mid,field,value){
    const numMid=Number(mid)||mid;
    const rm=(await DB.get("rm"))||{};
    const existing=rm[numMid]||{};
    const updated={...existing,[field]:value};
    rm[numMid]=updated;
    await DB.set("rm",rm);
    setAdmResultForm(prev=>({...prev,[mid]:{...(prev[mid]||{}),[field]:value}}));
    toast2("Saved ✓","ok");
  }

  async function adjustPts(em,delta){
    const emk=ek(em);const cur=manualPtsAdj[emk]||0;
    const upd={...manualPtsAdj,[emk]:cur+delta};
    setManualPtsAdj(upd);await DB.set("ptsadj",upd);toast2((delta>0?"+":"")+delta+" pts","ok");
  }

  async function deleteUser(ue){
    if(!confirm("Delete "+users[ue]?.name+"?"))return;
    const uek=ek(ue);const nu={...users};delete nu[ue];delete nu[uek];
    await DB.set("u",nu);setUsers(nu);toast2("User deleted","ok");
  }

  async function toggleMatchLock(mid){
    const cur=lockedMatches[mid]??lockedMatches[String(mid)];
    const next=cur==="locked"?"unlocked":cur==="unlocked"?null:"locked";
    const upd={...lockedMatches};if(next===null)delete upd[mid];else upd[mid]=next;
    setLockedMatches(upd);await DB.set("lockedm",upd);
    toast2(next==="locked"?"🔒 Locked":next==="unlocked"?"🔓 Unlocked":"↩️ Auto");
  }

  /* ─── Card props ───────────────────────────────────────────── */
  const cardProps={myPicks,allPicks,rxns,doubleMatch,lockedMatches,email,allMs:ms,onReact:reactFn,
    bonusAnswers,myBonusPicks,allBonusPicks,goalBandAnswers,onBonusPick:async(mid,ans)=>{
      const sid=String(mid);const upd={...myBonusPicks,[sid]:ans};setMyBonusPicks(upd);
      const allUpd={...allBonusPicks,[myEk]:{...(allBonusPicks[myEk]||{}),[sid]:ans}};setAllBonusPicks(allUpd);
      await DB.set("bq/"+myEk+"/"+sid,ans);toast2(ans?"Bonus: Yes ✅":"Bonus: No ❌","ok");
    },users,
    onPredict:(m)=>{
      const existingPick=myPicks[String(m.id)]??myPicks[Number(m.id)];
      if(existingPick){toast2("Prediction already locked","error");return;}
      setAm(m);setDraft({win:"",motm:"",gb:"",bqAns:null});setSc("picks");
    }
  };

  const navItems=isAdmin
    ?[["home","HM","Home"],["lb","LB","Board"],["picks","MY","My Game"],["chat","CH","Chat"],["wof","WF","Fame"],["rules","RL","Rules"],["adm","AD","Admin"]]
    :[["home","HM","Home"],["lb","LB","Board"],["picks","MY","My Game"],["chat","CH","Chat"],["wof","WF","Fame"],["rules","RL","Rules"]];

  const hdr=useMemo(()=>(
    <div style={{background:"linear-gradient(135deg,#003d70,#004B87,#006BB6)",padding:"13px 16px 11px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <img src={FSP_LOGO_SM} alt="FSP" style={{width:36,height:36,objectFit:"contain"}}/>
        <div>
          <p className="C" style={{color:"#C5A028",fontSize:14,letterSpacing:2,margin:0}}>FIFA FANTASY</p>
          <p style={{color:"#bfdbfe",fontSize:10,margin:0}}>World Cup 2026{maintenance?" · 🔒":""}</p>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.25)",borderRadius:10,padding:"5px 12px",textAlign:"center"}}>
          <p className="C" style={{color:"#C5A028",fontSize:18,margin:0,letterSpacing:1}}>{myPts}</p>
          <p style={{color:"#bfdbfe",fontSize:9,margin:0,textTransform:"uppercase",letterSpacing:.5}}>My Pts</p>
        </div>
        <button onClick={onBack} style={{background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.2)",borderRadius:8,color:"#bfdbfe",fontSize:11,padding:"5px 8px",cursor:"pointer",fontFamily:"'Barlow',sans-serif",fontWeight:600}}>← Sports</button>
      </div>
    </div>
  ),[myPts,maintenance,onBack]);

  /* ─── MAINTENANCE ──────────────────────────────────────────── */
  if(maintenance&&!isAdmin){
    return(
      <div className="fifa-app"><style>{CSS}</style>
        <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center"}}>
          <span style={{fontSize:48,marginBottom:16}}>🔧</span>
          <p className="C" style={{color:"#004B87",fontSize:26,letterSpacing:2}}>MAINTENANCE MODE</p>
          <p style={{color:"#64748b",fontSize:14,marginTop:8}}>The FIFA app is temporarily offline.</p>
          <button onClick={onBack} style={{marginTop:24,padding:"10px 24px",borderRadius:10,background:"linear-gradient(135deg,#004B87,#006BB6)",color:"#fff",border:"none",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2}}>← Back to Sports</button>
        </div>
      </div>
    );
  }

  /* ─── ONBOARDING ───────────────────────────────────────────── */
  if(sc==="onboard"){
    return(
      <div className="fifa-app" style={{minHeight:"100vh"}}><style>{CSS}</style>
        <div style={{background:"linear-gradient(135deg,#003d70,#004B87,#006BB6)",padding:"24px 20px 20px",textAlign:"center"}}>
          <FspLogo size={80} style={{margin:"0 auto 12px",display:"block"}}/>
          <p style={{color:"#bfdbfe",fontSize:12,margin:"0 0 4px"}}>Welcome, {user?.name}!</p>
          <p className="C" style={{color:"#C5A028",fontSize:22,letterSpacing:2,margin:0}}>
            {obStep===0?"PICK YOUR CHAMPION":obStep===1?"TOP 4 TEAMS":"AWARDS & GOLDEN BALL"}
          </p>
          <div style={{display:"flex",gap:6,marginTop:12}}>
            {[0,1,2].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:obStep>=i?"#C5A028":"rgba(255,255,255,.2)"}}/>)}
          </div>
        </div>
        <div style={{padding:"20px 16px",paddingBottom:40}}>
          {obStep===0&&<>
            <p style={{color:"#0a1628",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Who will win FIFA World Cup 2026?</p>
            <p style={{color:"#64748b",fontSize:13,margin:"0 0 16px"}}>Worth <b style={{color:"#004B87"}}>+{PTS.season}pts</b> if correct. Locked forever.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>
              {TEAMS.map(t=>(
                <button key={t} className={"ot"+(obSp===t?" on":"")} onClick={()=>setObSp(t)} style={{width:"auto",padding:"8px 12px",flexDirection:"row",gap:8}}>
                  <FlagBox team={t} sz={20}/>
                  <span style={{fontSize:11,fontWeight:700,color:obSp===t?"#004B87":"#475569"}}>{t}</span>
                </button>
              ))}
            </div>
            <button className="lbtn" disabled={!obSp} onClick={()=>setObStep(1)} style={{opacity:obSp?1:.4}}>Next → Top 4</button>
            <button onClick={async()=>{
              // Skip onboarding — mark as done with placeholder so user can browse
              const placeholder="__skip__";
              setSpk(p=>({...p,[myEk]:placeholder}));setMySp(placeholder);
              await DB.set("sp/"+myEk,placeholder);
              justOnboarded.current=true;
              setSc("home");toast2("You can set your picks anytime from My Game → Season","info");
            }} style={{width:"100%",marginTop:8,padding:"10px",borderRadius:10,background:"transparent",color:"#94a3b8",border:"1px solid #e2e8f0",cursor:"pointer",fontSize:13,fontFamily:"'Barlow',sans-serif"}}>
              Skip for now — I'll pick later
            </button>
          </>}

          {obStep===1&&<>
            <p style={{color:"#0a1628",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Which 4 teams reach the Semi Finals?</p>
            <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 14px"}}>Select exactly 4 · {obT4.length}/4 · +{PTS.top4}pts each</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:24}}>
              {TEAMS.map(t=>{
                const sel=obT4.includes(t);
                return(
                  <button key={t} className={"ot"+(sel?" on":"")} onClick={()=>{if(sel)setObT4(p=>p.filter(x=>x!==t));else if(obT4.length<4)setObT4(p=>[...p,t]);else toast2("Max 4 teams","error");}} style={{width:"auto",padding:"8px 12px",flexDirection:"row",gap:8}}>
                    <FlagBox team={t} sz={18}/>
                    <span style={{fontSize:11,fontWeight:700,color:sel?"#004B87":"#475569"}}>{t}</span>
                    {sel&&<span style={{fontSize:9,background:"#004B87",color:"#fff",borderRadius:8,padding:"0 5px"}}>#{obT4.indexOf(t)+1}</span>}
                  </button>
                );
              })}
            </div>
            <button style={{width:"100%",padding:"12px",borderRadius:10,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,marginBottom:10}} onClick={()=>setObStep(0)}>← Back</button>
            <button className="lbtn" disabled={obT4.length!==4} onClick={()=>setObStep(2)} style={{opacity:obT4.length===4?1:.4}}>Next → Wooden Spoon &amp; Golden Boot</button>
          </>}

          {obStep===2&&<>
            <p style={{color:"#0a1628",fontSize:15,fontWeight:600,margin:"0 0 4px"}}>Awards &amp; Wooden Spoon</p>
            <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 14px"}}>Pick your tournament award candidates</p>

            {/* Wooden Spoon */}
            <div style={{background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
              <p style={{fontWeight:700,fontSize:12,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>🪵 Wooden Spoon · +{PTS.woodenSpoon}pts</p>
              <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 10px"}}>Which team will finish last — earliest group stage exit with the worst record?</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {TEAMS.map(t=>(
                  <button key={t} onClick={()=>setObWs(t)} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 9px",borderRadius:8,background:obWs===t?"#004B87":"#fff",border:"1.5px solid "+(obWs===t?"#004B87":"#e2e8f0"),cursor:"pointer"}}>
                    <FlagBox team={t} sz={14}/>
                    <span style={{fontSize:11,fontWeight:700,color:obWs===t?"#fff":"#475569"}}>{t}</span>
                  </button>
                ))}
              </div>
              {obWs&&<p style={{fontSize:11,color:"#15803d",fontWeight:700,marginTop:8}}>✓ {obWs} selected</p>}
            </div>

            {/* Golden Boot — pick 5 */}
            <div style={{background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
              <p style={{fontWeight:700,fontSize:12,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>👟 Golden Boot · +{PTS.goldenBoot}pts · {obGb.length}/5</p>
              <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 10px"}}>Pick 5 players who could be top scorer. If any one of them wins it, you get the points.</p>
              <GbSearch selected={obGb} onToggle={(p)=>{
                if(obGb.includes(p))setObGb(prev=>prev.filter(x=>x!==p));
                else if(obGb.length<5)setObGb(prev=>[...prev,p]);
                else toast2("Max 5 players","error");
              }}/>
              {obGb.length>0&&<div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:5}}>
                {obGb.map(p=><span key={p} style={{background:"#004B87",color:"#fff",fontSize:10,padding:"3px 10px",borderRadius:10,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}>
                  {p}<button onClick={()=>setObGb(prev=>prev.filter(x=>x!==p))} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,padding:0,lineHeight:1}}>✕</button>
                </span>)}
              </div>}
            </div>

            {/* Golden Glove — pick 3 */}
            <div style={{background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
              <p style={{fontWeight:700,fontSize:12,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>🧤 Golden Glove · +{PTS.goldenGlove}pts · {obGg.length}/3</p>
              <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 10px"}}>Pick 3 goalkeepers who could win best goalkeeper. If any of them wins, you get the points.</p>
              <GgSearch selected={obGg} onToggle={(g)=>{
                if(obGg.includes(g))setObGg(prev=>prev.filter(x=>x!==g));
                else if(obGg.length<3)setObGg(prev=>[...prev,g]);
                else toast2("Max 3 goalkeepers","error");
              }}/>
              {obGg.length>0&&<div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:5}}>
                {obGg.map(g=><span key={g} style={{background:"#006BB6",color:"#fff",fontSize:10,padding:"3px 10px",borderRadius:10,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}>
                  🧤 {g}<button onClick={()=>setObGg(prev=>prev.filter(x=>x!==g))} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,padding:0,lineHeight:1}}>✕</button>
                </span>)}
              </div>}
            </div>

            {/* Golden Ball — pick 5 player candidates */}
            <div style={{background:"#f8faff",border:"1px solid #e2e8f0",borderRadius:12,padding:"12px 14px",marginBottom:14}}>
              <p style={{fontWeight:700,fontSize:12,color:"#64748b",marginBottom:4,textTransform:"uppercase",letterSpacing:.5}}>🏅 Golden Ball · +{PTS.goldenGlove}pts · {obGball.length}/5</p>
              <p style={{fontSize:11,color:"#94a3b8",margin:"0 0 10px"}}>Pick 5 players who could win Player of the Tournament. If any of them wins, you get the points.</p>
              <GbSearch selected={obGball} onToggle={(p)=>{
                if(obGball.includes(p))setObGball(prev=>prev.filter(x=>x!==p));
                else if(obGball.length<5)setObGball(prev=>[...prev,p]);
                else toast2("Max 5 players","error");
              }}/>
              {obGball.length>0&&<div style={{marginTop:8,display:"flex",flexWrap:"wrap",gap:5}}>
                {obGball.map(p=><span key={p} style={{background:"#B8860B",color:"#fff",fontSize:10,padding:"3px 10px",borderRadius:10,fontWeight:600,display:"inline-flex",alignItems:"center",gap:5}}>
                  🏅 {p}<button onClick={()=>setObGball(prev=>prev.filter(x=>x!==p))} style={{background:"none",border:"none",color:"rgba(255,255,255,.7)",cursor:"pointer",fontSize:12,padding:0,lineHeight:1}}>✕</button>
                </span>)}
              </div>}
            </div>

            <div style={{display:"flex",gap:8,marginTop:4}}>
              <button style={{flex:1,padding:"12px",borderRadius:10,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2}} onClick={()=>setObStep(1)}>← Back</button>
              <button className="lbtn" disabled={!obWs||obGb.length!==5||obGg.length!==3||obGball.length===0} onClick={doneOnboard} style={{flex:2,opacity:obWs&&obGb.length===5&&obGg.length===3&&obGball.length>0?1:.4}}>Lock All Picks ⚽</button>
            </div>
          </>}

                  </div>
        {toast&&<Tst t={toast}/>}
      </div>
    );
  }

  /* ─── PREDICTION SCREEN ────────────────────────────────────── */
  if(sc==="picks"&&am){
    const hasBQ=!!BONUS_QUESTIONS[am.id];
    const allReady=!!(draft.win&&draft.motm&&draft.gb&&(!hasBQ||draft.bqAns!==null));
    const maxPts=PTS.win+PTS.motm+PTS.goals+PTS.streak+(hasBQ?PTS.bonus:0);
    return(
      <div className="fifa-app" style={{paddingBottom:32}}><style>{CSS}</style>
        <div style={{background:"linear-gradient(135deg,#003d70,#004B87,#006BB6)",padding:"16px",display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>{setAm(null);setSc("home");}} style={{background:"none",border:"none",color:"#fff",fontSize:22,cursor:"pointer",padding:0}}>←</button>
          <FlagBox team={am.home} sz={24}/>
          <div style={{flex:1}}>
            <p className="C" style={{color:"#fff",fontSize:16,margin:0}}>{am.home} vs {am.away}</p>
            <p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{am.date} · {am.time} ET · {am.mn}</p>
          </div>
          <FlagBox team={am.away} sz={24}/>
        </div>
        <div style={{background:"#FFF9E6",padding:"8px 16px",borderBottom:"1px solid #FDE68A"}}>
          <span style={{color:"#92400E",fontSize:12}}>⚠️ Once submitted, predictions are final.</span>
        </div>
        <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:18}}>

          {/* Winner */}
          <div>
            <p className="st">MATCH WINNER <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.win}pts</span></p>
            <div style={{display:"flex",gap:8}}>
              {[am.home,"Draw",am.away].map(t=>(
                <button key={t} className={"tmbtn"+(draft.win===t?" on":"")} onClick={()=>setDraft(d=>({...d,win:t}))}>
                  {t!=="Draw"?<FlagBox team={t} sz={28}/>:<span style={{fontSize:24}}>🤝</span>}
                  <p className="C" style={{color:draft.win===t?"#004B87":"#64748b",fontSize:t==="Draw"?14:13,margin:0}}>{t}</p>
                  {draft.win===t&&<span style={{background:"#004B87",color:"#fff",fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:12}}>SELECTED</span>}
                </button>
              ))}
            </div>
          </div>

          {/* MOTM */}
          <div>
            <p className="st">MAN OF THE MATCH <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.motm}pts</span></p>
            <MotmDropdown team1={am.home} team2={am.away} value={draft.motm||""} onChange={v=>setDraft(d=>({...d,motm:v}))}/>
          </div>

          {/* Goals Band */}
          <div>
            <p className="st">TOTAL GOALS <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.goals}pts</span></p>
            <p style={{fontSize:11,color:"#64748b",margin:"0 0 10px",lineHeight:1.5}}>How many total goals will be scored in this match?</p>
            <div style={{display:"flex",gap:8}}>
              {GOAL_BANDS.map(band=>(
                <button key={band.id} onClick={()=>setDraft(d=>({...d,gb:d.gb===band.id?"":band.id}))}
                  style={{flex:1,padding:"12px 4px",borderRadius:12,border:"2px solid "+(draft.gb===band.id?"#004B87":"#e2e8f0"),background:draft.gb===band.id?"#E6F0FB":"#f8faff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
                  <span style={{fontSize:22}}>{band.emoji}</span>
                  <p className="C" style={{color:draft.gb===band.id?"#004B87":"#64748b",fontSize:16,margin:0}}>{band.short}</p>
                  {draft.gb===band.id&&<span style={{background:"#004B87",color:"#fff",fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:8}}>SELECTED</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Bonus Q */}
          {hasBQ&&<div>
            <p className="st">BONUS QUESTION <span style={{color:"#94a3b8",fontWeight:400,fontSize:10}}>+{PTS.bonus}pts</span></p>
            <div style={{background:"#F4F6FB",border:"1px solid "+(draft.bqAns!==null?"#004B8740":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:8}}>
              <p style={{fontSize:13,color:"#0a1628",fontWeight:600,margin:"0 0 12px",lineHeight:1.5}}>{BONUS_QUESTIONS[am.id]}</p>
              <div style={{display:"flex",gap:8}}>
                <button className={"bq-btn yes"+(draft.bqAns===true?" on":"")} onClick={()=>setDraft(d=>({...d,bqAns:d.bqAns===true?null:true}))}>✅ Yes</button>
                <button className={"bq-btn no"+(draft.bqAns===false?" on":"")} onClick={()=>setDraft(d=>({...d,bqAns:d.bqAns===false?null:false}))}>❌ No</button>
              </div>
            </div>
          </div>}

          {/* Summary */}
          {draft.win&&draft.motm&&(
            <div style={{background:"#E6F0FB",border:"1px solid #bfdbfe",borderRadius:12,padding:"14px 16px"}}>
              <p className="st" style={{marginBottom:12}}>YOUR PREDICTION</p>
              {[["Winner",draft.win==="Draw"?"Draw":draft.win,PTS.win],["MOTM",draft.motm,PTS.motm],["Goals",draft.gb?GOAL_BANDS.find(b=>b.id===draft.gb)?.label:"—",PTS.goals]].map(([l,v,p])=>(
                <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{color:"#64748b",fontSize:13}}>{l}</span>
                  <span style={{color:"#0a1628",fontSize:13,fontWeight:600}}>{v} <span className="C" style={{color:"#004B87",fontSize:11}}>+{p}pts</span></span>
                </div>
              ))}
              {hasBQ&&draft.bqAns!==null&&<div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <span style={{color:"#64748b",fontSize:13}}>Bonus Q</span>
                <span style={{color:"#0a1628",fontSize:13,fontWeight:600}}>{draft.bqAns?"Yes":"No"} <span className="C" style={{color:"#004B87",fontSize:11}}>+{PTS.bonus}pts</span></span>
              </div>}
              <div style={{borderTop:"1px solid #bfdbfe",paddingTop:8,marginTop:4,display:"flex",justifyContent:"space-between"}}>
                <span style={{color:"#64748b",fontSize:12}}>Max possible</span>
                <span className="C" style={{color:"#004B87",fontSize:20}}>+{maxPts}pts</span>
              </div>
            </div>
          )}
          <button className="lbtn" disabled={!allReady} onClick={submitPick} style={{opacity:allReady?1:.4}}>Lock Prediction ⚽</button>
        </div>
        {toast&&<Tst t={toast}/>}
      </div>
    );
  }

  /* ─── MAIN SHELL ───────────────────────────────────────────── */
  return(
    <div className="fifa-app" style={{paddingBottom:68}}><style>{CSS}</style>
      {hdr}
      {pinnedBc&&<div style={{background:"#004B87",padding:"8px 16px",display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:14}}>📌</span><p style={{color:"#fff",fontSize:12,fontWeight:600,margin:0,flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{pinnedBc}</p></div>}

      {/* Points quick ref */}
      <div style={{background:"#fff",padding:"8px 16px",display:"flex",borderBottom:"1px solid #e2e8f0"}}>
        {[["🏆","Win",PTS.win],["⭐","MOTM",PTS.motm],["⚽","Goals",PTS.goals],["🔥","Streak",PTS.streak],["❓","Bonus",PTS.bonus]].map(([ic,l,p],i)=>(
          <div key={l} style={{flex:1,textAlign:"center",borderRight:i<4?"1px solid #e2e8f0":"none"}}>
            <p style={{color:"#004B87",fontWeight:700,fontSize:11,margin:0}}>{p}<span style={{fontSize:8,color:"#94a3b8",fontWeight:400}}> pts</span></p>
            <p style={{color:"#64748b",fontSize:8,margin:"1px 0 0"}}>{ic} {l}</p>
          </div>
        ))}
      </div>

      {/* ── HOME ── */}
      {sc==="home"&&<>
        <div style={{display:"flex",background:"#fff",borderBottom:"1px solid #e2e8f0"}}>
          {[["today","Today ("+todayMs.length+")"],["done","Results ("+done.length+")"],["up","Schedule ("+upMs.length+")"],["season","Season"],["groups","Groups"]].map(([t,l])=>(
            <button key={t} className={"tbtn"+(htab===t?" on":"")} onClick={()=>setHtab(t)}>{l}</button>
          ))}
        </div>
        <div style={{padding:"14px 14px 0"}}>
          {htab==="today"&&(todayMs.length===0
            ?<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:40}}>⚽</p><p className="C" style={{color:"#94a3b8",fontSize:18,letterSpacing:1}}>NO MATCHES TODAY</p></div>
            :todayMs.map(m=><MCard key={m.id} m={m} pred={true} {...cardProps}/>)
          )}
          {htab==="done"&&(done.length===0
            ?<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:40}}>⏳</p><p className="C" style={{color:"#94a3b8",fontSize:18,letterSpacing:1}}>NO RESULTS YET</p></div>
            :[...done].reverse().map(m=><MCard key={m.id} m={m} pred={false} {...cardProps}/>)
          )}
          {htab==="up"&&(upMs.length===0
            ?<div style={{textAlign:"center",padding:"48px 16px"}}><p className="C" style={{color:"#94a3b8",fontSize:16}}>ALL MATCHES DONE</p></div>
            :upMs.map(m=>{
              const hasPick=!!(myPicks[String(m.id)]??myPicks[Number(m.id)]);
              return(
                <div key={m.id} style={{background:"#fff",border:"1px solid "+(hasPick?"#bbf7d0":"#e2e8f0"),borderRadius:14,padding:"14px",marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time} ET</span>
                    {hasPick?<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>✅ Predicted</span>:<span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>Upcoming</span>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
                      <FlagBox team={m.home} sz={24}/>
                      <p className="C" style={{color:"#475569",fontSize:13,margin:0}}>{m.home}</p>
                    </div>
                    <p className="C" style={{color:"#e2e8f0",fontSize:16,padding:"0 8px",margin:0}}>VS</p>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end",flexDirection:"row-reverse"}}>
                      <FlagBox team={m.away} sz={24}/>
                      <p className="C" style={{color:"#475569",fontSize:13,margin:0}}>{m.away}</p>
                    </div>
                  </div>
                  <p style={{color:"#cbd5e1",fontSize:11,marginTop:10,borderTop:"1px solid #f1f5f9",paddingTop:8}}>📍 {m.venue}</p>
                </div>
              );
            })
          )}
          {htab==="season"&&<div>
            <div style={{background:"linear-gradient(135deg,#003d70,#004B87)",borderRadius:14,padding:"16px",marginBottom:14,textAlign:"center"}}>
              <p className="C" style={{color:"#C5A028",fontSize:22,letterSpacing:2,margin:0}}>MY SEASON PICKS</p>
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">🏆 WORLD CUP CHAMPION (+{PTS.season}pts)</p>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                {mySp?<FlagBox team={mySp} sz={36}/>:<div style={{width:50,height:50,borderRadius:10,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>?</div>}
                <div>
                  <p className="C" style={{color:"#0a1628",fontSize:18,margin:0}}>{mySp||"Not set"}</p>
                  {sw&&mySp&&<p style={{color:mySp===sw?"#15803d":"#dc2626",fontSize:13,fontWeight:700,marginTop:6}}>{mySp===sw?"✅ Correct! +200pts":"❌ Better luck next time"}</p>}
                </div>
              </div>
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">🏅 TOP 4 TEAMS (+{PTS.top4}pts each)</p>
              {myT4&&myT4.length>0?<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{myT4.map((t,i)=><div key={t} style={{display:"flex",alignItems:"center",gap:6,background:"#f8faff",borderRadius:10,padding:"8px 12px",border:"1px solid #e2e8f0"}}><span className="C" style={{color:"#94a3b8",fontSize:12}}>#{i+1}</span><FlagBox team={t} sz={20}/><span className="C" style={{color:"#004B87",fontSize:13}}>{t}</span>{actualTop4.length>0&&<span style={{fontSize:13}}>{actualTop4.includes(t)?"✅":"❌"}</span>}</div>)}</div>:<p style={{color:"#94a3b8",fontSize:12}}>Not set</p>}
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">🪵 WOODEN SPOON (+{PTS.woodenSpoon}pts)</p>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {myWs?<FlagBox team={myWs} sz={28}/>:null}
                <p className="C" style={{color:"#0a1628",fontSize:16,margin:0}}>{myWs||"Not set"}</p>
                {actualWs&&myWs&&<span style={{fontSize:13}}>{myWs===actualWs?"✅ Correct! +50pts":"❌"}</span>}
              </div>
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">👟 GOLDEN BOOT CANDIDATES (+{PTS.goldenBoot}pts)</p>
              <p style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>Points if any of your 5 picks wins the top scorer award</p>
              {myGb&&myGb.length>0
                ?<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{myGb.map(p=>{
                    const correct=actualGb&&p===actualGb;const wrong=actualGb&&p!==actualGb;
                    return<div key={p} style={{display:"flex",alignItems:"center",gap:5,background:correct?"#f0fdf4":wrong?"#fef2f2":"#f8faff",border:"1px solid "+(correct?"#bbf7d0":wrong?"#fecaca":"#e2e8f0"),borderRadius:8,padding:"5px 9px"}}>
                      <span style={{fontSize:11,fontWeight:600,color:correct?"#15803d":wrong?"#dc2626":"#475569"}}>{p}</span>
                      {correct&&<span>✅</span>}{wrong&&<span>✗</span>}
                    </div>;
                  })}</div>
                :<p style={{color:"#94a3b8",fontSize:12}}>Not set</p>}
              {actualGb&&myGb&&myGb.includes(actualGb)&&<p style={{color:"#15803d",fontSize:12,fontWeight:700,marginTop:8}}>✅ {actualGb} won! +{PTS.goldenBoot}pts</p>}
              {actualGb&&myGb&&!myGb.includes(actualGb)&&<p style={{color:"#dc2626",fontSize:12,fontWeight:700,marginTop:8}}>❌ {actualGb} won — not in your picks</p>}
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">🧤 GOLDEN GLOVE CANDIDATES (+{PTS.goldenGlove}pts)</p>
              <p style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>Points if any of your 3 keeper picks wins the Golden Glove</p>
              {myGg&&myGg.length>0
                ?<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{myGg.map(g=>{
                    const correct=actualGg.length>0&&actualGg.includes(g);const wrong=actualGg.length>0&&!actualGg.includes(g);
                    return<div key={g} style={{display:"flex",alignItems:"center",gap:5,background:correct?"#f0fdf4":wrong?"#fef2f2":"#f8faff",border:"1px solid "+(correct?"#bbf7d0":wrong?"#fecaca":"#e2e8f0"),borderRadius:8,padding:"5px 9px"}}>
                      <span style={{fontSize:11}}>🧤</span>
                      <span style={{fontSize:11,fontWeight:600,color:correct?"#15803d":wrong?"#dc2626":"#475569"}}>{g}</span>
                      {correct&&<span>✅</span>}
                    </div>;
                  })}</div>
                :<p style={{color:"#94a3b8",fontSize:12}}>Not set</p>}
              {actualGg.length>0&&myGg&&myGg.filter(g=>actualGg.includes(g)).length>0&&<p style={{color:"#15803d",fontSize:12,fontWeight:700,marginTop:8}}>✅ Correct! +{PTS.goldenGlove}pts</p>}
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">🏅 GOLDEN BALL CANDIDATES (+{PTS.goldenGlove}pts)</p>
              <p style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>Points if any of your 5 picks wins Player of the Tournament</p>
              {myGball&&myGball.length>0
                ?<div style={{display:"flex",flexWrap:"wrap",gap:6}}>{myGball.map(p=>{
                    const correct=actualGball&&p===actualGball;const wrong=actualGball&&p!==actualGball;
                    return<div key={p} style={{display:"flex",alignItems:"center",gap:5,background:correct?"#f0fdf4":wrong?"#fef2f2":"#f8faff",border:"1px solid "+(correct?"#bbf7d0":wrong?"#fecaca":"#e2e8f0"),borderRadius:8,padding:"5px 9px"}}>
                      <span style={{fontSize:11}}>🏅</span>
                      <span style={{fontSize:11,fontWeight:600,color:correct?"#15803d":wrong?"#dc2626":"#475569"}}>{p}</span>
                      {correct&&<span>✅</span>}{wrong&&actualGball&&<span style={{fontSize:10,color:"#dc2626"}}>✗</span>}
                    </div>;
                  })}</div>
                :<p style={{color:"#94a3b8",fontSize:12}}>Not set</p>}
              {actualGball&&myGball&&myGball.includes(actualGball)&&<p style={{color:"#15803d",fontSize:12,fontWeight:700,marginTop:8}}>✅ {actualGball} won! +{PTS.goldenGlove}pts</p>}
              {actualGball&&myGball&&!myGball.includes(actualGball)&&<p style={{color:"#dc2626",fontSize:12,fontWeight:700,marginTop:8}}>❌ {actualGball} won — not in your picks</p>}
              {!actualGball&&myGball&&myGball.length>0&&<p style={{color:"#94a3b8",fontSize:11,marginTop:6}}>Awaiting tournament result</p>}
            </div>
          </div>}
          {htab==="groups"&&<div>
            {Object.entries(GROUPS).map(([grp,teams])=>(
              <div key={grp} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:10}}>
                <p className="C" style={{color:"#004B87",fontSize:16,letterSpacing:2,margin:"0 0 8px"}}>Group {grp}</p>
                {teams.map(t=>(
                  <div key={t} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <FlagBox team={t} sz={20}/>
                    <span style={{fontSize:13,fontWeight:600,color:"#0a1628",flex:1}}>{t}</span>
                    <FormDots form={getTeamForm(t,ms,5)}/>
                  </div>
                ))}
              </div>
            ))}
          </div>}
        </div>
      </>}

      {/* ── LEADERBOARD ── */}
      {sc==="lb"&&<div style={{padding:"16px"}}>
        <div style={{background:"linear-gradient(135deg,#003d70,#004B87)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}>
          <p className="C" style={{color:"#C5A028",fontSize:26,letterSpacing:2,margin:0}}>LEADERBOARD</p>
          <p style={{color:"#bfdbfe",fontSize:12,marginTop:4}}>{done.length} matches · {getLb().length} players</p>
        </div>
        {getLb().map((u,i)=>(
          <LbCard key={u.email} u={u} i={i} isMe={u.email===email}
            sw={sw} actualTop4={actualTop4} actualWs={actualWs}
            actualGb={actualGb} actualGg={actualGg} actualGball={actualGball}
            PTS={PTS}/>
        ))}
        {getLb().length===0&&<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:36}}>👥</p><p style={{color:"#94a3b8",marginTop:12}}>No players yet.</p></div>}
      </div>}

      {/* ── MY GAME ── */}
      {sc==="picks"&&!am&&(()=>{
        const played=ms.filter(m=>m.result&&(myPicks[String(m.id)]??myPicks[Number(m.id)]));
        const pending=ms.filter(m=>!m.result&&(myPicks[String(m.id)]??myPicks[Number(m.id)]));
        const schedule=ms.filter(m=>!m.result&&!isTBD(m)&&!isToday(m));
        return(
          <div style={{padding:"16px"}}>
            <div style={{background:"linear-gradient(135deg,#003d70,#004B87)",borderRadius:14,padding:"16px",marginBottom:14}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div>
                  <p className="C" style={{color:"#C5A028",fontSize:20,letterSpacing:1,margin:0}}>MY GAME</p>
                  <p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{Object.keys(myPicks).length} predictions made</p>
                </div>
                <p className="C" style={{color:"#C5A028",fontSize:28,margin:0}}>{myPts}</p>
              </div>
              <div style={{display:"flex",gap:6}}>
                {[["⚽",played.length,"Played"],["🎯",played.filter(m=>{const p=myPicks[String(m.id)]??myPicks[Number(m.id)];if(!p)return false;const wA=!isNR(m.result.win),mA=!isNR(m.result.motm);const wOk=wA&&p.win===m.result.win;const mOk=mA&&motmMatch(p.motm,m.result.motm);const avail=[wA,mA].filter(Boolean).length;const correct=[wOk,mOk].filter(Boolean).length;return avail>0&&correct===avail;}).length,"Perfect"],["📊",played.length?Math.round(played.filter(m=>{const p=myPicks[String(m.id)]??myPicks[Number(m.id)];return p&&(p.win===m.result.win||(motmMatch(p.motm,m.result.motm)));}).length/played.length*100):0+"%","Acc"]].map(([ic,val,lbl])=>(
                  <div key={lbl} style={{flex:1,background:"rgba(255,255,255,.12)",borderRadius:10,padding:"8px 4px",textAlign:"center"}}>
                    <p style={{fontSize:14,margin:0}}>{ic}</p>
                    <p className="C" style={{color:"#C5A028",fontSize:15,margin:"2px 0 0"}}>{val}</p>
                    <p style={{color:"rgba(255,255,255,.6)",fontSize:9,margin:0,textTransform:"uppercase"}}>{lbl}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:"flex",gap:0,background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",marginBottom:14,overflow:"hidden"}}>
              {[["pending","Pending ("+pending.length+")"],["played","Results ("+played.length+")"],["upcoming","Schedule"]].map(([t,l])=>(
                <button key={t} className={"tbtn"+(ptab===t?" on":"")} onClick={()=>setPtab(t)}>{l}</button>
              ))}
            </div>
            {ptab==="pending"&&(pending.length===0
              ?<div style={{textAlign:"center",padding:"32px 16px"}}><p style={{fontSize:36}}>✅</p><p style={{color:"#94a3b8",marginTop:8,fontSize:13}}>No pending predictions.</p></div>
              :pending.map(m=>{
                const p=myPicks[String(m.id)]??myPicks[Number(m.id)];
                return(
                  <div key={m.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                      <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date}</span>
                      <span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,padding:"3px 9px",borderRadius:20,fontWeight:600}}>✅ Locked</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
                      <FlagBox team={m.home} sz={24}/>
                      <span className="C" style={{color:"#94a3b8",fontSize:14}}>VS</span>
                      <FlagBox team={m.away} sz={24}/>
                    </div>
                    <div style={{background:"#f0fdf4",borderRadius:8,padding:"8px 12px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {[["🏆 Winner",p?.win==="Draw"?"Draw":p?.win],["⭐ MOTM",p?.motm],["⚽ Goals",p?.gb?GOAL_BANDS.find(b=>b.id===p.gb)?.label:"—"]].map(([l,v])=>(
                        <div key={l} style={{background:"rgba(255,255,255,.7)",borderRadius:8,padding:"6px 8px"}}>
                          <p style={{fontSize:9,color:"#64748b",fontWeight:600,margin:0}}>{l}</p>
                          <p style={{fontSize:12,fontWeight:700,color:"#0a1628",margin:"2px 0 0"}}>{v||"—"}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
            {ptab==="played"&&(played.length===0
              ?<div style={{textAlign:"center",padding:"32px 16px"}}><p style={{fontSize:36}}>⏳</p><p style={{color:"#94a3b8",marginTop:8,fontSize:13}}>No results yet.</p></div>
              :[...played].reverse().map(m=>{
                const p=myPicks[String(m.id)]??myPicks[Number(m.id)];
                const wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
                const wOk=wA&&p?.win===m.result.win;
                const mOk=mA&&motmMatch(p?.motm,m.result.motm);
                const gbAns=goalBandAnswers[String(m.id)];
                const gbOk=!!(gbAns&&p?.gb&&p.gb===gbAns);
                const avail=[wA,mA].filter(Boolean).length;
                const correct=[wOk,mOk].filter(Boolean).length;
                const isPerfect=avail>0&&correct===avail;
                let base=0;
                if(wOk)base+=PTS.win;if(mOk)base+=PTS.motm;
                if(avail>0&&correct===avail)base+=PTS.streak;
                if(gbOk)base+=PTS.goals;
                const dbl=doubleMatch&&Number(doubleMatch)===Number(m.id);
                const pts=base*(dbl?2:1);
                return(
                  <div key={m.id} style={{background:"#fff",border:"1px solid "+(isPerfect?"#bbf7d0":"#e2e8f0"),borderRadius:12,padding:"14px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                      <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date}</span>
                      <div style={{display:"flex",gap:6,alignItems:"center"}}>
                        {isPerfect&&<span style={{fontSize:11}}>🎯</span>}
                        {dbl&&<span style={{background:"#C5A028",color:"#fff",fontSize:9,padding:"2px 6px",borderRadius:10,fontWeight:700}}>2×</span>}
                        <span className="C" style={{color:pts>0?"#15803d":"#94a3b8",fontSize:14}}>+{pts}pts</span>
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                      {[["Win",p?.win==="Draw"?"Draw":p?.win,m.result.win==="Draw"?"Draw":m.result.win,wOk,wA],["MOTM",p?.motm?.split(" ").slice(-1)[0],m.result.motm?.split(" ").slice(-1)[0],mOk,mA]].map(([l,pv,rv,ok,avail2])=>(
                        <div key={l} style={{flex:1,minWidth:60,background:!avail2?"#f1f5f9":ok?"#f0fdf4":"#fef2f2",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
                          <p style={{fontSize:9,color:"#94a3b8",margin:0,textTransform:"uppercase"}}>{l}</p>
                          <p style={{fontSize:11,fontWeight:700,color:!avail2?"#94a3b8":ok?"#15803d":"#dc2626",margin:"2px 0 0"}}>{pv||"—"}</p>
                          <p style={{fontSize:9,color:"#94a3b8",margin:"1px 0 0"}}>{ok?"✓":"✗"} {rv||"?"}</p>
                        </div>
                      ))}
                      {p?.gb&&<div style={{flex:1,minWidth:60,background:gbAns?(gbOk?"#f0fdf4":"#fef2f2"):"#f1f5f9",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
                        <p style={{fontSize:9,color:"#94a3b8",margin:0,textTransform:"uppercase"}}>Goals</p>
                        <p style={{fontSize:11,fontWeight:700,color:gbAns?(gbOk?"#15803d":"#dc2626"):"#94a3b8",margin:"2px 0 0"}}>{GOAL_BANDS.find(b=>b.id===p.gb)?.short||p.gb}</p>
                        <p style={{fontSize:9,color:"#94a3b8",margin:"1px 0 0"}}>{gbAns?(gbOk?"✓":"✗"):"TBD"}</p>
                      </div>}
                    </div>
                  </div>
                );
              })
            )}
            {ptab==="upcoming"&&(schedule.length===0
              ?<div style={{textAlign:"center",padding:"32px 16px"}}><p style={{color:"#94a3b8",fontSize:13}}>No upcoming matches.</p></div>
              :schedule.map(m=>{
                const hasPick=!!(myPicks[String(m.id)]??myPicks[Number(m.id)]);
                const lk=isMatchLocked(m,lockedMatches);
                return(
                  <div key={m.id} style={{background:"#fff",border:"1px solid "+(hasPick?"#bbf7d0":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <span style={{color:"#94a3b8",fontSize:11,fontWeight:600}}>{m.mn} · {m.date} · {m.time} ET</span>
                      {hasPick?<span style={{background:"#f0fdf4",color:"#15803d",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>✅</span>:lk?<span style={{background:"#fee2e2",color:"#991b1b",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>🔒</span>:<span style={{background:"#f1f5f9",color:"#64748b",fontSize:10,padding:"3px 8px",borderRadius:12,fontWeight:600}}>Pending</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <FlagBox team={m.home} sz={20}/>
                      <span className="C" style={{color:"#475569",fontSize:12}}>{m.home}</span>
                      <span className="C" style={{color:"#e2e8f0",fontSize:12,margin:"0 6px"}}>VS</span>
                      <span className="C" style={{color:"#475569",fontSize:12}}>{m.away}</span>
                      <FlagBox team={m.away} sz={20}/>
                    </div>
                    {!hasPick&&!lk&&<button className="pbtn" style={{marginTop:10,fontSize:12,padding:"8px"}} onClick={()=>{setAm(m);setDraft({win:"",motm:"",gb:"",bqAns:null});setSc("picks");}}>Predict →</button>}
                  </div>
                );
              })
            )}
          </div>
        );
      })()}

      {/* ── CHAT ── */}
      {sc==="chat"&&<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 130px)"}}>
        <div style={{background:"#fff",padding:"10px 16px",borderBottom:"1px solid #e2e8f0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <p style={{fontWeight:700,fontSize:14,color:"#0a1628",margin:0}}>FIFA Group Chat</p>
            <p style={{color:"#94a3b8",fontSize:11,margin:0}}>{Object.keys(onlineUsers).length} online</p>
          </div>
          {chatMuted&&<span style={{background:"#fef2f2",color:"#dc2626",fontSize:11,padding:"3px 8px",borderRadius:8,fontWeight:600}}>🔇 Muted</span>}
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"14px 14px 0",display:"flex",flexDirection:"column",gap:10}}>
          {chat.map(msg=>{
            const isMe=msg.email===email,isSys=msg.sys||msg.email==="__sys__";
            return(
              <div key={msg.id} className={"chat-row"+(isSys?" sys":isMe?" me":" them")}>
                {!isMe&&!isSys&&<span style={{fontSize:11,color:"#94a3b8",marginBottom:2,paddingLeft:4}}>{msg.name}</span>}
                <div style={{display:"flex",alignItems:"flex-end",gap:6,flexDirection:isMe?"row-reverse":"row"}}>
                  {!isMe&&!isSys&&<Av name={msg.name} sz={22}/>}
                  <div className={"bubble"+(isSys?" sys":isMe?" me":" them")}>{msg.text}</div>
                  {isAdmin&&!isSys&&<button onClick={()=>delMsg(msg.id)} style={{background:"none",border:"none",cursor:"pointer",color:"#fca5a5",fontSize:12,padding:"0 4px",opacity:.6}}>✕</button>}
                </div>
                <span style={{fontSize:9,color:"#94a3b8",paddingLeft:4}}>{new Date(msg.ts).toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",hour12:true})}</span>
              </div>
            );
          })}
          <div ref={chatRef}/>
        </div>
        <div style={{padding:"12px 14px",background:"#fff",borderTop:"1px solid #e2e8f0",display:"flex",gap:10,alignItems:"flex-end"}}>
          <textarea className="inp" value={chatIn} onChange={e=>setChatIn(e.target.value.slice(0,CHAT_MAX))} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendChat();}}} placeholder={chatMuted||(mutedUsers||{})[myEk]?"Chat is disabled…":"Type a message…"} disabled={chatMuted||(mutedUsers||{})[myEk]} style={{flex:1,resize:"none",minHeight:42,maxHeight:80}}/>
          <button onClick={sendChat} disabled={!chatIn.trim()||chatMuted||(mutedUsers||{})[myEk]} style={{padding:"10px 16px",borderRadius:10,background:"#004B87",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:14,flexShrink:0}}>➤</button>
        </div>
      </div>}

      {/* ── WALL OF FAME ── */}
      {sc==="wof"&&<div style={{padding:"16px"}}>
        <div style={{background:"linear-gradient(135deg,#C5A028,#E8C547)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}>
          <p className="C" style={{color:"#0a1628",fontSize:26,letterSpacing:2,margin:0}}>🌟 WALL OF FAME</p>
          <p style={{color:"#5a4000",fontSize:12,marginTop:4}}>Perfect prediction history</p>
        </div>
        {(()=>{
          const perfs=[];
          done.forEach(m=>{
            const wA=!isNR(m.result.win),mA=!isNR(m.result.motm);
            if(!wA||!mA)return;
            const avail=[wA,mA].filter(Boolean).length;
            Object.entries(allPicks).forEach(([emk,up])=>{
              const p=up[String(m.id)]??up[Number(m.id)];if(!p)return;
              const correct=[wA&&p.win===m.result.win,mA&&motmMatch(p.motm,m.result.motm)].filter(Boolean).length;
              if(avail>0&&correct===avail){
                const u=Object.values(users).find(u=>ek(u.email)===emk);
                if(u)perfs.push({user:u,match:m});
              }
            });
          });
          if(perfs.length===0)return<div style={{textAlign:"center",padding:"48px 16px"}}><p style={{fontSize:36}}>⚽</p><p style={{color:"#94a3b8",marginTop:12}}>No perfect predictions yet.</p></div>;
          return perfs.reverse().map(({user:u,match:m},i)=>(
            <div key={i} style={{background:"#fff",border:"1px solid #FDE68A",borderRadius:12,padding:"14px",marginBottom:10,display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:28}}>🌟</span>
              <Av name={u.name} sz={36}/>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:14,color:"#0a1628",margin:0}}>{u.name}</p>
                <p style={{color:"#64748b",fontSize:12,margin:"2px 0 0"}}>{m.mn}: {m.home} vs {m.away} · {m.date}</p>
                <p style={{color:"#C5A028",fontSize:11,margin:"2px 0 0",fontWeight:600}}>Perfect prediction! +{PTS.win+PTS.motm+PTS.streak}pts</p>
              </div>
            </div>
          ));
        })()}
      </div>}

      {/* ── RULES ── */}
      {sc==="rules"&&<div style={{padding:"16px"}}>
        <div style={{background:"linear-gradient(135deg,#003d70,#004B87)",borderRadius:14,padding:"16px",marginBottom:16,textAlign:"center"}}>
          <p className="C" style={{color:"#C5A028",fontSize:24,letterSpacing:2,margin:0}}>HOW TO PLAY</p>
        </div>
        {[
          ["⚽ Points","Match Winner: +"+PTS.win+"pts | Man of the Match: +"+PTS.motm+"pts | Both Correct (streak): +"+PTS.streak+"pts extra | Total Goals Band: +"+PTS.goals+"pts | Bonus Question: +"+PTS.bonus+"pts"],
          ["⚡ Double Match","One match per day earns 2× all points. Watch for the ⚡ badge."],
          ["🏆 Season Picks","Champion: +"+PTS.season+"pts | Top 4 (SF teams): +"+PTS.top4+"pts each | Wooden Spoon (last team): +"+PTS.woodenSpoon+"pts | Golden Boot (pick 5 candidates): +"+PTS.goldenBoot+"pts | Golden Glove (pick 3 keepers): +"+PTS.goldenGlove+"pts | Golden Ball (pick 5 candidates): +"+PTS.goldenGlove+"pts"],
          ["⚽ Goals Band","Predict total goals in the match: 0 / 1 / 2 / 3 / 4+. Correct = +"+PTS.goals+"pts."],
          ["🔒 Lock Times","Predictions lock 35 minutes before kickoff (ET). No changes after lock."],
          ["💡 Group Leans","After lock, see how the group split on Winner (home/draw/away)."],
          ["🌟 Wall of Fame","Get both Winner and MOTM correct = Perfect Prediction entry."],
        ].map(([t,d])=>(
          <div key={t} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:10}}>
            <p style={{fontWeight:700,fontSize:13,color:"#0a1628",margin:"0 0 6px"}}>{t}</p>
            <p style={{color:"#64748b",fontSize:12,lineHeight:1.6,margin:0}}>{d}</p>
          </div>
        ))}
        <div style={{background:"#FFF9E6",border:"1px solid #FDE68A",borderRadius:12,padding:"14px"}}>
          <p style={{fontWeight:700,fontSize:13,color:"#92400E",margin:"0 0 8px"}}>📊 Full Points Summary</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {[["🏆 Winner correct","+"+PTS.win+"pts"],["⭐ MOTM correct","+"+PTS.motm+"pts"],["🔥 Both correct bonus","+"+PTS.streak+"pts"],["⚽ Goals band correct","+"+PTS.goals+"pts"],["❓ Bonus Q correct","+"+PTS.bonus+"pts"],["⚡ Double match","×2 all above"],["🥇 Champion","+"+PTS.season+"pts"],["🏅 Top 4 team","+"+PTS.top4+"pts each"],["🪵 Wooden Spoon","+"+PTS.woodenSpoon+"pts"],["👟 Golden Boot (pick 5)","+"+PTS.goldenBoot+"pts"],["🧤 Golden Glove (pick 3)","+"+PTS.goldenGlove+"pts"],["🏅 Golden Ball (pick 5)","+"+PTS.goldenGlove+"pts"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"rgba(255,255,255,.6)",borderRadius:8,padding:"6px 8px"}}>
                <span style={{fontSize:11,color:"#92400E"}}>{l}</span>
                <span className="C" style={{fontSize:13,color:"#004B87"}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {/* ── ADMIN ── */}
      {sc==="adm"&&isAdmin&&<div style={{padding:"16px"}}>
        <div style={{background:"linear-gradient(135deg,#003d70,#004B87)",borderRadius:14,padding:"14px",marginBottom:14,textAlign:"center"}}>
          <p className="C" style={{color:"#C5A028",fontSize:22,letterSpacing:2,margin:0}}>⚙️ FIFA ADMIN PANEL</p>
        </div>

        <div style={{display:"flex",gap:0,background:"#fff",borderRadius:10,border:"1px solid #e2e8f0",marginBottom:14,overflow:"auto"}}>
          {[["approvals","✅ Approve"],["manpick","✍️ Pick Entry"],["results","📊 Results"],["pickstatus","👁 Picks"],["users","👥 Users"],["analytics","📈 Analytics"],["controls","🎛️ Controls"],["broadcast","📢 Broadcast"]].map(([t,l])=>(
            <button key={t} className={"at"+(admTab===t?" on":"")} onClick={()=>setAdmTab(t)}>{l}{t==="approvals"&&pendingCount>0?` (${pendingCount})`:""}</button>
          ))}
        </div>

        {admTab==="approvals"&&<div className="ac">
          <p className="st">PENDING APPROVALS ({pendingCount})</p>
          {Object.keys(pendingUsers).length===0?<p style={{color:"#94a3b8",fontSize:13,textAlign:"center",padding:"16px 0"}}>No pending registrations.</p>:Object.entries(pendingUsers).map(([emk,entry])=>(
            <div key={emk} style={{display:"flex",alignItems:"center",gap:10,padding:"12px 0",borderBottom:"1px solid #f1f5f9"}}>
              <Av name={entry.name} sz={36}/>
              <div style={{flex:1}}>
                <p style={{fontWeight:700,fontSize:13,color:"#0a1628",margin:0}}>{entry.name}</p>
                <p style={{color:"#94a3b8",fontSize:11,margin:0}}>{entry.email}</p>
              </div>
              <button onClick={()=>approveUser(emk)} style={{padding:"6px 12px",borderRadius:8,background:"#f0fdf4",color:"#15803d",border:"1px solid #bbf7d0",cursor:"pointer",fontSize:12,fontWeight:700}}>Approve</button>
              <button onClick={()=>rejectUser(emk)} style={{padding:"6px 12px",borderRadius:8,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:12,fontWeight:700}}>Reject</button>
            </div>
          ))}
        </div>}

        {admTab==="manpick"&&<AdminManualPickPanel ms={ms} users={users} allPicks={allPicks} allBonusPicks={allBonusPicks} doubleMatch={doubleMatch} onSave={adminSavePick} toast2={toast2}/>}

        {admTab==="results"&&<div>
          {ms.filter(m=>!isTBD(m)).sort((a,b)=>Number(a.id)-Number(b.id)).map(m=>(
            <div key={m.id} className="ac">
              <p style={{fontWeight:700,fontSize:13,color:"#0a1628",margin:"0 0 6px"}}>{m.mn}: {m.home} vs {m.away}</p>
              <p style={{color:"#94a3b8",fontSize:11,margin:"0 0 10px"}}>{m.date} · {m.time} ET</p>
              {m.result
                ?<div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:8,padding:"8px 12px",fontSize:12,color:"#15803d",marginBottom:8}}>
                    ✅ Winner: {m.result.win} · MOTM: {m.result.motm}{m.result.score?" · Score: "+m.result.score:""}
                    <button onClick={async()=>{if(!confirm("Clear this result?"))return;const rm=(await DB.get("rm"))||{};delete rm[Number(m.id)];await DB.set("rm",rm);setMs(prev=>prev.map(x=>Number(x.id)===Number(m.id)?{...x,result:null}:x));toast2("Result cleared","ok");}} style={{marginLeft:10,padding:"3px 8px",borderRadius:6,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:10,fontWeight:700}}>↩️ Edit</button>
                  </div>
                :<div>
                  {/* Winner */}
                  <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 6px"}}>Match Winner</p>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {[m.home,"Draw",m.away].map(v=>(
                      <button key={v} onClick={()=>savePartialResult(m.id,"win",v)}
                        style={{flex:1,padding:"6px 4px",borderRadius:8,background:admResultForm[m.id]?.win===v?"#004B87":"#f1f5f9",color:admResultForm[m.id]?.win===v?"#fff":"#475569",border:"1px solid "+(admResultForm[m.id]?.win===v?"#004B87":"#e2e8f0"),cursor:"pointer",fontSize:11,fontWeight:600,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                        {v!=="Draw"&&<FlagBox team={v} sz={16}/>}
                        <span>{v==="Draw"?"🤝 Draw":v}</span>
                      </button>
                    ))}
                  </div>
                  {/* Score */}
                  <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 6px"}}>Score (optional)</p>
                  <input className="inp" placeholder="e.g. 2-1" value={admResultForm[m.id]?.score||""} onChange={e=>setAdmResultForm(p=>({...p,[m.id]:{...(p[m.id]||{}),score:e.target.value}}))} style={{marginBottom:10}}/>
                  {/* MOTM */}
                  <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 6px"}}>Man of the Match</p>
                  <div style={{marginBottom:10}}>
                    <MotmDropdown team1={m.home} team2={m.away} value={admResultForm[m.id]?.motm||""} onChange={v=>{setAdmResultForm(p=>({...p,[m.id]:{...(p[m.id]||{}),motm:v}}));savePartialResult(m.id,"motm",v);}}/>
                  </div>
                  {/* Goals Band Answer */}
                  <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 6px"}}>⚽ Total Goals Band</p>
                  <div style={{display:"flex",gap:6,marginBottom:10}}>
                    {GOAL_BANDS.map(band=>{
                      const cur=goalBandAnswers[String(m.id)];
                      return(
                        <button key={band.id} onClick={async()=>{const upd={...goalBandAnswers,[String(m.id)]:band.id};setGoalBandAnswers(upd);await DB.set("goalbanans",upd);toast2("Goals band saved","ok");}}
                          style={{flex:1,padding:"6px 4px",borderRadius:8,background:cur===band.id?"#004B87":"#f1f5f9",color:cur===band.id?"#fff":"#475569",border:"1px solid "+(cur===band.id?"#004B87":"#e2e8f0"),cursor:"pointer",fontSize:11,fontWeight:600,textAlign:"center"}}>
                          {band.emoji}<br/>{band.short}
                        </button>
                      );
                    })}
                  </div>
                  {/* Bonus Q Answer */}
                  {BONUS_QUESTIONS[m.id]&&(()=>{
                    const bAns=bonusAnswers[String(m.id)];
                    return<div style={{marginBottom:10}}>
                      <p style={{fontSize:11,color:"#64748b",fontWeight:600,margin:"0 0 4px"}}>❓ Bonus Answer</p>
                      <p style={{fontSize:11,color:"#475569",fontStyle:"italic",margin:"0 0 6px"}}>{BONUS_QUESTIONS[m.id]}</p>
                      <div style={{display:"flex",gap:6}}>
                        {[true,false].map(v=>(
                          <button key={String(v)} onClick={async()=>{const upd={...bonusAnswers,[String(m.id)]:v};setBonusAnswers(upd);await DB.set("bonusans",upd);toast2("Bonus answer saved","ok");}}
                            style={{flex:1,padding:"7px",borderRadius:8,background:bAns===v?(v?"#f0fdf4":"#fef2f2"):"#f1f5f9",color:bAns===v?(v?"#15803d":"#dc2626"):"#475569",border:"1px solid "+(bAns===v?(v?"#bbf7d0":"#fecaca"):"#e2e8f0"),cursor:"pointer",fontSize:12,fontWeight:700}}>
                            {v?"✅ YES":"❌ NO"}
                          </button>
                        ))}
                      </div>
                    </div>;
                  })()}
                  <button className="pbtn" onClick={()=>setManualResult(m.id)} style={{marginTop:4}}>✅ Finalise Result</button>
                </div>
              }
            </div>
          ))}
        </div>}

        {admTab==="pickstatus"&&<PickStatusPanel ms={ms} users={users} allPicks={allPicks} lockedMatches={lockedMatches} adminEmail={email} goalBandAnswers={goalBandAnswers} bonusAnswers={bonusAnswers} allBonusPicks={allBonusPicks}/>}

        {admTab==="users"&&<div>
          <input className="inp" placeholder="Search users…" value={userSearch} onChange={e=>setUserSearch(e.target.value)} style={{marginBottom:12}}/>
          {Object.values(users).filter(u=>u?.email&&u.approved!==false&&(u.name.toLowerCase().includes(userSearch.toLowerCase())||u.email.toLowerCase().includes(userSearch.toLowerCase()))).map(u=>(
            <div key={u.email} className="ac" style={{marginBottom:10}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <Av name={u.name} sz={32}/>
                <div style={{flex:1}}>
                  <p style={{fontWeight:700,fontSize:13,color:"#0a1628",margin:0}}>{u.name}</p>
                  <p style={{color:"#94a3b8",fontSize:11,margin:0}}>{u.email}</p>
                </div>
                <div style={{display:"flex",gap:4}}>
                  {[-10,-5,5,10].map(d=>(
                    <button key={d} onClick={()=>adjustPts(u.email,d)} style={{padding:"4px 8px",borderRadius:6,background:d>0?"#f0fdf4":"#fef2f2",color:d>0?"#15803d":"#dc2626",border:"1px solid "+(d>0?"#bbf7d0":"#fecaca"),cursor:"pointer",fontSize:10,fontWeight:700}}>{d>0?"+":""}{d}</button>
                  ))}
                  {u.email!==SUPER_ADMIN&&<button onClick={()=>deleteUser(u.email)} style={{padding:"4px 8px",borderRadius:6,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:10,fontWeight:700}}>🗑</button>}
                </div>
              </div>
            </div>
          ))}
        </div>}

        {admTab==="analytics"&&(()=>{
          const doneMs=ms.filter(m=>m.result&&!isTBD(m)&&!isNR(m.result.win));
          const ae=Object.entries(allPicks);
          const getUP=(emk,id)=>{const up=allPicks[emk]||{};return up[String(id)]??up[Number(id)]??null;};
          const matchStats=doneMs.map(m=>{
            const picks=ae.filter(([emk])=>getUP(emk,m.id));
            const tot=picks.length||1;
            const winRight=picks.filter(([emk])=>getUP(emk,m.id)?.win===m.result.win).length;
            const motmRight=picks.filter(([emk])=>motmMatch(getUP(emk,m.id)?.motm,m.result.motm)).length;
            const perfect=picks.filter(([emk])=>{const p=getUP(emk,m.id);return p?.win===m.result.win&&motmMatch(p?.motm,m.result.motm);}).length;
            return{m,tot:picks.length,winRight,motmRight,perfect,winAcc:Math.round(winRight/tot*100),motmAcc:Math.round(motmRight/tot*100)};
          }).sort((a,b)=>a.winAcc-b.winAcc);
          const upsets=matchStats.filter(s=>s.winAcc<30&&s.tot>=2);
          const easiest=matchStats.filter(s=>s.winAcc>=70&&s.tot>=2).reverse();
          const totalPicks=ae.reduce((s,[,up])=>s+Object.keys(up||{}).length,0);
          const totalPerfects=doneMs.reduce((s,m)=>s+ae.filter(([emk])=>{const p=getUP(emk,m.id);return p?.win===m.result.win&&motmMatch(p?.motm,m.result.motm);}).length,0);
          const avgWinAcc=matchStats.length?Math.round(matchStats.reduce((s,x)=>s+x.winAcc,0)/matchStats.length):0;
          const avgMotmAcc=matchStats.length?Math.round(matchStats.reduce((s,x)=>s+x.motmAcc,0)/matchStats.length):0;
          return<div>
            <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
              {[["⚽",doneMs.length,"Matches Done"],["💎",totalPerfects,"Group Perfects"],["📊",totalPicks,"Total Picks"],["🏆",avgWinAcc+"%","Avg Win Acc"],["⭐",avgMotmAcc+"%","Avg MOTM Acc"]].map(([ic,val,lbl])=>(
                <div key={lbl} style={{flex:1,minWidth:60,background:"#fff",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 6px",textAlign:"center"}}>
                  <p style={{fontSize:14,margin:0}}>{ic}</p>
                  <p className="C" style={{color:"#004B87",fontSize:15,fontWeight:800,margin:"2px 0 0"}}>{val}</p>
                  <p style={{color:"#64748b",fontSize:8,margin:0,textTransform:"uppercase",letterSpacing:.3}}>{lbl}</p>
                </div>
              ))}
            </div>
            {upsets.length>0&&<div className="ac" style={{marginBottom:12}}>
              <p className="st" style={{marginBottom:8}}>😱 BIGGEST UPSETS (Group mostly wrong)</p>
              {upsets.map(s=><div key={s.m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                <div><p style={{fontSize:12,fontWeight:600,color:"#0a1628",margin:0}}>{s.m.mn}: {s.m.home} vs {s.m.away}</p><p style={{fontSize:10,color:"#94a3b8",margin:0}}>Winner: <b style={{color:"#0a1628"}}>{s.m.result.win}</b> · {s.tot} picks</p></div>
                <span style={{background:"#fee2e2",color:"#991b1b",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:8}}>{s.winAcc}% right</span>
              </div>)}
            </div>}
            {easiest.length>0&&<div className="ac" style={{marginBottom:12}}>
              <p className="st" style={{marginBottom:8}}>🎯 MOST PREDICTED CORRECTLY</p>
              {easiest.map(s=><div key={s.m.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                <div><p style={{fontSize:12,fontWeight:600,color:"#0a1628",margin:0}}>{s.m.mn}: {s.m.home} vs {s.m.away}</p><p style={{fontSize:10,color:"#94a3b8",margin:0}}>Winner: <b style={{color:"#0a1628"}}>{s.m.result.win}</b> · {s.tot} picks</p></div>
                <span style={{background:"#f0fdf4",color:"#15803d",fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:8}}>{s.winAcc}% right</span>
              </div>)}
            </div>}
            <div className="ac">
              <p className="st" style={{marginBottom:8}}>📈 ALL MATCH ACCURACY</p>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
                  <thead><tr style={{borderBottom:"2px solid #e2e8f0"}}>
                    {["Match","Picks","Win%","MOTM%","Perfects"].map(h=><th key={h} style={{textAlign:"left",padding:"5px 6px",color:"#64748b",fontWeight:700,fontSize:9,textTransform:"uppercase"}}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {[...matchStats].reverse().map(s=><tr key={s.m.id} style={{borderBottom:"1px solid #f1f5f9"}}>
                      <td style={{padding:"7px 6px",fontWeight:600,color:"#0a1628"}}>{s.m.mn}</td>
                      <td style={{padding:"7px 6px",color:"#64748b"}}>{s.tot}</td>
                      <td style={{padding:"7px 6px"}}><span style={{color:s.winAcc>=60?"#15803d":s.winAcc>=40?"#92400E":"#dc2626",fontWeight:700}}>{s.winAcc}%</span></td>
                      <td style={{padding:"7px 6px"}}><span style={{color:s.motmAcc>=60?"#15803d":s.motmAcc>=40?"#92400E":"#dc2626",fontWeight:700}}>{s.motmAcc}%</span></td>
                      <td style={{padding:"7px 6px",color:"#004B87",fontWeight:700}}>{s.perfect}</td>
                    </tr>)}
                  </tbody>
                </table>
                {matchStats.length===0&&<p style={{color:"#94a3b8",fontSize:12,textAlign:"center",padding:"16px 0"}}>No completed matches yet.</p>}
              </div>
            </div>
          </div>;
        })()}

        {admTab==="controls"&&<div>
          <div className="ac">
            <p className="st">SEASON CONTROLS</p>
            <div className="ctrl-row">
              <div><p style={{fontWeight:600,fontSize:13,color:"#0a1628",margin:0}}>Maintenance Mode</p><p style={{color:"#94a3b8",fontSize:11,margin:0}}>Lock app for non-admins</p></div>
              <Toggle on={maintenance} onChange={async v=>{setMaintenance(v);await DB.set("maintenance",v);toast2(v?"App locked":"App live","ok");}}/>
            </div>
            <div className="ctrl-row">
              <div><p style={{fontWeight:600,fontSize:13,color:"#0a1628",margin:0}}>Chat Muted</p></div>
              <Toggle on={chatMuted} onChange={async v=>{setChatMuted(v);await DB.set("chatmuted",v);toast2(v?"Chat muted":"Chat open");}}/>
            </div>
          </div>
          <div className="ac">
            <p className="st">⚡ DOUBLE HEADER MATCH</p>
            <select className="sel" value={doubleMatch??""} onChange={async e=>{const v=e.target.value===""?null:Number(e.target.value);setDoubleMatch(v);await DB.set("doublematch",v);toast2(v?"⚡ Double set":"Double removed");}}>
              <option value="">None</option>
              {ms.filter(m=>!isTBD(m)).map(m=><option key={m.id} value={m.id}>{m.mn}: {m.home} vs {m.away} ({m.date})</option>)}
            </select>
          </div>
          <div className="ac">
            <p className="st">🏆 MATCH LOCK CONTROLS</p>
            <div style={{maxHeight:200,overflowY:"auto",border:"1px solid #e2e8f0",borderRadius:10}}>
              {ms.filter(m=>!isTBD(m)&&!m.result).map(m=>{
                const st=lockedMatches[m.id]??lockedMatches[String(m.id)];
                return(
                  <div key={m.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",borderBottom:"1px solid #f1f5f9"}}>
                    <div style={{flex:1}}>
                      <p style={{fontSize:12,fontWeight:600,color:"#0a1628",margin:0}}>{m.mn}: {m.home} vs {m.away}</p>
                    </div>
                    <button onClick={()=>toggleMatchLock(m.id)} style={{padding:"4px 10px",borderRadius:8,background:st==="locked"?"#fee2e2":st==="unlocked"?"#f0fdf4":"#f1f5f9",color:st==="locked"?"#991b1b":st==="unlocked"?"#15803d":"#475569",border:"1px solid "+(st==="locked"?"#fecaca":st==="unlocked"?"#bbf7d0":"#e2e8f0"),cursor:"pointer",fontSize:11,fontWeight:600}}>
                      {st==="locked"?"🔒 Locked":st==="unlocked"?"🔓 Unlocked":"⏱ Auto"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="ac">
            <p className="st">🏆 SET WORLD CUP WINNER</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {TEAMS.map(t=>(
                <button key={t} onClick={async()=>{setSw(t);await DB.set("sw",t);toast2("Champion: "+t+" 🏆","ok");}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:10,background:sw===t?"#004B87":"#f8faff",border:"2px solid "+(sw===t?"#004B87":"#e2e8f0"),cursor:"pointer"}}>
                  <FlagBox team={t} sz={16}/>
                  <span style={{fontSize:11,fontWeight:700,color:sw===t?"#fff":"#475569"}}>{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="ac">
            <p className="st">🏅 ACTUAL TOP 4 (SF TEAMS)</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
              {TEAMS.map(t=>{
                const sel=actualTop4.includes(t);
                return(
                  <button key={t} onClick={async()=>{let upd;if(sel)upd=actualTop4.filter(x=>x!==t);else if(actualTop4.length<4)upd=[...actualTop4,t];else{toast2("Max 4","error");return;}setActualTop4(upd);await DB.set("actualtop4",upd);toast2("Top 4 updated");}} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:10,background:sel?"#004B87":"#f8faff",border:"2px solid "+(sel?"#004B87":"#e2e8f0"),cursor:"pointer"}}>
                    <FlagBox team={t} sz={16}/>
                    <span style={{fontSize:11,fontWeight:700,color:sel?"#fff":"#475569"}}>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="ac">
            <p className="st">🪵 WOODEN SPOON &amp; 👟 GOLDEN BOOT</p>
            <p style={{fontSize:11,color:"#64748b",marginBottom:8}}>🪵 Wooden Spoon — team finishing last (worst record / earliest group exit):</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {TEAMS.map(t=>(
                <button key={t} onClick={async()=>{setActualWs(t);await DB.set("actualws",t);toast2("Wooden Spoon: "+t);}} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 9px",borderRadius:8,background:actualWs===t?"#004B87":"#f8faff",border:"1.5px solid "+(actualWs===t?"#004B87":"#e2e8f0"),cursor:"pointer"}}>
                  <FlagBox team={t} sz={14}/>
                  <span style={{fontSize:10,fontWeight:700,color:actualWs===t?"#fff":"#475569"}}>{t}</span>
                </button>
              ))}
            </div>
            <p style={{fontSize:11,color:"#64748b",marginBottom:8}}>👟 Golden Boot — actual top scorer (used to award pts to those who picked them):</p>
            <MotmDropdown team1="" team2="" value={actualGb} onChange={async v=>{setActualGb(v);await DB.set("actualgb",v);toast2("Golden Boot: "+v,"ok");}}/>

            <p style={{fontSize:11,color:"#64748b",margin:"14px 0 8px",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>🧤 Golden Glove — actual winning goalkeeper</p>
            <p style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>Select the keeper who won the award — players who picked them get +{PTS.goldenGlove}pts.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
              {GOALKEEPERS.map(gk=>{
                const sel=actualGg.includes(gk);
                return<button key={gk} onClick={async()=>{
                  const upd=sel?actualGg.filter(x=>x!==gk):[gk];
                  setActualGg(upd);await DB.set("actualgg",upd);toast2(sel?"Cleared":"Golden Glove: "+gk,"ok");
                }} style={{display:"flex",alignItems:"center",gap:5,padding:"5px 9px",borderRadius:8,
                  background:sel?"#006BB6":"#f8faff",border:"1.5px solid "+(sel?"#006BB6":"#e2e8f0"),
                  cursor:"pointer",fontSize:11,fontWeight:sel?700:400,color:sel?"#fff":"#475569"}}>
                  🧤 {gk}{sel&&" ✅"}
                </button>;
              })}
            </div>
          </div>
          <div className="ac">
            <p className="st">🏅 GOLDEN BALL WINNER</p>
            <p style={{fontSize:11,color:"#64748b",marginBottom:10}}>Set the actual Player of the Tournament. Anyone who included them in their 5 candidates gets +{PTS.goldenGlove}pts.</p>
            <MotmDropdown team1="" team2="" value={actualGball} onChange={async v=>{setActualGball(v);await DB.set("actualgball",v);toast2("🏅 Golden Ball: "+v,"ok");}}/>
            {actualGball&&<p style={{fontSize:11,color:"#15803d",fontWeight:700,marginTop:8}}>✓ Set: {actualGball}</p>}
            {actualGball&&<button onClick={async()=>{setActualGball("");await DB.set("actualgball",null);toast2("Cleared");}} style={{marginTop:8,padding:"6px 14px",borderRadius:8,background:"#fef2f2",color:"#dc2626",border:"1px solid #fecaca",cursor:"pointer",fontSize:11,fontWeight:700}}>✕ Clear</button>}
          </div>

          <div className="ac">
            <p className="st">EXPORT DATA</p>
            <div style={{display:"flex",gap:8,flexDirection:"column"}}>
              <button className="pbtn" onClick={()=>{
                const lb=getLb();
                const rows=[["Rank","Name","Email","Points","Winner","Top4"].join(","),
                  ...lb.map((u,i)=>[i+1,'"'+u.name+'"',u.email,u.pts,u.userSp||"",(u.userT4||[]).join("|")].join(","))];
                const blob=new Blob([rows.join("\n")],{type:"text/csv"});
                const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="fifa26_leaderboard.csv";a.click();URL.revokeObjectURL(url);
                toast2("Leaderboard exported!","ok");
              }}>📥 Export Leaderboard CSV</button>
              <button className="pbtn" style={{background:"linear-gradient(135deg,#0f6e56,#1D9E75)"}} onClick={()=>{
                const playableMs=ms.filter(m=>!isTBD(m)).sort((a,b)=>Number(a.id)-Number(b.id));
                const users2=Object.values(users).filter(u=>u?.email&&u.approved!==false).sort((a,b)=>a.name.localeCompare(b.name));
                const hdr=["Name","Email",...playableMs.flatMap(m=>[m.mn+"_win",m.mn+"_goals",m.mn+"_motm"])];
                const rows=[hdr.join(","),...users2.map(u=>{
                  const emk=ek(u.email);const up=allPicks[emk]||{};
                  const cells=playableMs.flatMap(m=>{const p=up[String(m.id)]??up[Number(m.id)];return[p?.win||"",p?.gb||"",p?.motm||""];});
                  return['"'+u.name+'"',u.email,...cells].join(",");
                })];
                const blob=new Blob([rows.join("\n")],{type:"text/csv"});
                const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="fifa26_all_picks.csv";a.click();URL.revokeObjectURL(url);
                toast2("All picks exported!","ok");
              }}>📥 Export All Picks CSV</button>
            </div>
          </div>

          <div className="ac" style={{background:"#E6F0FA",border:"2px solid #004B87"}}>
            <p className="st">🔧 DB REPAIR</p>
            <p style={{fontSize:12,color:"#64748b",marginBottom:10}}>Re-normalises all pick keys (email encoding + string match IDs). Run if picks look wrong after a double-header day.</p>
            <button className="pbtn" disabled={repairLoading} onClick={async()=>{
              if(repairLoading)return;
              setRepairLoading(true);
              try{
                const ap=await DB.get("ap")||{};
                const fixed={};
                Object.keys(ap).forEach(k=>{
                  const ck=ek(k);const up=ap[k]||{};fixed[ck]=fixed[ck]||{};
                  Object.keys(up).forEach(mid=>{const p=up[mid];if(p&&(p.win||p.motm))fixed[ck][String(mid)]=p;});
                });
                await DB.set("ap",fixed);
                await reloadShared(email);
                toast2("✅ DB repaired & reloaded","ok");
              }catch(e){console.error("repair",e);toast2("Repair failed — check console","error");}
              setRepairLoading(false);
            }}>{repairLoading?"Repairing…":"🔧 Repair & Reload All Picks"}</button>
          </div>
        </div>}

        {admTab==="broadcast"&&<div>
          <div className="ac">
            <p className="st">SEND BROADCAST</p>
            <textarea className="inp" value={bcMsg} onChange={e=>setBcMsg(e.target.value.slice(0,300))} placeholder="Type announcement…" style={{minHeight:80,resize:"none",marginBottom:4}}/>
            <div style={{display:"flex",gap:8,marginTop:10}}>
              <button className="pbtn" style={{flex:1}} onClick={()=>sendBc(false)}>📢 Send</button>
              <button className="pbtn" style={{flex:1,background:"linear-gradient(135deg,#C5A028,#E8C547)",color:"#0a1628"}} onClick={()=>sendBc(true)}>📌 Pin</button>
            </div>
            {pinnedBc&&<button className="dbtn" style={{marginTop:8}} onClick={async()=>{setPinnedBc(null);await DB.set("pinnedbc",null);}}>✕ Clear Pinned</button>}
          </div>
          <div className="ac">
            <p className="st">BROADCAST HISTORY</p>
            {[...bc].reverse().slice(0,10).map(b=>(
              <div key={b.id} style={{padding:"8px 0",borderBottom:"1px solid #f1f5f9"}}>
                <p style={{fontSize:12,color:"#0a1628",margin:0}}>{b.msg}</p>
                <p style={{fontSize:10,color:"#94a3b8",margin:"2px 0 0"}}>{new Date(b.ts).toLocaleString("en-US")}</p>
              </div>
            ))}
          </div>
        </div>}
      </div>}

      {/* ── NAV ── */}
      <nav className="nav">
        {navItems.map(([s,ic,lb])=>(
          <button key={s} className="ni" onClick={()=>{if(s!=="picks")setAm(null);setSc(s);if(s==="chat"){setChatU(0);setChatSeenTs(Date.now());}}}>
            <div style={{position:"relative",display:"inline-block"}}>
              <div style={{width:28,height:22,borderRadius:6,background:sc===s?"#004B87":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>{ic==="HM"?<svg width="13" height="13" viewBox="0 0 24 24" fill={sc===s?"#fff":"#94a3b8"}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>:ic==="LB"?<svg width="13" height="13" viewBox="0 0 24 24" fill={sc===s?"#fff":"#94a3b8"}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>:ic==="MY"?<svg width="13" height="13" viewBox="0 0 24 24" fill={sc===s?"#fff":"#94a3b8"}><path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/></svg>:ic==="CH"?<svg width="13" height="13" viewBox="0 0 24 24" fill={sc===s?"#fff":"#94a3b8"}><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>:ic==="WF"?<svg width="13" height="13" viewBox="0 0 24 24" fill={sc===s?"#fff":"#94a3b8"}><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>:ic==="RL"?<svg width="13" height="13" viewBox="0 0 24 24" fill={sc===s?"#fff":"#94a3b8"}><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 14H8v-2h8v2zm0-4H8v-2h8v2zm0-4H8V6h8v2z"/></svg>:<svg width="13" height="13" viewBox="0 0 24 24" fill={sc===s?"#fff":"#94a3b8"}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}</div>
              {s==="chat"&&chatU>0&&<span className="bd"/>}
              {s==="adm"&&pendingCount>0&&<span className="bd"/>}
            </div>
            <span className="nl" style={{color:sc===s?"#004B87":"#334155"}}>{lb}</span>
          </button>
        ))}
      </nav>

      {toast&&<Tst t={toast}/>}
    </div>
  );
}
