/**
 * Historical election data for all 28 states + 8 UTs
 * Modeled on ECI formats — educational mock data
 */

export interface HistoricalElection {
  year: number;
  turnoutPercent: number;
  totalSeats: number;
  topParty: string;
  topPartySeats: number;
  majorOpposition: string;
  majorOppositionSeats: number;
}

export interface StateHistoricalData {
  stateCode: string;
  stateName: string;
  elections: HistoricalElection[];
}

export const HISTORICAL_DATA: StateHistoricalData[] = [
  { stateCode: "AP", stateName: "Andhra Pradesh", elections: [
    { year: 2014, turnoutPercent: 74.5, totalSeats: 175, topParty: "TDP+", topPartySeats: 106, majorOpposition: "YSRCP", majorOppositionSeats: 67 },
    { year: 2019, turnoutPercent: 79.7, totalSeats: 175, topParty: "YSRCP", topPartySeats: 151, majorOpposition: "TDP+", majorOppositionSeats: 23 },
    { year: 2024, turnoutPercent: 81.9, totalSeats: 175, topParty: "TDP+", topPartySeats: 135, majorOpposition: "YSRCP", majorOppositionSeats: 11 },
  ]},
  { stateCode: "AR", stateName: "Arunachal Pradesh", elections: [
    { year: 2014, turnoutPercent: 78.0, totalSeats: 60, topParty: "Congress", topPartySeats: 42, majorOpposition: "BJP", majorOppositionSeats: 11 },
    { year: 2019, turnoutPercent: 80.5, totalSeats: 60, topParty: "BJP", topPartySeats: 41, majorOpposition: "Congress", majorOppositionSeats: 4 },
    { year: 2024, turnoutPercent: 82.0, totalSeats: 60, topParty: "BJP", topPartySeats: 46, majorOpposition: "Congress", majorOppositionSeats: 1 },
  ]},
  { stateCode: "AS", stateName: "Assam", elections: [
    { year: 2011, turnoutPercent: 75.9, totalSeats: 126, topParty: "Congress", topPartySeats: 78, majorOpposition: "AGP", majorOppositionSeats: 10 },
    { year: 2016, turnoutPercent: 84.7, totalSeats: 126, topParty: "BJP+", topPartySeats: 86, majorOpposition: "Congress", majorOppositionSeats: 26 },
    { year: 2021, turnoutPercent: 82.0, totalSeats: 126, topParty: "BJP+", topPartySeats: 75, majorOpposition: "Congress+", majorOppositionSeats: 50 },
  ]},
  { stateCode: "BR", stateName: "Bihar", elections: [
    { year: 2010, turnoutPercent: 52.7, totalSeats: 243, topParty: "NDA", topPartySeats: 206, majorOpposition: "RJD+", majorOppositionSeats: 25 },
    { year: 2015, turnoutPercent: 56.7, totalSeats: 243, topParty: "Grand Alliance", topPartySeats: 178, majorOpposition: "NDA", majorOppositionSeats: 58 },
    { year: 2020, turnoutPercent: 57.1, totalSeats: 243, topParty: "NDA", topPartySeats: 125, majorOpposition: "Grand Alliance", majorOppositionSeats: 110 },
  ]},
  { stateCode: "CG", stateName: "Chhattisgarh", elections: [
    { year: 2013, turnoutPercent: 76.5, totalSeats: 90, topParty: "BJP", topPartySeats: 49, majorOpposition: "Congress", majorOppositionSeats: 39 },
    { year: 2018, turnoutPercent: 76.4, totalSeats: 90, topParty: "Congress", topPartySeats: 68, majorOpposition: "BJP", majorOppositionSeats: 15 },
    { year: 2023, turnoutPercent: 76.3, totalSeats: 90, topParty: "BJP", topPartySeats: 54, majorOpposition: "Congress", majorOppositionSeats: 35 },
  ]},
  { stateCode: "GA", stateName: "Goa", elections: [
    { year: 2012, turnoutPercent: 82.0, totalSeats: 40, topParty: "BJP", topPartySeats: 21, majorOpposition: "Congress", majorOppositionSeats: 9 },
    { year: 2017, turnoutPercent: 83.2, totalSeats: 40, topParty: "BJP+", topPartySeats: 21, majorOpposition: "Congress", majorOppositionSeats: 17 },
    { year: 2022, turnoutPercent: 78.9, totalSeats: 40, topParty: "BJP", topPartySeats: 20, majorOpposition: "Congress", majorOppositionSeats: 11 },
  ]},
  { stateCode: "GJ", stateName: "Gujarat", elections: [
    { year: 2012, turnoutPercent: 71.3, totalSeats: 182, topParty: "BJP", topPartySeats: 115, majorOpposition: "Congress", majorOppositionSeats: 61 },
    { year: 2017, turnoutPercent: 68.4, totalSeats: 182, topParty: "BJP", topPartySeats: 99, majorOpposition: "Congress", majorOppositionSeats: 77 },
    { year: 2022, turnoutPercent: 64.3, totalSeats: 182, topParty: "BJP", topPartySeats: 156, majorOpposition: "Congress", majorOppositionSeats: 17 },
  ]},
  { stateCode: "HR", stateName: "Haryana", elections: [
    { year: 2014, turnoutPercent: 76.5, totalSeats: 90, topParty: "BJP", topPartySeats: 47, majorOpposition: "INLD", majorOppositionSeats: 19 },
    { year: 2019, turnoutPercent: 68.5, totalSeats: 90, topParty: "BJP", topPartySeats: 40, majorOpposition: "Congress", majorOppositionSeats: 31 },
    { year: 2024, turnoutPercent: 67.9, totalSeats: 90, topParty: "BJP", topPartySeats: 48, majorOpposition: "Congress", majorOppositionSeats: 37 },
  ]},
  { stateCode: "HP", stateName: "Himachal Pradesh", elections: [
    { year: 2012, turnoutPercent: 73.5, totalSeats: 68, topParty: "Congress", topPartySeats: 36, majorOpposition: "BJP", majorOppositionSeats: 26 },
    { year: 2017, turnoutPercent: 75.6, totalSeats: 68, topParty: "BJP", topPartySeats: 44, majorOpposition: "Congress", majorOppositionSeats: 21 },
    { year: 2022, turnoutPercent: 75.6, totalSeats: 68, topParty: "Congress", topPartySeats: 40, majorOpposition: "BJP", majorOppositionSeats: 25 },
  ]},
  { stateCode: "JH", stateName: "Jharkhand", elections: [
    { year: 2014, turnoutPercent: 63.9, totalSeats: 81, topParty: "BJP+", topPartySeats: 42, majorOpposition: "JMM+", majorOppositionSeats: 24 },
    { year: 2019, turnoutPercent: 65.2, totalSeats: 81, topParty: "JMM+", topPartySeats: 47, majorOpposition: "BJP+", majorOppositionSeats: 25 },
    { year: 2024, turnoutPercent: 67.7, totalSeats: 81, topParty: "JMM+", topPartySeats: 56, majorOpposition: "BJP+", majorOppositionSeats: 24 },
  ]},
  { stateCode: "KA", stateName: "Karnataka", elections: [
    { year: 2013, turnoutPercent: 71.4, totalSeats: 224, topParty: "Congress", topPartySeats: 122, majorOpposition: "BJP", majorOppositionSeats: 40 },
    { year: 2018, turnoutPercent: 72.1, totalSeats: 224, topParty: "BJP", topPartySeats: 104, majorOpposition: "Congress", majorOppositionSeats: 80 },
    { year: 2023, turnoutPercent: 73.2, totalSeats: 224, topParty: "Congress", topPartySeats: 135, majorOpposition: "BJP", majorOppositionSeats: 66 },
  ]},
  { stateCode: "KL", stateName: "Kerala", elections: [
    { year: 2011, turnoutPercent: 75.1, totalSeats: 140, topParty: "UDF", topPartySeats: 72, majorOpposition: "LDF", majorOppositionSeats: 68 },
    { year: 2016, turnoutPercent: 77.1, totalSeats: 140, topParty: "LDF", topPartySeats: 91, majorOpposition: "UDF", majorOppositionSeats: 47 },
    { year: 2021, turnoutPercent: 74.0, totalSeats: 140, topParty: "LDF", topPartySeats: 99, majorOpposition: "UDF", majorOppositionSeats: 41 },
  ]},
  { stateCode: "MP", stateName: "Madhya Pradesh", elections: [
    { year: 2013, turnoutPercent: 72.6, totalSeats: 230, topParty: "BJP", topPartySeats: 165, majorOpposition: "Congress", majorOppositionSeats: 58 },
    { year: 2018, turnoutPercent: 75.1, totalSeats: 230, topParty: "Congress", topPartySeats: 114, majorOpposition: "BJP", majorOppositionSeats: 109 },
    { year: 2023, turnoutPercent: 75.8, totalSeats: 230, topParty: "BJP", topPartySeats: 163, majorOpposition: "Congress", majorOppositionSeats: 66 },
  ]},
  { stateCode: "MH", stateName: "Maharashtra", elections: [
    { year: 2014, turnoutPercent: 63.4, totalSeats: 288, topParty: "BJP", topPartySeats: 122, majorOpposition: "Congress+NCP", majorOppositionSeats: 83 },
    { year: 2019, turnoutPercent: 61.1, totalSeats: 288, topParty: "BJP+SS", topPartySeats: 161, majorOpposition: "Congress+NCP", majorOppositionSeats: 98 },
    { year: 2024, turnoutPercent: 66.1, totalSeats: 288, topParty: "Mahayuti", topPartySeats: 230, majorOpposition: "MVA", majorOppositionSeats: 46 },
  ]},
  { stateCode: "MN", stateName: "Manipur", elections: [
    { year: 2012, turnoutPercent: 83.5, totalSeats: 60, topParty: "Congress", topPartySeats: 42, majorOpposition: "Others", majorOppositionSeats: 18 },
    { year: 2017, turnoutPercent: 86.4, totalSeats: 60, topParty: "BJP+", topPartySeats: 32, majorOpposition: "Congress", majorOppositionSeats: 28 },
    { year: 2022, turnoutPercent: 88.6, totalSeats: 60, topParty: "BJP+", topPartySeats: 37, majorOpposition: "Congress", majorOppositionSeats: 5 },
  ]},
  { stateCode: "ML", stateName: "Meghalaya", elections: [
    { year: 2013, turnoutPercent: 87.0, totalSeats: 60, topParty: "Congress", topPartySeats: 29, majorOpposition: "UDP", majorOppositionSeats: 8 },
    { year: 2018, turnoutPercent: 84.9, totalSeats: 60, topParty: "NPP+", topPartySeats: 32, majorOpposition: "Congress", majorOppositionSeats: 21 },
    { year: 2023, turnoutPercent: 86.1, totalSeats: 60, topParty: "NPP+", topPartySeats: 32, majorOpposition: "Congress", majorOppositionSeats: 8 },
  ]},
  { stateCode: "MZ", stateName: "Mizoram", elections: [
    { year: 2013, turnoutPercent: 82.6, totalSeats: 40, topParty: "Congress", topPartySeats: 34, majorOpposition: "MNF", majorOppositionSeats: 5 },
    { year: 2018, turnoutPercent: 80.3, totalSeats: 40, topParty: "MNF", topPartySeats: 26, majorOpposition: "Congress", majorOppositionSeats: 5 },
    { year: 2023, turnoutPercent: 81.0, totalSeats: 40, topParty: "ZPM", topPartySeats: 27, majorOpposition: "MNF", majorOppositionSeats: 10 },
  ]},
  { stateCode: "NL", stateName: "Nagaland", elections: [
    { year: 2013, turnoutPercent: 87.8, totalSeats: 60, topParty: "NPF", topPartySeats: 38, majorOpposition: "Congress", majorOppositionSeats: 8 },
    { year: 2018, turnoutPercent: 83.0, totalSeats: 60, topParty: "NDPP+BJP", topPartySeats: 32, majorOpposition: "NPF", majorOppositionSeats: 26 },
    { year: 2023, turnoutPercent: 87.4, totalSeats: 60, topParty: "NDPP+BJP", topPartySeats: 37, majorOpposition: "Congress", majorOppositionSeats: 7 },
  ]},
  { stateCode: "OD", stateName: "Odisha", elections: [
    { year: 2014, turnoutPercent: 73.8, totalSeats: 147, topParty: "BJD", topPartySeats: 117, majorOpposition: "Congress", majorOppositionSeats: 16 },
    { year: 2019, turnoutPercent: 73.1, totalSeats: 147, topParty: "BJD", topPartySeats: 112, majorOpposition: "BJP", majorOppositionSeats: 23 },
    { year: 2024, turnoutPercent: 74.4, totalSeats: 147, topParty: "BJP", topPartySeats: 78, majorOpposition: "BJD", majorOppositionSeats: 51 },
  ]},
  { stateCode: "PB", stateName: "Punjab", elections: [
    { year: 2012, turnoutPercent: 78.2, totalSeats: 117, topParty: "SAD+BJP", topPartySeats: 68, majorOpposition: "Congress", majorOppositionSeats: 46 },
    { year: 2017, turnoutPercent: 77.4, totalSeats: 117, topParty: "Congress", topPartySeats: 77, majorOpposition: "AAP", majorOppositionSeats: 20 },
    { year: 2022, turnoutPercent: 72.0, totalSeats: 117, topParty: "AAP", topPartySeats: 92, majorOpposition: "Congress", majorOppositionSeats: 18 },
  ]},
  { stateCode: "RJ", stateName: "Rajasthan", elections: [
    { year: 2013, turnoutPercent: 75.1, totalSeats: 200, topParty: "BJP", topPartySeats: 163, majorOpposition: "Congress", majorOppositionSeats: 21 },
    { year: 2018, turnoutPercent: 74.2, totalSeats: 200, topParty: "Congress", topPartySeats: 99, majorOpposition: "BJP", majorOppositionSeats: 73 },
    { year: 2023, turnoutPercent: 74.1, totalSeats: 200, topParty: "BJP", topPartySeats: 115, majorOpposition: "Congress", majorOppositionSeats: 69 },
  ]},
  { stateCode: "SK", stateName: "Sikkim", elections: [
    { year: 2014, turnoutPercent: 82.6, totalSeats: 32, topParty: "SDF", topPartySeats: 22, majorOpposition: "SKM", majorOppositionSeats: 10 },
    { year: 2019, turnoutPercent: 81.4, totalSeats: 32, topParty: "SKM", topPartySeats: 17, majorOpposition: "SDF", majorOppositionSeats: 15 },
    { year: 2024, turnoutPercent: 79.8, totalSeats: 32, topParty: "SKM", topPartySeats: 31, majorOpposition: "SDF", majorOppositionSeats: 1 },
  ]},
  { stateCode: "TN", stateName: "Tamil Nadu", elections: [
    { year: 2011, turnoutPercent: 78.0, totalSeats: 234, topParty: "AIADMK+", topPartySeats: 203, majorOpposition: "DMK+", majorOppositionSeats: 31 },
    { year: 2016, turnoutPercent: 74.2, totalSeats: 234, topParty: "AIADMK+", topPartySeats: 136, majorOpposition: "DMK+", majorOppositionSeats: 98 },
    { year: 2021, turnoutPercent: 72.8, totalSeats: 234, topParty: "DMK+", topPartySeats: 159, majorOpposition: "AIADMK+", majorOppositionSeats: 75 },
  ]},
  { stateCode: "TS", stateName: "Telangana", elections: [
    { year: 2014, turnoutPercent: 69.3, totalSeats: 119, topParty: "TRS", topPartySeats: 63, majorOpposition: "Congress", majorOppositionSeats: 21 },
    { year: 2018, turnoutPercent: 73.2, totalSeats: 119, topParty: "TRS", topPartySeats: 88, majorOpposition: "Congress+", majorOppositionSeats: 21 },
    { year: 2023, turnoutPercent: 71.3, totalSeats: 119, topParty: "Congress", topPartySeats: 64, majorOpposition: "BRS", majorOppositionSeats: 39 },
  ]},
  { stateCode: "TR", stateName: "Tripura", elections: [
    { year: 2013, turnoutPercent: 91.8, totalSeats: 60, topParty: "Left Front", topPartySeats: 50, majorOpposition: "Congress", majorOppositionSeats: 10 },
    { year: 2018, turnoutPercent: 91.6, totalSeats: 60, topParty: "BJP+", topPartySeats: 44, majorOpposition: "Left Front", majorOppositionSeats: 16 },
    { year: 2023, turnoutPercent: 90.0, totalSeats: 60, topParty: "BJP+", topPartySeats: 32, majorOpposition: "Left+Congress", majorOppositionSeats: 19 },
  ]},
  { stateCode: "UP", stateName: "Uttar Pradesh", elections: [
    { year: 2012, turnoutPercent: 59.4, totalSeats: 403, topParty: "SP", topPartySeats: 224, majorOpposition: "BSP", majorOppositionSeats: 80 },
    { year: 2017, turnoutPercent: 61.0, totalSeats: 403, topParty: "BJP+", topPartySeats: 325, majorOpposition: "SP+", majorOppositionSeats: 54 },
    { year: 2022, turnoutPercent: 60.2, totalSeats: 403, topParty: "BJP+", topPartySeats: 273, majorOpposition: "SP+", majorOppositionSeats: 125 },
  ]},
  { stateCode: "UK", stateName: "Uttarakhand", elections: [
    { year: 2012, turnoutPercent: 65.8, totalSeats: 70, topParty: "Congress", topPartySeats: 32, majorOpposition: "BJP", majorOppositionSeats: 31 },
    { year: 2017, turnoutPercent: 65.6, totalSeats: 70, topParty: "BJP", topPartySeats: 57, majorOpposition: "Congress", majorOppositionSeats: 11 },
    { year: 2022, turnoutPercent: 65.4, totalSeats: 70, topParty: "BJP", topPartySeats: 47, majorOpposition: "Congress", majorOppositionSeats: 19 },
  ]},
  { stateCode: "WB", stateName: "West Bengal", elections: [
    { year: 2011, turnoutPercent: 84.6, totalSeats: 294, topParty: "TMC+", topPartySeats: 227, majorOpposition: "Left Front", majorOppositionSeats: 62 },
    { year: 2016, turnoutPercent: 82.6, totalSeats: 294, topParty: "TMC", topPartySeats: 211, majorOpposition: "Left+Congress", majorOppositionSeats: 76 },
    { year: 2021, turnoutPercent: 82.0, totalSeats: 294, topParty: "TMC", topPartySeats: 213, majorOpposition: "BJP", majorOppositionSeats: 77 },
  ]},
  // Union Territories with elections
  { stateCode: "DL", stateName: "Delhi (NCT)", elections: [
    { year: 2015, turnoutPercent: 67.5, totalSeats: 70, topParty: "AAP", topPartySeats: 67, majorOpposition: "BJP", majorOppositionSeats: 3 },
    { year: 2020, turnoutPercent: 62.6, totalSeats: 70, topParty: "AAP", topPartySeats: 62, majorOpposition: "BJP", majorOppositionSeats: 8 },
    { year: 2025, turnoutPercent: 58.2, totalSeats: 70, topParty: "BJP", topPartySeats: 48, majorOpposition: "AAP", majorOppositionSeats: 22 },
  ]},
  { stateCode: "JK", stateName: "Jammu & Kashmir", elections: [
    { year: 2014, turnoutPercent: 65.2, totalSeats: 87, topParty: "PDP", topPartySeats: 28, majorOpposition: "BJP", majorOppositionSeats: 25 },
    { year: 2024, turnoutPercent: 63.5, totalSeats: 90, topParty: "NC+Congress", topPartySeats: 48, majorOpposition: "BJP", majorOppositionSeats: 29 },
  ]},
  { stateCode: "PY", stateName: "Puducherry", elections: [
    { year: 2011, turnoutPercent: 85.1, totalSeats: 30, topParty: "AINRC+", topPartySeats: 15, majorOpposition: "Congress+DMK", majorOppositionSeats: 12 },
    { year: 2016, turnoutPercent: 84.3, totalSeats: 30, topParty: "Congress+DMK", topPartySeats: 17, majorOpposition: "AINRC+", majorOppositionSeats: 9 },
    { year: 2021, turnoutPercent: 81.0, totalSeats: 30, topParty: "NDA", topPartySeats: 16, majorOpposition: "DMK+Congress", majorOppositionSeats: 14 },
  ]},
];

export function getHistoricalDataForState(stateCode: string): StateHistoricalData | null {
  return HISTORICAL_DATA.find(d => d.stateCode === stateCode) ?? null;
}
