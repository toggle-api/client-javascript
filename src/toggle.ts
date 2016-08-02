import { SelectionMethod } from './selection_methods/selection_method';
import { MD5 } from './selection_methods/md5';
import * as SemVer from 'semver';

export interface ToggleData {
  Id: string;
  Description: string;
  SelectionAlgorithm: string;
  EnableInVersions: string;
  Options: ToggleOptionData[];
}

export class Toggle implements ToggleData {
  Id: string;
  Description: string;
  SelectionAlgorithm: string;
  EnableInVersions: string;
  Options: ToggleOptionData[];

  static CreateFromData(data: ToggleData) {
    var instance = new this();
    instance.Id = data.Id;
    instance.Description = data.Description;
    instance.SelectionAlgorithm = data.SelectionAlgorithm;
    instance.EnableInVersions = data.EnableInVersions;
    instance.Options = data.Options;
    return instance;
  }

  getSelectionAlgorithm(): SelectionMethod {
    let md5_match: RegExpMatchArray;
    if (md5_match = this.SelectionAlgorithm.match(/^md5:(.+),(\d+)$/)) {
      return new MD5(md5_match[1], parseInt(md5_match[2], 10));
    }
    return undefined;
  }

  getOption(userId: string, default_value: string|boolean, version?: string): string|boolean {
    if (version === undefined || this.enabledIn(version)) {
      return this.getSelection(userId, default_value);
    }
    return default_value;
  }

  getSelection(userId: string, default_value: string|boolean): string|boolean {
    let selection_method = this.getSelectionAlgorithm();
    if (selection_method === undefined) {
      return default_value;
    }
    let selection_number = selection_method.CalculateSelection(userId);
    let options = this.Options.filter((option: ToggleOptionData) => option.Cutoff < selection_number);
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

export interface ToggleSelectionData {
  ToggleId: string;
  OptionValue: string|boolean;
}

export class ToggleSelection implements ToggleSelectionData {
  ToggleId: string;
  OptionValue: string|boolean;

  static CreateFromData(data: ToggleSelectionData): ToggleSelection {
    var instance = new this();
    instance.ToggleId = data.ToggleId;
    instance.OptionValue = data.OptionValue;
    return instance;
  }
}
