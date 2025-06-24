import useSound from 'use-sound';

export function useSoundEffects() {
  const [playXP] = useSound('/sounds/xp.mp3', { volume: 0.5 });
  const [playLevelUp] = useSound('/sounds/level-up.mp3', { volume: 0.7 });
  const [playClick] = useSound('/sounds/click.mp3', { volume: 0.3 });
  const [playQuest] = useSound('/sounds/quest-complete.mp3', { volume: 0.6 });

  return {
    playXP,
    playLevelUp,
    playClick,
    playQuest,
  };
} 