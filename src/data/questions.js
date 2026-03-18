const KINGDOM_NAMES = [
  'The Ones Land',
  'Twin Peaks',
  'Triple Forest',
  'Quad Castle',
  'Five Peaks',
  'Hex Island',
  'Lucky Seven',
  'Octo Realm',
  'Nine Gates',
  'Deca Dunes',
  'Eleven Hills',
  'The Final Kingdom',
];

const KINGDOM_COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0',
  '#F44336', '#00BCD4', '#FFC107', '#FF5722',
  '#3F51B5', '#009688', '#795548', '#607D8B',
];

export const KINGDOMS = Array.from({ length: 12 }, (_, k) => {
  const multiplier = k + 1;
  return {
    id: multiplier,
    name: KINGDOM_NAMES[k],
    color: KINGDOM_COLORS[k],
    multiplier,
    questions: Array.from({ length: 12 }, (_, i) => {
      const factor = i + 1;
      return {
        id: `${multiplier}x${factor}`,
        a: multiplier,
        b: factor,
        question: `${multiplier} × ${factor}`,
        answer: multiplier * factor,
      };
    }),
  };
});

export const ALL_QUESTIONS = KINGDOMS.flatMap(k => k.questions);
