<!--
  @component
  Generates an SVG bar chart.
 -->
<script>
  import { getContext } from "svelte";
  import { fade } from "svelte/transition";
  import { urbanColors } from "@urbaninstitute/dataviz-components/utils";

  const { data, xGet, yGet, zGet, yScale, y, x, z, xScale, custom } = getContext("LayerCake");

  const {
    yAxisTitle = "",
    yShift = 0,
    fill = urbanColors.blue,
    facetIndex = null,
    onBarHover,
    onLeaveBar
  } = $props();

  function columnWidth(d) {
    const xVals = $xGet(d);
    return xVals[1] - xVals[0];
  }
</script>

<g class="bar-group">
  {#each $data as series, slot}
    {#each series as d, i}
      <rect
        class="group-rect"
        onmousemove={(e) => {
          onBarHover(e, i, slot, $x(d)[1] - $x(d)[0]);
        }}
        onmouseout={() => onLeaveBar()}
        onblur={() => onLeaveBar()}
        data-id={i}
        x={$xGet(d)[0]}
        y={$yGet(d)}
        height={$yScale.bandwidth()}
        width={columnWidth(d)}
        fill={$custom.seriesColors[slot]}
      ></rect>
    {/each}
  {/each}
</g>

<style>
  rect {
    /* transition: ease-in-out 250ms; */
  }
  .group-rect {
    cursor: pointer;
  }
  .yaxis-label {
    font-size: 16px;
    font-weight: 700;
  }
  .yaxis-title {
    font-size: 16px;
    font-weight: 700;
    font-style: italic;
  }
</style>
