import { Authenticator } from './authentication/authentication';
import { Toggle, ToggleSelection, ToggleSelectionData } from './toggle';

export interface Client {
  getToggles(): Promise<Toggle[]>;
  getUserToggles(userId: string): Promise<ToggleSelection[]>;
  createToggle(toggleId: string): Promise<Toggle>;
  updateToggle(toggle: Toggle): Promise<Toggle>;
}

const TOGGLES = [
  {
    Id: 'my-toggle-1',
    Description: 'My first toggle, it is disabled',
    SelectionAlgorithm: 'md5:abc,1000',
    EnableInVersions: undefined,
    Options: [
      {Value: false, Cutoff: 0},
      {Value: true, Cutoff: 1}
    ]
  },
  {
    Id: 'my-toggle-2',
    Description: 'A second toggle, 30% roll out',
    SelectionAlgorithm: 'md5:def,1000',
    EnableInVersions: '>2.0.3',
    Options: [
      {Value: false, Cutoff: 0},
      {Value: true, Cutoff: 0.7}
    ]
  },
  {
    Id: 'my-toggle-3',
    Description: 'Another toggle that is activated',
    SelectionAlgorithm: 'md5:ghi,1000',
    EnableInVersions: undefined,
    Options: [
      {Value: true, Cutoff: 0}
    ]
  },
];

const SELECTIONS = [<ToggleSelectionData>{ToggleId: 'my-toggle-2', OptionValue: true}];

export class StaticClient implements Client {
  getToggles(): Promise<Toggle[]> {
    return Promise.resolve(TOGGLES.map(Toggle.CreateFromData));
  }

  getUserToggles(userId: string): Promise<ToggleSelection[]> {
    return Promise.resolve(SELECTIONS.map(ToggleSelection.CreateFromData));
  }

  createToggle(toggleId: string): Promise<Toggle> {
    let toggle = new Toggle();
    toggle.Id = toggleId;
    TOGGLES.push(Object.assign({}, toggle));
    return Promise.resolve(toggle);
  }

  updateToggle(toggle: Toggle): Promise<Toggle> {
    let id = TOGGLES.findIndex(t => t.Id === toggle.Id);
    TOGGLES[id] = Object.assign({}, toggle);
    return Promise.resolve(Toggle.CreateFromData(TOGGLES[id]));
  }
}

export class APIClient extends StaticClient {
  constructor(private host: string, private authenticator: Authenticator) { super(); }
}
