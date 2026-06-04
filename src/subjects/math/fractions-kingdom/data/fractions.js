function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y !== 0) {
    const temp = y;
    y = x % y;
    x = temp;
  }

  return x;
}

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function createReducibleFraction(seed) {
  const baseDenominators = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  const denominatorBase = randomFrom(baseDenominators);
  const maxNumerator = denominatorBase - 1;

  let numeratorBase = Math.floor(Math.random() * maxNumerator) + 1;
  while (gcd(numeratorBase, denominatorBase) !== 1) {
    numeratorBase = Math.floor(Math.random() * maxNumerator) + 1;
  }

  const scale = randomFrom([2, 3, 4, 5, 6]);

  return {
    id: `fraction-${seed}-${numeratorBase}-${denominatorBase}-${scale}`,
    fractionNumerator: numeratorBase * scale,
    fractionDenominator: denominatorBase * scale,
    reducedNumerator: numeratorBase,
    reducedDenominator: denominatorBase,
  };
}

export function generateBridgeBuilderQuestions(count = 12) {
  return Array.from({ length: count }, (_, index) => {
    const challenge = createReducibleFraction(index + 1);
    return {
      ...challenge,
      prompt: `Reduce ${challenge.fractionNumerator}/${challenge.fractionDenominator} to simplest form.`,
      story: 'Only simplified planks can lock into the bridge.',
    };
  });
}
