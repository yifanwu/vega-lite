import {BaseBin} from './bin';
import {OutputNode} from './compile/data/dataflow';
import {NiceTime, ScaleType, SelectionDomain} from './scale';
import {StackOffset} from './stack';
import {isArray} from './util';

export interface VgData {
  name: string;
  source?: string;
  values?: any;
  format?: any;
  url?: any;
  transform?: VgTransform[];
}


export type VgParentRef = {
  parent: string
};

export type VgFieldRef = string | VgParentRef | VgParentRef[];

export type VgSortField = boolean | {
  field: VgFieldRef,
  op: string
};

export type VgDataRef = {
  data: string,
  field: VgFieldRef,
  sort?: VgSortField
};

export type VgSignalRef = {
  signal: string
};

// TODO: add type of value (Make it VgValueRef<T> {value?:T ...})
export type VgValueRef = {
  value?: number | string | boolean,
  field?: string | {
    datum?: string,
    group?: string,
    parent?: string
  },
  signal?: string;
  scale?: string, // TODO: object
  mult?: number,
  offset?: number | VgValueRef,
  band?: boolean | number
};

// TODO: add vg prefix
export type DataRefUnionDomain = {
  fields: (any[] | VgDataRef)[],
  sort?: boolean | {
    op: 'count'
  }
};

// TODO: add vg prefix
export type FieldRefUnionDomain = {
  data: string,
  fields: VgFieldRef[],
  sort?: boolean | {
    op: 'count'
  }
};

export type VgRangeScheme = {scheme: string, extent?: number[], count?: number};
export type VgRange = string | VgDataRef | (number|string|VgDataRef)[] | VgRangeScheme | {step: number};

export type VgDomain = any[] | VgDataRef | DataRefUnionDomain | FieldRefUnionDomain | VgSignalRef;

export type VgMarkGroup = any;

export type VgScale = {
  name: string,
  type: ScaleType,
  domain: VgDomain,
  // FIXME: Should be a VgSignalRef.
  domainRaw?: SelectionDomain,
  range: VgRange,

  clamp?: boolean,
  exponent?: number,
  nice?: boolean | NiceTime,
  padding?: number,
  paddingInner?: number,
  paddingOuter?: number,
  reverse?: boolean,
  round?: boolean,
  zero?: boolean
};

export type VgProjectionType = 'albers' | 'albersUsa' | 'azimuthalEqualArea' | 'azimuthalEquidistant' | 'conicConformal' | 'conicEqualArea' | 'conicEquidistant' | 'equirectangular' | 'gnomonic' | 'mercator' | 'orthographic' | 'stereographic' | 'transverseMercator';

export type VgProjection = {
  /*
   * The name of the projection.
   */
  name: string,
  /*
   * The type of the projection.
   */
  type?: VgProjectionType;
  /*
   * The center of the projection.
   */
  center?: number[];
  /*
   * The translation of the projection.
   */
  translate?: number[];
  /*
   * The scale of the projection.
   */
  zoom?: number;
  /**
   * The rotation of the projection.
   */
  rotate?: number[];
  /*
   * The desired precision of the projection.
   */
  precision?: String;
  /*
   * The clip angle of the projection.
   */
  clipAngle?: number;
  /*
   * Sets the projection’s scale factor to the specified value
   */
  scale?: number;
  /*
   * Sets the projection’s viewport clip extent to the specified bounds in pixels
   */
  clipExtent?: number[];
};

export type VgLayoutAlign = 'none' | 'each' | 'all';

export type VgLayout = {
  padding: number | {
    row?: number,
    column?: number
  },
  offset: number | {
    rowHeader: number,
    rowFooter: number,
    rowTitle: number,
    columnHeader: number,
    columnFooter: number,
    columnTitle: number
  },
  bounds: 'full' | 'flush',
  columns?: number | {signal: string},
  align?: VgLayoutAlign | {
    row: VgLayoutAlign,
    column: VgLayoutAlign
  };
};

export function isDataRefUnionedDomain(domain: VgDomain): domain is DataRefUnionDomain {
  if (!isArray(domain)) {
    return 'fields' in domain && !('data' in domain);
  }
  return false;
}

export function isFieldRefUnionDomain(domain: VgDomain): domain is FieldRefUnionDomain {
  if (!isArray(domain)) {
    return 'fields' in domain && 'data' in domain;
  }
  return false;
}

export function isDataRefDomain(domain: VgDomain): domain is VgDataRef {
  if (!isArray(domain)) {
     return 'field' in domain && 'data' in domain;
  }
  return false;
}

export function isSignalRefDomain(domain: VgDomain): domain is VgSignalRef {
  if (!isArray(domain)) {
    return 'signal' in domain;
  }
  return false;
}

export type VgSignal = {
  name: string,
  update: string
};

export type VgEncodeEntry = any;
// TODO: make export interface VgEncodeEntry {
//   x?: VgValueRef<number>
//   y?: VgValueRef<number>
//  ...
//   color?: VgValueRef<string>
//  ...
// }

export type VgAxis = any;
export type VgLegend = any;

export interface VgBinTransform extends BaseBin {
  type: 'bin';
  extent?: number[] | {signal: string};
  field: string;
  as: string[];
  signal?: string;
}

export interface VgExtentTransform {
  type: 'extent';
  field: string;
  signal: string;
}

export interface VgFormulaTransform {
  type: 'formula';
  as: string;
  expr: string;
}

export interface VgFilterTransform {
  type: 'filter';
  expr: string;
}

export interface VgAggregateTransform {
  type: 'aggregate';
  groupby?: VgFieldRef[];
  fields?: VgFieldRef[];
  ops?: string[];
  as?: string[];
  drop?: boolean;
}

export interface VgCollectTransform {
  type: 'collect';
  sort: VgSort;
}

export interface VgLookupTransform {
  type: 'lookup';
  from: string;
  key: string;
  fields: string[];
  values?: string[];
  as?: string[];
  default?: string;
}

export interface VgGeoPointTransform {
  type: 'geopoint';
  projection: string; // the name of the projection
  fields: string[];
  as?: string[];
}

export interface VgAxisEncode {
  ticks?: VgGuideEncode;
  labels?: VgGuideEncode;
  title?: VgGuideEncode;
  grid?: VgGuideEncode;
  domain?: VgGuideEncode;
}

export interface VgLegendEncode {
  title?: VgGuideEncode;
  labels?: VgGuideEncode;
  legend?: VgGuideEncode;
  symbols?: VgGuideEncode;
  gradient?: VgGuideEncode;
}

export type VgGuideEncode = any; // TODO: replace this (See guideEncode in Vega Schema)

export type VgTransform = VgBinTransform | VgExtentTransform | VgFormulaTransform | VgAggregateTransform | VgFilterTransform | VgImputeTransform | VgStackTransform | VgCollectTransform | VgLookupTransform | VgGeoPointTransform;

export interface VgGeoShapeTransform {
  type: 'geoshape';
  projection: string; // the name of the projection
  field?: VgFieldRef;
  as?: string;
}

export type VgPostEncodingTransform = VgGeoShapeTransform;

export interface VgStackTransform {
  type: 'stack';
  offset?: StackOffset;
  groupby: string[];
  field: string;
  sort: VgSort;
  as: string[];
}

export type VgSort = {
  field: string;
  order: 'ascending' | 'descending';
} | {
  field: string[];
  order: ('ascending' | 'descending')[];
};

export interface VgImputeTransform {
  type: 'impute';
  groupby?: string[];
  field: string;
  orderby?: string[];
  method?: 'value' | 'median' | 'max' | 'min' | 'mean';
  value?: any;
}

export type VgCheckboxBinding = {
  input: 'checkbox';
  element?: string;
};

export type VgRadioBinding = {
  input: 'radio';
  options: string[];
  element?: string;
};

export type VgSelectBinding = {
  input: 'select';
  options: string[];
  element?: string;
};

export type VgRangeBinding = {
  input: 'range';
  min?: number;
  max?: number;
  step?: number;
  element?: string;
};

export type VgGenericBinding = {
  input: string;
  element?: string;
};

export type VgBinding = VgCheckboxBinding | VgRadioBinding |
  VgSelectBinding | VgRangeBinding | VgGenericBinding;


/**
 * Base object for Vega's Axis and Axis Config.
 * All of these properties are both properties of Vega's Axis and Axis Config.
 */
export interface VgAxisBase {
  /**
   * A boolean flag indicating if the domain (the axis baseline) should be included as part of the axis (default true).
   */
  domain?: boolean;

  /**
   * A boolean flag indicating if grid lines should be included as part of the axis
   *
   * __Default value:__ `true` for (1) quantitative fields that are not binned and (2) time fields;  otherwise, `"false"`.
   */
  grid?: boolean;

  /**
   * A boolean flag indicating if labels should be included as part of the axis (default true).
   *
   * __Default value:__  derived from [axis config](config.html#axis-config)'s `labels` (`true` by default).
   */
  labels?: boolean;

  /**
   * The rotation angle of the axis labels.
   *
   * __Default value:__ `-45` for time or ordinal axis and `0` otherwise.
   * @minimum 0
   * @maximum 360
   */
  labelAngle?: number;

  /**
   * Boolean value that determines whether the axis should include ticks.
   */
  ticks?: boolean;

  /**
   * Boolean flag indicating if an extra axis tick should be added for the initial position of the axis. This flag is useful for styling axes for `band` scales such that ticks are placed on band boundaries rather in the middle of a band. Use in conjunction with `"bandPostion": 1` and an axis `"padding"` value of `0`.
   */
  tickExtra?: boolean;

  /**
   * The size, in pixels, of major, minor and end ticks.
   *
   * __Default value:__  derived from [axis config](config.html#axis-config)'s `tickSize` (`6` by default).
   *
   * @minimum 0
   */
  tickSize?: number;

  /**
   * Horizontal text alignment of axis titles.
   */
  titleAlign?: string;

  /**
   * Angle in degrees of axis titles.
   */
  titleAngle?: number;

  /**
   * Max length for axis title if the title is automatically generated from the field's description. By default, this is automatically based on cell size and characterWidth property.
   *
   * __Default value:__  automatically determined based on the cell size (`config.cell.width`, `config.cell.height`)
   *
   * @minimum 0
   * @TJS-type integer
   */
  titleMaxLength?: number;

  /**
   * The padding, in pixels, between title and axis.
   */
  titlePadding?: number;

  /**
   * The minimum extent in pixels that axis ticks and labels should use. This determines a minimum offset value for axis titles.
   */
  minExtent?: number;

  /**
   * The maximum extent in pixels that axis ticks and labels should use. This determines a maximum offset value for axis titles.
   */
  maxExtent?: number;
}

export interface VgAxisConfig extends VgAxisBase {
  /**
   * An interpolation fraction indicating where, for `band` scales, axis ticks should be positioned. A value of `0` places ticks at the left edge of their bands. A value of `0.5` places ticks in the middle of their bands.
   */
  bandPosition?: number;
  /**
   * Stroke width of axis domain line
   *
   * __Default value:__  (none, using Vega default).
   */
  domainWidth?: number;

  /**
   * Color of axis domain line.
   *
   * __Default value:__  (none, using Vega default).
   */
  domainColor?: string;

  // ---------- Grid ----------
  /**
   * Color of gridlines.
   */
  gridColor?: string;

  /**
   * The offset (in pixels) into which to begin drawing with the grid dash array.
   * @minimum 0
   */
  gridDash?: number[];

  /**
   * The stroke opacity of grid (value between [0,1])
   *
   * __Default value:__ (`1` by default)
   * @minimum 0
   * @maximum 1
   */
  gridOpacity?: number;

  /**
   * The grid width, in pixels.
   * @minimum 0
   */
  gridWidth?: number;

  // ---------- Ticks ----------
  /**
   * The color of the axis's tick.
   */
  tickColor?: string;

  /**
   * The color of the tick label, can be in hex color code or regular color name.
   */
  labelColor?: string;

  /**
   * The font of the tick label.
   */
  labelFont?: string;

  /**
   * The font size of the label, in pixels.
   *
   * __Default value:__ `10`.
   *
   * @minimum 0
   */
  labelFontSize?: number;

  /**
   * Maximum allowed pixel width of axis tick labels.
   */
  labelLimit?: number;

  /**
   * Padding in pixels between axis ticks and tick labels.
   */
  labelPadding?: number;

  /**
   * Boolean flag indicating if pixel position values should be rounded to the nearest integer.
   */
  tickRound?: boolean;

  /**
   * The width, in pixels, of ticks.
   * @minimum 0
   */
  tickWidth?: number;

  // ---------- Title ----------

  /**
   * Vertical text baseline for axis titles.
   */
  titleBaseline?: string;
  /**
   * Color of the title, can be in hex color code or regular color name.
   */
  titleColor?: string;

  /**
   * Font of the title. (e.g., `"Helvetica Neue"`).
   */
  titleFont?: string;

  /**
   * Font size of the title.
   *
   * __Default value:__ `10`.
   *
   * @minimum 0
   */
  titleFontSize?: number;

  /**
   * Font weight of the title. (e.g., `"bold"`).
   */
  titleFontWeight?: string | number;

  /**
   * Maximum allowed pixel width of axis titles.
   */
  titleLimit?: number;

  /**
   * X-coordinate of the axis title relative to the axis group.
   */
  titleX?: number;

  /**
   * Y-coordinate of the axis title relative to the axis group.
   */
  titleY?: number;
}

export interface VgLegendBase {
  /**
   * Padding (in pixels) between legend entries in a symbol legend.
   */
  entryPadding?: number;

  /**
   * Background fill color for the full legend.
   */
  fillColor?: string;

  /**
   * The orientation of the legend. One of `"left"` or `"right"`. This determines how the legend is positioned within the scene. The default is `"right"`.
   *
   * __Default value:__  `"right"`
   */
  orient?: string;

  /**
   * The offset, in pixels, by which to displace the legend from the edge of the enclosing group or data rectangle.
   *
   * __Default value:__  `0`
   */
  offset?: number;

  /**
   * The padding, in pixels, between the legend and axis.
   */
  padding?: number;

  /**
   * Horizontal text alignment for legend titles.
   */
  titleAlign?: string;
}

export interface VgLegendConfig extends VgLegendBase {

  /**
   * Corner radius for the full legend.
   */
  cornerRadius?: number;

  /**
   * Border stroke color for the full legend.
   */
  strokeColor?: string;

  /**
   * Border stroke dash pattern for the full legend.
   */
  strokeDash?: number[];

  /**
   * Border stroke width for the full legend.
   */
  strokeWidth?: number;
  // ---------- Gradient ----------
  /**
   * The color of the gradient stroke, can be in hex color code or regular color name.
   */
  gradientStrokeColor?: string;

  /**
   * The width of the gradient stroke, in pixels.
   * @minimum 0
   */
  gradientStrokeWidth?: number;

  /**
   * The height of the gradient, in pixels.
   * @minimum 0
   */
  gradientHeight?: number;

  /**
   * Text baseline for color ramp gradient labels.
   */
  gradientLabelBaseline?: string;

  /**
   * The maximum allowed length in pixels of color ramp gradient labels.
   */
  gradientLabelLimit?: number;

  /**
   * Vertical offset in pixels for color ramp gradient labels.
   */
  gradientLabelOffset?: number;

  /**
   * The width of the gradient, in pixels.
   * @minimum 0
   */
  gradientWidth?: number;

  // ---------- Label ----------
  /**
   * The alignment of the legend label, can be left, middle or right.
   */
  labelAlign?: string;

  /**
   * The position of the baseline of legend label, can be top, middle or bottom.
   */
  labelBaseline?: string;

  /**
   * The color of the legend label, can be in hex color code or regular color name.
   */
  labelColor?: string;

  /**
   * The font of the legend label.
   */
  labelFont?: string;

  /**
   * The font size of legend label.
   *
   * __Default value:__ `10`.
   *
   * @minimum 0
   */
  labelFontSize?: number;

  /**
   * Maximum allowed pixel width of axis tick labels.
   */
  labelLimit?: number;

  /**
   * The offset of the legend label.
   * @minimum 0
   */
  labelOffset?: number;

  // ---------- Symbols ----------
  /**
   * The color of the legend symbol,
   */
  symbolColor?: string;

  /**
   * Default shape type (such as "circle") for legend symbols.
   */
  symbolType?: string;

  /**
   * The size of the legend symbol, in pixels.
   * @minimum 0
   */
  symbolSize?: number;

  /**
   * The width of the symbol's stroke.
   * @minimum 0
   */
  symbolStrokeWidth?: number;

  // ---------- Title ----------
  /**
   * Optional mark property definitions for custom legend styling.
   */
   /**
    * Vertical text baseline for legend titles.
    */
  titleBaseline?: string;
  /**
   * The color of the legend title, can be in hex color code or regular color name.
   */
  titleColor?: string;

  /**
   * The font of the legend title.
   */
  titleFont?: string;

  /**
   * The font size of the legend title.
   */
  titleFontSize?: number;

  /**
   * The font weight of the legend title.
   */
  titleFontWeight?: string | number;

  /**
   * Maximum allowed pixel width of axis titles.
   */
  titleLimit?: number;

  /**
   * The padding, in pixels, between title and legend.
   */
  titlePadding?: number;
}

export type FontStyle = 'normal' | 'italic';
export type FontWeight = 'normal' | 'bold';
/**
 * @TJS-type integer
 * @minimum 100
 * @maximum 900
 */
export type FontWeightNumber = number;
export type HorizontalAlign = 'left' | 'right' | 'center';
export type Interpolate = 'linear' | 'linear-closed' |
  'step' | 'step-before' | 'step-after' |
  'basis' | 'basis-open' | 'basis-closed' |
  'cardinal' | 'cardinal-open' | 'cardinal-closed' |
  'bundle' | 'monotone';
export type Orient = 'horizontal' | 'vertical';
export type VerticalAlign = 'top' | 'middle' | 'bottom';

export interface VgMarkConfig {

  /**
   * Default Fill Color.  This has higher precedence than config.color
   *
   * __Default value:__ (None)
   *
   */
  fill?: string;

  /**
   * Default Stroke Color.  This has higher precedence than config.color
   *
   * __Default value:__ (None)
   *
   */
  stroke?: string;

  // ---------- Opacity ----------
  /**
   * The overall opacity (value between [0,1]).
   *
   * __Default value:__ `0.7` for non-aggregate plots with `point`, `tick`, `circle`, or `square` marks or layered `bar` charts and `1` otherwise.
   *
   * @minimum 0
   * @maximum 1
   */
  opacity?: number;


  /**
   * The fill opacity (value between [0,1]).
   *
   * __Default value:__ `1`
   *
   * @minimum 0
   * @maximum 1
   */
  fillOpacity?: number;

  /**
   * The stroke opacity (value between [0,1]).
   *
   * __Default value:__ `1`
   *
   * @minimum 0
   * @maximum 1
   */
  strokeOpacity?: number;

  // ---------- Stroke Style ----------
  /**
   * The stroke width, in pixels.
   *
   * @minimum 0
   */
  strokeWidth?: number;

  /**
   * An array of alternating stroke, space lengths for creating dashed or dotted lines.
   */
  strokeDash?: number[];

  /**
   * The offset (in pixels) into which to begin drawing with the stroke dash array.
   */
  strokeDashOffset?: number;

  // ---------- Orientation: Bar, Tick, Line, Area ----------
  /**
   * The orientation of a non-stacked bar, tick, area, and line charts.
   * The value is either horizontal (default) or vertical.
   * - For bar, rule and tick, this determines whether the size of the bar and tick
   * should be applied to x or y dimension.
   * - For area, this property determines the orient property of the Vega output.
   * - For line, this property determines the sort order of the points in the line
   * if `config.sortLineBy` is not specified.
   * For stacked charts, this is always determined by the orientation of the stack;
   * therefore explicitly specified value will be ignored.
   */
  orient?: Orient;

  // ---------- Interpolation: Line / area ----------
  /**
   * The line interpolation method to use for line and area marks. One of the following:
   * - `"linear"`: piecewise linear segments, as in a polyline.
   * - `"linear-closed"`: close the linear segments to form a polygon.
   * - `"step"`: alternate between horizontal and vertical segments, as in a step function.
   * - `"step-before"`: alternate between vertical and horizontal segments, as in a step function.
   * - `"step-after"`: alternate between horizontal and vertical segments, as in a step function.
   * - `"basis"`: a B-spline, with control point duplication on the ends.
   * - `"basis-open"`: an open B-spline; may not intersect the start or end.
   * - `"basis-closed"`: a closed B-spline, as in a loop.
   * - `"cardinal"`: a Cardinal spline, with control point duplication on the ends.
   * - `"cardinal-open"`: an open Cardinal spline; may not intersect the start or end, but will intersect other control points.
   * - `"cardinal-closed"`: a closed Cardinal spline, as in a loop.
   * - `"bundle"`: equivalent to basis, except the tension parameter is used to straighten the spline.
   * - `"monotone"`: cubic interpolation that preserves monotonicity in y.
   */
  interpolate?: Interpolate;
  /**
   * Depending on the interpolation type, sets the tension parameter (for line and area marks).
   * @minimum 0
   * @maximum 1
   */
  tension?: number;

  /**
   * The default symbol shape to use. One of: `"circle"` (default), `"square"`, `"cross"`, `"diamond"`, `"triangle-up"`, or `"triangle-down"`, or a custom SVG path.
   *
   * __Default value:__ `"circle"`
   *
   */
  shape?: string;

  /**
   * The pixel area each the point/circle/square.
   * For example: in the case of circles, the radius is determined in part by the square root of the size value.
   *
   * __Default value:__ `30`
   *
   * @minimum 0
   */
  size?: number;

  // Text / Label Mark Config

  /**
   * The horizontal alignment of the text. One of `"left"`, `"right"`, `"center"`.
   */
  align?: HorizontalAlign;

  /**
   * The rotation angle of the text, in degrees.
   * @minimum 0
   * @maximum 360
   */
  angle?: number;

  /**
   * The vertical alignment of the text. One of `"top"`, `"middle"`, `"bottom"`.
   *
   * __Default value:__ `"middle"`
   *
   */
  baseline?: VerticalAlign;

  /**
   * The horizontal offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the _angle_ property.
   */
  dx?: number;

  /**
   * The vertical offset, in pixels, between the text label and its anchor point. The offset is applied after rotation by the _angle_ property.
   */
  dy?: number;

  /**
   * Polar coordinate radial offset, in pixels, of the text label from the origin determined by the `x` and `y` properties.
   * @minimum 0
   */
  radius?: number;

  /**
   * Polar coordinate angle, in radians, of the text label from the origin determined by the `x` and `y` properties. Values for `theta` follow the same convention of `arc` mark `startAngle` and `endAngle` properties: angles are measured in radians, with `0` indicating "north".
   */
  theta?: number;

  /**
   * The typeface to set the text in (e.g., `"Helvetica Neue"`).
   * @minimum 0
   */
  font?: string;

  /**
   * The font size, in pixels.
   * @minimum 0
   */
  fontSize?: number;

  /**
   * The font style (e.g., `"italic"`).
   */
  fontStyle?: FontStyle;
  /**
   * The font weight (e.g., `"bold"`).
   */
  fontWeight?: FontWeight | FontWeightNumber;

  /**
   * Placeholder text if the `text` channel is not specified
   */
  text?: string;
}
