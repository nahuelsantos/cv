import React from 'react';
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
  Email as EmailIcon, 
  LinkedIn as LinkedInIcon, 
  GitHub as GitHubIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { Profile } from '../../types';

interface HeaderProps {
  profile: Profile;
}

const Header: React.FC<HeaderProps> = ({ profile }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box 
      component="header" 
      sx={{
        py: 8,
        px: 2,
        bgcolor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: isMobile ? 'center' : 'left' }}>
          <Typography variant="h1" component="h1" gutterBottom>
            {profile.name}
          </Typography>
          <Typography 
            variant="h5" 
            component="h2" 
            gutterBottom 
            sx={{ color: 'text.secondary', fontWeight: 400 }}
          >
            {profile.title}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <LocationIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="body1" color="text.secondary">
              {profile.location}
            </Typography>
          </Box>

          <Box sx={{ my: 3 }}>
            <Typography variant="body1" paragraph>
              {profile.summary}
            </Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Stack 
            direction={isMobile ? 'column' : 'row'} 
            spacing={2} 
            sx={{ 
              mt: 3,
              justifyContent: isMobile ? 'center' : 'flex-start' 
            }}
          >
            {profile.contact.email && (
              <Button
                variant="outlined"
                startIcon={<EmailIcon />}
                href={`mailto:${profile.contact.email}`}
                sx={{ borderRadius: 2 }}
              >
                Email
              </Button>
            )}
            
            {profile.contact.phone && (
              <Button
                variant="outlined"
                startIcon={<PhoneIcon />}
                href={`tel:${profile.contact.phone}`}
                sx={{ borderRadius: 2 }}
              >
                Call
              </Button>
            )}
            
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
    </Box>
  );
};

export default Header; 