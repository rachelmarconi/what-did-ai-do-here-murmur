<!--
  @component
  Generates an SVG force simulation using [d3-force](https://github.com/d3/d3-force). The values here are defaults which you will likely have to customize because every force simulation is different. This technique comes from @plmrry.
 -->
<script>
  import { getContext } from "svelte";
  import { forceSimulation, forceX, forceManyBody, forceCollide, forceCenter } from "d3-force";

  let { width, height, xScale, xGet, rGet, zGet } = getContext("LayerCake");
  let {
    manyBodyStrength = 5,
    xStrength = 0.1,
    nodeColor = undefined,
    nodeStroke = "#fff",
    nodeStrokeWidth = 1,
    groupBy = true,
    data = [],
    labelVar = "keyword",
    label = false,
    onCircleHover = () => {},
    onLeaveCircle = () => {}
  } = $props();
  /** @type {Number} [manyBodyStrength=5] - The value passed into the `.strength` method on `forceManyBody`, which is used as the `'charge'` property on the simulation. See [the documentation](https://github.com/d3/d3-force#manyBody_strength) for more. */
  //export let manyBodyStrength = 5;

  /** @type {Number} [xStrength=0.1] - The value passed into the `.strength` method on `forceX`, which is used as the `'x'` property on the simulation. See [the documentation](https://github.com/d3/d3-force#x_strength) for more. */
  //export let xStrength = 0.1;

  /** @type {String|undefined} [nodeColor] - Set a color manually otherwise it will default to the `zScale`. */
  //export let nodeColor = undefined;

  /** @type {String} [nodeStroke='#fff'] - The circle's stroke color. */
  //export let nodeStroke = "#fff";

  /** @type {Number} [nodeStrokeWidth=1] - The circle's stroke width, in pixels. */
  //export let nodeStrokeWidth = 1;

  /** @type {boolean} [groupBy=true] - Group the nodes by the return value of the x-scale. If `false`, align all the nodes to the canvas center. */
  //export let groupBy = true;

  /* --------------------------------------------
   * Make a copy because the simulation will alter the objects
   */
  const initialNodes = $derived(data.map((d) => ({ ...d })));

  const simulation = $derived(forceSimulation(initialNodes));

  let nodes = $state([]);
  //$inspect("NODES", nodes);

  $effect(() => {
    simulation.on("tick", () => {
      nodes = simulation.nodes();
    });
  });

  /* ----------------------------------------------
   * When variables change, set forces and restart the simulation
   */
  $effect(() => {
    simulation
      .force(
        "x",
        forceX()
          .x((d) => {
            return groupBy === true ? $xGet(d) + $xScale.bandwidth() / 2 : $width / 2;
          })
          .strength(xStrength)
      )
      .force("center", forceCenter($width / 2, $height / 2))
      .force("charge", forceManyBody().strength(manyBodyStrength))
      .force(
        "collision",
        forceCollide().radius((d) => {
          return $rGet(d) + nodeStrokeWidth / 2; // Divide this by two because an svg stroke is drawn halfway out
        })
      )
      .force("center", forceCenter($width / 2, $height / 2))
      .alpha(1)
      .restart();
  });
</script>

{#each nodes as point, i}
  <circle
    class="node"
    r={$rGet(point)}
    fill={nodeColor || $zGet(point)}
    stroke={nodeStroke}
    stroke-width={nodeStrokeWidth}
    cx={point.x}
    cy={point.y}
    onmousemove={(e) => onCircleHover(e, point)}
    onmouseout={(e) => onLeaveCircle()}
  >
    <!-- <title>{point[$custom.title]}</title> -->
  </circle>
  {#if label}
    {#each point[labelVar].split(/[ -]/) as line, i}
      <text x={point.x} y={point.y + 18 * i}>{line}</text>
    {/each}
  {/if}
{/each}

<style>
  circle {
    cursor: pointer;
  }
  text {
    font-size: 14px;
    text-anchor: middle;
    fill: white;
    stroke: black;
    stroke-width: 0.5;
    font-weight: 800;
    pointer-events: none;
  }
</style>
