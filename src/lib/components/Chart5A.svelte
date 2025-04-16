<script>
  import chart5data from "$data/chart5data.csv";
  import ChartBlock from "./chart-parts/ChartBlock.svelte";
  import Bar from "./chart-parts/Bar.svelte";
  import { percentFormat } from "$utils/format.svelte";
  import AxisX from "./chart-parts/AxisX.svelte";
  import { LayerCake, Svg } from "layercake";
  import { scaleBand, scaleOrdinal } from "d3-scale";
  import AxisY from "./chart-parts/AxisY.svelte";

  let { title = "", description = "&nbsp;", source, notes } = $props();

  let xKey = "share";
  let yKey = "q5_cat";

  const seriesColors = ["#00856B", "#F98100", "#C01C1B", "#005285", "#4B4B2E"];
</script>

<ChartBlock {title} {description} {source} {notes}>
  <div style:height="var(--spacing-8)"></div>
  <div class="chart-container">
    <LayerCake
      padding={{ bottom: 20, left: 35 }}
      x={xKey}
      y={yKey}
      yScale={scaleBand().paddingInner(0.1)}
      xDomain={[0, 40]}
      zScale={scaleOrdinal()}
      zRange={seriesColors}
      data={chart5data}
      custom={{ format: percentFormat, xKey: xKey, seriesColors: seriesColors }}
    >
      <Svg>
        <AxisX tickMarks baseline formatTick={(d) => d + "%"} />
        <AxisY gridlines={false} tickGutter={4} />
        <Bar />
      </Svg>
    </LayerCake>
  </div>
</ChartBlock>

<style>
  .chart-container {
    width: 100%;
    height: 250px;
  }
</style>
