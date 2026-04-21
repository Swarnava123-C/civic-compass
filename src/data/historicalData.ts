/**
 * Historical election data for comparison (educational mock data modeled on ECI formats)
 * Covers 2014, 2019, 2024 cycles for major states
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
  {
    stateCode: "UP",
    stateName: "Uttar Pradesh",
    elections: [
      { year: 2012, turnoutPercent: 59.4, totalSeats: 403, topParty: "SP", topPartySeats: 224, majorOpposition: "BSP", majorOppositionSeats: 80 },
      { year: 2017, turnoutPercent: 61.0, totalSeats: 403, topParty: "BJP+", topPartySeats: 325, majorOpposition: "SP+", majorOppositionSeats: 54 },
      { year: 2022, turnoutPercent: 60.2, totalSeats: 403, topParty: "BJP+", topPartySeats: 273, majorOpposition: "SP+", majorOppositionSeats: 125 },
    ],
  },
  {
    stateCode: "MH",
    stateName: "Maharashtra",
    elections: [
      { year: 2014, turnoutPercent: 63.4, totalSeats: 288, topParty: "BJP", topPartySeats: 122, majorOpposition: "Congress+NCP", majorOppositionSeats: 83 },
      { year: 2019, turnoutPercent: 61.1, totalSeats: 288, topParty: "BJP+SS", topPartySeats: 161, majorOpposition: "Congress+NCP", majorOppositionSeats: 98 },
      { year: 2024, turnoutPercent: 66.1, totalSeats: 288, topParty: "Mahayuti", topPartySeats: 230, majorOpposition: "MVA", majorOppositionSeats: 46 },
    ],
  },
  {
    stateCode: "WB",
    stateName: "West Bengal",
    elections: [
      { year: 2011, turnoutPercent: 84.6, totalSeats: 294, topParty: "TMC+", topPartySeats: 227, majorOpposition: "Left Front", majorOppositionSeats: 62 },
      { year: 2016, turnoutPercent: 82.6, totalSeats: 294, topParty: "TMC", topPartySeats: 211, majorOpposition: "Left+Congress", majorOppositionSeats: 76 },
      { year: 2021, turnoutPercent: 82.0, totalSeats: 294, topParty: "TMC", topPartySeats: 213, majorOpposition: "BJP", majorOppositionSeats: 77 },
    ],
  },
  {
    stateCode: "TN",
    stateName: "Tamil Nadu",
    elections: [
      { year: 2011, turnoutPercent: 78.0, totalSeats: 234, topParty: "AIADMK+", topPartySeats: 203, majorOpposition: "DMK+", majorOppositionSeats: 31 },
      { year: 2016, turnoutPercent: 74.2, totalSeats: 234, topParty: "AIADMK+", topPartySeats: 136, majorOpposition: "DMK+", majorOppositionSeats: 98 },
      { year: 2021, turnoutPercent: 72.8, totalSeats: 234, topParty: "DMK+", topPartySeats: 159, majorOpposition: "AIADMK+", majorOppositionSeats: 75 },
    ],
  },
  {
    stateCode: "KA",
    stateName: "Karnataka",
    elections: [
      { year: 2013, turnoutPercent: 71.4, totalSeats: 224, topParty: "Congress", topPartySeats: 122, majorOpposition: "BJP", majorOppositionSeats: 40 },
      { year: 2018, turnoutPercent: 72.1, totalSeats: 224, topParty: "BJP", topPartySeats: 104, majorOpposition: "Congress", majorOppositionSeats: 80 },
      { year: 2023, turnoutPercent: 73.2, totalSeats: 224, topParty: "Congress", topPartySeats: 135, majorOpposition: "BJP", majorOppositionSeats: 66 },
    ],
  },
  {
    stateCode: "RJ",
    stateName: "Rajasthan",
    elections: [
      { year: 2013, turnoutPercent: 75.1, totalSeats: 200, topParty: "BJP", topPartySeats: 163, majorOpposition: "Congress", majorOppositionSeats: 21 },
      { year: 2018, turnoutPercent: 74.2, totalSeats: 200, topParty: "Congress", topPartySeats: 99, majorOpposition: "BJP", majorOppositionSeats: 73 },
      { year: 2023, turnoutPercent: 74.1, totalSeats: 200, topParty: "BJP", topPartySeats: 115, majorOpposition: "Congress", majorOppositionSeats: 69 },
    ],
  },
  {
    stateCode: "KL",
    stateName: "Kerala",
    elections: [
      { year: 2011, turnoutPercent: 75.1, totalSeats: 140, topParty: "UDF", topPartySeats: 72, majorOpposition: "LDF", majorOppositionSeats: 68 },
      { year: 2016, turnoutPercent: 77.1, totalSeats: 140, topParty: "LDF", topPartySeats: 91, majorOpposition: "UDF", majorOppositionSeats: 47 },
      { year: 2021, turnoutPercent: 74.0, totalSeats: 140, topParty: "LDF", topPartySeats: 99, majorOpposition: "UDF", majorOppositionSeats: 41 },
    ],
  },
  {
    stateCode: "DL",
    stateName: "Delhi (NCT)",
    elections: [
      { year: 2015, turnoutPercent: 67.5, totalSeats: 70, topParty: "AAP", topPartySeats: 67, majorOpposition: "BJP", majorOppositionSeats: 3 },
      { year: 2020, turnoutPercent: 62.6, totalSeats: 70, topParty: "AAP", topPartySeats: 62, majorOpposition: "BJP", majorOppositionSeats: 8 },
      { year: 2025, turnoutPercent: 58.2, totalSeats: 70, topParty: "BJP", topPartySeats: 48, majorOpposition: "AAP", majorOppositionSeats: 22 },
    ],
  },
  {
    stateCode: "GJ",
    stateName: "Gujarat",
    elections: [
      { year: 2012, turnoutPercent: 71.3, totalSeats: 182, topParty: "BJP", topPartySeats: 115, majorOpposition: "Congress", majorOppositionSeats: 61 },
      { year: 2017, turnoutPercent: 68.4, totalSeats: 182, topParty: "BJP", topPartySeats: 99, majorOpposition: "Congress", majorOppositionSeats: 77 },
      { year: 2022, turnoutPercent: 64.3, totalSeats: 182, topParty: "BJP", topPartySeats: 156, majorOpposition: "Congress", majorOppositionSeats: 17 },
    ],
  },
  {
    stateCode: "BR",
    stateName: "Bihar",
    elections: [
      { year: 2010, turnoutPercent: 52.7, totalSeats: 243, topParty: "NDA", topPartySeats: 206, majorOpposition: "RJD+", majorOppositionSeats: 25 },
      { year: 2015, turnoutPercent: 56.7, totalSeats: 243, topParty: "Grand Alliance", topPartySeats: 178, majorOpposition: "NDA", majorOppositionSeats: 58 },
      { year: 2020, turnoutPercent: 57.1, totalSeats: 243, topParty: "NDA", topPartySeats: 125, majorOpposition: "Grand Alliance", majorOppositionSeats: 110 },
    ],
  },
];

export function getHistoricalDataForState(stateCode: string): StateHistoricalData | null {
  return HISTORICAL_DATA.find(d => d.stateCode === stateCode) ?? null;
}
