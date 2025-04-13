import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton,
  Menu,
  MenuItem,
  Container,
  useScrollTrigger,
  Slide,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

interface NavigationProps {
  transparent?: boolean;
}

interface HideOnScrollProps {
  window?: () => Window;
  children: React.ReactElement;
}

const HideOnScroll = (props: HideOnScrollProps) => {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
};

const Navigation: React.FC<NavigationProps> = ({ transparent = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navItems = [
    { name: 'Experience', href: '#experience' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
  ];

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        elevation={transparent ? 0 : 1}
        sx={{ 
          bgcolor: transparent ? 'transparent' : 'background.paper',
          color: transparent ? 'white' : 'text.primary',
          borderBottom: !transparent ? '1px solid' : 'none',
          borderColor: 'divider',
          transition: 'all 0.3s ease',
          backdropFilter: transparent ? 'none' : 'blur(8px)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ py: 1 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
            >
              Nahuel Santos
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {navItems.map((item) => (
                  <MenuItem key={item.name} onClick={handleCloseNavMenu}>
                    <Typography 
                      textAlign="center" 
                      component="a" 
                      href={item.href}
                      sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {item.name}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
              >
                Nahuel Santos
              </Typography>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  href={item.href}
                  sx={{ 
                    mx: 1,
                    color: 'inherit',
                    '&:hover': {
                      backgroundColor: transparent ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  {item.name}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navigation; 