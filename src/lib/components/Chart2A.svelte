<script>
  import chart2data from "$data/chart2data.csv";
  import ChartBlock from "./chart-parts/ChartBlock.svelte";
  import ForceLayout from "./CirclePackForce.svelte";
  import { LayerCake, Svg } from "layercake";
  import { scaleBand, scaleOrdinal } from "d3-scale";
  let { title = "", description = [], source, notes } = $props();

  let topData = $state(chart2data ? chart2data.filter((d) => d.category == "quality") : []);
  let bottomData = $state(chart2data ? chart2data.filter((d) => d.category == "industry") : []);

  const xKey = "keyword";
  const rKey = "frequency";
  const zKey = "frequency";

  const seriesColors = ["#00856B", "#4B4B2E", "#005285", "#C01C1B"];

  let manyBodyStrength = 60;
  let xStrength = 0.005;
</script>

<ChartBlock {title} description={description[0].value} {source} {notes}>
  <div class="chart-container">
    <LayerCake
      data={topData}
      x={xKey}
      r={rKey}
      z={zKey}
      xScale={scaleBand()}
      rRange={[35, 75]}
      zScale={scaleOrdinal()}
      zRange={seriesColors}
    >
      <Svg>
        <ForceLayout
          data={topData}
          {manyBodyStrength}
          {xStrength}
          groupBy={false}
          label={true}
          nodeStroke="#000"
        />
      </Svg>
    </LayerCake>
  </div>
</ChartBlock>

<ChartBlock {title} description={description[1].value} {source} {notes}>
  <div class="chart-container">
    <LayerCake
      data={bottomData}
      x={xKey}
      r={rKey}
      z={zKey}
      xScale={scaleBand()}
      rRange={[35, 75]}
      zScale={scaleOrdinal()}
      zRange={seriesColors}
    >
      <Svg>
        <ForceLayout
          data={bottomData}
          {manyBodyStrength}
          {xStrength}
          groupBy={false}
          nodeStroke="#000"
          label={true}
          labelVar="keyword"
        />
      </Svg>
    </LayerCake>
  </div>
</ChartBlock>

<style>
  .chart-container {
    width: 100%;
    height: 350px;
    position: relative;
  }
</style>
