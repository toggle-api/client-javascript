import { Authenticator } from '../authentication/authentication';
import { Toggle } from '../toggle';
import { PublicStaticClient, TOGGLES } from './public-api-client';
import { Client } from './client';

export class StaticClient extends PublicStaticClient {
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

export class APIClient extends StaticClient implements Client {
  constructor(private host: string, private authenticator: Authenticator) { super(); }
}
