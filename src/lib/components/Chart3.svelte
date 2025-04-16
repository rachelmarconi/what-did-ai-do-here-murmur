<script>
  import chart3data from "$data/us_ai_survey_unique_50.csv";
  import ChartBlock from "./chart-parts/ChartBlock.svelte";
  import ForceLayout from "./CirclePackForce.svelte";
  import { LayerCake, Svg } from "layercake";
  import { scaleBand, scaleOrdinal } from "d3-scale";
  let { title = "", description = [], source, notes } = $props();

  let higher_ed = ["Associate Degree", "Bachelor’s Degree", "Master’s Degree", "Doctorate"];

  let topData = $state(
    chart3data
      ? chart3data
          .filter((d) => d.q4_rating < 3)
          .map((d) => {
            higher_ed.includes(d.education_level)
              ? (d.edu_level = "Degree holder")
              : d.education_level;
            return d;
          })
          .map(({ ...rest }) => ({ identity: 1, ...rest }))
      : []
  ); //top chart shows unlikelies
  let bottomData = $state(
    chart3data
      ? chart3data
          .filter((d) => d.q4_rating > 3)
          .map((d) => {
            higher_ed.includes(d.education_level)
              ? { identity: 1, edu_level: "Degree holder" }
              : { identity: 1, edu_level: d.education_level };
            return d;
          })
      : // .map(({ education_level, ...rest }) => ({
        //   education_level: education_level,
        //   identity: 1,
        //   ...rest
        // }))
        []
  ); //bottom chart shows liklies

  const xKey = "education_level";
  const rKey = "identity";
  const zKey = "education_level";

  const seriesColors = ["#00856B", "#005285", "#C01C1B"];

  let manyBodyStrength = 30;
  let xStrength = 0.0005;
</script>

<ChartBlock title="" description={description[0].value} {source} {notes}>
  <div class="chart-container">
    <LayerCake
      data={topData}
      x={xKey}
      r={rKey}
      z={zKey}
      xScale={scaleBand()}
      rRange={[35, 35]}
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
          labelVar="education_level"
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
      rRange={[35, 35]}
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
          labelVar="education_level"
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
