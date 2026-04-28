import { Game, NewsArticle, Player, Product, Team, Achievement, SocialMedia, TeamStats, Arena, TeamHistory, GameStats, BroadcastInfo } from '../types';

// Mock Teams
export const teams: Team[] = [
  {
    id: '1',
    name: 'UCAO',
    mascot: 'Wildcats',
    abbreviation: 'WC',
    primaryColor: '#1a365d',
    secondaryColor: '#c41e3a',
    logo: '/Pictures/University basketball admissions posters psd….jpeg',
    conference: 'East',
    record: '18-5',
    standing: 1,
    roster: [],
    stats: {
      wins: 18,
      losses: 5,
      winPercentage: 78.3,
      pointsFor: 1850,
      pointsAgainst: 1650,
      streak: 'W3',
      homeRecord: '10-2',
      awayRecord: '8-3',
      conferenceRecord: '12-2',
      lastTenGames: '8-2'
    },
    arena: {
      name: 'Wildcat Arena',
      location: 'Dakar, Senegal',
      capacity: 5000,
      yearOpened: 2015,
      surface: 'Hardwood',
      image: '/images/arenas/wildcat-arena.jpg'
    },
    socialMedia: {
      twitter: '@UCAOWildcats',
      instagram: 'ucao_wildcats',
      facebook: 'UCAOWildcats',
      youtube: 'UCAOWildcatsTV'
    },
    history: {
      founded: 2010,
      championships: 2,
      conferenceTitles: 3,
      retiredNumbers: ['23', '33'],
      hallOfFamers: ['Amadou Diallo', 'Moussa Diop']
    }
  },
  {
    id: '2',
    name: 'DAUST',
    mascot: 'Bulls',
    abbreviation: 'BL',
    primaryColor: '#ce1141',
    secondaryColor: '#000000',
    logo: '/Pictures/Basketball court h5 background.jpeg',
    conference: 'East',
    record: '15-8',
    standing: 2,
    roster: [] // Will be filled with players
  },
  {
    id: '3',
    name: 'UAHB',
    mascot: 'Eagles',
    abbreviation: 'EG',
    primaryColor: '#046a38',
    secondaryColor: '#a39161',
    logo: '/Pictures/c38fe017-34a8-4b6a-8fcd-d990aabe9d23.jpeg',
    conference: 'West',
    record: '16-7',
    standing: 1,
    roster: [] // Will be filled with players
  },
  {
    id: '4',
    name: 'IPP',
    mascot: 'Tigers',
    abbreviation: 'TG',
    primaryColor: '#522d80',
    secondaryColor: '#f56600',
    logo: '/Pictures/9944a5ab-3701-44a5-812a-0631aad40bf2.jpeg',
    conference: 'West',
    record: '14-9',
    standing: 2,
    roster: [] // Will be filled with players
  }
];

// Mock Players with NBA-style additions
export const players: Player[] = [
  {
    id: '1',
    name: 'Ibrahima Diba',
    position: 'SG',
    team: '1',
    jerseyNumber: 23,
    height: '6\'6"',
    weight: '216 lbs',
    year: 'Senior',
    hometown: 'DAUST, Somone',
    avatar: 'Pictures/rebound.jpg',
    stats: {
      ppg: 28.5,
      rpg: 6.3,
      apg: 5.9,
      spg: 2.4,
      bpg: 0.8,
      fgp: 52.3,
      tpp: 38.9,
      ftp: 85.7,
      per: 28.5,
      ts: 62.3,
      usg: 32.1,
      ws: 8.2,
      vorp: 4.5,
      plusMinus: 12.3
    },
    achievements: [
      {
        id: 'a1',
        title: 'Player of the Year',
        description: 'Named Player of the Year for the 2024 season',
        date: '2024-03-15',
        type: 'award',
        image: '/images/awards/poty-2024.jpg'
      },
      {
        id: 'a2',
        title: '50-Point Game',
        description: 'Scored 50 points against DAUST',
        date: '2024-02-20',
        type: 'record'
      }
    ],
    socialMedia: {
      twitter: '@IbrahimaDiba',
      instagram: 'ibrahima_diba',
      youtube: 'IbrahimaDibaOfficial'
    },
    injuryStatus: {
      status: 'active'
    },
    media: {
      photos: [
        {
          id: 'p1',
          url: '/images/players/diba-game1.jpg',
          caption: 'Ibrahima Diba during the championship game',
          date: '2024-03-15',
          category: 'game',
          tags: ['championship', 'game', 'action']
        },
        {
          id: 'p2',
          url: '/images/players/diba-practice.jpg',
          caption: 'Working on his three-point shot',
          date: '2024-03-10',
          category: 'practice',
          tags: ['practice', 'training', 'shooting']
        },
        {
          id: 'p3',
          url: '/images/players/diba-award.jpg',
          caption: 'Receiving Player of the Year award',
          date: '2024-03-15',
          category: 'award',
          tags: ['award', 'ceremony', 'achievement']
        }
      ],
      videos: [
        {
          id: 'v1',
          url: 'https://youtube.com/watch?v=diba-highlights-2024',
          title: 'Season Highlights 2024',
          description: 'Best plays from Ibrahima Diba\'s 2024 season',
          duration: '10:15',
          thumbnail: '/images/videos/diba-highlights-thumb.jpg',
          date: '2024-03-20',
          category: 'highlight'
        },
        {
          id: 'v2',
          url: 'https://youtube.com/watch?v=diba-interview',
          title: 'Post-Game Interview',
          description: 'Interview after the championship game',
          duration: '5:30',
          thumbnail: '/images/videos/diba-interview-thumb.jpg',
          date: '2024-03-15',
          category: 'interview'
        }
      ],
      highlights: [
        {
          id: 'h1',
          title: 'Game-Winning Three',
          description: 'Clutch three-pointer to win the game',
          videoUrl: 'https://youtube.com/watch?v=diba-clutch-three',
          thumbnail: '/images/highlights/clutch-three.jpg',
          date: '2024-03-15',
          gameId: '1',
          type: 'clutch'
        },
        {
          id: 'h2',
          title: 'Monster Dunk',
          description: 'Powerful dunk over defender',
          videoUrl: 'https://youtube.com/watch?v=diba-monster-dunk',
          thumbnail: '/images/highlights/monster-dunk.jpg',
          date: '2024-03-10',
          type: 'dunk'
        }
      ],
      socialMediaPosts: [
        {
          id: 'sm1',
          platform: 'twitter',
          url: 'https://twitter.com/IbrahimaDiba/status/123456',
          content: 'Great team win tonight! #Wildcats #Basketball',
          date: '2024-03-15',
          likes: 1200,
          comments: 150,
          shares: 300
        }
      ]
    },
    shotChart: {
      season: '2023-2024',
      zones: [
        {
          zone: 'paint',
          made: 85,
          attempted: 120,
          percentage: 70.8,
          coordinates: [
            { x: 5, y: 5 },
            { x: 6, y: 4 },
            // ... more coordinates
          ]
        },
        {
          zone: 'mid-range-left',
          made: 25,
          attempted: 45,
          percentage: 55.6,
          coordinates: [
            { x: 15, y: 10 },
            { x: 16, y: 9 },
            // ... more coordinates
          ]
        },
        {
          zone: 'mid-range-right',
          made: 20,
          attempted: 45,
          percentage: 44.4,
          coordinates: [
            { x: 15, y: 10 },
            { x: 16, y: 9 },
            // ... more coordinates
          ]
        },
        {
          zone: 'corner-three-left',
          made: 15,
          attempted: 30,
          percentage: 50.0,
          coordinates: [
            { x: 22, y: 0 },
            { x: 22, y: 1 },
            // ... more coordinates
          ]
        },
        {
          zone: 'corner-three-right',
          made: 15,
          attempted: 30,
          percentage: 50.0,
          coordinates: [
            { x: 22, y: 0 },
            { x: 22, y: 1 },
            // ... more coordinates
          ]
        },
        {
          zone: 'wing-three-left',
          made: 20,
          attempted: 42,
          percentage: 47.6,
          coordinates: [
            { x: 20, y: 10 },
            { x: 21, y: 9 },
            // ... more coordinates
          ]
        },
        {
          zone: 'wing-three-right',
          made: 20,
          attempted: 43,
          percentage: 46.5,
          coordinates: [
            { x: 20, y: 10 },
            { x: 21, y: 9 },
            // ... more coordinates
          ]
        },
        {
          zone: 'top-three',
          made: 35,
          attempted: 75,
          percentage: 46.7,
          coordinates: [
            { x: 0, y: 22 },
            { x: 1, y: 21 },
            // ... more coordinates
          ]
        }
      ],
      summary: {
        totalShots: 430,
        totalMade: 235,
        overallPercentage: 54.7,
        hotZones: ['paint', 'corner-three-left', 'corner-three-right'],
        coldZones: ['top-three'],
        mostFrequentZone: 'paint',
        mostEfficientZone: 'paint'
      }
    },
    detailedStats: {
      season: '2023-2024',
      gameLog: [
        {
          gameId: '1',
          date: '2024-03-15',
          opponent: 'DAUST',
          result: 'W',
          minutes: 35,
          points: 32,
          rebounds: 7,
          assists: 5,
          steals: 2,
          blocks: 1,
          turnovers: 2,
          fouls: 3,
          plusMinus: 15,
          shooting: {
            fg: '12-20',
            three: '4-8',
            ft: '4-4'
          }
        }
        // ... more games
      ],
      shootingSplits: {
        byQuarter: {
          '1': { fg: '55%', three: '40%', ft: '85%' },
          '2': { fg: '52%', three: '38%', ft: '88%' },
          '3': { fg: '48%', three: '35%', ft: '82%' },
          '4': { fg: '45%', three: '42%', ft: '90%' }
        },
        byGameSituation: {
          clutch: { fg: '48%', three: '40%', ft: '92%' },
          fastBreak: { fg: '65%', three: '35%' },
          catchAndShoot: { fg: '45%', three: '42%' }
        },
        byDefenderDistance: {
          tight: '35%',
          open: '45%',
          wideOpen: '55%'
        }
      },
      advancedStats: {
        per: 28.5,
        trueShooting: 62.3,
        effectiveFg: 58.7,
        usageRate: 32.1,
        winShares: 8.2,
        boxPlusMinus: 7.5,
        valueOverReplacement: 4.5,
        netRating: 12.3,
        offensiveRating: 118.5,
        defensiveRating: 106.2
      },
      matchupStats: [
        {
          opponent: 'DAUST',
          games: 3,
          points: 28.5,
          rebounds: 6.3,
          assists: 5.9,
          shooting: {
            fg: '52.3%',
            three: '38.9%',
            ft: '85.7%'
          },
          plusMinus: 12.3
        }
        // ... more matchups
      ]
    }
  },
  {
    id: '2',
    name: 'Mouhamed Camara',
    position: 'SF',
    team: '1',
    jerseyNumber: 6,
    height: '6\'9"',
    weight: '250 lbs',
    year: 'Junior',
    hometown: 'Akron, OH',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
    stats: {
      ppg: 25.7,
      rpg: 9.1,
      apg: 8.5,
      spg: 1.8,
      bpg: 1.2,
      fgp: 54.1,
      tpp: 36.4,
      ftp: 73.8,
      per: 24.8,
      ts: 58.9,
      usg: 28.5,
      ws: 7.5,
      vorp: 3.8,
      plusMinus: 10.5
    },
    media: {
      photos: [
        {
          id: 'p4',
          url: '/images/players/camara-game1.jpg',
          caption: 'Mouhamed Camara during a game',
          date: '2024-03-15',
          category: 'game',
          tags: ['game', 'action']
        }
      ],
      videos: [],
      highlights: [
        {
          id: 'h3',
          title: 'Triple Double Performance',
          description: 'Recorded a triple double with 25 points, 10 rebounds, and 10 assists',
          videoUrl: 'https://youtube.com/watch?v=camara-triple-double',
          thumbnail: '/images/highlights/triple-double.jpg',
          date: '2024-03-10',
          type: 'assist'
        }
      ],
      socialMediaPosts: []
    },
    shotChart: {
      season: '2023-2024',
      zones: [
        {
          zone: 'paint',
          made: 75,
          attempted: 110,
          percentage: 68.2,
          coordinates: [
            { x: 5, y: 5 },
            { x: 6, y: 4 }
          ]
        },
        {
          zone: 'mid-range-left',
          made: 20,
          attempted: 42,
          percentage: 47.6,
          coordinates: [
            { x: 15, y: 10 },
            { x: 16, y: 9 }
          ]
        },
        {
          zone: 'mid-range-right',
          made: 20,
          attempted: 43,
          percentage: 46.5,
          coordinates: [
            { x: 15, y: 10 },
            { x: 16, y: 9 }
          ]
        },
        {
          zone: 'corner-three-left',
          made: 12,
          attempted: 27,
          percentage: 44.4,
          coordinates: [
            { x: 22, y: 0 },
            { x: 22, y: 1 }
          ]
        },
        {
          zone: 'corner-three-right',
          made: 13,
          attempted: 28,
          percentage: 46.4,
          coordinates: [
            { x: 22, y: 0 },
            { x: 22, y: 1 }
          ]
        },
        {
          zone: 'wing-three-left',
          made: 15,
          attempted: 35,
          percentage: 42.9,
          coordinates: [
            { x: 20, y: 10 },
            { x: 21, y: 9 }
          ]
        },
        {
          zone: 'wing-three-right',
          made: 20,
          attempted: 35,
          percentage: 57.1,
          coordinates: [
            { x: 20, y: 10 },
            { x: 21, y: 9 }
          ]
        },
        {
          zone: 'top-three',
          made: 30,
          attempted: 70,
          percentage: 42.9,
          coordinates: [
            { x: 0, y: 22 },
            { x: 1, y: 21 }
          ]
        }
      ],
      summary: {
        totalShots: 400,
        totalMade: 205,
        overallPercentage: 51.3,
        hotZones: ['paint'],
        coldZones: ['top-three'],
        mostFrequentZone: 'paint',
        mostEfficientZone: 'paint'
      }
    },
    detailedStats: {
      season: '2023-2024',
      gameLog: [
        {
          gameId: '2',
          date: '2024-03-15',
          opponent: 'DAUST',
          result: 'W',
          minutes: 38,
          points: 25,
          rebounds: 10,
          assists: 10,
          steals: 2,
          blocks: 1,
          turnovers: 3,
          fouls: 2,
          plusMinus: 12,
          shooting: {
            fg: '10-18',
            three: '2-5',
            ft: '3-4'
          }
        }
      ],
      shootingSplits: {
        byQuarter: {
          '1': { fg: '52%', three: '38%', ft: '75%' },
          '2': { fg: '55%', three: '36%', ft: '72%' },
          '3': { fg: '53%', three: '35%', ft: '74%' },
          '4': { fg: '56%', three: '37%', ft: '73%' }
        },
        byGameSituation: {
          clutch: { fg: '50%', three: '35%', ft: '75%' },
          fastBreak: { fg: '62%', three: '33%' },
          catchAndShoot: { fg: '43%', three: '38%' }
        },
        byDefenderDistance: {
          tight: '40%',
          open: '48%',
          wideOpen: '55%'
        }
      },
      advancedStats: {
        per: 24.8,
        trueShooting: 58.9,
        effectiveFg: 56.2,
        usageRate: 28.5,
        winShares: 7.5,
        boxPlusMinus: 6.8,
        valueOverReplacement: 3.8,
        netRating: 10.5,
        offensiveRating: 115.8,
        defensiveRating: 105.3
      },
      matchupStats: [
        {
          opponent: 'DAUST',
          games: 3,
          points: 25.7,
          rebounds: 9.1,
          assists: 8.5,
          shooting: {
            fg: '54.1%',
            three: '36.4%',
            ft: '73.8%'
          },
          plusMinus: 10.5
        }
      ]
    }
  },
  {
    id: '3',
    name: 'Ousmane Fall',
    position: 'PG',
    team: '2',
    jerseyNumber: 30,
    height: '6\'3"',
    weight: '185 lbs',
    year: 'Senior',
    hometown: 'Charlotte, NC',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    stats: {
      ppg: 24.3,
      rpg: 4.5,
      apg: 6.8,
      spg: 1.9,
      bpg: 0.2,
      fgp: 47.8,
      tpp: 43.2,
      ftp: 91.5
    }
  },
  {
    id: '4',
    name: 'mouhamed Ndiaye',
    position: 'PF',
    team: '2',
    jerseyNumber: 35,
    height: '6\'10"',
    weight: '240 lbs',
    year: 'Junior',
    hometown: 'Washington, DC',
    avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
    stats: {
      ppg: 26.8,
      rpg: 7.2,
      apg: 4.9,
      spg: 1.1,
      bpg: 1.3,
      fgp: 52.1,
      tpp: 39.5,
      ftp: 88.9
    }
  },
  {
    id: '5',
    name: 'Tidiane Diouf',
    position: 'PF',
    team: '3',
    jerseyNumber: 34,
    height: '6\'11"',
    weight: '242 lbs',
    year: 'Senior',
    hometown: 'Athens, Greece',
    avatar: 'https://randomuser.me/api/portraits/men/19.jpg',
    stats: {
      ppg: 27.2,
      rpg: 11.5,
      apg: 5.7,
      spg: 1.3,
      bpg: 1.5,
      fgp: 56.8,
      tpp: 30.1,
      ftp: 71.8
    }
  },
  {
    id: '6',
    name: 'cheikh Ndiaye',
    position: 'PG',
    team: '3',
    jerseyNumber: 77,
    height: '6\'7"',
    weight: '230 lbs',
    year: 'Sophomore',
    hometown: 'Ljubljana, Slovenia',
    avatar: 'https://randomuser.me/api/portraits/men/24.jpg',
    stats: {
      ppg: 28.1,
      rpg: 8.4,
      apg: 9.2,
      spg: 1.2,
      bpg: 0.5,
      fgp: 47.5,
      tpp: 35.8,
      ftp: 74.2
    }
  },
  {
    id: '7',
    name: 'fallou Thiam',
    position: 'C',
    team: '4',
    jerseyNumber: 21,
    height: '7\'0"',
    weight: '280 lbs',
    year: 'Senior',
    hometown: 'Yaoundé, Cameroon',
    avatar: 'https://randomuser.me/api/portraits/men/26.jpg',
    stats: {
      ppg: 29.5,
      rpg: 11.2,
      apg: 3.5,
      spg: 1.1,
      bpg: 1.8,
      fgp: 51.5,
      tpp: 36.3,
      ftp: 85.1
    }
  },
  {
    id: '8',
    name: 'Bamba Gueye',
    position: 'C',
    team: '4',
    jerseyNumber: 15,
    height: '6\'11"',
    weight: '284 lbs',
    year: 'Junior',
    hometown: 'Sombor, Serbia',
    avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
    stats: {
      ppg: 24.8,
      rpg: 11.8,
      apg: 9.8,
      spg: 1.3,
      bpg: 0.7,
      fgp: 57.1,
      tpp: 37.7,
      ftp: 81.5
    }
  }
];

// Assign players to teams
teams.forEach(team => {
  team.roster = players.filter(player => player.team === team.id);
});

// Mock Games with NBA-style additions
export const games: Game[] = [
  {
    id: '1',
    homeTeam: teams[0],
    awayTeam: teams[1],
    homeScore: 85,
    awayScore: 78,
    date: '2025-03-28',
    time: '19:00',
    venue: 'DAUST stadium',
    isFeatured: true,
    isCompleted: true,
    status: 'completed',
    broadcast: {
      network: 'BUL Sports',
      commentators: ['Mamadou Diallo', 'Fatou Ndiaye'],
      streamUrl: 'https://stream.bul-sports.com/game1'
    },
    stats: {
      attendance: 4500,
      duration: '2:15',
      leadChanges: 12,
      timesTied: 8,
      largestLead: 15,
      quarters: [
        { quarter: 1, homeScore: 22, awayScore: 18 },
        { quarter: 2, homeScore: 45, awayScore: 40 },
        { quarter: 3, homeScore: 65, awayScore: 62 },
        { quarter: 4, homeScore: 85, awayScore: 78 }
      ]
    },
    highlights: [
      'Ibrahima Diba with a monster dunk in the third quarter',
      'Mouhamed Camara hits the game-winning three-pointer',
      'Defensive play of the game by Ousmane Fall'
    ],
    highlightVideoUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw',
    officials: ['Referee 1', 'Referee 2', 'Referee 3']
  },
  {
    id: '2',
    homeTeam: teams[2],
    awayTeam: teams[3],
    homeScore: 92,
    awayScore: 88,
    date: '2025-03-29',
    time: '20:00',
    venue: 'UCAO Stadium',
    isFeatured: false,
    isCompleted: true,
    highlights: [
      'Back-and-forth fourth quarter with six lead changes',
      'Clutch free throws seal the win in the final seconds',
      'Career night from beyond the arc for the home side'
    ],
    highlightVideoUrl: 'https://www.youtube.com/embed/ScMzIvxBSi4'
  },
  {
    id: '3',
    homeTeam: teams[1],
    awayTeam: teams[2],
    date: '2026-04-12',
    time: '19:30',
    venue: 'DAUST stadium',
    isFeatured: true,
    isCompleted: false,
    status: 'scheduled',
    broadcast: {
      network: 'BUL Sports',
      commentators: ['Mamadou Diallo', 'Fatou Ndiaye']
    }
  },
  {
    id: '4',
    homeTeam: teams[3],
    awayTeam: teams[0],
    date: '2026-04-15',
    time: '18:00',
    venue: 'UCAO stadium',
    isFeatured: false,
    isCompleted: false,
    status: 'scheduled',
    broadcast: {
      network: 'BUL TV',
      commentators: ['Ibrahima Sow', 'Aïssatou Ba']
    }
  },
  {
    id: '5',
    homeTeam: teams[0],
    awayTeam: teams[3],
    date: '2026-04-12',
    time: '21:00',
    venue: 'Wildcat Arena',
    isFeatured: false,
    isCompleted: false,
    status: 'scheduled'
  },
  {
    id: '6',
    homeTeam: teams[2],
    awayTeam: teams[1],
    date: '2026-04-22',
    time: '20:00',
    venue: 'Eagles Gymnasium',
    isFeatured: true,
    isCompleted: false,
    status: 'scheduled',
    broadcast: {
      network: 'BUL Sports',
      commentators: ['Mamadou Diallo', 'Fatou Ndiaye']
    }
  }
];

// Mock News Articles with NBA-style additions
export const newsArticles: NewsArticle[] = [
  {
    id: '1',
    title: 'Wildcats Dominate Conference Play',
    summary: 'UCAO Wildcats continue their impressive run in conference play with another convincing victory',
    content: 'The UCAO Wildcats have been on fire lately, winning their last 8 games...',
    author: 'Mamadou Diallo',
    date: '2024-03-15',
    image: '/images/news/wildcats-win.jpg',
    category: 'team',
    tags: ['UCAO', 'Wildcats', 'Conference', 'Basketball'],
    featured: true,
    views: 12500,
    comments: 342,
    relatedArticles: ['2', '3'],
    videoUrl: 'https://youtube.com/watch?v=wildcats-highlights'
  },
  {
    id: '2',
    title: 'Diop Breaks Three-Point Record',
    summary: 'Mamadou Diop has broken the university league record for most three-pointers in a single season.',
    content: 'Mamadou Diop continues to redefine the game with his exceptional shooting ability. In a thrilling matchup against the Eagles, Diop broke the university league record for most three-pointers in a single season, surpassing the previous record of 157 with still four games remaining in the regular season. The senior point guard finished the game with 8 three-pointers, bringing his season total to 162. "It\'s an honor to set this record, but I\'m more focused on helping my team win games," said Diop in the post-game interview. "Records are meant to be broken, but championships last forever." Bulls coach Amadou Ndiaye praised Diop\'s work ethic and dedication to his craft, highlighting how his shooting ability creates opportunities for his teammates. "Mamadou is a special player who makes everyone around him better," Coach Ndiaye stated. "His shooting gravity opens up the floor for everyone else."',
    author: 'Emily Johnson',
    date: '2025-03-30',
    image: 'Pictures/1424e40b-bd66-416a-88bc-638c5b385c72.jpeg',
    category: 'player',
    tags: ['Mamadou Diop', 'Bulls', 'Three-Point Record']
  },
  {
    id: '3',
    title: 'League Announces All-Star Weekend Schedule',
    summary: 'The Basketball University League has released the schedule for the upcoming All-Star Weekend.',
    content: 'Mark your calendars, basketball fans! The Basketball University League has officially announced the schedule for the highly anticipated All-Star Weekend, set to take place from April 15-17. The three-day event will feature a skills challenge, three-point contest, slam dunk competition, and the All-Star Game itself. The festivities will be held at the state-of-the-art National Basketball Arena, with tickets going on sale next week. League Commissioner David Stern expressed excitement about this year\'s event, stating, "This year\'s All-Star Weekend promises to be our biggest and most exciting yet. We\'ve added several fan engagement activities and enhanced the overall experience." Fan voting for the All-Star teams will open on April 1st and close on April 10th, with the final rosters to be announced on April 12th.',
    author: 'Michael Williams',
    date: '2025-04-01',
    image: 'Pictures/9944a5ab-3701-44a5-812a-0631aad40bf2.jpeg',
    category: 'league',
    tags: ['All-Star Weekend', 'Schedule', 'Fan Voting']
  },
  {
    id: '4',
    title: 'Ndiaye Named Player of the Month',
    summary: 'Cheikh Ndiaye has been named the Basketball University League Player of the Month for March.',
    content: 'The Basketball University League has announced Cheikh Ndiaye as the Player of the Month for March, following a series of outstanding performances that helped the Tigers maintain their playoff push. During March, Ndiaye averaged a near triple-double with 25.3 points, 12.5 rebounds, and 9.7 assists per game, while shooting an efficient 60.2% from the field. The junior center recorded four triple-doubles during this stretch, including a monster 30-point, 15-rebound, 12-assist performance against the Eagles. Tigers head coach Mike Malone praised Ndiaye\'s impact on the team, saying, "Cheikh is the engine that drives our team. His ability to score, rebound, and create for others at his size makes him a unique talent in college basketball." This is Ndiaye\'s second Player of the Month honor this season, having previously won the award in December.',
    author: 'Sarah Thompson',
    date: '2025-04-02',
    image: 'Pictures/c38fe017-34a8-4b6a-8fcd-d990aabe9d23.jpeg',
    category: 'player',
    tags: ['Cheikh Ndiaye', 'Tigers', 'Player of the Month']
  }
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'UCAD Home Jersey',
    description: 'Official home jersey of the UCAD basketball team. Made with premium moisture-wicking fabric for maximum comfort and performance.',
    price: 5200,
    image: 'Pictures/fb0c4186-1894-496d-8400-833373671cca.jpeg',
    category: 'jerseys',
    team: 'UCAD',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Navy', 'White'],
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'DAUST Basketball Shorts',
    description: 'Official basketball shorts of DAUST. Designed for optimal movement and breathability during intense gameplay.',
    price: 5400,
    image: 'Pictures/Jordan M J DF SPRT DMND - Short de sport….jpeg',
    category: 'shorts',
    team: 'DAUST',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Red', 'Black'],
    inStock: true,
    featured: false
  },
  {
    id: '3',
    name: 'UCAO Hoodie Sweatshirt',
    description: 'Stay warm and show your team spirit with this premium UCAO hoodie sweatshirt. Features embroidered university logo and player number.',
    price: 5600,
    image: 'https://images.pexels.com/photos/6311475/pexels-photo-6311475.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'apparel',
    team: 'UCAO',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Green', 'Gold'],
    inStock: true,
    featured: true
  },
  {
    id: '4',
    name: 'ESP Basketball',
    description: 'Official game basketball of ESP. Composite leather construction provides superior grip and durability.',
    price: 5800,
    image: 'https://images.pexels.com/photos/945471/pexels-photo-945471.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'equipment',
    team: 'ESP',
    inStock: true,
    featured: false
  },
  {
    id: '5',
    name: 'UGB Signature Shoes',
    description: 'Limited edition signature basketball shoes designed for UGB. Features advanced cushioning and support.',
    price: 6000,
    image: 'Pictures/96027b61-c50b-4afa-bde4-b7426ae3fffb.jpeg',
    category: 'footwear',
    player: 'UGB',
    team: 'UGB',
    sizes: ['7', '8', '9', '10', '11', '12', '13'],
    colors: ['Red/Black', 'Navy/White'],
    inStock: true,
    featured: true
  },
  {
    id: '6',
    name: 'UADB League Cap',
    description: 'Adjustable cap featuring the official UADB logo. Perfect for showing your support for university basketball.',
    price: 6200,
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'accessories',
    sizes: ['One Size'],
    colors: ['Navy', 'Black', 'Red', 'Green'],
    inStock: true,
    featured: false
  },
  {
    id: '7',
    name: 'ISM Jersey',
    description: 'Official ISM jersey. Features university name and number on the back.',
    price: 6400,
    image: 'Pictures/c274d11b-cbca-41d8-a049-6d232a8b5dda.jpeg',
    category: 'jerseys',
    player: 'ISM',
    team: 'ISM',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Red', 'White'],
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'UASZ Training Kit',
    description: 'Complete UASZ basketball training kit including agility cones, resistance bands, and dribbling aids. Perfect for improving your skills.',
    price: 6600,
    image: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'equipment',
    inStock: true,
    featured: false
  }
];