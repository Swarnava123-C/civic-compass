export interface LearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  content: string[];
  quiz: LearningQuiz[];
}

export interface LearningQuiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface LearningLevel {
  id: string;
  name: string;
  badge: string;
  badgeIcon: string;
  modules: LearningModule[];
}

export const LEARNING_LEVELS: LearningLevel[] = [
  {
    id: "beginner",
    name: "Beginner",
    badge: "Civic Explorer",
    badgeIcon: "🌱",
    modules: [
      {
        id: "b1",
        title: "What is Democracy?",
        description: "Understanding the basics of democratic governance",
        icon: "🏛",
        content: [
          "Democracy means 'rule by the people'. In India, citizens choose their leaders through elections.",
          "India is the world's largest democracy with over 900 million eligible voters.",
          "Every citizen aged 18 and above has the right to vote, regardless of caste, religion, or gender.",
          "Elections are conducted by the Election Commission of India (ECI), an independent constitutional body.",
        ],
        quiz: [
          { question: "What is the minimum voting age in India?", options: ["16", "18", "21", "25"], correctIndex: 1, explanation: "The 61st Amendment Act of 1988 lowered the voting age from 21 to 18 years." },
          { question: "Who conducts elections in India?", options: ["Supreme Court", "Parliament", "Election Commission of India", "President"], correctIndex: 2, explanation: "The ECI is an autonomous constitutional body responsible for administering elections." },
          { question: "India is the world's _____ democracy.", options: ["oldest", "smallest", "largest", "newest"], correctIndex: 2, explanation: "With over 900 million eligible voters, India is the world's largest democracy." },
        ],
      },
      {
        id: "b2",
        title: "Types of Elections",
        description: "Lok Sabha, Vidhan Sabha, and Local Body elections",
        icon: "🗳",
        content: [
          "Lok Sabha elections choose members of Parliament for the lower house (543 seats).",
          "Vidhan Sabha (State Assembly) elections choose representatives for state legislatures.",
          "Panchayat and Municipal elections handle local governance in rural and urban areas.",
          "Rajya Sabha members are elected by state legislators, not directly by citizens.",
        ],
        quiz: [
          { question: "How many seats are in the Lok Sabha?", options: ["245", "543", "403", "288"], correctIndex: 1, explanation: "The Lok Sabha has 543 elected seats across India." },
          { question: "Who elects Rajya Sabha members?", options: ["Citizens directly", "State legislators", "Lok Sabha MPs", "President"], correctIndex: 1, explanation: "Rajya Sabha members are elected by elected members of State Legislative Assemblies." },
          { question: "Which election is for state-level governance?", options: ["Lok Sabha", "Rajya Sabha", "Vidhan Sabha", "Panchayat"], correctIndex: 2, explanation: "Vidhan Sabha (State Assembly) elections determine the state government." },
        ],
      },
      {
        id: "b3",
        title: "Your Voter ID",
        description: "EPIC card and voter registration basics",
        icon: "🪪",
        content: [
          "EPIC (Electors Photo Identity Card) is your Voter ID — proof of your right to vote.",
          "You can register online at nvsp.in using Form 6.",
          "You need: proof of age, proof of address, and a passport-size photo.",
          "Your name must be on the electoral roll of your constituency to vote.",
        ],
        quiz: [
          { question: "What is EPIC?", options: ["Election law", "Voter ID card", "Voting machine", "Political party"], correctIndex: 1, explanation: "EPIC stands for Electors Photo Identity Card — your Voter ID." },
          { question: "Which form is used for voter registration?", options: ["Form 1", "Form 6", "Form 8", "Form 10"], correctIndex: 1, explanation: "Form 6 is used for new voter registration on nvsp.in." },
        ],
      },
      {
        id: "b4",
        title: "Polling Day Basics",
        description: "What happens when you go to vote",
        icon: "📍",
        content: [
          "On polling day, go to your assigned polling booth with your Voter ID.",
          "Your identity is verified, and your finger is marked with indelible ink.",
          "You press a button on the EVM (Electronic Voting Machine) next to your chosen candidate.",
          "Your vote is secret — no one can see whom you voted for.",
        ],
        quiz: [
          { question: "What machine is used for voting in India?", options: ["Ballot box", "EVM", "Computer", "Scanner"], correctIndex: 1, explanation: "India uses Electronic Voting Machines (EVMs) in elections." },
          { question: "Why is indelible ink used?", options: ["For fun", "To prevent double voting", "For identification", "Legal requirement only"], correctIndex: 1, explanation: "Indelible ink prevents a person from voting more than once." },
        ],
      },
      {
        id: "b5",
        title: "NOTA — None of the Above",
        description: "Your right to reject all candidates",
        icon: "✋",
        content: [
          "NOTA allows voters to express disapproval of all contesting candidates.",
          "It was introduced by the Supreme Court in 2013.",
          "NOTA votes are counted but a NOTA 'win' doesn't invalidate the election.",
          "Using NOTA is a valid democratic expression — not a wasted vote.",
        ],
        quiz: [
          { question: "When was NOTA introduced?", options: ["2009", "2013", "2019", "2004"], correctIndex: 1, explanation: "The Supreme Court introduced NOTA via the PUCL vs Union of India case in 2013." },
          { question: "If NOTA gets the most votes, what happens?", options: ["Election cancelled", "Re-election ordered", "Next highest candidate wins", "NOTA wins"], correctIndex: 2, explanation: "Currently, NOTA is symbolic — the candidate with the next highest votes still wins." },
        ],
      },
    ],
  },
  {
    id: "intermediate",
    name: "Intermediate",
    badge: "Election Analyst",
    badgeIcon: "📊",
    modules: [
      {
        id: "i1",
        title: "First-Past-The-Post",
        description: "How India's FPTP voting system works",
        icon: "🏁",
        content: [
          "In FPTP, the candidate with the most votes in a constituency wins — no majority needed.",
          "This means a candidate can win with just 30% of votes if others split the rest.",
          "FPTP tends to produce clear majorities but may not proportionally represent votes.",
          "All 543 Lok Sabha and state assembly seats use the FPTP system.",
        ],
        quiz: [
          { question: "In FPTP, does a candidate need 50%+ to win?", options: ["Yes, always", "No, just the most votes", "Only in Lok Sabha", "Depends on state"], correctIndex: 1, explanation: "In FPTP, the candidate with the most votes wins, even without a majority." },
          { question: "A criticism of FPTP is:", options: ["Too slow", "Disproportionate representation", "Too complex", "Requires technology"], correctIndex: 1, explanation: "FPTP can lead to parties getting many seats with a small vote share, or few seats with a large share." },
        ],
      },
      {
        id: "i2",
        title: "Model Code of Conduct",
        description: "Rules parties must follow during elections",
        icon: "📜",
        content: [
          "The MCC is a set of guidelines for parties and candidates during elections.",
          "It comes into effect from the date of election announcement until results.",
          "No government can announce new policies or projects during MCC.",
          "Violations are monitored by the ECI and can lead to action against candidates.",
        ],
        quiz: [
          { question: "When does MCC start?", options: ["Polling day", "Nomination day", "Date of announcement", "Counting day"], correctIndex: 2, explanation: "MCC kicks in from the moment elections are announced by the ECI." },
          { question: "Can the government launch new schemes during MCC?", options: ["Yes", "No", "Only central govt", "Only state govt"], correctIndex: 1, explanation: "No new policies or schemes can be announced during MCC to prevent voter influence." },
        ],
      },
      {
        id: "i3",
        title: "EVM & VVPAT",
        description: "Electronic voting technology and verification",
        icon: "🖥",
        content: [
          "EVMs are standalone, battery-operated machines — not connected to any network.",
          "VVPAT (Voter Verifiable Paper Audit Trail) prints a slip showing your vote for 7 seconds.",
          "VVPAT slips are matched with EVM counts in randomly selected booths for verification.",
          "EVMs have been used in India since 1998 and are manufactured by BEL and ECIL.",
        ],
        quiz: [
          { question: "Are EVMs connected to the internet?", options: ["Yes", "No", "Only during counting", "Depends on booth"], correctIndex: 1, explanation: "EVMs are completely standalone — no internet, Wi-Fi, or Bluetooth connectivity." },
          { question: "What does VVPAT do?", options: ["Counts votes", "Prints verification slip", "Connects to server", "Stores data"], correctIndex: 1, explanation: "VVPAT prints a paper slip so voters can verify their vote was recorded correctly." },
        ],
      },
      {
        id: "i4",
        title: "Anti-Defection Law",
        description: "The 10th Schedule of the Constitution",
        icon: "⚖",
        content: [
          "The Anti-Defection Law (1985) penalizes legislators who switch parties.",
          "A member is disqualified if they voluntarily give up party membership or vote against party direction.",
          "Exception: if one-third of a party merges with another (now two-thirds after amendment).",
          "The Speaker of the House decides disqualification cases under this law.",
        ],
        quiz: [
          { question: "What does the Anti-Defection Law prevent?", options: ["Corruption", "Party switching", "Election rigging", "Voter fraud"], correctIndex: 1, explanation: "It penalizes elected members who switch parties or vote against party direction." },
        ],
      },
      {
        id: "i5",
        title: "Election Finance",
        description: "Campaign spending rules and transparency",
        icon: "💰",
        content: [
          "Candidates have spending limits: ~₹95 lakh for Lok Sabha, ~₹40 lakh for Assembly.",
          "Electoral Bonds were a donation mechanism from 2018–2024 (struck down by Supreme Court).",
          "All donations above ₹20,000 must be disclosed to the Election Commission.",
          "The ECI monitors campaign expenses through expenditure observers.",
        ],
        quiz: [
          { question: "Approximate Lok Sabha candidate spending limit:", options: ["₹10 lakh", "₹50 lakh", "₹95 lakh", "No limit"], correctIndex: 2, explanation: "ECI sets spending limits around ₹95 lakh for Lok Sabha candidates (varies by state)." },
        ],
      },
    ],
  },
  {
    id: "advanced",
    name: "Advanced",
    badge: "Democracy Mentor",
    badgeIcon: "🎓",
    modules: [
      {
        id: "a1",
        title: "Delimitation Commission",
        description: "How constituency boundaries are drawn",
        icon: "🗺",
        content: [
          "The Delimitation Commission redraws constituency boundaries based on census data.",
          "It is a high-powered body whose orders have the force of law and cannot be challenged in court.",
          "Last major delimitation was in 2002, based on the 2001 Census (except J&K in 2022).",
          "Delimitation affects representation: states with slower population growth may lose relative seats.",
        ],
        quiz: [
          { question: "Can Delimitation Commission orders be challenged in court?", options: ["Yes", "No", "Only in Supreme Court", "Only by Parliament"], correctIndex: 1, explanation: "Delimitation orders have the force of law and cannot be questioned in any court." },
        ],
      },
      {
        id: "a2",
        title: "Representation of the People Act",
        description: "The legal framework governing Indian elections",
        icon: "📖",
        content: [
          "RPA 1950 deals with preparation of electoral rolls and seat allocation.",
          "RPA 1951 deals with conduct of elections, election disputes, and qualifications.",
          "Corrupt practices include bribery, undue influence, and promoting enmity.",
          "Election petitions can be filed in High Courts within 45 days of results.",
        ],
        quiz: [
          { question: "RPA 1951 primarily deals with:", options: ["Voter registration", "Conduct of elections", "Census", "Delimitation"], correctIndex: 1, explanation: "RPA 1951 governs the conduct of elections, disputes, and qualifications/disqualifications." },
        ],
      },
      {
        id: "a3",
        title: "Constitutional Provisions",
        description: "Articles governing elections in the Indian Constitution",
        icon: "🏛",
        content: [
          "Article 324: Superintendence of elections vested in ECI.",
          "Article 325: No person ineligible for electoral roll on grounds of religion, race, caste, or sex.",
          "Article 326: Elections to Lok Sabha and Assemblies on basis of adult suffrage.",
          "Articles 327-329: Parliament's power to make laws regarding elections.",
        ],
        quiz: [
          { question: "Which Article vests election superintendence in ECI?", options: ["Article 14", "Article 324", "Article 356", "Article 370"], correctIndex: 1, explanation: "Article 324 vests the superintendence, direction, and control of elections in the ECI." },
        ],
      },
      {
        id: "a4",
        title: "Election Disputes & Petitions",
        description: "Legal remedies after elections",
        icon: "⚖",
        content: [
          "An election petition must be filed within 45 days from the date of election result.",
          "Only a candidate or an elector can file an election petition.",
          "Grounds: corrupt practices, non-compliance with provisions, improper acceptance/rejection of nominations.",
          "The High Court is the court of first instance; appeal lies with the Supreme Court.",
        ],
        quiz: [
          { question: "Where is an election petition first filed?", options: ["District Court", "High Court", "Supreme Court", "ECI"], correctIndex: 1, explanation: "Election petitions are filed in the High Court of the respective state." },
        ],
      },
      {
        id: "a5",
        title: "Electoral Reforms Debate",
        description: "Ongoing discussions about improving India's electoral system",
        icon: "💡",
        content: [
          "Simultaneous elections (One Nation One Election) is a major reform proposal.",
          "State funding of elections aims to reduce the influence of money power.",
          "Right to recall allows voters to remove non-performing representatives (proposed, not implemented).",
          "Proportional representation vs FPTP debate continues among constitutional experts.",
        ],
        quiz: [
          { question: "'One Nation One Election' proposes:", options: ["One party rule", "Simultaneous Lok Sabha & Assembly elections", "Abolishing states", "Digital voting"], correctIndex: 1, explanation: "It proposes holding Lok Sabha and all state assembly elections simultaneously to reduce costs." },
        ],
      },
    ],
  },
];
