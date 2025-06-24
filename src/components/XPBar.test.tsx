import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import XPBar from './XPBar';

// Mock the game utils
vi.mock('@/utils/game', () => ({
  getNextLevelXp: (xp: number) => {
    if (xp < 100) return 100;
    if (xp < 300) return 300;
    return xp + 1000;
  },
  getCurrentLevelXp: (xp: number) => {
    if (xp < 100) return 0;
    if (xp < 300) return 100;
    return 300;
  }
}));

describe('XPBar', () => {
  it('displays current level', () => {
    render(<XPBar level={1} xp={0} />);
    expect(screen.getByText(/Level 1/)).toBeInTheDocument();
  });

  it('displays XP progress correctly for level 1', () => {
    render(<XPBar level={1} xp={50} />);
    expect(screen.getByText('50 / 100 XP')).toBeInTheDocument();
  });

  it('displays XP progress correctly for level 2', () => {
    render(<XPBar level={2} xp={150} />);
    expect(screen.getByText('50 / 200 XP')).toBeInTheDocument();
  });

  it('updates when XP changes', () => {
    const { rerender } = render(<XPBar level={1} xp={0} />);
    expect(screen.getByText('0 / 100 XP')).toBeInTheDocument();

    rerender(<XPBar level={1} xp={50} />);
    expect(screen.getByText('50 / 100 XP')).toBeInTheDocument();
  });

  it('updates when level changes', () => {
    const { rerender } = render(<XPBar level={1} xp={99} />);
    expect(screen.getByText(/Level 1/)).toBeInTheDocument();

    rerender(<XPBar level={2} xp={100} />);
    expect(screen.getByText(/Level 2/)).toBeInTheDocument();
  });
}); 