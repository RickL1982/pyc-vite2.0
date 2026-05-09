export const APP_ID = "proteccion-cuidado-appweb";

export const COLORS = { royalBlue: '#0044FF', royalBlueLight: '#3B82F6' };

export const INITIAL_SERVERS = [
  // LÍDERES Y SUPERVISORES
  { id: 100, name: "FERNANDO ALBERTO BLANCO GUERRERO", group: "COORDINADOR", isSupervisor: true, gender: 'M', phone: "3187156621", doc: "80472275", birthday: "2-oct", serviceStartDate: "2018-12-04", photoUrl: "" },
  { id: 101, name: "KAREN JOHANNA GUERRERO CASTRO", group: "SUPERVISOR", isSupervisor: true, gender: 'F', phone: "3193544864", doc: "53120818", birthday: "10-oct", serviceStartDate: "", photoUrl: "" },
  { id: 102, name: "WILLIAM DAVID BENJUMEA LIZARAZO", group: "SUPERVISOR", isSupervisor: true, gender: 'M', phone: "3158980586", doc: "79797161", birthday: "1-oct", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 103, name: "RICARDO ALBERTO LOZANO LOZANO", group: "SUPERVISOR", isSupervisor: true, gender: 'M', phone: "3044108903", doc: "11229765", birthday: "18-dic", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 104, name: "GINNA DANIELA SOTO REYES", group: "SUPERVISOR", isSupervisor: true, gender: 'F', phone: "3212637787", doc: "1110520374", birthday: "13-feb", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 105, name: "EDNA MAYERLY SERRATO RUIZ", group: "3A", isSupervisor: true, gender: 'F', phone: "3132464606", doc: "52348159", birthday: "13-may", serviceStartDate: "2022-08-15", photoUrl: "" },

  // GRUPO 3A
  { id: 35, name: "ANGÉLICA MARÍA AREIZA SEGURA", group: "3A", isSupervisor: false, gender: 'F', phone: "3003401366", doc: "52393310", birthday: "2-feb", serviceStartDate: "2025-11-30", photoUrl: "" },
  { id: 49, name: "BRAYAN RENE BERNAL ROJAS", group: "3A", isSupervisor: false, gender: 'M', phone: "3118448252", doc: "1013622500", birthday: "13-oct", serviceStartDate: "2024-07-02", photoUrl: "" },
  { id: 27, name: "YAMILE BLANCO GUERRERO", group: "3A", isSupervisor: false, gender: 'F', phone: "3174589284", doc: "52397098", birthday: "9-dic", serviceStartDate: "2025-04-05", photoUrl: "" },
  { id: 51, name: "ANGELA ROCÍO BOJACA BOJACA", group: "3A", isSupervisor: false, gender: 'F', phone: "3228271584", doc: "1019011911", birthday: "3-ene", serviceStartDate: "2025-09-24", photoUrl: "" },
  { id: 34, name: "GIOVANY BUITRAGO PULECIO", group: "3A", isSupervisor: false, gender: 'M', phone: "3164628630", doc: "79600372", birthday: "29-abr", serviceStartDate: "2022-05-31", photoUrl: "" },
  { id: 46, name: "ERNESTO CASTRO REY", group: "3A", isSupervisor: false, gender: 'M', phone: "3135535366", doc: "79890038", birthday: "7-mar", serviceStartDate: "2023-08-02", photoUrl: "" },
  { id: 29, name: "ANGELICA ESCOBAR HERRERA", group: "3A", isSupervisor: false, gender: 'F', phone: "3025268281", doc: "53015193", birthday: "30-nov", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 36, name: "ESPERANZA ESPITIA VEGA", group: "3A", isSupervisor: false, gender: 'F', phone: "3143079116", doc: "52802669", birthday: "4-may", serviceStartDate: "2025-09-19", photoUrl: "" },
  { id: 50, name: "CLAUDIA ALEJANDRA FARFAN GONZALEZ", group: "3A", isSupervisor: false, gender: 'F', phone: "3134340131", doc: "52805610", birthday: "13-nov", serviceStartDate: "2023-04-18", photoUrl: "" },
  { id: 40, name: "JULIETH PAOLA FARFÁN ANGARITA", group: "3A", isSupervisor: false, gender: 'F', phone: "3242852130", doc: "1020786271", birthday: "10-sep", serviceStartDate: "2025-06-26", photoUrl: "" },
  { id: 20, name: "LOGAN FLAUTERO ROJAS", group: "3A", isSupervisor: false, gender: 'F', phone: "3044096467", doc: "52801453", birthday: "13-feb", serviceStartDate: "2025-06-04", photoUrl: "" },
  { id: 32, name: "MARTIN JAIMES DELGADILLO", group: "3A", isSupervisor: false, gender: 'M', phone: "3004929680", doc: "79354063", birthday: "7-ago", serviceStartDate: "2025-02-06", photoUrl: "" },
  { id: 31, name: "OLMIS JUNCO SMITH", group: "3A", isSupervisor: false, gender: 'F', phone: "3005641160", doc: "52045893", birthday: "31-may", serviceStartDate: "2022-06-10", photoUrl: "" },
  { id: 37, name: "BETSY MILENY HERRERA NOVA", group: "3A", isSupervisor: false, gender: 'F', phone: "3214744191", doc: "52154894", birthday: "12-may", serviceStartDate: "2025-09-19", photoUrl: "" },
  { id: 48, name: "ADRIANA PAOLA MENDEZ MONTOYA", group: "3A", isSupervisor: false, gender: 'F', phone: "3004670258", doc: "1026274812", birthday: "8-feb", serviceStartDate: "2022-12-15", photoUrl: "" },
  { id: 43, name: "CLAUDIA MARCELA MONTAÑO RAMIREZ", group: "3A", isSupervisor: false, gender: 'F', phone: "3004670258", doc: "52351390", birthday: "13-oct", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 44, name: "ESTEBAN NIÑO SANTOYO", group: "3A", isSupervisor: false, gender: 'M', phone: "3158901965", doc: "1019059663", birthday: "19-mar", serviceStartDate: "2024-07-02", photoUrl: "" },
  { id: 53, name: "JESSICA OROZCO", group: "3A", isSupervisor: false, gender: 'F', phone: "3138270680", doc: "1019134909", birthday: "9-oct", serviceStartDate: "2025-09-03", photoUrl: "" },
  { id: 30, name: "JULIO CESAR PAEZ LOPEZ", group: "3A", isSupervisor: false, gender: 'M', phone: "3112845439", doc: "79399370", birthday: "17-oct", serviceStartDate: "2022-08-15", photoUrl: "" },
  { id: 33, name: "ESTEBAN PANTOJA ARCOS", group: "3A", isSupervisor: false, gender: 'M', phone: "3166459432", doc: "1014252328", birthday: "22-dic", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 54, name: "OMAR FABIAN PARAMO BLANQUICETT", group: "3A", isSupervisor: false, gender: 'M', phone: "3184069506", doc: "", birthday: "", serviceStartDate: "", photoUrl: "" },
  { id: 41, name: "ANGELA VICTORIA PULIDO GIL", group: "3A", isSupervisor: false, gender: 'F', phone: "3118900096", doc: "1019032595", birthday: "9-mar", serviceStartDate: "2022-05-30", photoUrl: "" },
  { id: 28, name: "ANGELICA MARIA RAMIREZ ROJAS", group: "3A", isSupervisor: false, gender: 'F', phone: "3142944665", doc: "52514416", birthday: "7-ene", serviceStartDate: "2022-05-30", photoUrl: "" },
  { id: 39, name: "JOSÉ MIGUEL RUIZ GONZALEZ", group: "3A", isSupervisor: false, gender: 'M', phone: "3052135825", doc: "1026572788", birthday: "10-jun", serviceStartDate: "2024-03-30", photoUrl: "" },
  { id: 38, name: "JHONNATAN SALGADO ANICHARICO", group: "3A", isSupervisor: false, gender: 'M', phone: "3178276248", doc: "1233908421", birthday: "20-may", serviceStartDate: "2024-07-02", photoUrl: "" },
  { id: 52, name: "CARLOS JAVIER SANTOS RIVERA", group: "3A", isSupervisor: false, gender: 'M', phone: "3133311064", doc: "80227381", birthday: "15-mar", serviceStartDate: "2022-06-11", photoUrl: "" },

  // GRUPO 3B
  { id: 18, name: "ANA JACKELINE ARIAS ALFONSO", group: "3B", isSupervisor: false, gender: 'F', phone: "3164414758", doc: "52911076", birthday: "10-jun", serviceStartDate: "2022-09-03", photoUrl: "" },
  { id: 19, name: "MANUEL ENRIQUE BOLIVAR ZIPAQUIRA", group: "3B", isSupervisor: false, gender: 'M', phone: "3214544454", doc: "11523980", birthday: "10-jun", serviceStartDate: "2024-07-10", photoUrl: "" },
  { id: 13, name: "LUIS EDUARDO CANRO POVEDA", group: "3B", isSupervisor: false, gender: 'M', phone: "3204513790", doc: "79526304", birthday: "14-jul", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 5, name: "MAGDA VIVIANA CARRANZA", group: "3B", isSupervisor: false, gender: 'F', phone: "3166951103", doc: "24157479", birthday: "7-dic", serviceStartDate: "2024-07-02", photoUrl: "" },
  { id: 2, name: "MARY JACQUELINE CASTAÑEDA CALDERON", group: "3B", isSupervisor: false, gender: 'F', phone: "3104852716", doc: "51713924", birthday: "1-oct", serviceStartDate: "2022-06-20", photoUrl: "" },
  { id: 25, name: "ROBINSON DANIEL CRUZ CASTRO", group: "3B", isSupervisor: false, gender: 'M', phone: "3007002487", doc: "1015472857", birthday: "1-ene", serviceStartDate: "2023-05-03", photoUrl: "" },
  { id: 11, name: "MIGUEL ARTURO FARFAN ALVAREZ", group: "3B", isSupervisor: false, gender: 'M', phone: "3115028484", doc: "79581847", birthday: "19-oct", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 9, name: "OSWALDO GONZALEZ ZAMBRANO", group: "3B", isSupervisor: false, gender: 'M', phone: "3015626165", doc: "504670", birthday: "13-ene", serviceStartDate: "2024-07-02", photoUrl: "" },
  { id: 24, name: "SANDRA MILENA GUALTEROS MENDIETA", group: "3B", isSupervisor: false, gender: 'F', phone: "3124790479", doc: "40048132", birthday: "1-oct", serviceStartDate: "2022-06-01", photoUrl: "" },
  { id: 16, name: "YECENIA ESTHER JARAMILLO ARRIENTA", group: "3B", isSupervisor: false, gender: 'F', phone: "3008080506", doc: "64583154", birthday: "3-nov", serviceStartDate: "2022-05-30", photoUrl: "" },
  { id: 23, name: "MARTHA LILIANA LEGUIZAMON ROJAS", group: "3B", isSupervisor: false, gender: 'F', phone: "3002302773", doc: "52480967", birthday: "22-jun", serviceStartDate: "2022-06-18", photoUrl: "" },
  { id: 1, name: "LUIS ALEJANDRO MORENO", group: "3B", isSupervisor: false, gender: 'M', phone: "3016743955", doc: "79868600", birthday: "28-jun", serviceStartDate: "2022-06-08", photoUrl: "" },
  { id: 14, name: "LUZ HELENA NORIEGA MOYA", group: "3B", isSupervisor: false, gender: 'F', phone: "3165294269", doc: "52394076", birthday: "13-feb", serviceStartDate: "2024-03-30", photoUrl: "" },
  { id: 17, name: "WILLINGTON ORTIZ CARRILLO", group: "3B", isSupervisor: false, gender: 'M', phone: "3138914228", doc: "13724862", birthday: "17-ene", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 26, name: "JULIAN ANDRES ORTEGÓN CASALLAS", group: "3B", isSupervisor: false, gender: 'M', phone: "3183334646", doc: "1030604972", birthday: "3-feb", serviceStartDate: "2025-08-13", photoUrl: "" },
  { id: 15, name: "JESUS EFREN PAEZ ROMERO", group: "3B", isSupervisor: false, gender: 'M', phone: "3204406446", doc: "80179078", birthday: "8-ene", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 47, name: "DIANA MARCELA PIÑEROS GONZALEZ", group: "3B", isSupervisor: false, gender: 'F', phone: "3175328392", doc: "52928063", birthday: "24-jun", serviceStartDate: "2024-02-22", photoUrl: "" },
  { id: 7, name: "HAYDER RAMIRO RINCÓN RUIZ", group: "3B", isSupervisor: false, gender: 'M', phone: "3006418146", doc: "1047390363", birthday: "11-ago", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 12, name: "MAYRA ALEJANDRA RIVEROS VEGA", group: "3B", isSupervisor: false, gender: 'F', phone: "3142375581", doc: "1057588217", birthday: "28-oct", serviceStartDate: "2025-08-22", photoUrl: "" },
  { id: 21, name: "LUZ HELENA RONCANCIO GARCIA", group: "3B", isSupervisor: false, gender: 'F', phone: "3160428048", doc: "39541336", birthday: "28-feb", serviceStartDate: "2025-02-07", photoUrl: "" },
  { id: 3, name: "MAURICIO FERNANDO RODRIGUEZ SANCHEZ", group: "3B", isSupervisor: false, gender: 'M', phone: "3168869428", doc: "80817205", birthday: "12-ago", serviceStartDate: "2022-11-10", photoUrl: "" },
  { id: 8, name: "YEHIZMI ANDREA SAMACÁ CAMACHO", group: "3B", isSupervisor: false, gender: 'F', phone: "3114450076", doc: "40042182", birthday: "18-jun", serviceStartDate: "2022-06-11", photoUrl: "" },
  { id: 22, name: "YERSON TAMAYO", group: "3B", isSupervisor: false, gender: 'M', phone: "3197182085", doc: "80121893", birthday: "9-ene", serviceStartDate: "2023-04-19", photoUrl: "" },
  { id: 6, name: "NELSON IGNACIO VELAZQUEZ SABOGAL", group: "3B", isSupervisor: false, gender: 'M', phone: "3118607559", doc: "11231486", birthday: "29-oct", serviceStartDate: "2025-11-11", photoUrl: "" },
  { id: 4, name: "LUCY ESPERANZA ZAMBRANO HERNANDEZ", group: "3B", isSupervisor: false, gender: 'F', phone: "3124449927", doc: "52558658", birthday: "18-may", serviceStartDate: "2024-03-30", photoUrl: "" }
];

export const ZONES_DEFINITION = [
  {
    id: "Z1",
    name: "ZONA 1 - AUDITORIO",
    points: [
      { id: "Z1_1", label: "Alfa 1: Ingreso púlpito", isCritical: true, genderReq: 'M' },
      { id: "Z1_2", label: "Corredor alfa 1-4", isReinforcement: true, genderReq: 'F' },
      { id: "Z1_3", label: "Alfa 2: Entrada líderes", isCritical: true },
      { id: "Z1_4", label: "Alfa 3: Entrada auditorio", isCritical: true },
      { id: "Z1_5", label: "Alfa 4: Entrada prioritaria", isCritical: true, genderReq: 'M' },
      { id: "Z1_6", label: "Alfa 5", isCritical: true, genderReq: 'F' },
      { id: "Z1_7", label: "Alfa 6: Salida interna parq.", isCritical: true },
      { id: "Z1_8", label: "Alfa 7: Entrada padres SPK", isCritical: true },
      { id: "Z1_9", label: "Alfa 8: Entrada PMU", isCritical: true },
      { id: "Z1_10", label: "Alfa 9: Púlpito", isCritical: true, genderReq: 'M' },
      { id: "Z1_11", label: "Alfa 10: Master (refuerzo)", isReinforcement: true, genderReq: 'F' },
    ]
  },
  {
    id: "Z2",
    name: "ZONA 2 - SPK",
    points: [
      { id: "Z2_1", label: "Av suba ingreso", isCritical: true },
      { id: "Z2_2", label: "Corredor ingreso SPK", isCritical: true, genderReq: 'F' },
      { id: "Z2_3", label: "Corredor ingreso (refuerzo)", isReinforcement: true },
      { id: "Z2_4", label: "Corredor evac. SP babies (ref)", isReinforcement: true },
      { id: "Z2_5", label: "Puerta acompañantes", isCritical: true },
      { id: "Z2_6_1", label: "Auditorio SPK 1", isCritical: true, isSticky: true, genderReq: 'F' },
      { id: "Z2_6_2", label: "Auditorio SPK 2", isCritical: true, isSticky: true, genderReq: 'F' },
      { id: "Z2_6_3", label: "Auditorio SPK 3", isCritical: true, isSticky: true, genderReq: 'F' },
      { id: "Z2_7", label: "Auditorio SPK (refuerzo)", isReinforcement: true, isSticky: true, genderReq: 'F' },
      { id: "Z2_8", label: "Ascensor SPK", isCritical: true, genderReq: 'F' },
      { id: "Z2_9", label: "Salida SP babies", isCritical: true, genderReq: 'F' },
      { id: "Z2_10", label: "Ingreso Padres SPK 2piso", isCritical: true },
      { id: "Z2_11", label: "Rampa salida SPK 2 piso", isCritical: true },
      { id: "Z2_12", label: "Overflow salon 215 (refuerzo)", isReinforcement: true },
      { id: "Z2_13", label: "Salida puerta de vidrio SPK", isCritical: true },
      { id: "Z2_14", label: "Escaleras eléctricas 1 piso", isCritical: true },
      { id: "Z2_15", label: "Escaleras eléctricas 2 piso", isCritical: true },
      { id: "Z2_16", label: "Escaleras capacitación 1P", isCritical: true },
      { id: "Z2_17", label: "Escaleras capacitación 2P", isCritical: true },
    ]
  },
  {
    id: "Z3",
    name: "ZONA 3 - EXTERIORES",
    points: [
      { id: "Z3_1", label: "Ingreso lobby/puerta principal", isCritical: true },
      { id: "Z3_2", label: "Ingreso lobby/puerta (ref)", isReinforcement: true },
      { id: "Z3_3", label: "PMU - Radios chaquetas", isCritical: true, exclusiveTo: 21 },
      { id: "Z3_4", label: "Ingreso AV Suba líderes", isCritical: true },
      { id: "Z3_5", label: "Rampa/coffee (refuerzo)", isReinforcement: true },
      { id: "Z3_6", label: "Ascensor salón VIP", isCritical: true, genderReq: 'F' },
      { id: "Z3_7", label: "Pasillo lobby/VIP (ref)", isReinforcement: true, genderReq: 'M' },
      { id: "Z3_8", label: "Salida Parque", isCritical: true },
      { id: "Z3_9", label: "Salida Parque (refuerzo)", isReinforcement: true },
      { id: "Z3_10", label: "MEC y baños auditorio", isCritical: true, genderReq: 'F' },
      { id: "Z3_11", label: "MEC y baños (refuerzo)", isReinforcement: true, genderReq: 'M' },
      { id: "Z3_12", label: "Baños SPK", isCritical: true, genderReq: 'F' },
      { id: "Z3_13", label: "Parqueadero y edificio", isCritical: true, genderReq: 'M' },
      { id: "Z3_14", label: "Edificio adm. 3P (refuerzo)", isReinforcement: true },
      { id: "Z3_15", label: "Edificio adm. 4P (refuerzo)", isReinforcement: true },
      { id: "Z3_16", label: "Edificio adm. 5P (refuerzo)", isReinforcement: true },
    ]
  }
];

export const SERVICE_SLOTS = ["7:30", "9:30", "11:30", "1:30"];

export const EVAC_SOURCES = {
  'Z2_16': ['Z2_4', 'Z2_5'],
  'Z2_17': ['Z2_6_1', 'Z2_6_2', 'Z2_6_3', 'Z2_7'],
  'Z2_18': ['Z2_1', 'Z2_2'],
  'Z2_19': ['Z2_3', 'Z2_8'],
};

export const EVAC_DESTINATIONS = {
  'Z2_4': 'Z2_16', 'Z2_5': 'Z2_16',
  'Z2_6_1': 'Z2_17', 'Z2_6_2': 'Z2_17', 'Z2_6_3': 'Z2_17', 'Z2_7': 'Z2_17',
  'Z2_1': 'Z2_18', 'Z2_2': 'Z2_18',
  'Z2_3': 'Z2_19', 'Z2_8': 'Z2_19',
};

export const BIBLE_VERSES = [
  "«Sirvan de buena gana, como quien sirve al Señor y no a los hombres.» - Efesios 6:7",
  "«Cada uno ponga al servicio de los demás el don que haya recibido...» - 1 Pedro 4:10",
  "«Porque el Hijo del hombre no vino para ser servido, sino para servir.» - Marcos 10:45",
  "«Todo lo que hagan, háganlo de corazón, como para el Señor y no para los hombres.» - Colosenses 3:23",
];
