import { describe, it, expect } from 'vitest';
import { calculateLevel, getNextLevelXp, getCurrentLevelXp, calculateProgress } from './game';

describe('Game Logic', () => {
  describe('calculateLevel', () => {
    it('returns level 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('returns level 1 for 99 XP', () => {
      expect(calculateLevel(99)).toBe(1);
    });

    it('returns level 2 at 100 XP', () => {
      expect(calculateLevel(100)).toBe(2);
    });

    it('returns level 3 at 300 XP', () => {
      expect(calculateLevel(300)).toBe(3);
    });

    it('returns correct level for high XP values', () => {
      expect(calculateLevel(5000)).toBe(10); // Level 10 is max level
    });

    it('caps at max level', () => {
      expect(calculateLevel(99999)).toBe(11); // LEVEL_THRESHOLDS.length + 1
    });
  });

  describe('getNextLevelXp', () => {
    it('returns 100 for level 1', () => {
      expect(getNextLevelXp(0)).toBe(100);
    });

    it('returns 300 for level 2', () => {
      expect(getNextLevelXp(100)).toBe(300);
    });

    it('returns next threshold for mid-level XP', () => {
      expect(getNextLevelXp(150)).toBe(300);
    });

    it('returns XP + 1000 for max level', () => {
      const maxLevelXp = 6000;
      expect(getNextLevelXp(maxLevelXp)).toBe(maxLevelXp + 1000);
    });
  });

  describe('getCurrentLevelXp', () => {
    it('returns 0 for level 1', () => {
      expect(getCurrentLevelXp(0)).toBe(0);
    });

    it('returns 0 for level 1 with some XP', () => {
      expect(getCurrentLevelXp(50)).toBe(0);
    });

    it('returns 100 for level 2', () => {
      expect(getCurrentLevelXp(150)).toBe(100);
    });

    it('returns correct threshold for higher levels', () => {
      expect(getCurrentLevelXp(1200)).toBe(1000); // Level 5 starts at 1000 XP
    });
  });

  describe('calculateProgress', () => {
    it('returns 0% at start of level', () => {
      expect(calculateProgress(0)).toBe(0);
    });

    it('returns 50% at midpoint between levels', () => {
      // Level 1: 0-100 XP, so 50 XP should be 50%
      expect(calculateProgress(50)).toBe(50);
    });

    it('returns 100% at level threshold', () => {
      expect(calculateProgress(100)).toBe(100);
    });

    it('returns correct progress for mid-level XP', () => {
      // Level 2: 100-300 XP, so 200 XP should be 50%
      const progress = calculateProgress(200);
      expect(progress).toBe(50);
    });

    it('caps progress at 100%', () => {
      // At max level, progress should be capped at 100%
      const maxLevelXp = 6000;
      expect(calculateProgress(maxLevelXp)).toBe(100);
    });

    it('prevents negative progress', () => {
      expect(calculateProgress(-50)).toBe(0);
    });
  });
}); 