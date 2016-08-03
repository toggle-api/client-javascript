export interface ToggleSelectionData {
  ToggleId: string;
  OptionValue: string|boolean;
}

export class ToggleSelection implements ToggleSelectionData {
  ToggleId: string;
  OptionValue: string|boolean;

  static CreateFromData(data: ToggleSelectionData): ToggleSelection {
    let instance = new ToggleSelection();
    instance.ToggleId = data.ToggleId;
    instance.OptionValue = data.OptionValue;
    return instance;
  }
}
