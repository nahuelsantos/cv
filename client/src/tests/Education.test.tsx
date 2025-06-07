import React from 'react';
import { render, screen } from '@testing-library/react';
import Education from '../components/Education';
import { ThemeProvider } from '@mui/material';
import theme from '../theme/theme';

const mockEducation = [
  {
    degree: 'Test Degree',
    institution: 'Test University',
    period: '2015 - 2019',
    description: 'Test description for education'
  }
];

const mockCertifications = [
  {
    title: 'Test Certification',
    issuer: 'Test Issuer',
    period: '2020',
    description: 'Test description for certification'
  }
];

describe('Education Component', () => {
  test('renders education section with correct title', () => {
    render(
      <ThemeProvider theme={theme}>
        <Education education={mockEducation} certifications={mockCertifications} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Education & Certifications')).toBeInTheDocument();
  });

  test('renders academic education subsection', () => {
    render(
      <ThemeProvider theme={theme}>
        <Education education={mockEducation} certifications={mockCertifications} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Academic Education')).toBeInTheDocument();
  });

  test('renders certifications subsection', () => {
    render(
      <ThemeProvider theme={theme}>
        <Education education={mockEducation} certifications={mockCertifications} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Certifications & Specializations')).toBeInTheDocument();
  });

  test('renders education details correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Education education={mockEducation} certifications={mockCertifications} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Degree')).toBeInTheDocument();
    expect(screen.getByText('Test University')).toBeInTheDocument();
    expect(screen.getByText('2015 - 2019')).toBeInTheDocument();
    expect(screen.getByText('Test description for education')).toBeInTheDocument();
  });

  test('renders certification details correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Education education={mockEducation} certifications={mockCertifications} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Certification')).toBeInTheDocument();
    expect(screen.getByText('Test Issuer')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('Test description for certification')).toBeInTheDocument();
  });
}); 