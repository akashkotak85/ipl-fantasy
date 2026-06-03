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
  "Argentina","France","Brazil","England","Spain","Portugal","Germany",
  "Netherlands","Belgium","Croatia","Uruguay","Denmark","Switzerland",
  "USA","Mexico","Canada","Morocco","Senegal","Japan","South Korea",
  "Australia","Serbia","Poland","Ecuador","Ghana","Cameroon","Tunisia",
  "Saudi Arabia","Iran","Qatar","Costa Rica","Panama","Honduras",
  "El Salvador","Jamaica","Guatemala","New Zealand","Indonesia",
  "Uzbekistan","Iraq","Oman","Yemen","Venezuela","Bolivia","Chile",
  "Paraguay","Peru","Egypt",
];

const FLAGS = {
  Argentina:"🇦🇷",France:"🇫🇷",Brazil:"🇧🇷",England:"🏴󠁧󠁢󠁥󠁮󠁧󠁿",Spain:"🇪🇸",
  Portugal:"🇵🇹",Germany:"🇩🇪",Netherlands:"🇳🇱",Belgium:"🇧🇪",Croatia:"🇭🇷",
  Uruguay:"🇺🇾",Denmark:"🇩🇰",Switzerland:"🇨🇭",USA:"🇺🇸",Mexico:"🇲🇽",
  Canada:"🇨🇦",Morocco:"🇲🇦",Senegal:"🇸🇳",Japan:"🇯🇵","South Korea":"🇰🇷",
  Australia:"🇦🇺",Serbia:"🇷🇸",Poland:"🇵🇱",Ecuador:"🇪🇨",Ghana:"🇬🇭",
  Cameroon:"🇨🇲",Tunisia:"🇹🇳","Saudi Arabia":"🇸🇦",Iran:"🇮🇷",Qatar:"🇶🇦",
  "Costa Rica":"🇨🇷",Panama:"🇵🇦",Honduras:"🇭🇳","El Salvador":"🇸🇻",
  Jamaica:"🇯🇲",Guatemala:"🇬🇹","New Zealand":"🇳🇿",Indonesia:"🇮🇩",
  Uzbekistan:"🇺🇿",Iraq:"🇮🇶",Oman:"🇴🇲",Yemen:"🇾🇪",Venezuela:"🇻🇪",
  Bolivia:"🇧🇴",Chile:"🇨🇱",Paraguay:"🇵🇾",Peru:"🇵🇪",Egypt:"🇪🇬",
};

const TEAM_COLORS = {
  Argentina:{bg:"#74ACDF",dk:"#fff"},France:{bg:"#002395",dk:"#fff"},
  Brazil:{bg:"#009c3b",dk:"#FFDF00"},England:{bg:"#CF081F",dk:"#fff"},
  Spain:{bg:"#AA151B",dk:"#F1BF00"},Portugal:{bg:"#006600",dk:"#FF0000"},
  Germany:{bg:"#000000",dk:"#DD0000"},Netherlands:{bg:"#FF6600",dk:"#fff"},
  Belgium:{bg:"#000000",dk:"#FFD700"},Croatia:{bg:"#FF0000",dk:"#fff"},
  Uruguay:{bg:"#5EB6E4",dk:"#fff"},Denmark:{bg:"#C60C30",dk:"#fff"},
  Switzerland:{bg:"#FF0000",dk:"#fff"},USA:{bg:"#002868",dk:"#BF0A30"},
  Mexico:{bg:"#006847",dk:"#fff"},Canada:{bg:"#FF0000",dk:"#fff"},
  Morocco:{bg:"#C1272D",dk:"#006233"},Senegal:{bg:"#00853F",dk:"#FDEF42"},
  Japan:{bg:"#BC002D",dk:"#fff"},"South Korea":{bg:"#CD2E3A",dk:"#fff"},
  Australia:{bg:"#00843D",dk:"#FFB81C"},Serbia:{bg:"#C6363C",dk:"#fff"},
  Poland:{bg:"#DC143C",dk:"#fff"},Ecuador:{bg:"#FFD100",dk:"#003893"},
  Ghana:{bg:"#006B3F",dk:"#FCD116"},Cameroon:{bg:"#007A5E",dk:"#CE1126"},
  Tunisia:{bg:"#E70013",dk:"#fff"},"Saudi Arabia":{bg:"#006C35",dk:"#fff"},
  Iran:{bg:"#239F40",dk:"#fff"},Qatar:{bg:"#8D1B3D",dk:"#fff"},
  "Costa Rica":{bg:"#002B7F",dk:"#fff"},Panama:{bg:"#DA121A",dk:"#fff"},
  Honduras:{bg:"#0073CF",dk:"#fff"},"El Salvador":{bg:"#0F47AF",dk:"#fff"},
  Jamaica:{bg:"#000000",dk:"#FED100"},Guatemala:{bg:"#4997D0",dk:"#fff"},
  "New Zealand":{bg:"#00247D",dk:"#fff"},Indonesia:{bg:"#CE1126",dk:"#fff"},
  Uzbekistan:{bg:"#1EB53A",dk:"#fff"},Iraq:{bg:"#007A3D",dk:"#fff"},
  Oman:{bg:"#DB161B",dk:"#fff"},Yemen:{bg:"#CE1126",dk:"#fff"},
  Venezuela:{bg:"#CF142B",dk:"#fff"},Bolivia:{bg:"#D52B1E",dk:"#007934"},
  Chile:{bg:"#D52B1E",dk:"#fff"},Paraguay:{bg:"#D52B1E",dk:"#fff"},
  Peru:{bg:"#D91023",dk:"#fff"},Egypt:{bg:"#CE1126",dk:"#fff"},
};

// Groups
const GROUPS = {
  A:["USA","Panama","Honduras","El Salvador"],
  B:["Argentina","Chile","Peru","Canada"],
  C:["Mexico","Jamaica","Venezuela","Ecuador"],
  D:["France","Belgium","Uruguay","Paraguay"],
  E:["Spain","Brazil","Bolivia","Guatemala"],
  F:["England","Netherlands","Serbia","New Zealand"],
  G:["Portugal","Germany","Senegal","Indonesia"],
  H:["Morocco","Croatia","Denmark","Tunisia"],
  I:["Japan","South Korea","Ghana","Australia"],
  J:["Qatar","Uzbekistan","Iran","Iraq"],
  K:["South Korea","Cameroon","Switzerland","Oman"],
  L:["Costa Rica","Saudi Arabia","Egypt","Yemen"],
};

/* ─── MATCHES (Group Stage M1–M78, Knockouts M79–M104) ───────── */
const BASE_MATCHES = [
  // GROUP A
  {id:1,mn:"M1",home:"USA",away:"Panama",date:"2026-06-11",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"A"},
  {id:2,mn:"M2",home:"Honduras",away:"El Salvador",date:"2026-06-12",time:"18:00",venue:"AT&T Stadium, Dallas",group:"A"},
  {id:3,mn:"M3",home:"USA",away:"Honduras",date:"2026-06-16",time:"21:00",venue:"MetLife Stadium, New York",group:"A"},
  {id:4,mn:"M4",home:"El Salvador",away:"Panama",date:"2026-06-16",time:"18:00",venue:"NRG Stadium, Houston",group:"A"},
  {id:5,mn:"M5",home:"Panama",away:"Honduras",date:"2026-06-20",time:"18:00",venue:"Levi's Stadium, San Francisco",group:"A"},
  {id:6,mn:"M6",home:"El Salvador",away:"USA",date:"2026-06-20",time:"18:00",venue:"Gillette Stadium, Boston",group:"A"},
  // GROUP B
  {id:7,mn:"M7",home:"Argentina",away:"Chile",date:"2026-06-13",time:"21:00",venue:"MetLife Stadium, New York",group:"B"},
  {id:8,mn:"M8",home:"Peru",away:"Canada",date:"2026-06-13",time:"18:00",venue:"BC Place, Vancouver",group:"B"},
  {id:9,mn:"M9",home:"Argentina",away:"Peru",date:"2026-06-17",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"B"},
  {id:10,mn:"M10",home:"Canada",away:"Chile",date:"2026-06-17",time:"18:00",venue:"BMO Field, Toronto",group:"B"},
  {id:11,mn:"M11",home:"Chile",away:"Peru",date:"2026-06-21",time:"18:00",venue:"AT&T Stadium, Dallas",group:"B"},
  {id:12,mn:"M12",home:"Canada",away:"Argentina",date:"2026-06-21",time:"18:00",venue:"BC Place, Vancouver",group:"B"},
  // GROUP C
  {id:13,mn:"M13",home:"Mexico",away:"Jamaica",date:"2026-06-12",time:"21:00",venue:"Estadio Azteca, Mexico City",group:"C"},
  {id:14,mn:"M14",home:"Venezuela",away:"Ecuador",date:"2026-06-12",time:"18:00",venue:"SoFi Stadium, Los Angeles",group:"C"},
  {id:15,mn:"M15",home:"Mexico",away:"Venezuela",date:"2026-06-16",time:"21:00",venue:"Estadio Azteca, Mexico City",group:"C"},
  {id:16,mn:"M16",home:"Ecuador",away:"Jamaica",date:"2026-06-16",time:"18:00",venue:"NRG Stadium, Houston",group:"C"},
  {id:17,mn:"M17",home:"Jamaica",away:"Venezuela",date:"2026-06-20",time:"21:00",venue:"MetLife Stadium, New York",group:"C"},
  {id:18,mn:"M18",home:"Ecuador",away:"Mexico",date:"2026-06-20",time:"21:00",venue:"AT&T Stadium, Dallas",group:"C"},
  // GROUP D
  {id:19,mn:"M19",home:"France",away:"Belgium",date:"2026-06-14",time:"18:00",venue:"MetLife Stadium, New York",group:"D"},
  {id:20,mn:"M20",home:"Uruguay",away:"Paraguay",date:"2026-06-14",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"D"},
  {id:21,mn:"M21",home:"France",away:"Uruguay",date:"2026-06-18",time:"21:00",venue:"AT&T Stadium, Dallas",group:"D"},
  {id:22,mn:"M22",home:"Paraguay",away:"Belgium",date:"2026-06-18",time:"18:00",venue:"NRG Stadium, Houston",group:"D"},
  {id:23,mn:"M23",home:"Belgium",away:"Uruguay",date:"2026-06-22",time:"18:00",venue:"Gillette Stadium, Boston",group:"D"},
  {id:24,mn:"M24",home:"Paraguay",away:"France",date:"2026-06-22",time:"18:00",venue:"Levi's Stadium, San Francisco",group:"D"},
  // GROUP E
  {id:25,mn:"M25",home:"Spain",away:"Brazil",date:"2026-06-14",time:"15:00",venue:"Levi's Stadium, San Francisco",group:"E"},
  {id:26,mn:"M26",home:"Bolivia",away:"Guatemala",date:"2026-06-13",time:"15:00",venue:"Gillette Stadium, Boston",group:"E"},
  {id:27,mn:"M27",home:"Spain",away:"Bolivia",date:"2026-06-18",time:"15:00",venue:"SoFi Stadium, Los Angeles",group:"E"},
  {id:28,mn:"M28",home:"Guatemala",away:"Brazil",date:"2026-06-18",time:"18:00",venue:"MetLife Stadium, New York",group:"E"},
  {id:29,mn:"M29",home:"Brazil",away:"Bolivia",date:"2026-06-22",time:"21:00",venue:"AT&T Stadium, Dallas",group:"E"},
  {id:30,mn:"M30",home:"Guatemala",away:"Spain",date:"2026-06-22",time:"21:00",venue:"NRG Stadium, Houston",group:"E"},
  // GROUP F
  {id:31,mn:"M31",home:"England",away:"Netherlands",date:"2026-06-15",time:"21:00",venue:"AT&T Stadium, Dallas",group:"F"},
  {id:32,mn:"M32",home:"Serbia",away:"New Zealand",date:"2026-06-15",time:"18:00",venue:"Gillette Stadium, Boston",group:"F"},
  {id:33,mn:"M33",home:"England",away:"Serbia",date:"2026-06-19",time:"21:00",venue:"MetLife Stadium, New York",group:"F"},
  {id:34,mn:"M34",home:"New Zealand",away:"Netherlands",date:"2026-06-19",time:"18:00",venue:"Levi's Stadium, San Francisco",group:"F"},
  {id:35,mn:"M35",home:"Netherlands",away:"Serbia",date:"2026-06-23",time:"18:00",venue:"SoFi Stadium, Los Angeles",group:"F"},
  {id:36,mn:"M36",home:"New Zealand",away:"England",date:"2026-06-23",time:"18:00",venue:"BC Place, Vancouver",group:"F"},
  // GROUP G
  {id:37,mn:"M37",home:"Portugal",away:"Germany",date:"2026-06-15",time:"15:00",venue:"NRG Stadium, Houston",group:"G"},
  {id:38,mn:"M38",home:"Senegal",away:"Indonesia",date:"2026-06-15",time:"12:00",venue:"BMO Field, Toronto",group:"G"},
  {id:39,mn:"M39",home:"Portugal",away:"Senegal",date:"2026-06-19",time:"15:00",venue:"AT&T Stadium, Dallas",group:"G"},
  {id:40,mn:"M40",home:"Indonesia",away:"Germany",date:"2026-06-19",time:"12:00",venue:"Gillette Stadium, Boston",group:"G"},
  {id:41,mn:"M41",home:"Germany",away:"Senegal",date:"2026-06-23",time:"21:00",venue:"MetLife Stadium, New York",group:"G"},
  {id:42,mn:"M42",home:"Indonesia",away:"Portugal",date:"2026-06-23",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"G"},
  // GROUP H
  {id:43,mn:"M43",home:"Morocco",away:"Croatia",date:"2026-06-16",time:"15:00",venue:"AT&T Stadium, Dallas",group:"H"},
  {id:44,mn:"M44",home:"Denmark",away:"Tunisia",date:"2026-06-16",time:"12:00",venue:"NRG Stadium, Houston",group:"H"},
  {id:45,mn:"M45",home:"Morocco",away:"Denmark",date:"2026-06-20",time:"15:00",venue:"Gillette Stadium, Boston",group:"H"},
  {id:46,mn:"M46",home:"Tunisia",away:"Croatia",date:"2026-06-20",time:"12:00",venue:"Levi's Stadium, San Francisco",group:"H"},
  {id:47,mn:"M47",home:"Croatia",away:"Denmark",date:"2026-06-24",time:"18:00",venue:"BC Place, Vancouver",group:"H"},
  {id:48,mn:"M48",home:"Tunisia",away:"Morocco",date:"2026-06-24",time:"18:00",venue:"BMO Field, Toronto",group:"H"},
  // GROUP I
  {id:49,mn:"M49",home:"Japan",away:"South Korea",date:"2026-06-17",time:"15:00",venue:"SoFi Stadium, Los Angeles",group:"I"},
  {id:50,mn:"M50",home:"Ghana",away:"Australia",date:"2026-06-17",time:"12:00",venue:"AT&T Stadium, Dallas",group:"I"},
  {id:51,mn:"M51",home:"Japan",away:"Ghana",date:"2026-06-21",time:"15:00",venue:"MetLife Stadium, New York",group:"I"},
  {id:52,mn:"M52",home:"Australia",away:"South Korea",date:"2026-06-21",time:"12:00",venue:"NRG Stadium, Houston",group:"I"},
  {id:53,mn:"M53",home:"South Korea",away:"Ghana",date:"2026-06-25",time:"18:00",venue:"Gillette Stadium, Boston",group:"I"},
  {id:54,mn:"M54",home:"Australia",away:"Japan",date:"2026-06-25",time:"18:00",venue:"Levi's Stadium, San Francisco",group:"I"},
  // GROUP J
  {id:55,mn:"M55",home:"Qatar",away:"Uzbekistan",date:"2026-06-17",time:"09:00",venue:"Estadio Azteca, Mexico City",group:"J"},
  {id:56,mn:"M56",home:"Iran",away:"Iraq",date:"2026-06-17",time:"12:00",venue:"BC Place, Vancouver",group:"J"},
  {id:57,mn:"M57",home:"Qatar",away:"Iran",date:"2026-06-21",time:"09:00",venue:"Estadio Azteca, Mexico City",group:"J"},
  {id:58,mn:"M58",home:"Iraq",away:"Uzbekistan",date:"2026-06-21",time:"09:00",venue:"BMO Field, Toronto",group:"J"},
  {id:59,mn:"M59",home:"Uzbekistan",away:"Iran",date:"2026-06-25",time:"21:00",venue:"AT&T Stadium, Dallas",group:"J"},
  {id:60,mn:"M60",home:"Iraq",away:"Qatar",date:"2026-06-25",time:"21:00",venue:"SoFi Stadium, Los Angeles",group:"J"},
  // GROUP K
  {id:61,mn:"M61",home:"South Korea",away:"Cameroon",date:"2026-06-18",time:"09:00",venue:"BMO Field, Toronto",group:"K"},
  {id:62,mn:"M62",home:"Switzerland",away:"Oman",date:"2026-06-18",time:"12:00",venue:"Estadio Azteca, Mexico City",group:"K"},
  {id:63,mn:"M63",home:"South Korea",away:"Switzerland",date:"2026-06-22",time:"09:00",venue:"BC Place, Vancouver",group:"K"},
  {id:64,mn:"M64",home:"Oman",away:"Cameroon",date:"2026-06-22",time:"12:00",venue:"Estadio Azteca, Mexico City",group:"K"},
  {id:65,mn:"M65",home:"Cameroon",away:"Switzerland",date:"2026-06-26",time:"18:00",venue:"NRG Stadium, Houston",group:"K"},
  {id:66,mn:"M66",home:"Oman",away:"South Korea",date:"2026-06-26",time:"18:00",venue:"Gillette Stadium, Boston",group:"K"},
  // GROUP L
  {id:67,mn:"M67",home:"Costa Rica",away:"Saudi Arabia",date:"2026-06-19",time:"09:00",venue:"Estadio Azteca, Mexico City",group:"L"},
  {id:68,mn:"M68",home:"Egypt",away:"Yemen",date:"2026-06-19",time:"09:00",venue:"BC Place, Vancouver",group:"L"},
  {id:69,mn:"M69",home:"Costa Rica",away:"Egypt",date:"2026-06-23",time:"09:00",venue:"BMO Field, Toronto",group:"L"},
  {id:70,mn:"M70",home:"Yemen",away:"Saudi Arabia",date:"2026-06-23",time:"09:00",venue:"Estadio Azteca, Mexico City",group:"L"},
  {id:71,mn:"M71",home:"Saudi Arabia",away:"Egypt",date:"2026-06-27",time:"18:00",venue:"AT&T Stadium, Dallas",group:"L"},
  {id:72,mn:"M72",home:"Yemen",away:"Costa Rica",date:"2026-06-27",time:"18:00",venue:"SoFi Stadium, Los Angeles",group:"L"},
  // Round of 32 (M73–M104 will be TBD slots set by admin)
  {id:73,mn:"R32-1",home:"TBD",away:"TBD",date:"2026-06-29",time:"18:00",venue:"MetLife Stadium, New York",stage:"R32"},
  {id:74,mn:"R32-2",home:"TBD",away:"TBD",date:"2026-06-29",time:"21:00",venue:"AT&T Stadium, Dallas",stage:"R32"},
  {id:75,mn:"R32-3",home:"TBD",away:"TBD",date:"2026-06-30",time:"18:00",venue:"SoFi Stadium, Los Angeles",stage:"R32"},
  {id:76,mn:"R32-4",home:"TBD",away:"TBD",date:"2026-06-30",time:"21:00",venue:"NRG Stadium, Houston",stage:"R32"},
  {id:77,mn:"R32-5",home:"TBD",away:"TBD",date:"2026-07-01",time:"18:00",venue:"Gillette Stadium, Boston",stage:"R32"},
  {id:78,mn:"R32-6",home:"TBD",away:"TBD",date:"2026-07-01",time:"21:00",venue:"Levi's Stadium, San Francisco",stage:"R32"},
  {id:79,mn:"R32-7",home:"TBD",away:"TBD",date:"2026-07-02",time:"18:00",venue:"BC Place, Vancouver",stage:"R32"},
  {id:80,mn:"R32-8",home:"TBD",away:"TBD",date:"2026-07-02",time:"21:00",venue:"BMO Field, Toronto",stage:"R32"},
  {id:81,mn:"R32-9",home:"TBD",away:"TBD",date:"2026-07-03",time:"18:00",venue:"Estadio Azteca, Mexico City",stage:"R32"},
  {id:82,mn:"R32-10",home:"TBD",away:"TBD",date:"2026-07-03",time:"21:00",venue:"MetLife Stadium, New York",stage:"R32"},
  {id:83,mn:"R32-11",home:"TBD",away:"TBD",date:"2026-07-04",time:"18:00",venue:"AT&T Stadium, Dallas",stage:"R32"},
  {id:84,mn:"R32-12",home:"TBD",away:"TBD",date:"2026-07-04",time:"21:00",venue:"SoFi Stadium, Los Angeles",stage:"R32"},
  {id:85,mn:"R32-13",home:"TBD",away:"TBD",date:"2026-07-05",time:"18:00",venue:"NRG Stadium, Houston",stage:"R32"},
  {id:86,mn:"R32-14",home:"TBD",away:"TBD",date:"2026-07-05",time:"21:00",venue:"Gillette Stadium, Boston",stage:"R32"},
  {id:87,mn:"R32-15",home:"TBD",away:"TBD",date:"2026-07-06",time:"18:00",venue:"Levi's Stadium, San Francisco",stage:"R32"},
  {id:88,mn:"R32-16",home:"TBD",away:"TBD",date:"2026-07-06",time:"21:00",venue:"BC Place, Vancouver",stage:"R32"},
  // Round of 16
  {id:89,mn:"R16-1",home:"TBD",away:"TBD",date:"2026-07-09",time:"18:00",venue:"MetLife Stadium, New York",stage:"R16"},
  {id:90,mn:"R16-2",home:"TBD",away:"TBD",date:"2026-07-09",time:"21:00",venue:"AT&T Stadium, Dallas",stage:"R16"},
  {id:91,mn:"R16-3",home:"TBD",away:"TBD",date:"2026-07-10",time:"18:00",venue:"SoFi Stadium, Los Angeles",stage:"R16"},
  {id:92,mn:"R16-4",home:"TBD",away:"TBD",date:"2026-07-10",time:"21:00",venue:"NRG Stadium, Houston",stage:"R16"},
  {id:93,mn:"R16-5",home:"TBD",away:"TBD",date:"2026-07-11",time:"18:00",venue:"Gillette Stadium, Boston",stage:"R16"},
  {id:94,mn:"R16-6",home:"TBD",away:"TBD",date:"2026-07-11",time:"21:00",venue:"Levi's Stadium, San Francisco",stage:"R16"},
  {id:95,mn:"R16-7",home:"TBD",away:"TBD",date:"2026-07-12",time:"18:00",venue:"BC Place, Vancouver",stage:"R16"},
  {id:96,mn:"R16-8",home:"TBD",away:"TBD",date:"2026-07-12",time:"21:00",venue:"BMO Field, Toronto",stage:"R16"},
  // Quarter Finals
  {id:97,mn:"QF-1",home:"TBD",away:"TBD",date:"2026-07-15",time:"18:00",venue:"MetLife Stadium, New York",stage:"QF"},
  {id:98,mn:"QF-2",home:"TBD",away:"TBD",date:"2026-07-15",time:"21:00",venue:"AT&T Stadium, Dallas",stage:"QF"},
  {id:99,mn:"QF-3",home:"TBD",away:"TBD",date:"2026-07-16",time:"18:00",venue:"SoFi Stadium, Los Angeles",stage:"QF"},
  {id:100,mn:"QF-4",home:"TBD",away:"TBD",date:"2026-07-16",time:"21:00",venue:"NRG Stadium, Houston",stage:"QF"},
  // Semi Finals
  {id:101,mn:"SF-1",home:"TBD",away:"TBD",date:"2026-07-19",time:"21:00",venue:"MetLife Stadium, New York",stage:"SF"},
  {id:102,mn:"SF-2",home:"TBD",away:"TBD",date:"2026-07-20",time:"21:00",venue:"AT&T Stadium, Dallas",stage:"SF"},
  // Third Place
  {id:103,mn:"3rd",home:"TBD",away:"TBD",date:"2026-07-25",time:"21:00",venue:"SoFi Stadium, Los Angeles",stage:"3rd"},
  // Final
  {id:104,mn:"Final",home:"TBD",away:"TBD",date:"2026-07-26",time:"21:00",venue:"MetLife Stadium, New York",stage:"Final"},
];

/* ─── BONUS QUESTIONS ────────────────────────────────────────── */
const BONUS_QUESTIONS = {
  1:"Will the match produce 3+ goals total?",
  2:"Will there be a red card in this match?",
  3:"Will the first goal come in the first 15 minutes?",
  4:"Will the match be decided by a penalty shootout?",
  5:"Will the winning team keep a clean sheet?",
  6:"Will the MOTM be a defender or goalkeeper?",
  7:"Will there be a hat-trick in this match?",
  8:"Will the match end in a draw?",
  9:"Will there be 2+ goals in the second half?",
  10:"Will the toss of the coin (kick-off choice) team win?",
  // ... more for each match — admin can set per match
};

/* ─── SCORE BANDS (Total goals) ─────────────────────────────── */
const GOAL_BANDS = [
  {id:"0",label:"0 Goals",short:"0",emoji:"🫙"},
  {id:"1",label:"1 Goal",short:"1",emoji:"⚽"},
  {id:"2",label:"2 Goals",short:"2",emoji:"⚽⚽"},
  {id:"3",label:"3 Goals",short:"3",emoji:"🔥"},
  {id:"4+",label:"4+ Goals",short:"4+",emoji:"💥"},
];

/* ─── PROP QUESTIONS ─────────────────────────────────────────── */
const PROP_QUESTIONS = [
  {id:"q0",label:"Who will win the FIFA World Cup 2026?",type:"team"},
  {id:"q1",label:"Golden Boot — who will be the top scorer?",type:"player"},
  {id:"q2",label:"Which team will finish in 2nd place (runners-up)?",type:"team"},
  {id:"q3",label:"Which team will finish in 3rd place?",type:"team"},
  {id:"q4",label:"Which team will finish in 4th place?",type:"team"},
  {id:"q5",label:"Wooden Spoon — which team finishes last / group stage exit with worst record?",type:"team"},
];

/* ─── PLAYER POOL (top players per nation) ───────────────────── */
const PLAYERS = [
  // Argentina
  "Lionel Messi","Julian Alvarez","Lautaro Martinez","Angel Di Maria","Emiliano Martinez",
  // France
  "Kylian Mbappe","Antoine Griezmann","Ousmane Dembele","Marcus Thuram","Mike Maignan",
  // Brazil
  "Vinicius Junior","Rodrygo","Raphinha","Bruno Guimaraes","Alisson",
  // England
  "Jude Bellingham","Harry Kane","Phil Foden","Bukayo Saka","Jordan Pickford",
  // Spain
  "Pedri","Lamine Yamal","Alvaro Morata","Rodri","Unai Simon",
  // Portugal
  "Cristiano Ronaldo","Bruno Fernandes","Bernardo Silva","Ruben Dias","Diogo Costa",
  // Germany
  "Florian Wirtz","Jamal Musiala","Thomas Muller","Kai Havertz","Manuel Neuer",
  // Netherlands
  "Virgil van Dijk","Cody Gakpo","Memphis Depay","Frenkie de Jong","Bart Verbruggen",
  // Belgium
  "Kevin De Bruyne","Romelu Lukaku","Yannick Carrasco","Axel Witsel","Thibaut Courtois",
  // Croatia
  "Luka Modric","Ivan Perisic","Mateo Kovacic","Andrej Kramaric","Dominik Livakovic",
  // Uruguay
  "Darwin Nunez","Federico Valverde","Luis Suarez","Ronald Araujo","Sergio Rochet",
  // Denmark
  "Christian Eriksen","Rasmus Hojlund","Pierre-Emile Hojbjerg","Simon Kjaer","Kasper Schmeichel",
  // USA
  "Christian Pulisic","Tyler Adams","Weston McKennie","Gio Reyna","Matt Turner",
  // Morocco
  "Hakim Ziyech","Achraf Hakimi","Youssef En-Nesyri","Sofyan Amrabat","Yassine Bounou",
  // Japan
  "Takumi Minamino","Wataru Endo","Daichi Kamada","Ritsu Doan","Shuichi Gonda",
  // South Korea
  "Son Heung-min","Lee Kang-in","Kim Min-jae","Hwang Hee-chan","Jo Hyeon-woo",
  // Mexico
  "Hirving Lozano","Edson Alvarez","Raul Jimenez","Andres Guardado","Guillermo Ochoa",
  // Canada
  "Alphonso Davies","Jonathan David","Cyle Larin","Atiba Hutchinson","Milan Borjan",
  // Senegal
  "Sadio Mane","Kalidou Koulibaly","Ismaila Sarr","Idrissa Gueye","Edouard Mendy",
  // Australia
  "Mathew Leckie","Aaron Mooy","Mitchell Duke","Mat Ryan","Harry Souttar",
].sort();

const PFX = "fifa26_";
const SHARED_PFX = "ipl26_"; // shared passwords and tokens
const SUPER_ADMIN = "akashkotak@gmail.com";
const CHAT_MAX = 400;
const CHAT_CAP = 500;
const NR = "NO_RESULT";

const PTS = {
  win: 20, motm: 30, goals: 10, streak: 15,
  bonus: 15, season: 200, top4: 50, woodenSpoon: 50, goldenBoot: 100,
};

const TRASH_TALK = [
  (perfs,zeros,lone,mn)=>`⚽ ${mn} FULL TIME!\n${perfs.length?`🎯 ${perfs.join(" & ")} nailed all 3! Class.`:"Nobody got a perfect. The beautiful game humbled us all. 💀"}\n${zeros.length?`😅 Moment of silence for ${zeros.join(", ")} — 0 from 3.`:""}\n${lone?`🐉 Lone wolf: ${lone} was the only one who called it. Respect.`:""}`,
  (perfs,zeros,lone,mn)=>`🏟 ${mn} DONE!\n${perfs.length?`🏆 Perfect picks: ${perfs.join(", ")}. Someone's been watching the group stage properly.`:"Not a single perfect pick. Football remains delightfully unpredictable."}\n${zeros.length?`🪦 Pour one out for ${zeros.join(", ")} (0/3). The ref wasn't the only one having a bad day.`:""}\n${lone?`🐉 ${lone} backed the winner alone. Absolute scenes.`:""}`,
  (perfs,zeros,lone,mn)=>`⚡ ${mn} FINAL WHISTLE!\n${perfs.length?`🎯 PERFECTS: ${perfs.join(", ")} — read the game perfectly!`:"Nobody called it perfectly. VAR couldn't save your predictions either."}\n${zeros.length?`💀 Complete whitewash for ${zeros.join(", ")}. Didn't get a single one.`:""}\n${lone?`🔮 Only ${lone} predicted the winner. Fortune favours the bold.`:""}`,
];

/* ─── UTILS ─────────────────────────────────────────────────── */
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

/* ─── FIREBASE ──────────────────────────────────────────────── */
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
  get: async k => {try{const{db,dbMod}=await firebaseReady;const s=await dbMod.get(dbMod.ref(db,PFX+k));return s.exists()?s.val():null;}catch(e){console.error("DB.get",k,e);return null;}},
  set: async(k,v) => {try{const{db,dbMod}=await firebaseReady;if(v==null)await dbMod.remove(dbMod.ref(db,PFX+k));else await dbMod.set(dbMod.ref(db,PFX+k),v);}catch(e){console.error("DB.set",k,e);}},
  // Shared password/token paths use ipl26_ prefix
  getPw: async k => {try{const{db,dbMod}=await firebaseReady;const s=await dbMod.get(dbMod.ref(db,SHARED_PFX+"pw_"+k));return s.exists()?s.val():null;}catch(e){return null;}},
  setPw: async(k,v) => {try{const{db,dbMod}=await firebaseReady;await dbMod.set(dbMod.ref(db,SHARED_PFX+"pw_"+k),v);}catch(e){console.error("DB.setPw",e);}},
  getToken: async k => {try{const{db,dbMod}=await firebaseReady;const s=await dbMod.get(dbMod.ref(db,SHARED_PFX+"token_"+k));return s.exists()?s.val():null;}catch(e){return null;}},
  setToken: async(k,v) => {try{const{db,dbMod}=await firebaseReady;if(v==null)await dbMod.remove(dbMod.ref(db,SHARED_PFX+"token_"+k));else await dbMod.set(dbMod.ref(db,SHARED_PFX+"token_"+k),v);}catch(e){console.error("DB.setToken",e);}},
  setUserPick: async(userKey,matchId,pick) => {
    try{const{db,dbMod}=await firebaseReady;await dbMod.set(dbMod.ref(db,PFX+"ap/"+userKey+"/"+String(matchId)),pick);return true;}catch(e){console.error("DB.setUserPick",e);return false;}
  },
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
function TeamFlag({team,sz=40}){
  const flag = FLAGS[team]||"🏳";
  const tc = TEAM_COLORS[team]||{bg:"#94a3b8",dk:"#fff"};
  return(
    <div style={{width:sz,height:sz,borderRadius:8,background:tc.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:sz*.55,flexShrink:0,boxShadow:"0 2px 6px rgba(0,0,0,.2)"}}>
      {flag}
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
  const players=PLAYERS.filter(p=>p);
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
          {players.map(p=>(
            <div key={p} className={"dd-item"+(value===p?" sel":"")}
              onMouseDown={e=>{e.preventDefault();onChange(p);setOpen(false);}}>
              <span style={{fontSize:16}}>👤</span>
              <span style={{flex:1,color:value===p?"#004B87":"#475569",fontWeight:value===p?600:400}}>{p}</span>
            </div>
          ))}
        </div>
      )}
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

/* ─── INLINE REVEAL ───────────────────────────────────────────── */
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
  const[myGb,setMyGb]=useState("");const[gbpk,setGbpk]=useState({});
  const[propAnswers,setPropAnswers]=useState({});
  const[myPropBets,setMyPropBets]=useState({});
  const[allPropBets,setAllPropBets]=useState({});
  const[sw,setSw]=useState(null);const[actualTop4,setActualTop4]=useState([]);
  const[actualWs,setActualWs]=useState("");const[actualGb,setActualGb]=useState("");
  const[lockedMatches,setLockedMatches]=useState({});
  const[doubleMatch,setDoubleMatch]=useState(null);
  const[rxns,setRxns]=useState({});
  const[chat,setChat]=useState([]);const[chatIn,setChatIn]=useState("");
  const[chatU,setChatU]=useState(0);const[chatSeenTs,setChatSeenTs]=useState(()=>Date.now());
  const[bc,setBc]=useState([]);const[bcMsg,setBcMsg]=useState("");
  const[pinnedBc,setPinnedBc]=useState(null);
  const[maintenance,setMaintenance]=useState(false);
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
  const[obWs,setObWs]=useState("");const[obGb,setObGb]=useState("");
  const[obProps,setObProps]=useState({q0:"",q1:"",q2:"",q3:"",q4:"",q5:""});
  const[chatMuted,setChatMuted]=useState(false);
  const[mutedUsers,setMutedUsers]=useState({});
  const[onlineUsers,setOnlineUsers]=useState({});
  const[userSearch,setUserSearch]=useState("");
  const[bracket,setBracket]=useState(null);
  const[admResultForm,setAdmResultForm]=useState({});

  const tRef=useRef();const chatRef=useRef();const pollRef=useRef(null);
  const lastPendingCount=useRef(0);

  const toast2=useCallback((msg,type="info")=>{setToast({msg,type});clearTimeout(tRef.current);tRef.current=setTimeout(()=>setToast(null),3500);},[]);
  const myEk=useMemo(()=>ek(email),[email]);

  /* ─── Load shared data ─────────────────────────────────────── */
  const reloadShared=useCallback(async()=>{
    const[u,ap,rm,bc2,ch,sp2,t4,ws,gb,sw2,lk,rx,mnt,pts,dm,cm,mu,bq,bans,gban,pa,pb,at4,aws,agb,pu,pbc]=await Promise.all([
      DB.get("u"),DB.get("ap"),DB.get("rm"),DB.get("bc"),DB.get("ch"),
      DB.get("sp"),DB.get("t4"),DB.get("ws"),DB.get("gb"),DB.get("sw"),
      DB.get("lockedm"),DB.get("rx"),DB.get("maintenance"),DB.get("ptsadj"),
      DB.get("doublematch"),DB.get("chatmuted"),DB.get("mutedusers"),
      DB.get("bq"),DB.get("bonusans"),DB.get("goalbanans"),
      DB.get("propanswers"),DB.get("propbets"),DB.get("actualtop4"),
      DB.get("actualws"),DB.get("actualgb"),DB.get("pending"),DB.get("pinnedbc"),
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
    const ngb={};if(gb)Object.keys(gb).forEach(k=>{ngb[ek(k)]=gb[k];});setGbpk(ngb);setMyGb(ngb[myEk]||"");
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
    const normPB={};if(pb&&typeof pb==="object"){Object.keys(pb).forEach(k=>{normPB[ek(k)]=pb[k];});}setAllPropBets(normPB);setMyPropBets(normPB[myEk]||{});
    if(pa)setPropAnswers(pa);
    if(at4&&Array.isArray(at4))setActualTop4(at4);
    if(aws)setActualWs(aws);
    if(agb)setActualGb(agb);
    setPinnedBc(pbc||null);
  },[myEk]);

  useEffect(()=>{reloadShared();},[reloadShared]);
  useEffect(()=>{if(["home","lb","picks","chat","wof","adm","rules"].includes(sc))reloadShared();},[sc]);// eslint-disable-line

  // Auto-approve IPL users in FIFA
  useEffect(()=>{
    if(!email||!user)return;
    const checkAutoApprove=async()=>{
      const existing=await DB.get("u")||{};
      const emk=ek(email);
      if(!existing[email]&&!existing[emk]){
        const entry={email,name:user.name,joined:new Date().toISOString(),approved:true,autoApproved:true};
        await DB.set("u",{...existing,[email]:entry});
        setUsers(prev=>({...prev,[emk]:entry}));
      }
    };
    checkAutoApprove();
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
  const hasPropBets=PROP_QUESTIONS.every((q,i)=>myPropBets?.[`q${i}`]&&myPropBets[`q${i}`]!=="");

  useEffect(()=>{
    if(!hasOnboarded&&sc!=="onboard")setSc("onboard");
    else if(hasOnboarded&&!hasPropBets&&sc==="home"&&email!==SUPER_ADMIN)setSc("propbets");
  },[hasOnboarded,hasPropBets,sc,email]);// eslint-disable-line

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
    const gbPts=(myGb&&actualGb&&myGb===actualGb)?PTS.goldenBoot:0;
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
    const propPts=PROP_QUESTIONS.reduce((s,q,i)=>{
      const ans=propAnswers?.[`q${i}`];const myAns=myPropBets?.[`q${i}`];
      if(!ans||!myAns||myAns==="")return s;
      return s+(String(myAns)===String(ans)?PTS.prop:0);
    },0);
    return pts+seasonPts+t4pts+wsPts+gbPts+bonusPts+goalPts+propPts+getManualAdj(email);
  },[myPicks,ms,doubleMatch,mySp,sw,myT4,actualTop4,myWs,actualWs,myGb,actualGb,bonusAnswers,myBonusPicks,goalBandAnswers,done,propAnswers,myPropBets,getManualAdj,email]);

  const myPts=useMemo(calcMyPts,[calcMyPts]);

  const getLb=useCallback(()=>{
    return Object.values(users).filter(u=>u?.email&&u.approved!==false).map(u=>{
      const emk=ek(u.email);
      const up=allPicks[emk]||{};
      const{pts:mPts}=calcScore(up,ms,doubleMatch);
      const userSp=spk[emk]||"";
      const userT4=t4pk[emk]||[];
      const userWs=wspk[emk]||"";
      const userGb=gbpk[emk]||"";
      const sp2=(userSp&&sw&&userSp===sw)?PTS.season:0;
      const t4p=actualTop4.length>0?userT4.filter(t=>actualTop4.includes(t)).length*PTS.top4:0;
      const wsp=(userWs&&actualWs&&userWs===actualWs)?PTS.woodenSpoon:0;
      const gbp=(userGb&&actualGb&&userGb===actualGb)?PTS.goldenBoot:0;
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
      const propPts=PROP_QUESTIONS.reduce((s,q,i)=>{
        const ans=propAnswers?.[`q${i}`];const uAns=(allPropBets[emk]||{})?.[`q${i}`];
        if(!ans||!uAns||uAns==="")return s;
        return s+(String(uAns)===String(ans)?PTS.prop:0);
      },0);
      const total=mPts+sp2+t4p+wsp+gbp+bonusPts+goalPts+propPts+getManualAdj(u.email);
      return{...u,pts:total,userSp,userT4,userWs,userGb};
    }).sort((a,b)=>b.pts-a.pts);
  },[users,allPicks,ms,doubleMatch,spk,sw,t4pk,wspk,gbpk,actualTop4,actualWs,actualGb,bonusAnswers,allBonusPicks,goalBandAnswers,done,propAnswers,allPropBets,getManualAdj]);

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

  async function doneOnboard(){
    if(!obSp){toast2("Pick a champion first","error");return;}
    if(obT4.length!==4){toast2("Select exactly 4 teams for Top 4","error");return;}
    if(!obWs){toast2("Pick Wooden Spoon team","error");return;}
    if(!obGb){toast2("Pick Golden Boot player","error");return;}
    const unanswered=PROP_QUESTIONS.filter((q,i)=>!obProps[`q${i}`]||obProps[`q${i}`]==="");
    if(unanswered.length>0){toast2("Answer all prop bet questions","error");return;}
    const sp2={...spk,[myEk]:obSp};const t42={...t4pk,[myEk]:obT4};
    const ws2={...wspk,[myEk]:obWs};const gb2={...gbpk,[myEk]:obGb};
    setSpk(sp2);setMySp(obSp);setT4pk(t42);setMyT4(obT4);setWspk(ws2);setMyWs(obWs);setGbpk(gb2);setMyGb(obGb);
    await Promise.all([DB.set("sp",sp2),DB.set("t4",t42),DB.set("ws",ws2),DB.set("gb",gb2)]);
    await DB.set("propbets/"+myEk,obProps);
    setMyPropBets(obProps);
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
    ?[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","My Game"],["chat","💬","Chat"],["wof","🌟","Fame"],["rules","📖","Rules"],["adm","⚙️","Admin"]]
    :[["home","🏠","Home"],["lb","🏆","Board"],["picks","📋","My Game"],["chat","💬","Chat"],["wof","🌟","Fame"],["rules","📖","Rules"]];

  const hdr=useMemo(()=>(
    <div style={{background:"linear-gradient(135deg,#003d70,#004B87,#006BB6)",padding:"13px 16px 11px",display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:28}}>⚽</span>
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
        <div style={{background:"linear-gradient(135deg,#003d70,#004B87,#006BB6)",padding:"24px 20px 20px"}}>
          <p style={{color:"#bfdbfe",fontSize:12,margin:0}}>Welcome, {user?.name}! One-time World Cup setup</p>
          <p className="C" style={{color:"#C5A028",fontSize:24,letterSpacing:2,margin:"4px 0 0"}}>
            {obStep===0?"PICK YOUR CHAMPION":obStep===1?"TOP 4 TEAMS":obStep===2?"WOODEN SPOON & GOLDEN BOOT":"SEASON PROP BETS"}
          </p>
          <div style={{display:"flex",gap:6,marginTop:12}}>
            {[0,1,2,3].map(i=><div key={i} style={{flex:1,height:3,borderRadius:2,background:obStep>=i?"#C5A028":"rgba(255,255,255,.2)"}}/>)}
          </div>
        </div>
        <div style={{padding:"20px 16px",paddingBottom:40}}>
          {obStep===0&&<>
            <p style={{color:"#0a1628",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Who will win FIFA World Cup 2026?</p>
            <p style={{color:"#64748b",fontSize:13,margin:"0 0 16px"}}>Worth <b style={{color:"#004B87"}}>+{PTS.season}pts</b> if correct. Locked forever.</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:24}}>
              {TEAMS.map(t=>(
                <button key={t} className={"ot"+(obSp===t?" on":"")} onClick={()=>setObSp(t)} style={{width:"auto",padding:"8px 12px",flexDirection:"row",gap:8}}>
                  <span style={{fontSize:20}}>{FLAGS[t]||"🏳"}</span>
                  <span style={{fontSize:11,fontWeight:700,color:obSp===t?"#004B87":"#475569"}}>{t}</span>
                </button>
              ))}
            </div>
            <button className="lbtn" disabled={!obSp} onClick={()=>setObStep(1)} style={{opacity:obSp?1:.4}}>Next → Top 4</button>
          </>}

          {obStep===1&&<>
            <p style={{color:"#0a1628",fontSize:15,fontWeight:600,margin:"0 0 6px"}}>Which 4 teams reach the Semi Finals?</p>
            <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 14px"}}>Select exactly 4 · {obT4.length}/4 · +{PTS.top4}pts each</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center",marginBottom:24}}>
              {TEAMS.map(t=>{
                const sel=obT4.includes(t);
                return(
                  <button key={t} className={"ot"+(sel?" on":"")} onClick={()=>{if(sel)setObT4(p=>p.filter(x=>x!==t));else if(obT4.length<4)setObT4(p=>[...p,t]);else toast2("Max 4 teams","error");}} style={{width:"auto",padding:"8px 12px",flexDirection:"row",gap:8}}>
                    <span style={{fontSize:18}}>{FLAGS[t]||"🏳"}</span>
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
            <p style={{color:"#0a1628",fontSize:15,fontWeight:600,margin:"0 0 4px"}}>Wooden Spoon &amp; Golden Boot</p>
            <p style={{color:"#94a3b8",fontSize:12,margin:"0 0 16px"}}>Worth +{PTS.woodenSpoon}pts and +{PTS.goldenBoot}pts respectively</p>
            <p style={{fontWeight:700,fontSize:12,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>🪵 Wooden Spoon — worst team in tournament</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
              {TEAMS.map(t=>(
                <button key={t} onClick={()=>setObWs(t)} style={{display:"flex",alignItems:"center",gap:6,padding:"6px 10px",borderRadius:10,background:obWs===t?"#004B87":"#f8faff",border:"2px solid "+(obWs===t?"#004B87":"#e2e8f0"),cursor:"pointer"}}>
                  <span style={{fontSize:16}}>{FLAGS[t]||"🏳"}</span>
                  <span style={{fontSize:11,fontWeight:700,color:obWs===t?"#fff":"#475569"}}>{t}</span>
                </button>
              ))}
            </div>
            <p style={{fontWeight:700,fontSize:12,color:"#64748b",marginBottom:8,textTransform:"uppercase",letterSpacing:.5}}>👟 Golden Boot — top scorer of the tournament</p>
            <MotmDropdown team1="" team2="" value={obGb} onChange={setObGb}/>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button style={{flex:1,padding:"12px",borderRadius:10,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2}} onClick={()=>setObStep(1)}>← Back</button>
              <button className="lbtn" disabled={!obWs||!obGb} onClick={()=>setObStep(3)} style={{flex:2,opacity:obWs&&obGb?1:.4}}>Next → Prop Bets</button>
            </div>
          </>}

          {obStep===3&&<>
            <p style={{color:"#0a1628",fontSize:15,fontWeight:600,margin:"0 0 4px"}}>Season Prop Bets</p>
            <p style={{color:"#64748b",fontSize:12,margin:"0 0 16px"}}>6 questions · +{PTS.prop}pts each · locked for the tournament</p>
            {PROP_QUESTIONS.map((q,i)=>{
              const val=obProps[q.id]||"";
              const filled=!!(val&&val!=="");
              return(
                <div key={q.id} style={{background:filled?"#f0fdf4":"#f8faff",border:"1px solid "+(filled?"#bbf7d0":"#e2e8f0"),borderRadius:10,padding:"12px 14px",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
                    <p style={{fontSize:12,fontWeight:700,color:"#004B87",margin:0}}>Q{i+1} · +{PTS.prop}pts</p>
                    {filled?<span style={{fontSize:10,color:"#15803d",fontWeight:700}}>✓</span>:<span style={{fontSize:10,color:"#ef4444",fontWeight:600}}>Required</span>}
                  </div>
                  <p style={{fontSize:13,color:"#0a1628",fontWeight:600,margin:"0 0 8px",lineHeight:1.4}}>{q.label}</p>
                  {q.type==="team"&&<select className="sel" value={val} onChange={e=>setObProps(p=>({...p,[q.id]:e.target.value}))} style={{borderColor:filled?"#bbf7d0":"#e2e8f0"}}><option value="">Select team…</option>{TEAMS.map(t=><option key={t} value={t}>{FLAGS[t]} {t}</option>)}</select>}
                  {q.type==="player"&&<MotmDropdown team1="" team2="" value={val} onChange={v=>setObProps(p=>({...p,[q.id]:v}))}/>}
                </div>
              );
            })}
            <button style={{width:"100%",padding:"12px",borderRadius:10,background:"#f1f5f9",color:"#475569",border:"1px solid #e2e8f0",cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",fontSize:16,letterSpacing:2,marginBottom:10}} onClick={()=>setObStep(2)}>← Back</button>
            <button className="lbtn" disabled={PROP_QUESTIONS.some((q,i)=>!obProps[`q${i}`]||obProps[`q${i}`]==="")} onClick={doneOnboard} style={{opacity:PROP_QUESTIONS.every((q,i)=>obProps[`q${i}`]&&obProps[`q${i}`]!=="")?"1":".4"}}>
              Lock All Picks — Vamos! ⚽
            </button>
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
          <span style={{fontSize:24}}>{FLAGS[am.home]||"🏳"}</span>
          <div style={{flex:1}}>
            <p className="C" style={{color:"#fff",fontSize:16,margin:0}}>{am.home} vs {am.away}</p>
            <p style={{color:"#bfdbfe",fontSize:11,margin:"2px 0 0"}}>{am.date} · {am.time} ET · {am.mn}</p>
          </div>
          <span style={{fontSize:24}}>{FLAGS[am.away]||"🏳"}</span>
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
                  {t!=="Draw"?<span style={{fontSize:28}}>{FLAGS[t]||"🏳"}</span>:<span style={{fontSize:24}}>🤝</span>}
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
                      <span style={{fontSize:24}}>{FLAGS[m.home]||"🏳"}</span>
                      <p className="C" style={{color:"#475569",fontSize:13,margin:0}}>{m.home}</p>
                    </div>
                    <p className="C" style={{color:"#e2e8f0",fontSize:16,padding:"0 8px",margin:0}}>VS</p>
                    <div style={{display:"flex",alignItems:"center",gap:8,flex:1,justifyContent:"flex-end",flexDirection:"row-reverse"}}>
                      <span style={{fontSize:24}}>{FLAGS[m.away]||"🏳"}</span>
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
                {mySp?<span style={{fontSize:36}}>{FLAGS[mySp]||"🏳"}</span>:<div style={{width:50,height:50,borderRadius:10,background:"#f1f5f9",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>?</div>}
                <div>
                  <p className="C" style={{color:"#0a1628",fontSize:18,margin:0}}>{mySp||"Not set"}</p>
                  {sw&&mySp&&<p style={{color:mySp===sw?"#15803d":"#dc2626",fontSize:13,fontWeight:700,marginTop:6}}>{mySp===sw?"✅ Correct! +200pts":"❌ Better luck next time"}</p>}
                </div>
              </div>
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">🏅 TOP 4 TEAMS (+{PTS.top4}pts each)</p>
              {myT4&&myT4.length>0?<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{myT4.map((t,i)=><div key={t} style={{display:"flex",alignItems:"center",gap:6,background:"#f8faff",borderRadius:10,padding:"8px 12px",border:"1px solid #e2e8f0"}}><span className="C" style={{color:"#94a3b8",fontSize:12}}>#{i+1}</span><span style={{fontSize:20}}>{FLAGS[t]||"🏳"}</span><span className="C" style={{color:"#004B87",fontSize:13}}>{t}</span>{actualTop4.length>0&&<span style={{fontSize:13}}>{actualTop4.includes(t)?"✅":"❌"}</span>}</div>)}</div>:<p style={{color:"#94a3b8",fontSize:12}}>Not set</p>}
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">🪵 WOODEN SPOON (+{PTS.woodenSpoon}pts)</p>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                {myWs?<span style={{fontSize:28}}>{FLAGS[myWs]||"🏳"}</span>:null}
                <p className="C" style={{color:"#0a1628",fontSize:16,margin:0}}>{myWs||"Not set"}</p>
                {actualWs&&myWs&&<span style={{fontSize:13}}>{myWs===actualWs?"✅ Correct! +50pts":"❌"}</span>}
              </div>
            </div>
            <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:12}}>
              <p className="st">👟 GOLDEN BOOT (+{PTS.goldenBoot}pts)</p>
              <p className="C" style={{color:"#0a1628",fontSize:16,margin:0}}>{myGb||"Not set"}</p>
              {actualGb&&myGb&&<span style={{fontSize:13,marginTop:4,display:"block"}}>{myGb===actualGb?"✅ Correct! +100pts":"❌"}</span>}
            </div>
          </div>}
          {htab==="groups"&&<div>
            {Object.entries(GROUPS).map(([grp,teams])=>(
              <div key={grp} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:12,padding:"14px",marginBottom:10}}>
                <p className="C" style={{color:"#004B87",fontSize:16,letterSpacing:2,margin:"0 0 8px"}}>Group {grp}</p>
                {teams.map(t=>(
                  <div key={t} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0",borderBottom:"1px solid #f1f5f9"}}>
                    <span style={{fontSize:20}}>{FLAGS[t]||"🏳"}</span>
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
          <div key={u.email} style={{background:u.email===email?"#E6F0FB":"#fff",border:"1px solid "+(u.email===email?"#004B8760":"#e2e8f0"),borderRadius:12,padding:"12px 14px",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <div style={{display:"flex",flexDirection:"column",alignItems:"center",width:32,flexShrink:0}}>
                <span style={{fontSize:i<3?18:13}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":"#"+(i+1)}</span>
              </div>
              <Av name={u.name} sz={30}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{color:"#0a1628",fontWeight:600,fontSize:13,margin:0}}>{u.name}{u.email===email?" (You)":""}</p>
              </div>
              <p className="C" style={{color:"#004B87",fontSize:22,margin:0,letterSpacing:1}}>{u.pts}</p>
            </div>
            {/* Season picks row */}
            <div style={{display:"flex",gap:8,borderTop:"1px solid #f1f5f9",paddingTop:7,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,background:"#f8faff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0"}}>
                <span style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase"}}>🏆</span>
                {u.userSp?<><span style={{fontSize:16}}>{FLAGS[u.userSp]||"🏳"}</span><span className="C" style={{fontSize:12,color:sw&&u.userSp===sw?"#15803d":"#004B87"}}>{u.userSp}{sw&&u.userSp===sw?" ✅":""}</span></>:<span style={{fontSize:11,color:"#94a3b8"}}>—</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:4,background:"#f8faff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0",flex:1,flexWrap:"wrap"}}>
                <span style={{fontSize:9,color:"#94a3b8",fontWeight:600,textTransform:"uppercase"}}>Top4:</span>
                {(u.userT4||[]).length>0?(u.userT4||[]).map(t=>{
                  const correct=actualTop4.length>0&&actualTop4.includes(t);
                  const wrong=actualTop4.length>0&&!actualTop4.includes(t);
                  return<div key={t} style={{display:"inline-flex",alignItems:"center",gap:2,background:correct?"#EAF3DE":wrong?"#FCEBEB":"#f1f5f9",borderRadius:6,padding:"1px 4px",border:"0.5px solid "+(correct?"#97C459":wrong?"#F09595":"#e2e8f0")}}><span style={{fontSize:12}}>{FLAGS[t]||"🏳"}</span><span style={{fontSize:9,fontWeight:700,color:correct?"#27500A":wrong?"#791F1F":"#475569"}}>{t}</span>{correct&&<span style={{fontSize:9}}>✅</span>}{wrong&&<span style={{fontSize:9}}>✗</span>}</div>;
                }):<span style={{fontSize:11,color:"#94a3b8"}}>—</span>}
                {actualTop4.length>0&&(u.userT4||[]).length>0&&<span style={{fontSize:10,fontWeight:700,color:"#15803d",marginLeft:4}}>+{(u.userT4||[]).filter(t=>actualTop4.includes(t)).length*PTS.top4}pts</span>}
              </div>
            </div>
            {/* WS + GB row */}
            <div style={{display:"flex",gap:8,marginTop:6,flexWrap:"wrap"}}>
              <div style={{display:"flex",alignItems:"center",gap:5,background:"#f8faff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0"}}>
                <span style={{fontSize:9,color:"#94a3b8",fontWeight:600}}>🪵</span>
                {u.userWs?<><span style={{fontSize:14}}>{FLAGS[u.userWs]||"🏳"}</span><span className="C" style={{fontSize:11,color:actualWs&&u.userWs===actualWs?"#15803d":"#004B87"}}>{u.userWs}{actualWs&&(u.userWs===actualWs?" ✅":" ✗")}</span></>:<span style={{fontSize:10,color:"#94a3b8"}}>—</span>}
              </div>
              <div style={{display:"flex",alignItems:"center",gap:5,background:"#f8faff",borderRadius:8,padding:"4px 8px",border:"1px solid #e2e8f0"}}>
                <span style={{fontSize:9,color:"#94a3b8",fontWeight:600}}>👟</span>
                <span className="C" style={{fontSize:11,color:actualGb&&u.userGb===actualGb?"#15803d":"#004B87"}}>{u.userGb||"—"}{actualGb&&u.userGb&&(u.userGb===actualGb?" ✅":" ✗")}</span>
              </div>
            </div>
          </div>
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
                      <span style={{fontSize:24}}>{FLAGS[m.home]||"🏳"}</span>
                      <span className="C" style={{color:"#94a3b8",fontSize:14}}>VS</span>
                      <span style={{fontSize:24}}>{FLAGS[m.away]||"🏳"}</span>
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
                      <span style={{fontSize:20}}>{FLAGS[m.home]||"🏳"}</span>
                      <span className="C" style={{color:"#475569",fontSize:12}}>{m.home}</span>
                      <span className="C" style={{color:"#e2e8f0",fontSize:12,margin:"0 6px"}}>VS</span>
                      <span className="C" style={{color:"#475569",fontSize:12}}>{m.away}</span>
                      <span style={{fontSize:20}}>{FLAGS[m.away]||"🏳"}</span>
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
          ["🏆 Season Picks","Champion: +"+PTS.season+"pts | Top 4 (SF teams): +"+PTS.top4+"pts each | Wooden Spoon: +"+PTS.woodenSpoon+"pts | Golden Boot: +"+PTS.goldenBoot+"pts"],
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
            {[["🏆 Winner correct","+"+PTS.win+"pts"],["⭐ MOTM correct","+"+PTS.motm+"pts"],["🔥 Both correct bonus","+"+PTS.streak+"pts"],["⚽ Goals band correct","+"+PTS.goals+"pts"],["❓ Bonus Q correct","+"+PTS.bonus+"pts"],["⚡ Double match","×2 all above"],["🥇 Champion","+"+PTS.season+"pts"],["🏅 Top 4 team","+"+PTS.top4+"pts each"],["🪵 Wooden Spoon","+"+PTS.woodenSpoon+"pts"],["👟 Golden Boot","+"+PTS.goldenBoot+"pts"]].map(([l,v])=>(
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
          {[["approvals","✅ Approve"],["results","📊 Results"],["pickstatus","👁 Picks"],["users","👥 Users"],["controls","🎛️ Controls"],["broadcast","📢 Broadcast"]].map(([t,l])=>(
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

        {admTab==="results"&&<div>
          {ms.filter(m=>!isTBD(m)).sort((a,b)=>Number(a.id)-Number(b.id)).map(m=>(
            <div key={m.id} className="ac">
              <p style={{fontWeight:700,fontSize:13,color:"#0a1628",margin:"0 0 6px"}}>{m.mn}: {FLAGS[m.home]||""} {m.home} vs {m.away} {FLAGS[m.away]||""}</p>
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
                        {v!=="Draw"&&<span style={{fontSize:16}}>{FLAGS[v]||""}</span>}
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
                  <span style={{fontSize:16}}>{FLAGS[t]||"🏳"}</span>
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
                    <span style={{fontSize:16}}>{FLAGS[t]||"🏳"}</span>
                    <span style={{fontSize:11,fontWeight:700,color:sel?"#fff":"#475569"}}>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="ac">
            <p className="st">🪵 WOODEN SPOON &amp; 👟 GOLDEN BOOT</p>
            <p style={{fontSize:11,color:"#64748b",marginBottom:8}}>Wooden Spoon (worst team):</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
              {TEAMS.map(t=>(
                <button key={t} onClick={async()=>{setActualWs(t);await DB.set("actualws",t);toast2("Wooden Spoon: "+t);}} style={{display:"flex",alignItems:"center",gap:4,padding:"5px 9px",borderRadius:8,background:actualWs===t?"#004B87":"#f8faff",border:"1.5px solid "+(actualWs===t?"#004B87":"#e2e8f0"),cursor:"pointer"}}>
                  <span style={{fontSize:14}}>{FLAGS[t]||"🏳"}</span>
                  <span style={{fontSize:10,fontWeight:700,color:actualWs===t?"#fff":"#475569"}}>{t}</span>
                </button>
              ))}
            </div>
            <p style={{fontSize:11,color:"#64748b",marginBottom:8}}>Golden Boot (top scorer):</p>
            <MotmDropdown team1="" team2="" value={actualGb} onChange={async v=>{setActualGb(v);await DB.set("actualgb",v);toast2("Golden Boot: "+v,"ok");}}/>
          </div>
          <div className="ac">
            <p className="st">🔮 PROP BET ANSWERS</p>
            {PROP_QUESTIONS.map((q,i)=>{
              const cur=propAnswers?.[q.id]||"";
              return(
                <div key={q.id} style={{marginBottom:12}}>
                  <p style={{fontSize:11,fontWeight:700,color:"#004B87",margin:"0 0 4px"}}>Q{i+1} · {q.label}</p>
                  {q.type==="team"&&<select className="sel" value={cur} onChange={async e=>{const upd={...propAnswers,[q.id]:e.target.value};setPropAnswers(upd);await DB.set("propanswers",upd);toast2("Saved","ok");}}><option value="">Select team…</option>{TEAMS.map(t=><option key={t} value={t}>{FLAGS[t]} {t}</option>)}</select>}
                  {q.type==="player"&&<MotmDropdown team1="" team2="" value={cur} onChange={async v=>{const upd={...propAnswers,[q.id]:v};setPropAnswers(upd);await DB.set("propanswers",upd);toast2("Saved","ok");}}/>}
                </div>
              );
            })}
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
              <span style={{fontSize:15,opacity:sc===s?1:.4}}>{ic}</span>
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
