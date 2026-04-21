import type { TimelineStage, VotingStep, FAQItem, QuizQuestion, StateInfo } from "@/types/civic";

export const TIMELINE_STAGES: TimelineStage[] = [
  {
    id: "announcement",
    title: "Announcement",
    description: "The election commission officially announces the upcoming election and sets key dates.",
    icon: "📢",
    details: [
      "Official notification published in gazette",
      "Election schedule released to public",
      "Voter rolls preparation begins",
      "Political parties notified formally",
    ],
    duration: "Weeks before nomination",
  },
  {
    id: "nomination",
    title: "Nomination",
    description: "Candidates formally file their nominations and are vetted for eligibility.",
    icon: "📝",
    details: [
      "Candidates submit nomination papers",
      "Background and eligibility checks conducted",
      "Candidate lists published publicly",
      "Withdrawal period opens briefly",
    ],
    duration: "1–2 weeks",
  },
  {
    id: "campaign",
    title: "Campaign",
    description: "Candidates and parties campaign to inform voters about their platforms.",
    icon: "📣",
    details: [
      "Public rallies and town halls held",
      "Media advertisements air",
      "Debates may be organized",
      "Campaign finance rules enforced",
    ],
    duration: "2–6 weeks",
  },
  {
    id: "voting",
    title: "Voting",
    description: "Registered voters cast their ballots at designated polling stations.",
    icon: "🗳️",
    details: [
      "Polling stations open at scheduled times",
      "Voters verify identity and receive ballot",
      "Secret ballot cast in private booth",
      "Ballots secured in sealed boxes or machines",
    ],
    duration: "1 day (may span multiple days)",
  },
  {
    id: "counting",
    title: "Counting",
    description: "Votes are counted under observation of party representatives and observers.",
    icon: "📊",
    details: [
      "Ballot boxes opened under supervision",
      "Votes tallied by trained officials",
      "Observers from parties monitor process",
      "Results compiled constituency by constituency",
    ],
    duration: "Hours to days",
  },
  {
    id: "results",
    title: "Results",
    description: "Official results are announced and the electoral process concludes.",
    icon: "🏛️",
    details: [
      "Official results declared publicly",
      "Winners certified by election authority",
      "Legal challenge window opens",
      "Transition process begins",
    ],
    duration: "Days after counting",
  },
];

export const VOTING_STEPS: VotingStep[] = [
  {
    id: "registration",
    title: "Registration",
    description: "Ensure you are registered as an eligible voter in your constituency.",
    responsibilities: [
      "Election commission maintains voter registry",
      "Local authorities verify residency",
    ],
    userActions: [
      "Check your registration status online or at local office",
      "Register if not already on the rolls",
      "Update your address if you've moved",
    ],
    icon: "📋",
  },
  {
    id: "verification",
    title: "Verification",
    description: "Your identity and eligibility are confirmed before you can vote.",
    responsibilities: [
      "Polling officials verify voter identity",
      "Cross-check against voter rolls",
    ],
    userActions: [
      "Bring valid photo identification",
      "Know your assigned polling station",
      "Arrive during designated hours",
    ],
    icon: "🔍",
  },
  {
    id: "voting-step",
    title: "Voting",
    description: "Cast your ballot in a private and secure manner.",
    responsibilities: [
      "Officials ensure ballot secrecy",
      "Security maintained at polling station",
    ],
    userActions: [
      "Receive your ballot from the official",
      "Mark your choice in the private booth",
      "Deposit your ballot in the designated box",
    ],
    icon: "✅",
  },
  {
    id: "counting-step",
    title: "Counting",
    description: "Ballots are counted transparently with observers present.",
    responsibilities: [
      "Election officials conduct the count",
      "Party agents observe the process",
    ],
    userActions: [
      "You may follow results through official channels",
      "Report any irregularities you witnessed",
    ],
    icon: "🔢",
  },
  {
    id: "result-step",
    title: "Result",
    description: "Official results are announced and certified.",
    responsibilities: [
      "Election commission certifies outcomes",
      "Courts handle any disputes",
    ],
    userActions: [
      "Check official results from trusted sources",
      "Understand your right to petition if needed",
    ],
    icon: "🏆",
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How does voter registration work?",
    answer: "Voter registration is the process by which eligible citizens enroll in the electoral roll. You typically need to provide proof of identity, age, and residency. Registration can be done online, by mail, or in person at designated offices. Deadlines vary by jurisdiction.",
    category: "Registration",
  },
  {
    question: "What happens after voting?",
    answer: "After polls close, ballots are securely transported to counting centers. Trained officials count votes under the observation of party representatives and independent monitors. Results are compiled and officially announced by the election authority.",
    category: "Process",
  },
  {
    question: "What types of elections exist?",
    answer: "Common types include: General/Parliamentary elections (national legislature), Presidential elections, Local/Municipal elections, Primary elections (party candidate selection), Referendums (direct vote on specific issues), and By-elections (filling vacant seats).",
    category: "Overview",
  },
  {
    question: "Why do elections matter?",
    answer: "Elections are a fundamental mechanism of democratic governance. They allow citizens to choose their representatives, hold leaders accountable, express policy preferences, and participate in the democratic process. Regular, free, and fair elections are considered essential to legitimate governance.",
    category: "Overview",
  },
  {
    question: "What is a ballot?",
    answer: "A ballot is the medium used to cast a vote. It can be a paper form listing candidates/options, an electronic touchscreen, or a mail-in form. The ballot is designed to maintain voter secrecy while accurately recording choices.",
    category: "Process",
  },
  {
    question: "Can I vote if I'm abroad?",
    answer: "Many countries offer absentee or overseas voting options. This may include postal voting, voting at embassies/consulates, or electronic voting in some jurisdictions. Requirements and availability vary by country — check with your national election authority.",
    category: "Registration",
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the primary purpose of an election?",
    options: [
      "To entertain the public",
      "To allow citizens to choose representatives",
      "To generate revenue for the government",
      "To test citizens' knowledge",
    ],
    correctIndex: 1,
    explanation: "Elections serve as the primary mechanism for citizens to select their government representatives in a democracy.",
  },
  {
    id: "q2",
    question: "What ensures vote secrecy at polling stations?",
    options: [
      "Open counting",
      "Private voting booths",
      "Public ballot display",
      "Verbal voting",
    ],
    correctIndex: 1,
    explanation: "Private voting booths are provided at polling stations to ensure that each voter can mark their ballot without being observed.",
  },
  {
    id: "q3",
    question: "Who typically oversees the election process?",
    options: [
      "The ruling party",
      "An independent election commission",
      "The military",
      "Private companies",
    ],
    correctIndex: 1,
    explanation: "Most democracies establish an independent election commission to ensure impartiality and fairness in the electoral process.",
  },
  {
    id: "q4",
    question: "What is a referendum?",
    options: [
      "A type of tax",
      "A court ruling",
      "A direct vote on a specific issue",
      "A party nomination",
    ],
    correctIndex: 2,
    explanation: "A referendum allows citizens to vote directly on a specific policy question or constitutional matter.",
  },
  {
    id: "q5",
    question: "What should you bring to a polling station?",
    options: [
      "Your social media password",
      "Valid photo identification",
      "A campaign poster",
      "Cash for payment",
    ],
    correctIndex: 1,
    explanation: "Valid photo identification is typically required to verify your identity before you can receive a ballot.",
  },
];

export const US_STATES: StateInfo[] = [
  { name: "Alabama", code: "AL" }, { name: "Alaska", code: "AK" },
  { name: "Arizona", code: "AZ" }, { name: "Arkansas", code: "AR" },
  { name: "California", code: "CA" }, { name: "Colorado", code: "CO" },
  { name: "Connecticut", code: "CT" }, { name: "Delaware", code: "DE" },
  { name: "Florida", code: "FL" }, { name: "Georgia", code: "GA" },
  { name: "Hawaii", code: "HI" }, { name: "Idaho", code: "ID" },
  { name: "Illinois", code: "IL" }, { name: "Indiana", code: "IN" },
  { name: "Iowa", code: "IA" }, { name: "Kansas", code: "KS" },
  { name: "Kentucky", code: "KY" }, { name: "Louisiana", code: "LA" },
  { name: "Maine", code: "ME" }, { name: "Maryland", code: "MD" },
  { name: "Massachusetts", code: "MA" }, { name: "Michigan", code: "MI" },
  { name: "Minnesota", code: "MN" }, { name: "Mississippi", code: "MS" },
  { name: "Missouri", code: "MO" }, { name: "Montana", code: "MT" },
  { name: "Nebraska", code: "NE" }, { name: "Nevada", code: "NV" },
  { name: "New Hampshire", code: "NH" }, { name: "New Jersey", code: "NJ" },
  { name: "New Mexico", code: "NM" }, { name: "New York", code: "NY" },
  { name: "North Carolina", code: "NC" }, { name: "North Dakota", code: "ND" },
  { name: "Ohio", code: "OH" }, { name: "Oklahoma", code: "OK" },
  { name: "Oregon", code: "OR" }, { name: "Pennsylvania", code: "PA" },
  { name: "Rhode Island", code: "RI" }, { name: "South Carolina", code: "SC" },
  { name: "South Dakota", code: "SD" }, { name: "Tennessee", code: "TN" },
  { name: "Texas", code: "TX" }, { name: "Utah", code: "UT" },
  { name: "Vermont", code: "VT" }, { name: "Virginia", code: "VA" },
  { name: "Washington", code: "WA" }, { name: "West Virginia", code: "WV" },
  { name: "Wisconsin", code: "WI" }, { name: "Wyoming", code: "WY" },
];
