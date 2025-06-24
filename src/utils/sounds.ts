// Sound effect URLs from Pixabay (free for commercial use)
export const SOUND_EFFECTS = {
  xp: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b5e8e5a2.mp3',         // "Collect Coin" (XP gain)
  levelup: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b6c8e2e.mp3',    // "Level Up"
  click: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b5e8e5a2.mp3',      // "Button Click"
  quest: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b6c8e2e.mp3',      // "Quest Complete"
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