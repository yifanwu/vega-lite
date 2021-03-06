/* tslint:disable:quotemark */

import {assert} from 'chai';
import {AggregateNode} from '../../../src/compile/data/aggregate';
import {assembleData} from '../../../src/compile/data/assemble';
import {OutputNode} from '../../../src/compile/data/dataflow';
import {SourceNode} from '../../../src/compile/data/source';
import {Data} from '../../../src/data';
import {VgData} from '../../../src/vega.schema';

describe('compile/data/assemble', () => {
  describe('assembleData', () => {
    it('should assemble named data source', () => {
      const src = new SourceNode({name: 'foo'});
      const main = new OutputNode('mainOut', 'main');
      main.parent = src;

      assert.equal(main.source, 'mainOut');

      const data = assembleData({
        sources: {named: src},
        outputNodes: {out: main}
      });

      assert.deepEqual(data, [{
        name: 'foo'
      }]);
    });

    it('should assemble raw and main output', () => {
      const src = new SourceNode({url: 'foo.csv'});
      const raw = new OutputNode('rawOut', 'raw');
      raw.parent = src;
      const agg = new AggregateNode({a: true}, {b: {count: 'count_*'}});
      agg.parent = raw;
      const main = new OutputNode('mainOut', 'main');
      main.parent = agg;

      assert.equal(raw.source, 'rawOut');
      assert.equal(main.source, 'mainOut');

      const data = assembleData({
        sources: {named: src},
        outputNodes: {out: main}
      });

      assert.deepEqual<VgData[]>(data, [{
        name: 'source_0',
        url: 'foo.csv',
        format: {type: 'csv'}
      }, {
        name: 'data_0',
        source: 'source_0',
        transform: [{
          type: 'aggregate',
          groupby: ['a'],
          ops: ['count'],
          fields: ['b'],
          as: ['count_*']
        }]}
      ]);
    });
  });
});
