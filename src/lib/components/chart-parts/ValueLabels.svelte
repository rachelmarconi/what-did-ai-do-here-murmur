<script>
  import { getContext } from "svelte";

  const { data, yGet, y, x, xGet, yScale, custom } = getContext("LayerCake");

  const { xPadding = 8, facetIndex = null } = $props();

  const isBandwidth = typeof $yScale.bandwidth === "function";
</script>

<div>
  <div
    class="label-wrapper"
    style:transform="translate(0, {facetIndex !== null ? $custom.facetPositions[facetIndex] : 0}px)"
  >
    {#if facetIndex !== null}
      {@const facetScale = $custom.facetScales[facetIndex]}
      {#each $data[facetIndex].data as item}
        <p
          class="bar-label"
          style:top="{facetScale($y(item)) + facetScale.bandwidth() / 2}px"
          style:left="{$xGet(item)}px"
          style:transform="translate({xPadding}px, -50%)"
        >
          {$custom.valueFormat($x(item))}
        </p>
      {/each}
    {:else}
      {#each $data as item}
        <p
          class="bar-label"
          style:top="{$yGet(item) + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}px"
          style:left="{$xGet(item)}px"
          style:transform="translate({xPadding}px, -50%)"
        >
          {$custom.valueFormat($x(item))}
        </p>
      {/each}
    {/if}
  </div>
</div>

<style>
  .label-wrapper {
    position: relative;
  }
  .bar-label {
    font-size: var(--font-size-small) !important;
    font-weight: var(--font-weight-bold) !important;
    margin: 0;
    position: absolute;
    text-align: left;
  }
</style>
