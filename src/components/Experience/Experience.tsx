import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Experience as ExperienceType } from '../../types';

interface ExperienceProps {
  experiences: ExperienceType[];
}

const Experience: React.FC<ExperienceProps> = ({ experiences }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      component="section" 
      id="experience"
      sx={{
        py: 8,
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          component="h2" 
          gutterBottom
          align={isMobile ? 'center' : 'left'}
          sx={{ mb: 4 }}
        >
          Experience
        </Typography>

        {experiences.map((experience, index) => (
          <Card 
            key={`${experience.company}-${index}`} 
            elevation={0}
            sx={{ 
              mb: 4, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 2,
              overflow: 'visible',
              position: 'relative',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h4" component="h3" gutterBottom>
                  {experience.title} at {experience.company}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    mb: isMobile ? 2 : 0
                  }}
                >
                  {experience.period}
                </Typography>
              </Box>
              
              {experience.location && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2 }}
                >
                  {experience.location}
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />
              
              <List disablePadding>
                {experience.responsibilities.map((responsibility, respIndex) => (
                  <ListItem 
                    key={`${experience.company}-resp-${respIndex}`}
                    disablePadding
                    sx={{ py: 1 }}
                  >
                    <ListItemText
                      primary={responsibility}
                      primaryTypographyProps={{
                        variant: 'body1',
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Container>
    </Box>
  );
};

export default Experience; 