import { APIClient, Client } from './client';
import { Toggle, ToggleSelection } from './toggle';
import { PublicAuthenticator } from './authentication/public_authenticator';

export class UserToggles {
  private client: Client;
  private initialLoad: Promise<void>;
  private initialLoadComplete: boolean;
  private toggleSelections: {[key: string]: string|boolean;};

  constructor(private host: string,
              private publicKey: string,
              private userId: string,
              private version?: string,
              private anonymous?: boolean) {
    this.client = new APIClient(host, new PublicAuthenticator(publicKey));
  }

  load(): Promise<UserToggles> {
    return this.initialLoad.then(() => this);
  }

  getToggle(id: string, defaultValue?: string): string {
    if (this.initialLoadComplete) {
      let value = this.toggleSelections[id];
      if (value !== undefined) {
        return value as string;
      }
    }
    return defaultValue;
  }

  getTruthyToggle(id: string, defaultValue?: boolean): boolean {
    if (this.initialLoadComplete) {
      let value = this.toggleSelections[id];
      if (value !== undefined) {
        return value as boolean;
      }
    }
    return defaultValue;
  }

  private loadToggles() {
    let togglesQ = this.client.getToggles();
    let userTogglesQ: any = this.anonymous ? [] : this.client.getUserToggles(this.userId);

    this.initialLoad = Promise.all<Array<any>>([togglesQ, userTogglesQ]).then<void>((responses: Array<any>) => {
      let toggles: Toggle[] = responses[0];
      let selections: ToggleSelection[] = responses[1];
      let toggleSelections: { [key: string]: string | boolean; } = {};

      selections.forEach((selection: ToggleSelection) => {
        toggleSelections[selection.ToggleId] = selection.OptionValue;
      });

      toggles.forEach((toggle: Toggle) => {
        if (toggleSelections[toggle.Id] === undefined) {
          toggleSelections[toggle.Id] = toggle.getOption(this.userId, undefined, this.version);
        }
      });

      this.toggleSelections = toggleSelections;
    });
  }
}
