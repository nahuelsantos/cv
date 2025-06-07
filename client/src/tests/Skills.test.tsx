import React from 'react';
import { render, screen } from '@testing-library/react';
import Skills from '../components/Skills';
import { ThemeProvider } from '@mui/material';
import theme from '../theme/theme';

const mockSkills = [
  {
    category: 'Test Category 1',
    items: ['Skill A', 'Skill B']
  },
  {
    category: 'Test Category 2',
    items: ['Skill C', 'Skill D']
  }
];

describe('Skills Component', () => {
  test('renders skills section with correct title', () => {
    render(
      <ThemeProvider theme={theme}>
        <Skills skills={mockSkills} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
  });

  test('renders all skill categories', () => {
    render(
      <ThemeProvider theme={theme}>
        <Skills skills={mockSkills} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Test Category 1')).toBeInTheDocument();
    expect(screen.getByText('Test Category 2')).toBeInTheDocument();
  });

  test('renders all skill items', () => {
    render(
      <ThemeProvider theme={theme}>
        <Skills skills={mockSkills} />
      </ThemeProvider>
    );
    
    expect(screen.getByText('Skill A')).toBeInTheDocument();
    expect(screen.getByText('Skill B')).toBeInTheDocument();
    expect(screen.getByText('Skill C')).toBeInTheDocument();
    expect(screen.getByText('Skill D')).toBeInTheDocument();
  });
}); 