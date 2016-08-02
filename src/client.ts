import { Authenticator } from './authentication/authentication';
import { Toggle, ToggleSelection, ToggleSelectionData } from './toggle';

const TOGGLES = [
  Toggle.CreateFromData({
    Id: 'my-toggle-1',
    Description: 'My first toggle, it is disabled',
    SelectionAlgorithm: 'md5:abc,1000',
    EnableInVersions: undefined,
    Options: [
      {Value: false, Cutoff: 0},
      {Value: true, Cutoff: 1}
    ]
  }),
  Toggle.CreateFromData({
    Id: 'my-toggle-2',
    Description: 'A second toggle, 30% roll out',
    SelectionAlgorithm: 'md5:def,1000',
    EnableInVersions: '>2.0.3',
    Options: [
      {Value: false, Cutoff: 0},
      {Value: true, Cutoff: 0.7}
    ]
  }),
  Toggle.CreateFromData({
    Id: 'my-toggle-3',
    Description: 'Another toggle that is activated',
    SelectionAlgorithm: 'md5:ghi,1000',
    EnableInVersions: undefined,
    Options: [
      {Value: true, Cutoff: 0}
    ]
  }),
];

const SELECTIONS = [ToggleSelection.CreateFromData(<ToggleSelectionData>{ToggleId: 'my-toggle-2', OptionValue: true})];

export class ToggleAPIClient {
  constructor(private authenticator: Authenticator) {
  }

  getToggles(): Promise<Toggle[]> {
    return new Promise<Toggle[]>((r: any) => r(TOGGLES));
  }

  getUserToggles(userId: string): Promise<ToggleSelection[]> {
    return new Promise<ToggleSelection[]>((r: any) => r(SELECTIONS));
  }
}
