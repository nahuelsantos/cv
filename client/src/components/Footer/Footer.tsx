import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Box 
      component="footer" 
      sx={{
        py: 4,
        px: 2,
        bgcolor: 'primary.main',
        color: 'white',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © {currentYear} Nahuel Santos. All rights reserved.
        </Typography>
        <Typography variant="body2" align="center" sx={{ mt: 1 }}>
          <Link href="#experience" color="inherit" sx={{ mx: 1 }}>
            Experience
          </Link>
          |
          <Link href="#skills" color="inherit" sx={{ mx: 1 }}>
            Skills
          </Link>
          |
          <Link href="#education" color="inherit" sx={{ mx: 1 }}>
            Education
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer; 