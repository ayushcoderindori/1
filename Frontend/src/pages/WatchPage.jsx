import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Skeleton,
  IconButton,
  Divider,
  Chip,
  Stack,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
  Paper,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api.js";
import useAuth from "../auth/useAuth.js";
import CommentList from "../components/CommentSection/CommentList";
import RelatedVideos from "../components/WatchSidebar/RelatedVideos";
import SubscribeButton from "../components/SubscribeButton.jsx";
import { Link } from "react-router-dom";
import {
  PlayArrow,
  Visibility,
  CalendarToday,
  Person,
  AutoAwesome,
  SmartToy,
} from "@mui/icons-material";

export default function WatchPage() {
  const { videoId } = useParams();
  const { user, setUser, fetchUser } = useAuth();
  const remainingCredits = user?.credits ?? 0;

  const qc = useQueryClient();

  // Fetch video by ID
  const {
    data: video,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => api.get(`/videos/${videoId}`).then((r) => r.data.data),
  });

  // Like toggle mutation
  const toggleLike = useMutation({
    mutationFn: () => api.post(`/likes/toggle/v/${videoId}`),
    onSuccess: () => qc.invalidateQueries(["video", videoId]),
  });

  // AI generation mutation
  const generateAI = useMutation({
    mutationFn: () => api.post(`/videos/${videoId}/process-ai`),
    onSuccess: () => qc.invalidateQueries(["video", videoId]),
    onError: (err) => {
      console.error("AI generation failed:", err);
      alert(
        "AI generation failed: " + (err.response?.data?.message || err.message)
      );
    },
  });

  const [showTranscript, setShowTranscript] = useState(true);
  const [showSummary, setShowSummary] = useState(true);
  const [showQuestions, setShowQuestions] = useState(true);

  if (isLoading) {
    return (
      <Box sx={{ width: "100%", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ pt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} lg={8}>
              <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
              <Skeleton width="80%" height={32} sx={{ mt: 2 }} />
              <Skeleton width="60%" height={24} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
              <Skeleton width="100%" height={24} sx={{ mt: 1 }} />
              <Skeleton width="80%" height={20} />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!video) {
    return (
      <Box sx={{ width: "100%", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ pt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box display="flex" justifyContent="center">
            <Alert severity="error" sx={{ borderRadius: 2, maxWidth: 600 }}>
              <Typography variant="h6">Video not found</Typography>
              <Typography variant="body2">The video you're looking for doesn't exist or has been removed.</Typography>
            </Alert>
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ width: "100%", minHeight: "100vh" }}>
        <Container maxWidth="lg" sx={{ pt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box display="flex" justifyContent="center">
            <Alert severity="error" sx={{ borderRadius: 2, maxWidth: 600 }}>
              <Typography variant="h6">Failed to load video</Typography>
              <Typography variant="body2">{error.message}</Typography>
            </Alert>
          </Box>
        </Container>
      </Box>
    );
  }

  const hasTranscript = Boolean(video.transcript);
  const hasSummary = Boolean(video.summary);
  const hasQuestions = Boolean(video.questions?.length);
  const hasAnyAI = hasTranscript || hasSummary || hasQuestions;

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6, px: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Video Player */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  mb: 3
                }}
              >
                <Box sx={{ width: "100%", aspectRatio: "16/9", position: "relative" }}>
                  <video
                    controls
                    width="100%"
                    height="100%"
                    src={video.videoFile}
                    style={{ 
                      borderRadius: 12,
                      objectFit: "cover"
                    }}
                  />
                  
                  {/* Premium Badge */}
                  {video.isPremium && (
                    <Chip
                      label="Premium"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        backgroundColor: "rgba(245, 158, 11, 0.9)",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem"
                      }}
                    />
                  )}
                </Box>
              </Paper>

              {/* Video Info */}
              <Box mb={4}>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    fontWeight: 700,
                    mb: 2,
                    lineHeight: 1.3
                  }}
                >
                  {video.title}
                </Typography>

                {/* Creator Info */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    mb: 3
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Avatar 
                      src={video.owner?.avatarUrl} 
                      sx={{ 
                        width: 48, 
                        height: 48,
                        border: "2px solid rgba(99, 102, 241, 0.2)"
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Link 
                        to={`/profile/${video.owner.username}`} 
                        style={{ textDecoration: 'none', color: 'inherit' }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            cursor: 'pointer', 
                            fontWeight: 600,
                            "&:hover": {
                              color: "primary.main"
                            }
                          }}
                        >
                          {video.owner?.fullName}
                        </Typography>
                      </Link>
                      <Typography variant="body2" color="text.secondary">
                        @{video.owner?.username}
                      </Typography>
                    </Box>
                    {user?._id !== video.owner?._id && (
                      <SubscribeButton username={video.owner.username} />
                    )}
                  </Stack>

                  {/* Video Stats */}
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box display="flex" alignItems="center">
                      <Visibility sx={{ fontSize: 20, mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {video.views || 0} views
                      </Typography>
                    </Box>
                    
                    <Box display="flex" alignItems="center">
                      <CalendarToday sx={{ fontSize: 20, mr: 1, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* Like Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant={video.isLiked ? "contained" : "outlined"}
                    startIcon={<ThumbUpIcon />}
                    onClick={() => toggleLike.mutate()}
                    disabled={toggleLike.isLoading}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1,
                      fontWeight: 600
                    }}
                  >
                    {video.likeCount || 0} Likes
                  </Button>
                </motion.div>
              </Box>

              {/* AI Content Section */}
              <AnimatePresence mode="wait">
                {!hasAnyAI ? (
                  <motion.div
                    key="no-ai"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 4,
                        textAlign: "center",
                        borderRadius: 3,
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        mb: 4
                      }}
                    >
                      <SmartToy sx={{ fontSize: 64, color: "primary.main", mb: 2 }} />
                      <Typography variant="h6" mb={2}>
                        No AI-generated content yet
                      </Typography>
                      <Typography variant="body1" color="text.secondary" mb={3}>
                        Generate AI-powered insights including transcript, summary, and questions for this video.
                      </Typography>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="contained"
                          startIcon={<AutoAwesome />}
                          onClick={() => generateAI.mutate()}
                          disabled={generateAI.isLoading}
                          sx={{
                            borderRadius: 2,
                            px: 4,
                            py: 1.5,
                            fontWeight: 600,
                            background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)"
                            }
                          }}
                        >
                          {generateAI.isLoading ? "Generating..." : "Generate AI Insights"}
                        </Button>
                      </motion.div>
                    </Paper>
                  </motion.div>
                ) : (
                  <motion.div
                    key="ai-content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        mb: 4
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={3}>
                        <AutoAwesome sx={{ fontSize: 28, color: "primary.main", mr: 2 }} />
                        <Typography variant="h6" fontWeight={600}>
                          AI-Generated Insights
                        </Typography>
                      </Box>

                      <FormGroup row sx={{ mb: 3 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showTranscript}
                              onChange={() => setShowTranscript((prev) => !prev)}
                            />
                          }
                          label="Transcript"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showSummary}
                              onChange={() => setShowSummary((prev) => !prev)}
                            />
                          }
                          label="Summary"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={showQuestions}
                              onChange={() => setShowQuestions((prev) => !prev)}
                            />
                          }
                          label="Questions"
                        />
                      </FormGroup>

                      <AnimatePresence mode="wait">
                        {showTranscript && hasTranscript && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Accordion sx={{ mb: 2, borderRadius: 2 }}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight={600}>Transcript</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
                                  {video.transcript}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </motion.div>
                        )}

                        {showSummary && hasSummary && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Accordion sx={{ mb: 2, borderRadius: 2 }}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight={600}>Summary</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Typography sx={{ lineHeight: 1.6 }}>
                                  {video.summary}
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          </motion.div>
                        )}

                        {showQuestions && hasQuestions && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Accordion sx={{ borderRadius: 2 }}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography fontWeight={600}>Questions</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <Stack spacing={1}>
                                  {video.questions.map((q, i) => (
                                    <Typography key={i} sx={{ lineHeight: 1.6 }}>
                                      • {q.question}
                                    </Typography>
                                  ))}
                                </Stack>
                              </AccordionDetails>
                            </Accordion>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comments Section */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  background: "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  mb: 4
                }}
              >
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Comments
                  </Typography>
                  <CommentList videoId={videoId} />
                </Box>
              </Paper>

              {/* Credits Info */}
              {!video.isPremium && typeof video.remainingCredits === "number" && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: "rgba(99, 102, 241, 0.1)",
                    border: "1px solid rgba(99, 102, 241, 0.2)"
                  }}
                >
                  <Chip
                    label={`Remaining credits: ${video.remainingCredits}`}
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 600 }}
                  />
                </Paper>
              )}
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RelatedVideos />
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
