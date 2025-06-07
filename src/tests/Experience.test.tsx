import React from 'react';
import { render, screen } from '@testing-library/react';
import Experience from '../components/Experience';
import { ThemeProvider } from '@mui/material';
import theme from '../theme/theme';

const mockExperiences = [
  {
    company: 'Test Company',
    location: 'Test Location',
    title: 'Test Title',
    period: '2022 - Present',
    responsibilities: [
      'Responsibility 1',
      'Responsibility 2'
    ]
  }
];

describe('Experience Component', () => {
  test('renders experience section with correct title', () => {
    render(
      <ThemeProvider theme={theme}>
        <Experience experiences={mockExperiences} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Experience')).toBeInTheDocument();
  });

  test('renders company name and title correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Experience experiences={mockExperiences} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Title at Test Company')).toBeInTheDocument();
  });

  test('renders period correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Experience experiences={mockExperiences} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('2022 - Present')).toBeInTheDocument();
  });

  test('renders location correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Experience experiences={mockExperiences} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  test('renders all responsibilities', () => {
    render(
      <ThemeProvider theme={theme}>
        <Experience experiences={mockExperiences} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Responsibility 1')).toBeInTheDocument();
    expect(screen.getByText('Responsibility 2')).toBeInTheDocument();
  });
});