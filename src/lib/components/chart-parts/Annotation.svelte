<script module>
  /** @typedef {Object} Annotation
   * @property {string} label
   * @property {number} value
   */
</script>

<script>
  import { urbanColors } from "@urbaninstitute/dataviz-components/utils";
  import { getContext } from "svelte";
  /** @type {{data: Annotation, labelSize: number, color: string }} */
  let { data, labelSize = 14, color = urbanColors.gray_shade_darker } = $props();

  let { xScale, yScale } = getContext("LayerCake");

  let yRange = $derived($yScale.range());
  let xPos = $derived($xScale(data.value));
</script>

<line x1={xPos} x2={xPos} y1={yRange[0]} y2={yRange[1]} stroke={color} stroke-dasharray="4"
></line>
<text font-size={labelSize} x={xPos} y={yRange[1] + labelSize} fill={color}>{data.label}</text>
