import { expect } from 'chai';
import { ToggleSelection } from '../src/toggle-selection';

describe('ToggleSelection', () => {
  it('can be created from data', () => {
    let toggle_selection = ToggleSelection.CreateFromData({ToggleId: 'my-id', OptionValue: true});
    expect(toggle_selection.ToggleId).to.equal('my-id');
    expect(toggle_selection.OptionValue).to.equal(true);
  });
});
