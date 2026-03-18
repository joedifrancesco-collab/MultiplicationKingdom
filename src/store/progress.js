const KEY = 'mk_progress';

function defaultProgress() {
  return {
    kingdoms: Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      stars: 0,
      unlocked: i === 0,
    })),
  };
}

export function getProgress() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : defaultProgress();
  } catch {
    return defaultProgress();
  }
}

export function saveProgress(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
}

export function awardStars(kingdomId, stars) {
  const progress = getProgress();
  const kp = progress.kingdoms.find(k => k.id === kingdomId);
  if (!kp) return progress;

  if (stars > kp.stars) {
    kp.stars = stars;
  }

  if (stars >= 1 && kingdomId < 12) {
    const next = progress.kingdoms.find(k => k.id === kingdomId + 1);
    if (next) next.unlocked = true;
  }

  saveProgress(progress);
  return progress;
}
