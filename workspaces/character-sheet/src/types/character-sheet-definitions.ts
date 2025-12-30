import { RollSet } from "../character/roll-set";

export type UnresolvedDataSet = {
  featuresSets: FeatureSetDefinition[];
};

export type FeatureSetDefinition = {
  /**
   * Used when referencing it. E.g. `cursedRingOfInvisiblity`
   */
  id: string;
  /**
   * Human readable name. E.g. `Ring of Invisibility`
   */
  name: string;
  description: string;
  features: FeatureDefinition[];
};

export type FeatureDefinition = {
  /**
   * Used when referencing it.
   */
  id: string;
  /**
   * Human readable name.
   */
  name: string;
  description: string;
  /**
   * Properties are scoped to the individual feature.
   */
  properties: FeaturePropertyDefinition[];
  /**
   * Attributes are character-level values.
   */
  attributes: AttributeDefinition[];
  modifiers: Modifiers[];
};

export type FeaturePropertyDefinition = {
  id: string;
  valueDefinition: ValueDefinition;
};

export type AttributeDefinition = {
  id: string;
  valueDefinition: ValueDefinition;
};

export type ValueDefinition =
  | {
      type: "number";
      defaultValue: number;
    }
  | {
      type: "dice";
      defaultValue: RollSet;
    };

export type Modifiers = { key: string; calc: ModifierCalculation };

export type ModifierCalculation =
  | {
      operation: Operation;
      arguments: (ModifierCalculation | ConstantValue)[];
    }
  | {
      referencedKey: string;
    };

export type Operation = string;

export type ConstantValue = number | RollSet;
