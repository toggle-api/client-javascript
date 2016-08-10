import { Authenticator } from '../authentication/authentication';
import { Toggle } from '../toggle';
import { ToggleSelection, ToggleSelectionData } from '../toggle-selection';
import { PublicClient } from './client';
import { HTTPClientConstructor } from './http/client';

import { BrowserHTTPClient } from './http/browser';
import { NodeHTTPClient } from './http/node';

export let HTTPClientFactory: HTTPClientConstructor;

if (typeof window === 'undefined') {
  HTTPClientFactory = NodeHTTPClient;
} else {
  HTTPClientFactory = BrowserHTTPClient;
}

export const TOGGLES: Array<any> = [
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

export const SELECTIONS = [<ToggleSelectionData>{ToggleId: 'my-toggle-2', OptionValue: true}];

export class PublicStaticClient implements PublicClient {
  getToggles(): Promise<Toggle[]> {
    return Promise.resolve(TOGGLES.map(Toggle.CreateFromData));
  }

  getUserToggles(userId: string): Promise<ToggleSelection[]> {
    return Promise.resolve(SELECTIONS.map(ToggleSelection.CreateFromData));
  }
}

export class PublicAPIClient extends PublicStaticClient {
  constructor(private host: string, private authenticator: Authenticator) {
    super();
  }
}
