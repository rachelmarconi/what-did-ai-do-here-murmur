<script>
  import chart4data from "$data/us_ai_survey_unique_50.csv";
  import ChartBlock from "./chart-parts/ChartBlock.svelte";
  import ForceLayout from "./CirclePackForce.svelte";
  import { LayerCake, Svg } from "layercake";
  import { scaleBand, scaleOrdinal } from "d3-scale";
  let { title = "", description = [], source, notes } = $props();

  let topData = $state(
    chart4data
      ? chart4data
          .filter((d) => d.q3_cat == "helpful")
          .map((d) => ({ q3_cat: d.q3_cat, gender: d.gender, q1_rating: d.q1_rating, identity: 1 }))
      : []
  ); //top chart shows unlikelies
  let bottomData = $state(
    chart4data
      ? chart4data
          .filter((d) => d.q3_cat == "apathy")
          .map((d) => ({ q3_cat: d.q3_cat, gender: d.gender, q1_rating: d.q1_rating, identity: 1 }))
      : []
  ); //bottom chart shows liklies

  const xKey = "identity";
  const rKey = "identity";
  const zKey = "gender";

  const seriesColors = ["#00856B", "#005285", "#C01C1B"];

  let manyBodyStrength = 30;
  let xStrength = 0.00005;
</script>

<ChartBlock {title} description={description[0].value} {source} {notes}>
  <div class="chart-container">
    <LayerCake
      data={topData}
      x={xKey}
      r={rKey}
      z={zKey}
      xScale={scaleBand()}
      rRange={[30, 30]}
      zScale={scaleOrdinal()}
      zRange={seriesColors}
    >
      <Svg>
        <ForceLayout
          data={topData}
          {manyBodyStrength}
          {xStrength}
          groupBy={true}
          nodeStroke="#000"
          labelVar="gender"
          label
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
      rRange={[30, 30]}
      zScale={scaleOrdinal()}
      zRange={seriesColors}
    >
      <Svg>
        <ForceLayout
          data={bottomData}
          {manyBodyStrength}
          {xStrength}
          groupBy={true}
          nodeStroke="#000"
          labelVar="gender"
          label
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
