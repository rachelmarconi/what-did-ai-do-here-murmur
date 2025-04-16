<script>
  import Dots from "$components/chart-parts/Dots.svelte";
  import BarLabels from "$components/chart-parts/BarLabels.svelte";
  import FacetLabels from "$components/chart-parts/FacetLabels.svelte";
  import ValueLabels from "$components/chart-parts/ValueLabels.svelte";
  import AxisX from "$components/chart-parts/AxisX.svelte";
  import { LayerCake, Svg, Html } from "layercake";
  import { scaleBand } from "d3-scale";
  import { extent } from "d3-array";
  import { Tooltip } from "@urbaninstitute/dataviz-components";
  import { getChartHeight, getFacetScale, getFacetPositions } from "$utils/facets.js";
  import Annotation from "./chart-parts/Annotation.svelte";

  /** @typedef {import('./chart-parts/Annotation.svelte').Annotation} Annotation
   */

  /** @typedef{Object} Props
   * @property {Object<string, number>} data
   * @property {string | string[]} xKey
   * @property {string} yKey
   * @property {string[]} yDomain
   * @property {(s: number) => string} valueFormat
   * @property {number} [barSize = 20]
   * @property {number} [barPadding = 0.2]
   * @property {boolean} [faceted = false]
   * @property {number} [facetPadding = 50]
   * @property {Array<Annotation>} [annotations = []]
   * @property {boolean} [useTooltipCategoryLabels = false]
   * @property {string[]} tooltipCategoryLabels
   */

  /** @type {Props} */
  const {
    data,
    xKey,
    yKey,
    yDomain,
    valueFormat,
    barSize = 25,
    barPadding = 0.1,
    faceted = false,
    facetPadding = 40,
    annotations = [],
    useTooltipCategoryLabels = false,
    tooltipCategoryLabels = []
  } = $props();

  // calculate flat data. For faceted version of this chart, it collapses the faceted groups. For non-faceted charts, this is equal to data.
  let flatData = $derived(
    faceted
      ? data.reduce((acc, next) => {
          return acc.concat(next.data);
        }, [])
      : data
  );
  // convert xKey to always be an array, even when provided as a single string
  let xKeyArray = $derived(Array.isArray(xKey) ? xKey : [xKey]);
  // get full extent of flatData
  let dataExtent = $derived(getExtent(flatData, xKeyArray));
  // calculate a new rounded maximum value based on actual data extent. This adds about 30% padding to the upper end.
  let xMax = $derived(getRoundedMax(dataExtent));
  // compute the full height of the chart area, adjusting for faceting if necessary
  let chartHeight = $derived(
    faceted
      ? getChartHeight(data, barSize, barPadding, facetPadding)
      : getSimpleChartHeight(barSize, data.length, barPadding)
  );
  let facetScales = $derived(
    faceted ? data.map((d) => getFacetScale(d, yKey, barSize, barPadding)) : null
  );
  let facetPositions = $derived(
    faceted ? getFacetPositions(data, facetPadding, barSize, barPadding) : null
  );

  let chartPadding = faceted
    ? { top: 20, right: 0, bottom: 0, left: 130 }
    : { top: 0, right: 0, bottom: 0, left: 120 };

  function getExtent(inputData, inputKeys) {
    let extents = inputKeys.flatMap((key) => {
      return extent(inputData, (d) => +d[key]);
    });
    return extent(extents);
  }

  /**
   * @param {[number, number] | [undefined, undefined]} extent
   * @returns {number | null}
   */
  function getRoundedMax(extent) {
    if (extent && extent[0] && extent[1]) {
      const range = extent[1] - extent[0];
      const adjustedRange = range + range * 0.3;
      return extent[0] + adjustedRange;
    }
    return null;
  }

  // non-faceted function
  function getSimpleChartHeight(barSize, barCount, barPadding) {
    const barsHeight = barSize * barCount;
    const chartHeight = barsHeight * (1 + barPadding);
    return chartHeight;
  }

  let tooltip = $state();

  /**
   * @param {number} x
   * @param {number} y
   * @param {string} group
   * @param {string} val
   * @param {string} label
   * @returns {Tooltip}
   */
  function getTooltipProps(x, y, group, val, label) {
    return {
      x,
      y,
      group,
      val,
      label
    };
  }

  function onDotHover(e, d, val, index = 0) {
    tooltip = getTooltipProps(
      e.pageX,
      e.pageY,
      d[yKey],
      val,
      useTooltipCategoryLabels ? tooltipCategoryLabels[index] : ""
    );
  }
</script>

<div class="chart-wrap" style:height="{chartHeight}px">
  <LayerCake
    {data}
    {flatData}
    x={xKey}
    y={yKey}
    {yDomain}
    xDomain={[0, xMax ? xMax : null]}
    padding={chartPadding}
    yScale={scaleBand().paddingInner(barPadding)}
    custom={{ valueFormat, facetScales, facetPositions, facetPadding }}
  >
    <Html>
      {#if faceted}
        {#each data as { label }, facetIndex}
          <BarLabels {facetIndex} />
          <FacetLabels {facetIndex}>{label}</FacetLabels>
        {/each}
      {:else}
        <BarLabels />
      {/if}
      <!-- <ValueLabels /> -->
    </Html>
    <Svg>
      <AxisX
        formatTick={valueFormat}
        baseline={false}
        yTick={12}
        ticks={5}
        position="top"
        gridlines
      />
      {#if faceted}
        {#each data as _, facetIndex}
          <Dots {onDotHover} onLeaveDot={() => (tooltip = undefined)} {facetIndex} />
        {/each}
      {:else}
        <Dots {onDotHover} onLeaveDot={() => (tooltip = undefined)} />
      {/if}
      {#each annotations as data}
        <Annotation {data} />
      {/each}
    </Svg>
    {#if tooltip}
      <Tooltip x={tooltip.x} y={tooltip.y} size="small">
        <h5>{tooltip.group}</h5>
        <p>
          <strong>
            {tooltip.label}: {valueFormat(tooltip.val)}
          </strong>
        </p>
      </Tooltip>
    {/if}
  </LayerCake>
</div>

<style>
  .chart-wrap {
    width: 100%;
    margin-bottom: 25px;
  }

  .chart-wrap :global(.tick:first-child .gridline) {
    stroke: var(--color-black);
  }
</style>
