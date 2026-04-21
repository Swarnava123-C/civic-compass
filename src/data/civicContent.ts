import type { TimelineStage, VotingStep, FAQItem, QuizQuestion, StateInfo } from "@/types/civic";
import { INDIA_STATES } from "./indiaElectionData";

export const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: "registration",
    title: "Voter Registration",
    description: "Citizens enrol in the electoral roll maintained by the Election Commission of India.",
    icon: "📋",
    details: [
      "Check eligibility: Indian citizen, 18+ years on qualifying date",
      "Register online via NVSP portal or Form 6",
      "Submit at local Electoral Registration Officer (ERO)",
      "Verify your name in the voter list before elections",
    ],
    duration: "Ongoing — rolls revised annually; special drives before elections",
    whoIsInvolved: ["Election Commission of India (ECI)", "Electoral Registration Officers", "Booth Level Officers (BLOs)", "Citizens"],
    legalSignificance: "Registration is mandatory to vote. Governed by Representation of the People Act, 1950.",
    citizenRole: "Submit Form 6 with proof of age and residence. Check voter list before elections.",
    requiredDocuments: ["Aadhaar Card / Passport / Driving Licence", "Proof of residence (utility bill, ration card)", "Passport-size photograph", "Form 6 (application for new registration)"],
  },
  {
    id: "nomination",
    title: "Candidate Nomination",
    description: "Candidates file nominations with the Returning Officer and undergo scrutiny.",
    icon: "📝",
    details: [
      "Candidates file nomination papers with prescribed deposit",
      "₹25,000 deposit for Lok Sabha, ₹10,000 for Assembly",
      "Returning Officer scrutinises nominations for validity",
      "Withdrawal period: candidates may withdraw within 2 days of scrutiny",
    ],
    duration: "7–10 days (notification to last date of withdrawal)",
    whoIsInvolved: ["Candidates", "Political parties", "Returning Officers", "ECI"],
    legalSignificance: "Governed by Sections 33-37 of Representation of the People Act, 1951. Invalid nominations are rejected during scrutiny.",
    citizenRole: "Review candidate affidavits disclosing criminal cases, assets, and qualifications on the ECI website.",
  },
  {
    id: "campaign",
    title: "Campaign Period",
    description: "Political parties and candidates campaign to inform and persuade voters.",
    icon: "📣",
    details: [
      "Public rallies, roadshows, and door-to-door campaigns",
      "Campaign ends 48 hours before polling (silence period)",
      "Model Code of Conduct (MCC) enforced by ECI",
      "Social media and electronic media regulated",
    ],
    duration: "2–4 weeks (campaign silence 48 hours before polling)",
    whoIsInvolved: ["Candidates", "Political parties", "ECI", "Media", "Voters"],
    legalSignificance: "Model Code of Conduct restricts government announcements and misuse of state resources. Violations reported to ECI.",
    citizenRole: "Evaluate candidates based on manifestos and track records. Report MCC violations via cVIGIL app.",
  },
  {
    id: "voting",
    title: "Polling Day",
    description: "Voters cast their vote using Electronic Voting Machines (EVMs) at assigned polling stations.",
    icon: "🗳️",
    details: [
      "Polling stations open from 7:00 AM to 6:00 PM",
      "Voter identity verified using EPIC (Voter ID) or 12 approved ID documents",
      "Indelible ink applied on left index finger",
      "Vote cast on EVM; VVPAT slip generated for verification",
    ],
    duration: "1 day (multi-phase in large states)",
    whoIsInvolved: ["Presiding Officers", "Polling Officers", "Security forces", "Voters", "Polling agents of candidates"],
    legalSignificance: "Voting is a constitutional right under Article 326. Booth capturing and impersonation are criminal offences.",
    citizenRole: "Carry valid photo ID. Go to assigned polling station. Press the button for your chosen candidate on the EVM.",
    requiredDocuments: ["EPIC (Voter ID Card)", "Or any of 12 approved IDs: Aadhaar, Passport, DL, PAN, etc."],
  },
  {
    id: "counting",
    title: "Counting & Verification",
    description: "EVMs are stored securely and counted on the designated counting day.",
    icon: "📊",
    details: [
      "Strong rooms sealed and guarded 24/7 until counting day",
      "Counting under CCTV surveillance with candidates' agents",
      "VVPAT slips of 5 random booths per constituency are cross-verified",
      "Results announced constituency by constituency",
    ],
    duration: "Counting day (usually 3–4 days after last phase of polling)",
    whoIsInvolved: ["Returning Officers", "Counting agents", "ECI observers", "Security forces"],
    legalSignificance: "Any candidate can request a recount. VVPAT verification ensures EVM integrity.",
    citizenRole: "Follow results on the ECI Results portal. Report any irregularities to the ECI.",
  },
  {
    id: "results",
    title: "Results & Government Formation",
    description: "Winning candidates are declared and the process of government formation begins.",
    icon: "🏛️",
    details: [
      "ECI declares official results and issues certificates to winners",
      "Winning party/coalition with majority invited to form government",
      "Oath of office administered by President (PM) or Governor (CM)",
      "Election petitions may be filed in High Court within 45 days",
    ],
    duration: "1–2 weeks after counting",
    whoIsInvolved: ["ECI", "President/Governor", "Winning candidates", "Courts"],
    legalSignificance: "Election results are legally binding. Disputes resolved through election petitions under RPA 1951.",
    citizenRole: "Verify results from ECI website. Understand the government formation process. Hold elected representatives accountable.",
  },
];

export const VOTING_STEPS: VotingStep[] = [
  {
    id: "registration",
    title: "Enrolment",
    description: "Register as a voter with the Election Commission of India.",
    responsibilities: [
      "ECI maintains the electoral roll",
      "BLOs conduct door-to-door verification",
    ],
    userActions: [
      "Apply via NVSP portal (nvsp.in) or Form 6",
      "Check voter list at CEO state website",
      "Get your EPIC (Voter ID Card)",
    ],
    icon: "📋",
  },
  {
    id: "verification",
    title: "Identity Check",
    description: "Your identity is verified at the polling station before voting.",
    responsibilities: [
      "Presiding Officer verifies voter against roll",
      "Indelible ink applied after verification",
    ],
    userActions: [
      "Carry EPIC or any approved photo ID",
      "Know your polling booth number (check via Voter Helpline app)",
      "Arrive during polling hours (7 AM – 6 PM)",
    ],
    icon: "🔍",
  },
  {
    id: "voting-step",
    title: "Casting Vote",
    description: "Cast your vote on the EVM in a private voting compartment.",
    responsibilities: [
      "Officials ensure secrecy of ballot",
      "EVM and VVPAT machines are tested before polling",
    ],
    userActions: [
      "Press the button next to your chosen candidate on the EVM",
      "Check the VVPAT slip to verify your vote",
      "Exit the polling station after voting",
    ],
    icon: "✅",
  },
  {
    id: "counting-step",
    title: "Counting",
    description: "Votes are counted on the designated counting day.",
    responsibilities: [
      "Returning Officers supervise the counting process",
      "Agents from all candidates observe counting",
    ],
    userActions: [
      "Follow results on results.eci.gov.in",
      "Report irregularities to ECI",
    ],
    icon: "🔢",
  },
  {
    id: "result-step",
    title: "Result",
    description: "Official results declared and government formation begins.",
    responsibilities: [
      "ECI certifies results and issues certificates",
      "Courts handle election petitions",
    ],
    userActions: [
      "Verify results from ECI portal",
      "Hold your elected representative accountable",
    ],
    icon: "🏆",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I register to vote in India?",
    answer: "You can register through the National Voters' Service Portal (NVSP) at nvsp.in by filling Form 6. You need to be an Indian citizen, at least 18 years old on the qualifying date, and a resident of the constituency. You can also register through the Voter Helpline App or visit your local Electoral Registration Officer (ERO).",
    category: "Registration",
  },
  {
    question: "What is an EVM and VVPAT?",
    answer: "An Electronic Voting Machine (EVM) is used to record votes in Indian elections. It has a control unit and a ballot unit. The VVPAT (Voter Verifiable Paper Audit Trail) is attached to the EVM and prints a slip showing your vote for 7 seconds, which then drops into a sealed box. This allows voters to verify their vote was recorded correctly.",
    category: "Process",
  },
  {
    question: "What types of elections are held in India?",
    answer: "India conducts: Lok Sabha elections (Parliamentary, every 5 years), Rajya Sabha elections (Upper House, indirect by MLAs), State Assembly (Vidhan Sabha) elections, Local body elections (Panchayat, Municipal), and By-elections to fill casual vacancies. The ECI conducts Lok Sabha and state elections; State Election Commissions handle local body elections.",
    category: "Overview",
  },
  {
    question: "What is the Model Code of Conduct?",
    answer: "The Model Code of Conduct (MCC) is a set of guidelines issued by the Election Commission that comes into force the moment elections are announced. It governs the conduct of political parties, candidates, and the government to ensure free and fair elections. The ruling party cannot announce new schemes, make ad hoc appointments, or use government machinery for campaigning.",
    category: "Process",
  },
  {
    question: "What documents are valid voter ID at polling stations?",
    answer: "Apart from the EPIC (Voter ID Card), 12 other documents are accepted: Aadhaar Card, MNREGA Job Card, Passbook with photo issued by bank/post office, Health Insurance Smart Card, Driving Licence, PAN Card, Smart Card issued by RGI, Indian Passport, Pension document with photo, Service Identity Card from government/PSU, Official identity card by MPs/MLAs/MLCs, and Property document with photo.",
    category: "Registration",
  },
  {
    question: "Can I vote from a different city?",
    answer: "Currently, you must vote at the polling station assigned to your constituency based on your registered address. However, the ECI has been exploring Remote Electronic Voting for domestic migrants. Service voters (military, diplomatic staff) can use postal ballots. If you've moved permanently, update your registration to your new address via Form 6.",
    category: "Registration",
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Who appoints the Chief Election Commissioner of India?",
    options: [
      "The Prime Minister",
      "The President of India",
      "The Supreme Court",
      "The Parliament",
    ],
    correctIndex: 1,
    explanation: "The Chief Election Commissioner and other Election Commissioners are appointed by the President of India as per Article 324 of the Constitution.",
  },
  {
    id: "q2",
    question: "What is the minimum age to vote in India?",
    options: [
      "16 years",
      "18 years",
      "21 years",
      "25 years",
    ],
    correctIndex: 1,
    explanation: "The 61st Amendment Act of 1988 reduced the voting age from 21 to 18 years. You must be 18 on the qualifying date (1st January of the revision year).",
  },
  {
    id: "q3",
    question: "How many seats are there in the Lok Sabha?",
    options: [
      "500",
      "543",
      "545",
      "552",
    ],
    correctIndex: 1,
    explanation: "The Lok Sabha has a maximum of 543 elected members from territorial constituencies, plus 2 nominated Anglo-Indian members (removed by 104th Amendment in 2020).",
  },
  {
    id: "q4",
    question: "What is NOTA in Indian elections?",
    options: [
      "A type of ballot paper",
      "A political party",
      "None of the Above — option to reject all candidates",
      "An election monitoring committee",
    ],
    correctIndex: 2,
    explanation: "NOTA (None of the Above) was introduced by the Supreme Court in 2013. It allows voters to express disapproval of all candidates. However, even if NOTA gets the most votes, the candidate with the next highest votes wins.",
  },
  {
    id: "q5",
    question: "What does EVM stand for?",
    options: [
      "Electronic Vote Manager",
      "Electronic Voting Machine",
      "Election Verification Module",
      "Electoral Vote Mechanism",
    ],
    correctIndex: 1,
    explanation: "Electronic Voting Machine (EVM) was first used in 1982 in the Paravur Assembly constituency of Kerala and has been used nationwide since 2004.",
  },
  {
    id: "q6",
    question: "Which article of the Indian Constitution establishes the Election Commission?",
    options: [
      "Article 312",
      "Article 280",
      "Article 324",
      "Article 356",
    ],
    correctIndex: 2,
    explanation: "Article 324 of the Constitution vests the superintendence, direction, and control of elections in the Election Commission of India.",
  },
  {
    id: "q7",
    question: "How long before polling must campaigning stop?",
    options: [
      "24 hours",
      "48 hours",
      "72 hours",
      "12 hours",
    ],
    correctIndex: 1,
    explanation: "Under Section 126 of the Representation of People Act, 1951, election campaigning must stop 48 hours before the polling hour.",
  },
  {
    id: "q8",
    question: "What is the deposit amount for contesting Lok Sabha elections?",
    options: [
      "₹10,000",
      "₹15,000",
      "₹25,000",
      "₹50,000",
    ],
    correctIndex: 2,
    explanation: "General category candidates must deposit ₹25,000 for Lok Sabha and ₹10,000 for State Assembly elections. SC/ST candidates pay half these amounts.",
  },
];

// Re-export Indian states/UTs as the state list
export const INDIA_STATES_LIST: StateInfo[] = INDIA_STATES.map((s) => ({
  name: s.name,
  code: s.code,
}));

// Keep backward compat alias
export const US_STATES = INDIA_STATES_LIST;
