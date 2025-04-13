import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Skill as SkillType } from '../../types';

// Create styled components for Grid
const GridContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

interface SkillsProps {
  skills: SkillType[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      component="section" 
      id="skills"
      sx={{
        py: 8,
        px: 2,
        bgcolor: 'background.paper',
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
          Technical Skills
        </Typography>

        <GridContainer>
          {skills.map((skill, index) => (
            <Card 
              key={`skill-${index}`}
              elevation={0}
              sx={{ 
                height: '100%',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <CardContent>
                <Typography variant="h5" component="h3" gutterBottom>
                  {skill.category}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {skill.items.map((item, itemIndex) => (
                    <Chip 
                      key={`${skill.category}-${itemIndex}`}
                      label={item}
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        borderColor: theme.palette.primary.light,
                        color: 'text.primary',
                        m: 0.5
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </GridContainer>
      </Container>
    </Box>
  );
};

export default Skills; 