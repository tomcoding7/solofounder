import { useEffect } from 'react';
import { playSoundEffect, preloadSoundEffects } from '@/utils/sounds';

export function useSoundEffects() {
  useEffect(() => {
    // Preload all sound effects when the component mounts
    preloadSoundEffects();
  }, []);

  return {
    playXP: () => playSoundEffect('xp'),
    playLevelUp: () => playSoundEffect('levelup'),
    playClick: () => playSoundEffect('click'),
    playQuest: () => playSoundEffect('quest'),
  };
} 