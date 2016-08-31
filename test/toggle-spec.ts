import { expect } from 'chai';
import { Toggle, ToggleData } from '../src/toggle';
import { MD5 } from '../src/selection-methods/md5';

describe('Toggle', () => {
  it('can be created from data', () => {
    let toggle = Toggle.CreateFromData(<ToggleData>{
      Id: 'my-id',
      Description: 'This is my toggle.',
      EnableInVersions: '>2.0.3',
      SelectionAlgorithm: 'md5:asd,1000',
      Options: [
        {Value: false, Cutoff: 0.5},
        {Value: true, Cutoff: 1}
      ]
    });
    expect(toggle.Id).to.equal('my-id');
    expect(toggle.Description).to.equal('This is my toggle.');
    expect(toggle.EnableInVersions).to.equal('>2.0.3');
    expect(toggle.SelectionAlgorithm).to.equal('md5:asd,1000');
    expect(toggle.Options.length).to.equal(2);
  });

  describe('getSelectionAlgorithm', () => {
    let toggle = new Toggle();
    it('selects MD5 with md5', () => {
      toggle.SelectionAlgorithm = 'md5:my_salt,12345';
      let selection_algorithm = toggle.getSelectionAlgorithm();
      expect(selection_algorithm).to.be.instanceOf(MD5);
      expect(selection_algorithm!['salt']).to.equal('my_salt');
      expect(selection_algorithm!['int']).to.equal(12345);
    });

    it('is undefined with unknown algorithm', () => {
      toggle.SelectionAlgorithm = 'blah';
      expect(toggle.getSelectionAlgorithm()).to.equal(undefined);
    });
  });

  describe('getOption', () => {
    let toggle: Toggle;
    beforeEach(() => {
      toggle = new Toggle();
      toggle.getSelection = (a: any, b: any) => { return true; };
    });
    it('ignores version if no version is passed', () => {
      toggle.EnableInVersions = '>1.0.3';
      expect(toggle.getOption('id', false)).to.equal(true);
    });
    it('ignores version if no enable in versions is set', () => {
      toggle.EnableInVersions = undefined;
      expect(toggle.getOption('id', false, '1.3.2')).to.equal(true);
    });
    it('gets selection if versions match', () => {
      toggle.EnableInVersions = '>1.0.1';
      expect(toggle.getOption('id', false, '2.7.4')).to.equal(true);
    });
    it('defaults if versions match', () => {
      toggle.EnableInVersions = '>2.7.4';
      expect(toggle.getOption('id', false, '1.0.1')).to.equal(false);
    });
  });

  describe('getSelection', () => {
    let toggle: Toggle;

    function mockSelection(value: number) {
      toggle.getSelectionAlgorithm = () => { return { CalculateSelection: () => value }; };
    }

    beforeEach(() => {
      toggle = new Toggle();
      toggle.Options = [{ Value: false, Cutoff: 0 }, { Value: true, Cutoff: .3 }];
    });
    it('defaults if no selection method is found', () => {
      toggle.SelectionAlgorithm = 'blah';
      expect(toggle.getSelection('id', false)).to.equal(false);
    });
    it('selects only option if there is one option', () => {
      toggle.Options = [{Value: true, Cutoff: 0}];
      expect(toggle.getSelection('id', false)).to.equal(true);
    });
    it('selects 0 option when 0', () => {
      mockSelection(0);
      expect(toggle.getSelection('id', false)).to.equal(false);
    });
    it('selects lower option when below cutoff', () => {
      mockSelection(0.2);
      expect(toggle.getSelection('id', false)).to.equal(false);
    });
    it('selects upper option when at cutoff', () => {
      mockSelection(0.3);
      expect(toggle.getSelection('id', false)).to.equal(true);
    });
    it('selects upper option when above cutoff', () => {
      mockSelection(0.5);
      expect(toggle.getSelection('id', false)).to.equal(true);
    });
    it('selects upper option when 1', () => {
      mockSelection(1);
      expect(toggle.getSelection('id', false)).to.equal(true);
    });
  });

  describe('enabledIn', () => {
    let toggle = new Toggle();
    it('uses semver to match versions', () => {
      toggle.EnableInVersions = '2.0.1';
      expect(toggle.enabledIn('2.0.1')).to.equal(true);
      toggle.EnableInVersions = '>2.0.1';
      expect(toggle.enabledIn('2.0.1')).to.equal(false);
      toggle.EnableInVersions = '>=2.0.1';
      expect(toggle.enabledIn('2.0.1')).to.equal(true);
      toggle.EnableInVersions = '~2.0';
      expect(toggle.enabledIn('2.0.1')).to.equal(true);
    });
  });
});
