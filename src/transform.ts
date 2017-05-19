import {AggregateOp} from './aggregate';
import {Bin} from './bin';
import {Data} from './data';
import {Filter} from './filter';
import {TimeUnit} from './timeunit';
import {VgFieldRef} from './vega.schema';

export interface FilterTransform {
  /**
   * A string containing the filter Vega expression. Use `datum` to refer to the current data object.
   */
  filter: Filter;
}

export function isFilter(t: Transform): t is FilterTransform {
  return t['filter'] !== undefined;
}


export interface CalculateTransform {
  /**
   * A string containing a Vega Expression. Use the variable `datum` to refer to the current data object.
   */
  calculate: string;
  /**
   * The field for storing the computed formula value.
   */
  as: string;
}

export interface BinTransform {
  /**
   * Binning properties or boolean flag for determining whether to bin data or not.
   */
  bin: boolean | Bin;

  /**
   * The data field to bin.
   */
  field: string;

  /**
   * The output fields at which to write the start and end bin values.
   */
  as: string;
}

export interface TimeUnitTransform {
  /**
   * The timeUnit for calculating derived values.
   */
  timeUnit: TimeUnit;

  /**
   * The data field to use this timeUnit on.
   */
  field: string;

  /**
   * The output field at which to write the timeUnit value.
   */
  as: string;
}

export interface SummarizeTransform {
  /**
   * Array of objects that contains aggregate information for the transform.
   */
  summarize: Summarize[];

  /**
   * The data fields to group by. If not specified, a single group containing all data objects will be used.
   */
  groupby: string[];
}

export interface Summarize {
  /**
   * The aggregation operations to apply to the fields, such as sum, average or count. See the aggregate operation reference for more.
   */
  aggregate: AggregateOp;

  /**
   * The data field for which to compute aggregate function.
   */
  field: string;

  /**
   * The output field names to use for each aggregated field in field. If not specified, names will be automatically generated based on the operation and field names (e.g., sum_field, average_field).
   */
  as: string;
}

export interface LookupData {
  /**
   * secondary data source to lookup in
   */
  data: Data;
  /**
   * key in data to lookup
   */
  key: string;
  /**
   * (Optional) fields in foreign data to lookup
   * if not specificied, the entire object is queried
   */
  fields?: string[];
}

export interface LookupTransform {
  /**
   * key in primary data source
   */
  lookup: string;
  /**
   * secondary data reference
   */
  from: LookupData;
  /**
   * (Optional) The field or fields for storing the computed formula value.
   * If `from.fields` is not specified, `as` has to be a string and we put the whole object into the data
   */
  as?: string | string[];
  /**
   * (Optional) The default value to use if lookup fails
   */
  default?: string;
}

export function isLookup(t: Transform): t is LookupTransform {
  return t['lookup'] !== undefined;
}

export function isCalculate(t: Transform): t is CalculateTransform {
  return t['calculate'] !== undefined;
}

export function isBin(t: Transform): t is BinTransform {
  return t['bin'] !== undefined;
}

export function isTimeUnit(t: Transform): t is TimeUnitTransform {
  return t['timeUnit'] !== undefined;
}

export function isSummarize(t: Transform): t is SummarizeTransform {
  return t['summarize'] !== undefined;
}

export type Transform = FilterTransform | CalculateTransform | LookupTransform | BinTransform | TimeUnitTransform | SummarizeTransform;
