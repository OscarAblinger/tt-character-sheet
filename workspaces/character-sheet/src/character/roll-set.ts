/**
 * Represents an entire roll.
 * May include multiple dice sets, as well as a constant value that will be added to the total.
 */
export type RollSet = {
  dice: DiceSet[];
  constant: number;
};

/**
 * Reperesents a set of dice with the same sides and modifiers.
 *
 * Two `DiceSet`s are only considered mergeable if the sides as well as modifiers are the same.
 */
export type DiceSet = {
  count: number;
  sides: number;
  /**
   * Modifiers represent any information regarding the dice roll that goes beyond the rolled numbers.
   * This can be something functional (like picking only the highest rolled number, or exploding dice),
   * but can also "only" have a game effect (like specifying a specific damage type).
   */
  modifiers: string[];
};

/**
 * Sums up two RollSets.
 */
export function addRollSets(first: RollSet, second: RollSet): RollSet {
  return {
    dice: simplifyDiceSets([...first.dice, ...second.dice]),
    constant: first.constant + second.constant,
  };
}

/**
 * Substract the second RollSet from the first.
 */
export function substractRollSets(minuend: RollSet, subtrahend: RollSet): RollSet {
  return addRollSets(minuend, negateRollSet(subtrahend));
}

/**
 * Returns a new RollSet that is the negation of the given one (multiplied by -1).
 */
export function negateRollSet(rollSet: RollSet): RollSet {
  return {
    constant: -rollSet.constant,
    dice: rollSet.dice.map((d) => ({
      ...d,
      count: -d.count,
    })),
  };
}

/**
 * Simplifies a RollSet by merging compatible dice and sorting them.
 */
export function simplifyRollSet(rollSet: RollSet): RollSet {
  return {
    constant: rollSet.constant,
    dice: simplifyDiceSets(rollSet.dice),
  };
}

/**
 * Simplifies a list of DiceSets by merging compatible sets.
 * Compatible sets have the same number of sides and the same modifiers.
 * Additionally sorts the list as well as all modifiers.
 */
function simplifyDiceSets(dice: DiceSet[]): DiceSet[] {
  const merged = new Map<string, DiceSet>();

  for (const die of dice) {
    if (die.count === 0) continue;

    const sortedModifiers = [...die.modifiers].sort();

    const key = `${die.sides}:${JSON.stringify(sortedModifiers)}`;

    const existing = merged.get(key);
    if (existing) {
      existing.count += die.count;
    } else {
      merged.set(key, {
        count: die.count,
        sides: die.sides,
        modifiers: sortedModifiers,
      });
    }
  }

  const sortedEntries = [...merged];
  sortedEntries.sort((a, b) => String(a[0]).localeCompare(b[0]));

  return sortedEntries.map(([, diceSet]) => diceSet).filter((ds) => ds.count !== 0);
}

/**
 * Checks if two RollSets are equal.
 * Equality is defined as having the same modifier and the same set of dice (ignoring order).
 * Dice are considered equal if they have the same count, sides, and modifiers (ignoring order).
 *
 * Requires both RollSets to be simplified already!
 * Use `simplifyRollSet` if you are unsure.
 */
export function areSimplifiedRollSetsEqual(a: RollSet, b: RollSet): boolean {
  if (a.constant !== b.constant) {
    return false;
  }

  const diceA = a.dice;
  const diceB = b.dice;

  if (diceA.length !== diceB.length) {
    return false;
  }

  for (let i = 0; i < diceA.length; i++) {
    const dA = diceA[i];
    const dB = diceB[i];

    if (dA.count !== dB.count || dA.sides !== dB.sides) {
      return false;
    }

    if (dA.modifiers.length !== dB.modifiers.length) {
      return false;
    }
    for (let j = 0; j < dA.modifiers.length; j++) {
      if (dA.modifiers[j] !== dB.modifiers[j]) {
        return false;
      }
    }
  }

  return true;
}
