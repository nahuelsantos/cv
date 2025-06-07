import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button, 
  Box, 
  Stack,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
// import api from '../../utils/api'; // TODO: Uncomment when integrating with backend

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
}

interface AlertState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const ContactForm: React.FC<ContactFormProps> = ({ open, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<AlertState>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form validation states
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [messageError, setMessageError] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset validation errors
    setNameError(false);
    setEmailError(false);
    setMessageError(false);
    
    // Simple validation
    let hasError = false;
    
    if (!name.trim()) {
      setNameError(true);
      hasError = true;
    }
    
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError(true);
      hasError = true;
    }
    
    if (!message.trim()) {
      setMessageError(true);
      hasError = true;
    }
    
    if (hasError) {
      return;
    }
    
    setLoading(true);
    
    try {
      // TODO: Integrate with actual form service (Netlify Forms, Formspree, etc.)
      // await api.post('/contact', { name, email, message });
      console.log('Form submission:', { name, email, message });
      
      setAlert({
        open: true,
        message: 'Your message has been sent successfully!',
        severity: 'success'
      });
      
      // Reset form and close dialog
      setName('');
      setEmail('');
      setMessage('');
      onClose();
    } catch (error) {
      setAlert({
        open: true,
        message: 'There was a problem sending your message. Please try again later.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };
  
  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Typography variant="h4" component="div">
            Contact Me
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Stack spacing={3}>
              <TextField
                label="Your Name"
                fullWidth
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={nameError}
                helperText={nameError ? "Name is required" : ""}
                disabled={loading}
              />
              
              <TextField
                label="Your Email"
                fullWidth
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? "Valid email is required" : ""}
                disabled={loading}
              />
              
              <TextField
                label="Message"
                fullWidth
                required
                multiline
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                error={messageError}
                helperText={messageError ? "Message is required" : ""}
                disabled={loading}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={onClose} 
            variant="outlined"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleAlertClose} 
          severity={alert.severity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ContactForm; 