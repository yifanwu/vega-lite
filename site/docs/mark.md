---
layout: docs
menu: docs
title: Mark
permalink: /docs/mark.html
---

Marks are the basic visual building block of a visualization. They provide basic shapes whose properties (such as position, size, and color) can be used to visually encode data, either from a data field, or a constant value.

The `mark` property of a [single view specification](spec.html#single-view-spec) can either be (1) a string describing [mark type](#mark-type) or (2) a mark definition object.

{: .suppress-error}
```json
{
  "data": ... ,
  "mark": ... ,       // mark
  "encoding": ... ,
  ...
}
```

## Mark Definition Object
{:#mark-def}

A mark definition object can contains the following values.

{% include table.html props="type,role,filled,orient,interpolate,tension" source="MarkDef" %}

## Mark Types
{:#mark-type}

The `mark` property in a Vega-Lite specification defines the visualization's mark type.

The supported mark types are [`point`](#point), [`circle`](#circle-and-square), [`square`](#circle-and-square), [`text`](#text), [`tick`](#tick-mark), [`bar`](#bar), [`line`](#line), and [`area`](#area). In general, one mark instance is generated per input data element. However, line and area mark types represent multiple data elements as a contiguous line or shape.


<!-- why mark-based approach over chart typology + but we support variety of chart types -->

The rest of this page presents different chart types that can be created using each mark type.

* TOC
{:toc}


## Point

`point` mark represents each data point with a symbol.

### Dot Plot

Mapping a field to either only `x` (or only `y`) of `point` mark creates a **dot plot**.

<span class="vl-example" data-name="point_1d"></span>

### Scatter Plot

Mapping fields to both the `x` and `y` channels creates a scatter plot.

<span class="vl-example" data-name="scatter"></span>

### Bubble Plot

By mapping a third field to the `size` channel in the [scatter plot](#scatter), we can create a bubble plot instead.

<span class="vl-example" data-name="scatter_bubble"></span>

### Scatter Plot with Color and/or Shape

Fields can also be encoded in the [scatter plot](#scatter) using the `color` or `shape` channels.
For example, this specification encodes the field `Origin` with both `color` and `shape`.

<span class="vl-example" data-name="scatter_colored_with_shape"></span>

Note that `point` marks have a border but no fill by default.
See [this section for an example with filled `point` marks](config.html#config.mark.filled).

## Circle and Square

`circle` and `square` marks are similar to `point` mark, except that (1) the `shape` value is always set to `circle` or `square` (2) they are filled by default.

### Scatterplot with Circle and Square

Here are some examples of scatter plots with `circle` and `square`:

<span class="vl-example" data-name="circle"></span>

<span class="vl-example" data-name="square"></span>


## Text

`text` mark represents each data point with a text instead of a point.

### Scatterplot with Text

Mapping a field to `text` channel of text mark sets the mark's text value. For example, we can modify the color scatterplot above to have each mark as text showing the initial character of its origin.

<span class="vl-example" data-name="text_scatter_colored"></span>

<!--
### Text Table Heatmap
__TODO__
-->

## Tick

The `tick` mark represents each data point as a short line. This is a useful mark for displaying the distribution of values in a field.

### Dot Plot

For example, the following dot plot uses tick marks to show the distribution of each car's Horsepower.

<span class="vl-example" data-name="tick_dot"></span>

### Strip Plot

<!-- TODO: better explain this -->
The following strip-plot use `tick` mark to represent its data.

<span class="vl-example" data-name="tick_strip"></span>

<!--__TODO__ Colored Tick with adjusted size and thickness-->

## Bar

The `bar` mark encodes x and y channels with a pair of discrete and continuous fields.

### Single Bar Chart

Mapping a quantitative field to either `x` or `y` of the `bar` mark produces a single bar. In the following example, note that the `x` channel encodes the sum of the populations.

<span class="vl-example" data-name="bar_1d"></span>


### Bar Chart

If we map a different ordinal field to the `y` channel, we can produce a horizontal bar chart. Specifying `scale.rangeStep` of an ordinal field will adjust the [ordinal scale's range step](https://github.com/mbostock/d3/wiki/Ordinal-Scales#ordinal_rangeBands). By default, there will be a 1 pixel offset between bars. (See [an example that customizes the size of the bars](encoding.html#ex-bar-size).)

<!-- TODO: Need to update docs our and Vega's scale.rangeStep property and link there instead -->

<span class="vl-example" data-name="bar_aggregate"></span>

### Stacked Bar Chart

Adding color to the bar chart (by using the `color` attribute) creates a stacked bar chart by default. Here we also customize the color's scale range to make the color a little nicer.
(See [`config.stack` for more detail about customizing stack](config.html#stack-config).)


<span class="vl-example" data-name="stacked_bar_population"></span>


### Layered Bar Chart

To disable stacking, you can alternatively set `config.mark.stacked` to `"none"`.
This produces a layered bar chart.
To make it clear that bars are layered, we can make marks semi-transparent by setting the `opacity` to 0.6.

<span class="vl-example" data-name="bar_layered_transparent"></span>


### Normalized Stacked Bar Chart

<!-- TODO: better explain this -->
You can also create a normalized stacked bar chart by setting `config.mark.stacked` to `"normalize"`. Here we can easily see the percentage of male and female population at different ages.

<span class="vl-example" data-name="stacked_bar_normalize"></span>


### Grouped Bar Chart

<!-- TODO: better explain this -->
[Faceting](facet.html) a bar chart produces a grouped bar chart.

<span class="vl-example" data-name="bar_grouped"></span>

<!-- ### Table Heat Map -->

### Histogram
If the data is not pre-aggregated (i.e. each record in the data field represents one item),
mapping a binned quantitative field to `x` and aggregate `count` to `y` produces a histogram.

<span class="vl-example" data-name="histogram"></span>

If you prefer to have histogram without gaps between bars, you can set the [`barBinSpacing` mark config](config.html#bar-config) to `0`.

## Rect

The `rect` mark represents an arbitrary rectangle.

### Heatmap

Use the `rect` mark to create a heatmap.

<span class="vl-example" data-name="rect_heatmap"></span>


## Line

The `line` mark represents the data points stored in a field with a line connecting all of these points. Unlike other marks that represent one data element per mark, one line mark represents multiple data element as a single line (same is true for `area`).

### Line Chart

Using `line` with one ordinal field (typically on `x`) and another quantitative field (typically on `y`) produces a simple line chart with a single line.

<span class="vl-example" data-name="line"></span>

We can add create multiple lines by grouping along different attributes, such as `color` or `detail`.

### Colored Line Chart

In the example below, we group points using a new field mapped to `color`. This produces a line chart with different colors for each line.

<span class="vl-example" data-name="line_color"></span>

### Line Chart with Multiple Lines

Alternatively, we can map the same field to `detail`, creating multiple lines but with the same color instead.

<span class="vl-example" data-name="line_detail"></span>

### Line Chart with Custom Path

By default, the line's path (order of points in the line) is determined by data values on the ordinal dimension (x or y) like shown in previous examples. However, a field can be mapped to `path` channel for determining custom path.

<span class="vl-example" data-name="scatter_connected"></span>

## Area

`area` represent multiple data element as a single area shape.

### Area Chart

Using `area` mark with one ordinal field (typically on `x`) and one quantitative field (typically on `y`) produces an area chart. For example, the following area chart shows a number of unemployment people in the US over time.

<span class="vl-example" data-name="area"></span>

### Stacked Area Chart

Adding a color field to area chart creates stacked area chart by default. For example, here we split the area chart by industry.

<span class="vl-example" data-name="stacked_area"></span>

### Normalized Stacked Area Chart

You can also create a normalized stacked area chart by setting `config.mark.stacked` to `"normalize"`. Here we can easily see the percentage of unemployment across industries.

<span class="vl-example" data-name="stacked_area_normalize"></span>

### Streamgraph

We can also shift the stacked area chart's baseline to center and produces a [streamgraph](http://www.leebyron.com/else/streamgraph/) by setting `config.mark.stacked` to `"center"`.

<span class="vl-example" data-name="stacked_area_stream"></span>
