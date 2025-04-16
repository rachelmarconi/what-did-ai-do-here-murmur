<script>
  let { data, question, chunk } = $props();

  import { LayerCake, Svg, flatten, stack } from "layercake";

  import { scaleBand, scaleOrdinal } from "d3-scale";
  import { format } from "d3-format";

  import StackedBars from "./chart-parts/StackedBars.svelte";
  import AxisX from "./chart-parts/AxisX.svelte";
  import AxisY from "./chart-parts/AxisY.svelte";
  import ForceLayout from "./CirclePackForce.svelte";

  let yKey = $derived(
    ["q1_rating", "q2_rating", "q4_rating"].includes(question) ? "question" : "identity"
  );

  let seriesNames = $derived(Object.keys(data[0]).filter((d) => d !== yKey));
  const seriesColors = ["#00856B", "#F98100", "#C01C1B", "#005285", "#4B4B2E", "#000"];

  /* --------------------------------------------
   * Cast data
   */
  //   let castData = $derived(
  //     data.forEach((d) => {
  //       seriesNames.forEach((name) => {
  //         d[name] = +d[name];
  //       });
  //     })
  //   );

  let stackedData = $derived(stack(data, seriesNames));
  let derivedData = $derived(data);

  let tooltip = $state();

  function getTooltipProps(x, y, slot, group, val) {
    return {
      x,
      y,
      slot,
      group,
      val
    };
  }

  function onBarHover(e, slot, group, val) {
    tooltip = getTooltipProps(e.layerX, e.layerY, data[slot][yKey], group, val);
  }
  function onCircleHover(e, pointData) {
    tooltip = { x: e.layerX, y: e.layerY, val: pointData };
  }

  let manyBodyStrength = 60;
  let xStrength = 0.00005;
</script>

<div class="chart-container">
  {#if ["q1_rating", "q2_rating", "q4_rating"].includes(question)}
    <div class="legend">
      {#each seriesNames as name, i}
        <div class="set">
          <div class="square" style="background-color: {seriesColors[i]};"></div>
          {name}
        </div>
      {/each}
    </div>

    <LayerCake
      padding={{ top: 0, bottom: 20, left: 35 }}
      x={[0, 1]}
      y={(d) => d.data[yKey]}
      z={"question"}
      yScale={scaleBand().paddingInner(0.05)}
      zScale={scaleOrdinal()}
      zDomain={seriesNames}
      zRange={seriesColors}
      flatData={flatten(stackedData)}
      data={stackedData}
      custom={{ seriesNames: seriesNames, seriesColors: seriesColors }}
    >
      <Svg>
        <AxisX baseline />
        <AxisY
          gridlines={false}
          label="<-- More agree&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Less agree -->"
        />

        <StackedBars {onBarHover} onLeaveBar={(e) => (tooltip = undefined)} />
      </Svg>
      {#if tooltip}
        <div
          class="tooltip"
          style="position:relative; left:{tooltip.x}px; top:{tooltip.y +
            30}px; pointer-events: none;"
        >
          <h5>{seriesNames[tooltip.group]}: {tooltip.val}</h5>
        </div>
      {/if}
    </LayerCake>
  {:else}
    <LayerCake
      data={derivedData}
      x={"identity"}
      r={"identity"}
      z={chunk}
      xScale={scaleBand()}
      rRange={[45, 45]}
      zScale={scaleOrdinal()}
      zRange={seriesColors}
    >
      <Svg>
        <ForceLayout
          data={derivedData}
          {manyBodyStrength}
          {xStrength}
          groupBy={true}
          nodeStroke="#000"
          labelVar={chunk}
          label
          {onCircleHover}
          onLeaveCircle={(e) => (tooltip = undefined)}
        />
      </Svg>
      {#if tooltip}
        <div
          class="tooltip"
          style="position:relative; left:{tooltip.x}px; top:{tooltip.y}px; pointer-events: none;"
        >
          <p><strong>"{tooltip.val[question]}"</strong></p>
          <br />
          <p>
            --{tooltip.val.gender}, {tooltip.val.age}, of {tooltip.val.city}, {tooltip.val.state}
          </p>
        </div>
      {/if}
    </LayerCake>
  {/if}
</div>

<style>
  /*
      The wrapper div needs to have an explicit width and height in CSS.
      It can also be a flexbox child or CSS grid element.
      The point being it needs dimensions since the <LayerCake> element will
      expand to fill it.
    */
  .chart-container {
    width: 100%;
    height: 650px;
    position: relative;
  }
  .tooltip {
    background-color: white;
    border: 1px solid black;
    padding: 20px;
    width: fit-content;
    max-width: 300px;
    & p {
      margin: 0;
    }
  }
  .set {
    flex: 1 0 auto;
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .square {
    height: 20px;
    width: 20px;
    display: inline-block;
  }
  .legend {
    margin-bottom: 80px;
    display: flex;
    background-color: #fff;
    gap: 10px;
  }
</style>
