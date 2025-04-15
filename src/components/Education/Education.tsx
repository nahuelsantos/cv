import React from 'react';
import { 
  Box, 
  Typography, 
  Container,
  Card,
  CardContent,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Education as EducationType, Certification } from '../../types';

// Create styled components for Grid
const GridContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(1, 1fr)',
  gap: theme.spacing(4),
  [theme.breakpoints.up('md')]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
}));

const GridItem = styled('div')({
  width: '100%',
});

interface EducationProps {
  education: EducationType[];
  certifications: Certification[];
}

const Education: React.FC<EducationProps> = ({ education, certifications }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      id="education"
      sx={{
        py: 8,
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
          Education & Certifications
        </Typography>

        <GridContainer>
          <GridItem>
            <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 3 }}>
              Academic Education
            </Typography>
            
            {education.map((edu, index) => (
              <Card 
                key={`education-${index}`}
                elevation={0}
                sx={{ 
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h5" component="h4" gutterBottom>
                      {edu.degree}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        mb: isMobile ? 2 : 0
                      }}
                    >
                      {edu.period}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                    gutterBottom
                  >
                    {edu.institution}
                  </Typography>
                  
                  {edu.description && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body1">
                        {edu.description}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </GridItem>
          
          <GridItem>
            <Typography variant="h3" component="h3" gutterBottom sx={{ mb: 3 }}>
              Certifications & Specializations
            </Typography>
            
            {certifications.map((cert, index) => (
              <Card 
                key={`certification-${index}`}
                elevation={0}
                sx={{ 
                  mb: 3,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h5" component="h4" gutterBottom>
                      {cert.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ 
                        fontWeight: 500,
                        mb: isMobile ? 2 : 0
                      }}
                    >
                      {cert.period}
                    </Typography>
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2 }}
                    gutterBottom
                  >
                    {cert.issuer}
                  </Typography>
                  
                  {cert.description && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body1">
                        {cert.description}
                      </Typography>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </GridItem>
        </GridContainer>
      </Container>
    </Box>
  );
};

export default Education; 