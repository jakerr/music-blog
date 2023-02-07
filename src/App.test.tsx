import React from 'react';
import { render, screen } from '@testing-library/react';
import MajorModesTutorial from './MajorModesTutorial';

test('renders learn react link', () => {
  render(<MajorModesTutorial />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
