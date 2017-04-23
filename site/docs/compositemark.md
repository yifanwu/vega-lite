---
layout: docs
menu: docs
title: Composite Mark
permalink: /docs/compositemark.html
---

Composite marks are "macros" for more complex layered mark specs. Layered mark specs create visualizations with a series of basic mark types.

| Property      | Type          | Description    |
| :------------ |:-------------:| :------------- |
| `mark`      | String        | The CompositeMark type. Supported composite marks include: "box-plot". |

## Box Plot

`box-plot` composite mark represents a box-plot or box and whisker plot. The lower and upper whiskers extend to the min and max respectively. The middle tick in the box represents the median. The lower and upper part of the box represents quartile 1 and 3 respectively.

`box-plot` supports the following properties: color, size, opacity.

### Vertical 1D Boxplot
<span class="vl-example" data-name="box_plot_minmax_1D_vertical_short"></span>

You can create horizontal 1D boxplots

### Horizontal 1D Boxplot
<span class="vl-example" data-name="box_plot_minmax_1D_horizontal_short"></span>

You can create vertical 2D boxplots

### Vertical 2D Boxplot
<span class="vl-example" data-name="box_plot_minmax_2D_vertical_short"></span>

You can create horizontal 2D boxplots

### Horizontal 2D Boxplot
<span class="vl-example" data-name="box_plot_minmax_2D_horizontal_short"></span>
