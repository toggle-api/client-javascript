export type OptionValue = string | boolean;

export interface ToggleSelectionData {
  ToggleId: string;
  OptionValue: OptionValue;
}

export class ToggleSelection implements ToggleSelectionData {
  ToggleId: string;
  OptionValue: OptionValue;

  static CreateFromData(data: ToggleSelectionData): ToggleSelection {
    let instance = new ToggleSelection();
    instance.ToggleId = data.ToggleId;
    instance.OptionValue = data.OptionValue;
    return instance;
  }
}
