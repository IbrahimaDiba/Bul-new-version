// Types for the Basketball University League Website

export interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
  jerseyNumber: number;
  height: string;
  weight: string;
  year: string;
  hometown: string;
  avatar: string;
  dateOfBirth?: string;    // ex: '2002-05-14'
  playerClass?: string;   // ex: 'Licence 2', 'Master 1'
  stats: PlayerStats;
  achievements?: Achievement[];
  socialMedia?: SocialMedia;
  draftInfo?: DraftInfo;
  injuryStatus?: InjuryStatus;
  media?: PlayerMedia;
  shotChart?: ShotChart;
  detailedStats?: DetailedPlayerStats;
}

export interface PlayerStats {
  ppg: number; // Points per game
  rpg: number; // Rebounds per game
  apg: number; // Assists per game
  spg: number; // Steals per game
  bpg: number; // Blocks per game
  fgp: number; // Field goal percentage
  tpp: number; // Three-point percentage
  ftp: number; // Free throw percentage
  // NBA-style advanced stats
  per?: number; // Player Efficiency Rating
  ts?: number; // True Shooting percentage
  usg?: number; // Usage Rate
  ws?: number; // Win Shares
  vorp?: number; // Value Over Replacement Player
  plusMinus?: number; // Plus/Minus rating
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'award' | 'record' | 'milestone';
  image?: string;
}

export interface SocialMedia {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
}

export interface DraftInfo {
  year: number;
  round: number;
  pick: number;
  team: string;
}

export interface InjuryStatus {
  status: 'active' | 'out' | 'day-to-day' | 'injured';
  type?: string;
  expectedReturn?: string;
  description?: string;
}

export interface Team {
  id: string;
  name: string;
  mascot: string;
  abbreviation: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  conference: string;
  record: string;
  standing: number;
  roster: Player[];
  // NBA-style additions
  stats?: TeamStats;
  arena?: Arena;
  socialMedia?: SocialMedia;
  achievements?: Achievement[];
  history?: TeamHistory;
}

export interface TeamStats {
  wins: number;
  losses: number;
  winPercentage: number;
  pointsFor: number;
  pointsAgainst: number;
  streak: string;
  homeRecord: string;
  awayRecord: string;
  conferenceRecord: string;
  lastTenGames: string;
}

export interface Arena {
  name: string;
  location: string;
  capacity: number;
  yearOpened: number;
  surface: string;
  image?: string;
}

export interface TeamHistory {
  founded: number;
  championships: number;
  conferenceTitles: number;
  retiredNumbers: string[];
  hallOfFamers: string[];
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore?: number;
  awayScore?: number;
  date: string;
  time: string;
  venue: string;
  isFeatured: boolean;
  isCompleted: boolean;
  // NBA-style additions
  status?: 'scheduled' | 'live' | 'completed' | 'postponed' | 'cancelled';
  broadcast?: BroadcastInfo;
  stats?: GameStats;
  highlights?: string[];
  /** YouTube embed URL (e.g. https://www.youtube.com/embed/VIDEO_ID) */
  highlightVideoUrl?: string;
  officials?: string[];
}

export interface PlayerGameStats {
  playerId: string;
  name: string;
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
}

export interface BroadcastInfo {
  network: string;
  commentators: string[];
  streamUrl?: string;
}

export interface GameStats {
  attendance?: number;
  duration?: string;
  leadChanges?: number;
  timesTied?: number;
  largestLead?: number;
  quarters?: QuarterStats[];
  playerStats?: {
    home: PlayerGameStats[];
    away: PlayerGameStats[];
  };
}

export interface QuarterStats {
  quarter: number;
  homeScore: number;
  awayScore: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: 'player' | 'team' | 'league' | 'general';
  // NBA-style additions
  tags?: string[];
  featured?: boolean;
  views?: number;
  comments?: number;
  relatedArticles?: string[];
  videoUrl?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  team?: string;
  player?: string;
  sizes?: string[];
  colors?: string[];
  inStock: boolean;
  featured: boolean;
  isNew?: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  benefits: string[];
}

export interface OrderItem {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  priceAtPurchase: number;
  name: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'season' | 'game';
  date?: string;
  venue?: string;
  inStock: boolean;
}

export type NavItem = {
  title: string;
  href: string;
  subItems?: NavItem[];
};

export interface PlayerMedia {
  photos: Photo[];
  videos: Video[];
  highlights: Highlight[];
  socialMediaPosts: SocialMediaPost[];
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  date: string;
  category: 'game' | 'practice' | 'off-court' | 'award';
  tags: string[];
}

export interface Video {
  id: string;
  url: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  date: string;
  category: 'game' | 'highlight' | 'interview' | 'training';
}

export interface Highlight {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  date: string;
  gameId?: string;
  type: 'dunk' | 'three' | 'assist' | 'block' | 'steal' | 'clutch';
}

export interface SocialMediaPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'facebook' | 'youtube';
  url: string;
  content: string;
  date: string;
  likes: number;
  comments: number;
  shares: number;
}

export interface ShotChart {
  season: string;
  zones: ShotZone[];
  summary: ShotSummary;
}

export interface ShotZone {
  zone: 'paint' | 'mid-range-left' | 'mid-range-right' | 'corner-three-left' | 'corner-three-right' | 'wing-three-left' | 'wing-three-right' | 'top-three';
  made: number;
  attempted: number;
  percentage: number;
  coordinates: {
    x: number;
    y: number;
  }[];
}

export interface ShotSummary {
  totalShots: number;
  totalMade: number;
  overallPercentage: number;
  hotZones: string[];
  coldZones: string[];
  mostFrequentZone: string;
  mostEfficientZone: string;
}

export interface DetailedPlayerStats {
  season: string;
  gameLog: GameLog[];
  shootingSplits: ShootingSplits;
  advancedStats: AdvancedStats;
  matchupStats: MatchupStats[];
}

export interface GameLog {
  gameId: string;
  date: string;
  opponent: string;
  result: 'W' | 'L';
  minutes: number;
  points: number;
  rebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  plusMinus: number;
  shooting: {
    fg: string;
    three: string;
    ft: string;
  };
}

export interface ShootingSplits {
  byQuarter: {
    [key: string]: {
      fg: string;
      three: string;
      ft: string;
    };
  };
  byGameSituation: {
    clutch: {
      fg: string;
      three: string;
      ft: string;
    };
    fastBreak: {
      fg: string;
      three: string;
    };
    catchAndShoot: {
      fg: string;
      three: string;
    };
  };
  byDefenderDistance: {
    tight: string;
    open: string;
    wideOpen: string;
  };
}

export interface AdvancedStats {
  per: number;
  trueShooting: number;
  effectiveFg: number;
  usageRate: number;
  winShares: number;
  boxPlusMinus: number;
  valueOverReplacement: number;
  netRating: number;
  offensiveRating: number;
  defensiveRating: number;
}

export interface MatchupStats {
  opponent: string;
  games: number;
  points: number;
  rebounds: number;
  assists: number;
  shooting: {
    fg: string;
    three: string;
    ft: string;
  };
  plusMinus: number;
}