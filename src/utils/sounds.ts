// TODO: Download these sound effects from Pixabay and place them in the /public/sounds/ directory:
// - /sounds/collect-coin.mp3 (from https://cdn.pixabay.com/audio/2022/10/16/audio_12b5e8e5a2.mp3)
// - /sounds/level-up.mp3 (from https://cdn.pixabay.com/audio/2022/03/15/audio_115b6c8e2e.mp3)

// IMPORTANT: Sound files must exist in the /public/sounds/ directory and be valid, non-empty MP3 files.
// Required files:
// - /public/sounds/coin-recieved-230517.mp3 (for XP gain)
// - /public/sounds/orchestral-win-331233.mp3 (for level up)
// - /public/sounds/success-1-6297.mp3 (for button clicks)
// - /public/sounds/cute-level-up-2-189851.mp3 (for quest completion)
// If any of these files are missing or empty, you will see 416 Range Not Satisfiable errors.

// Sound effect paths (using local files in public directory)
export const SOUND_EFFECTS = {
  xp: '/sounds/coin-recieved-230517.mp3',      // Small reward sound (XP gain)
  levelup: '/sounds/orchestral-win-331233.mp3', // Major achievement (level up)
  click: '/sounds/success-1-6297.mp3',         // Button click feedback
  quest: '/sounds/cute-level-up-2-189851.mp3', // Quest completion
};

// Preload sound effects for better performance
export const preloadSoundEffects = () => {
  Object.values(SOUND_EFFECTS).forEach(url => {
    const audio = new Audio();
    audio.src = url;
    // Don't actually play the sound, just load it
    audio.load();
  });
};

// Play a sound effect by its key
export const playSoundEffect = (key: keyof typeof SOUND_EFFECTS) => {
  try {
    const audio = new Audio(SOUND_EFFECTS[key]);
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(error => {
      console.warn(`Failed to play sound effect ${key}:`, error);
    });
  } catch (error) {
    console.warn(`Error creating audio for ${key}:`, error);
  }
}; 