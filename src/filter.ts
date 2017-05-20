import {Model} from './compile/model';
import {predicate} from './compile/selection/selection';
import {DateTime, dateTimeExpr, isDateTime} from './datetime';
import {field} from './fielddef';
import {fieldExpr as timeUnitFieldExpr, isSingleTimeUnit, TimeUnit} from './timeunit';
import {isArray, isString} from './util';

export type Filter = EqualFilter | RangeFilter | OneOfFilter | SelectionFilter | string;

export interface SelectionFilter {
  /**
   * Filter using a selection name.
   */
  selection: string;
}

export function isSelectionFilter(filter: Filter): filter is SelectionFilter {
  return filter && filter['selection'];
}

export interface EqualFilter {
  // TODO: support aggregate

  /**
   * Time unit for the field to be filtered.
   */
  timeUnit?: TimeUnit;

  /**
   * Field to be filtered.
   */
  field: string;

  /**
   * The value that the field should be equal to.
   */
  equal: string | number | boolean | DateTime;

}

export function isEqualFilter(filter: any): filter is EqualFilter {
  return filter && !!filter.field && filter.equal!==undefined;
}

export interface RangeFilter {
  // TODO: support aggregate

  /**
   * time unit for the field to be filtered.
   */
  timeUnit?: TimeUnit;

  /**
   * Field to be filtered
   */
  field: string;

  /**
   * An array of inclusive minimum and maximum values
   * for a field value of a data item to be included in the filtered data.
   * @maxItems 2
   * @minItems 2
   */
  range: (number|DateTime)[];

}

export function isRangeFilter(filter: any): filter is RangeFilter {
  if (filter && filter.field) {
    if (isArray(filter.range) && filter.range.length === 2) {
      return true;
    }
  }
  return false;
}

export interface OneOfFilter {
  // TODO: support aggregate

  /**
   * time unit for the field to be filtered.
   */
  timeUnit?: TimeUnit;

  /**
   * Field to be filtered
   */
  field: string;

  /**
   * A set of values that the `field`'s value should be a member of,
   * for a data item included in the filtered data.
   */
  oneOf: string[] | number[] | boolean[] | DateTime[];

}

export function isOneOfFilter(filter: any): filter is OneOfFilter {
  return filter && !!filter.field && (
    isArray(filter.oneOf) ||
    isArray(filter.in) // backward compatibility
  );
}

/**
 * Converts a filter into an expression.
 */
// model is only used for selection filters.
export function expression(model: Model, filter: Filter): string {
  if (isString(filter)) {
    return filter;
  } else if (isSelectionFilter(filter)) {
    const selection = model.getComponent('selection', filter.selection);
    return predicate(filter.selection, selection.type, selection.resolve, null, null);
  } else { // Filter Object
    const fieldExpr = filter.timeUnit ?
      // For timeUnit, cast into integer with time() so we can use ===, inrange, indexOf to compare values directly.
        // TODO: We calculate timeUnit on the fly here. Consider if we would like to consolidate this with timeUnit pipeline
        // TODO: support utc
      ('time(' + timeUnitFieldExpr(filter.timeUnit, filter.field) + ')') :
      field(filter, {expr: 'datum'});

    if (isEqualFilter(filter)) {
      return fieldExpr + '===' + valueExpr(filter.equal, filter.timeUnit);
    } else if (isOneOfFilter(filter)) {
      // "oneOf" was formerly "in" -- so we need to add backward compatibility
      const oneOf: OneOfFilter[] = filter.oneOf || filter['in'];
      return 'indexof([' +
        oneOf.map((v) => valueExpr(v, filter.timeUnit)).join(',') +
        '], ' + fieldExpr + ') !== -1';
    } else if (isRangeFilter(filter)) {
      const lower = filter.range[0];
      const upper = filter.range[1];

      if (lower !== null &&  upper !== null) {
        return 'inrange(' + fieldExpr + ', ' +
          valueExpr(lower, filter.timeUnit) + ', ' +
          valueExpr(upper, filter.timeUnit) + ')';
      } else if (lower !== null) {
        return fieldExpr + ' >= ' + lower;
      } else if (upper !== null) {
        return fieldExpr + ' <= ' + upper;
      }
    }
  }
  return undefined;
}

function valueExpr(v: any, timeUnit: TimeUnit) {
  if (isDateTime(v)) {
    const expr = dateTimeExpr(v, true);
    return 'time(' + expr + ')';
  }
  if (isSingleTimeUnit(timeUnit)) {
    const datetime: DateTime = {};
    datetime[timeUnit] = v;
    const expr = dateTimeExpr(datetime, true);
    return 'time(' + expr + ')';
  }
  return JSON.stringify(v);
}
