import React, { useState } from 'react';
import { Player, ShotChart, PlayerMedia, DetailedPlayerStats } from '../types';
import {
  Box,
  Tab,
  Tabs,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Theme,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { PlayArrow, Close } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

// Styled components
const ShotChartContainer = styled(Box)(({ theme }: { theme: Theme }) => ({
  position: 'relative',
  width: '100%',
  height: 400,
  backgroundImage: 'url(/images/court.png)',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}));

interface ShotPointProps {
  x: number;
  y: number;
  made: boolean;
  theme?: Theme;
}

const ShotPoint = styled(Box)<ShotPointProps>(({ x, y, made, theme }: ShotPointProps) => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: made ? theme?.palette.success.main : theme?.palette.error.main,
  transform: 'translate(-50%, -50%)',
}));

const MediaGrid = styled(Box)(({ theme }: { theme: Theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const MediaCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease-in-out',
  },
}));

const VideoCard = styled(Card)(({ theme }: { theme: Theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  '&:hover': {
    transform: 'scale(1.02)',
    transition: 'transform 0.2s ease-in-out',
    '& .play-button': {
      opacity: 1,
    },
  },
}));

const PlayButton = styled(IconButton)(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  opacity: 0,
  transition: 'opacity 0.2s ease-in-out',
}));

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`player-tabpanel-${index}`}
      aria-labelledby={`player-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

interface PlayerDetailedStatsProps {
  player: Player;
}

export const PlayerDetailedStats: React.FC<PlayerDetailedStatsProps> = ({ player }) => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
  };

  const handleCloseVideo = () => {
    setSelectedVideo(null);
  };

  const renderShotChart = (shotChart: ShotChart) => {
    if (!shotChart || !shotChart.zones || shotChart.zones.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary" align="center">
          Shot chart data is not available for this player.
        </Typography>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Shot Chart {shotChart.season}
        </Typography>
        <ShotChartContainer>
          {shotChart.zones.flatMap((zone) =>
            zone.coordinates.map((coord, index) => (
              <ShotPoint
                key={`${zone.zone}-${index}`}
                x={coord.x}
                y={coord.y}
                made={index < zone.made}
              />
            ))
          )}
        </ShotChartContainer>
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1">Shot Summary</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <Box>
              <Typography>Total Shots: {shotChart.summary.totalShots}</Typography>
              <Typography>Made: {shotChart.summary.totalMade}</Typography>
              <Typography>Percentage: {shotChart.summary.overallPercentage}%</Typography>
            </Box>
            <Box>
              <Typography>Hot Zones: {shotChart.summary.hotZones.join(', ')}</Typography>
              <Typography>Cold Zones: {shotChart.summary.coldZones.join(', ')}</Typography>
              <Typography>Most Efficient: {shotChart.summary.mostEfficientZone}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  const renderVideos = (media: PlayerMedia) => {
    if (!media || (!media.videos.length && !media.highlights.length)) {
      return (
        <Typography variant="body1" color="text.secondary" align="center">
          No videos available for this player.
        </Typography>
      );
    }

    return (
      <Box>
        {media.videos.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Game Videos
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2, mb: 4 }}>
              {media.videos.map((video) => (
                <VideoCard key={video.id}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={video.thumbnail}
                    alt={video.title}
                  />
                  <PlayButton
                    className="play-button"
                    onClick={() => handleVideoClick(video.url)}
                    size="large"
                  >
                    <PlayArrow fontSize="large" />
                  </PlayButton>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {video.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {video.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Chip
                        label={video.category}
                        size="small"
                        color="primary"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {video.duration}
                      </Typography>
                    </Box>
                  </CardContent>
                </VideoCard>
              ))}
            </Box>
          </>
        )}

        {media.highlights.length > 0 && (
          <>
            <Typography variant="h6" gutterBottom>
              Highlights
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
              {media.highlights.map((highlight) => (
                <VideoCard key={highlight.id}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={highlight.thumbnail}
                    alt={highlight.title}
                  />
                  <PlayButton
                    className="play-button"
                    onClick={() => handleVideoClick(highlight.videoUrl)}
                    size="large"
                  >
                    <PlayArrow fontSize="large" />
                  </PlayButton>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {highlight.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {highlight.description}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Chip
                        label={highlight.type}
                        size="small"
                        color="primary"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {highlight.date}
                      </Typography>
                    </Box>
                  </CardContent>
                </VideoCard>
              ))}
            </Box>
          </>
        )}

        <Dialog
          open={!!selectedVideo}
          onClose={handleCloseVideo}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">Video Player</Typography>
              <IconButton onClick={handleCloseVideo} size="small">
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          <DialogContent>
            {selectedVideo && (
              <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 'none',
                  }}
                  src={selectedVideo.replace('watch?v=', 'embed/')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    );
  };

  const renderMediaGallery = (media: PlayerMedia) => {
    if (!media || (!media.photos.length && !media.highlights.length)) {
      return (
        <Typography variant="body1" color="text.secondary" align="center">
          No media content available for this player.
        </Typography>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Media Gallery
        </Typography>
        {media.photos.length > 0 && (
          <MediaGrid>
            {media.photos.map((photo) => (
              <MediaCard key={photo.id}>
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.url}
                  alt={photo.caption}
                />
                <CardContent>
                  <Typography variant="subtitle1">{photo.caption}</Typography>
                  <Box sx={{ mt: 1 }}>
                    {photo.tags.map((tag) => (
                      <Chip
                        key={tag}
                        label={tag}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </MediaCard>
            ))}
          </MediaGrid>
        )}

        {media.highlights.length > 0 && (
          <>
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
              Highlights
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 2 }}>
              {media.highlights.map((highlight) => (
                <Card key={highlight.id}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={highlight.thumbnail}
                    alt={highlight.title}
                  />
                  <CardContent>
                    <Typography variant="h6">{highlight.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {highlight.description}
                    </Typography>
                    <Chip
                      label={highlight.type}
                      color="primary"
                      size="small"
                      sx={{ mt: 1 }}
                    />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Box>
    );
  };

  const renderDetailedStats = (stats: DetailedPlayerStats) => {
    if (!stats || !stats.gameLog || stats.gameLog.length === 0) {
      return (
        <Typography variant="body1" color="text.secondary" align="center">
          Detailed statistics are not available for this player.
        </Typography>
      );
    }

    return (
      <Box>
        <Typography variant="h6" gutterBottom>
          Detailed Statistics {stats.season}
        </Typography>
        
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
          Game Log
        </Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Opponent</TableCell>
                <TableCell>Result</TableCell>
                <TableCell>MIN</TableCell>
                <TableCell>PTS</TableCell>
                <TableCell>REB</TableCell>
                <TableCell>AST</TableCell>
                <TableCell>FG%</TableCell>
                <TableCell>3P%</TableCell>
                <TableCell>FT%</TableCell>
                <TableCell>+/-</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stats.gameLog.map((game) => (
                <TableRow key={game.gameId}>
                  <TableCell>{game.date}</TableCell>
                  <TableCell>{game.opponent}</TableCell>
                  <TableCell>{game.result}</TableCell>
                  <TableCell>{game.minutes}</TableCell>
                  <TableCell>{game.points}</TableCell>
                  <TableCell>{game.rebounds}</TableCell>
                  <TableCell>{game.assists}</TableCell>
                  <TableCell>{game.shooting.fg}</TableCell>
                  <TableCell>{game.shooting.three}</TableCell>
                  <TableCell>{game.shooting.ft}</TableCell>
                  <TableCell>{game.plusMinus}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {stats.advancedStats && (
          <>
            <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
              Advanced Statistics
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 2 }}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">PER</Typography>
                  <Typography variant="h6">{stats.advancedStats.per}</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">True Shooting %</Typography>
                  <Typography variant="h6">{stats.advancedStats.trueShooting}%</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Usage Rate</Typography>
                  <Typography variant="h6">{stats.advancedStats.usageRate}%</Typography>
                </CardContent>
              </Card>
              <Card>
                <CardContent>
                  <Typography variant="subtitle2">Win Shares</Typography>
                  <Typography variant="h6">{stats.advancedStats.winShares}</Typography>
                </CardContent>
              </Card>
            </Box>
          </>
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="player stats tabs">
          <Tab label="Shot Chart" />
          <Tab label="Videos" />
          <Tab label="Media Gallery" />
          <Tab label="Detailed Stats" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {player.shotChart ? renderShotChart(player.shotChart) : (
          <Typography variant="body1" color="text.secondary" align="center">
            Shot chart data is not available for this player.
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {player.media ? renderVideos(player.media) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No videos available for this player.
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {player.media ? renderMediaGallery(player.media) : (
          <Typography variant="body1" color="text.secondary" align="center">
            No media content available for this player.
          </Typography>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {player.detailedStats ? renderDetailedStats(player.detailedStats) : (
          <Typography variant="body1" color="text.secondary" align="center">
            Detailed statistics are not available for this player.
          </Typography>
        )}
      </TabPanel>
    </Box>
  );
};

export default PlayerDetailedStats; 