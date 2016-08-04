import { PublicClient } from './clients/client';
import { PublicAPIClient } from './clients/public-api-client';
import { Toggle } from './toggle';
import { ToggleSelection } from './toggle-selection';
import { PublicAuthenticator } from './authentication/public-authenticator';

export class UserToggles {
  private client: PublicClient;
  private initialLoad: Promise<void>;
  private initialLoadComplete: boolean;
  private toggleSelections: { [key: string]: string|boolean; };

  constructor(private host: string,
              private publicKey: string,
              private userId: string,
              private anonymous?: boolean,
              private version?: string) {
    this.client = new PublicAPIClient(host, new PublicAuthenticator(publicKey));
  }

  load(): Promise<UserToggles> {
    if (!this.initialLoad) {
      this.loadToggles();
    }
    return this.initialLoad.then(() => this);
  }

  getToggle(id: string, defaultValue?: boolean): boolean {
    if (this.initialLoadComplete) {
      let value = this.toggleSelections[id];
      if (value !== undefined) {
        return value as boolean;
      }
    }
    return defaultValue;
  }

  getToggleFlag(id: string, defaultValue?: string): string {
    if (this.initialLoadComplete) {
      let value = this.toggleSelections[id];
      if (value !== undefined) {
        return value as string;
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
