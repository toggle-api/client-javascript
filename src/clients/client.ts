import { Toggle } from '../toggle';
import { ToggleSelection } from '../toggle-selection';

export interface PublicClient {
  getToggles(): Promise<Toggle[]>;
  getUserToggles(userId: string): Promise<ToggleSelection[]>;
}

export interface Client extends PublicClient {
  createToggle(toggleId: string): Promise<Toggle>;
  updateToggle(toggle: Toggle): Promise<Toggle>;
}