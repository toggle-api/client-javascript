import { SelectionMethod } from './selection-methods/selection-method';
import { MD5 } from './selection-methods/md5';
import { OptionValue } from './toggle-selection';
import * as SemVer from 'semver';

export interface ToggleData {
  Id: string;
  Description: string;
  SelectionAlgorithm: string;
  EnableInVersions?: string;
  Options: ToggleOptionData[];
}

export class Toggle implements ToggleData {
  Id: string;
  Description: string;
  SelectionAlgorithm: string;
  EnableInVersions?: string;
  Options: ToggleOptionData[];

  static CreateFromData(data: ToggleData) {
    let instance = new Toggle();
    instance.Id = data.Id;
    instance.Description = data.Description;
    instance.SelectionAlgorithm = data.SelectionAlgorithm;
    instance.EnableInVersions = data.EnableInVersions;
    instance.Options = data.Options;
    return instance;
  }

  getSelectionAlgorithm(): SelectionMethod | undefined {
    let match: RegExpMatchArray | null;
    if (match = this.SelectionAlgorithm.match(/^md5:(.+),(\d+)$/)) {
      return new MD5(match[1], parseInt(match[2], 10));
    }
    return undefined;
  }

  canSelect(version?: string): boolean {
    return (version === undefined || this.enabledIn(version)) && this.getSelectionAlgorithm() !== undefined;
  }

  getOption(userId: string, default_value: OptionValue, version?: string): OptionValue {
    if (version === undefined || this.enabledIn(version)) {
      return this.getSelection(userId, default_value);
    }
    return default_value;
  }

  getSelection(userId: string, default_value: OptionValue): OptionValue {
    if (this.Options.length === 1) {
      return this.Options[0].Value;
    }

    let selection_method = this.getSelectionAlgorithm();
    if (selection_method === undefined) {
      return default_value;
    }

    let selection_number = selection_method.CalculateSelection(userId);

    let options = this.Options.filter((option: ToggleOptionData) => option.Cutoff <= selection_number);
    let highest = options.map<number>(option => option.Cutoff).reduce<number>((a, b) => Math.max(a, b), 0);
    return options.filter(option => option.Cutoff === highest)[0].Value;
  }

  enabledIn(version: string): boolean {
    return this.EnableInVersions === undefined || SemVer.satisfies(version, this.EnableInVersions);
  }
}

export interface ToggleOptionData {
  Value: string|boolean;
  Cutoff: number;
}
