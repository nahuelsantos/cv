import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Button, 
  Stack, 
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { 
  LinkedIn as LinkedInIcon, 
  GitHub as GitHubIcon,
  LocationOn as LocationIcon,
  ContactMail as ContactMailIcon
} from '@mui/icons-material';
import { Profile } from '../../types';
import ContactForm from '../ContactForm';

interface HeaderProps {
  profile: Profile;
}

const Header: React.FC<HeaderProps> = ({ profile }) => {
  const [contactFormOpen, setContactFormOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpenContactForm = () => {
    setContactFormOpen(true);
  };

  const handleCloseContactForm = () => {
    setContactFormOpen(false);
  };
  
  return (
    <Box
      sx={{
        py: 8,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          <Typography 
            variant="h1" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              fontWeight: 700,
              letterSpacing: -0.5,
              mb: 1
            }}
          >
            {profile.name}
          </Typography>
          
          <Typography 
            variant="h2" 
            color="primary" 
            sx={{ 
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 500,
              mb: 2
            }}
          >
            {profile.title}
          </Typography>
          
          {profile.location && (
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <LocationIcon fontSize="small" color="action" />
              <Typography variant="body1" color="text.secondary">
                {profile.location}
              </Typography>
            </Stack>
          )}
          
          <Typography 
            variant="body1" 
            sx={{ 
              maxWidth: '800px',
              fontSize: '1.1rem',
              lineHeight: 1.6,
            }}
          >
            {profile.summary}
          </Typography>

          <Stack 
            direction={isMobile ? 'column' : 'row'} 
            spacing={2} 
            sx={{ 
              mt: 3,
              justifyContent: isMobile ? 'center' : 'flex-start' 
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ContactMailIcon />}
              onClick={handleOpenContactForm}
              sx={{ borderRadius: 2 }}
            >
              Contact Me
            </Button>
            
            {profile.contact.linkedin && (
              <Button
                variant="outlined"
                startIcon={<LinkedInIcon />}
                href={`https://${profile.contact.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderRadius: 2 }}
              >
                LinkedIn
              </Button>
            )}
            
            {profile.contact.github && (
              <Button
                variant="outlined"
                startIcon={<GitHubIcon />}
                href={`https://${profile.contact.github}`}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ borderRadius: 2 }}
              >
                GitHub
              </Button>
            )}
          </Stack>
        </Box>
      </Container>
      
      <ContactForm open={contactFormOpen} onClose={handleCloseContactForm} />
    </Box>
  );
};

export default Header; 