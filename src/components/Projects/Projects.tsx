import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  CardHeader,
} from '@mui/material';
import {
  GitHub as GitHubIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { Project } from '../../types';

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      id="projects"
      sx={{
        py: 8,
        bgcolor: 'background.default',
      }}
    >
      <Container>
        <Typography
          variant="h2"
          component="h2"
          gutterBottom
          align="center"
          sx={{ 
            mb: 6,
            fontWeight: 700,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          Projects
        </Typography>

        <Grid container spacing={4}>
          {projects.map((project, index) => (
            <Grid item xs={12} sm={6} md={6} key={`project-${index}`}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                  borderRadius: 2
                }}
                elevation={2}
              >
                <CardHeader
                  title={
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 600 }}>
                      {project.title}
                    </Typography>
                  }
                  avatar={<CodeIcon color="primary" />}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                    {project.description}
                  </Typography>
                  
                  {project.technologies && (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {project.technologies.map((tech, techIndex) => (
                        <Chip 
                          key={`tech-${techIndex}`} 
                          label={tech} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                      ))}
                    </Stack>
                  )}
                </CardContent>
                
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<GitHubIcon />}
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ borderRadius: 2 }}
                  >
                    View on GitHub
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Projects; 