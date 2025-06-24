import { useCallback } from 'react';
import useSound from 'use-sound';
import { SOUND_EFFECTS } from '@/utils/sounds';

export const useSoundEffects = () => {
  const [playXP] = useSound(SOUND_EFFECTS.xp, { volume: 0.5 });
  const [playLevelUp] = useSound(SOUND_EFFECTS.levelup, { volume: 0.5 });
  const [playClick] = useSound(SOUND_EFFECTS.click, { volume: 0.3 });
  const [playQuest] = useSound(SOUND_EFFECTS.quest, { volume: 0.5 });

  const playActionSound = useCallback(() => {
    playXP();
    playClick();
  }, [playXP, playClick]);

  const playLevelUpSound = useCallback(() => {
    playLevelUp();
    playQuest();
  }, [playLevelUp, playQuest]);

  return {
    playActionSound,
    playLevelUpSound,
    playClick,
    playQuest,
  };
}; 