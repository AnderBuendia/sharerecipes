import { SelectOption } from '@Interfaces/select/option.interface';

export enum ActionType {
  SELECT_FOOD_STYLE = 'SELECT_FOOD_STYLE',
  SELECT_DIFFICULTY = 'SELECT_DIFFICULTY',
  ADD_INGREDIENTS = 'ADD_INGREDIENTS',
  REMOVE_INGREDIENTS = 'REMOVE_INGREDIENTS',
}

export interface SelectFoodStyleAction {
  type: ActionType.SELECT_FOOD_STYLE;
  payload: SelectOption;
}

export interface SelectDifficultyAction {
  type: ActionType.SELECT_DIFFICULTY;
  payload: SelectOption;
}

export interface AddIngredientsAction {
  type: ActionType.ADD_INGREDIENTS;
  payload: {
    indexes: number[];
    counter: number;
  };
}

export interface RemoveIngredientsAction {
  type: ActionType.REMOVE_INGREDIENTS;
  payload: {
    index: number;
    counter: number;
  };
}

export type Action =
  | SelectFoodStyleAction
  | SelectDifficultyAction
  | AddIngredientsAction
  | RemoveIngredientsAction;
