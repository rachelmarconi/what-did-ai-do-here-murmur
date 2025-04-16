<script>
  import { getContext } from "svelte";

  const { data, y, yGet, yScale, padding, custom } = getContext("LayerCake");
  const { xPadding = 8, facetIndex = null, stacked = false } = $props();
  const isBandwidth = typeof $yScale.bandwidth === "function";
</script>

<div
  class="label-wrapper"
  style:transform="translate(-{$padding.left}px, {facetIndex !== null
    ? $custom.facetPositions[facetIndex]
    : 0}px)"
  style:width="{$padding.left}px"
>
  {#if facetIndex !== null}
    {@const facetScale = $custom.facetScales[facetIndex]}
    {#each $data[facetIndex].data as item}
      <p
        class="bar-label"
        style:top="{facetScale($y(item)) + facetScale.bandwidth() / 2}px"
        style:transform="translate({-xPadding}px, -50%)"
      >
        {$y(item)}
      </p>
    {/each}
  {:else if stacked}
    {#each $data[0] as item}
      <p
        class="bar-label"
        style:top="{$yGet(item) + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}px"
        style:transform="translate({-xPadding}px, -50%)"
      >
        {$y(item)}
      </p>
    {/each}
  {:else}
    {#each $data as item}
      <p
        class="bar-label"
        style:top="{$yGet(item) + (isBandwidth ? $yScale.bandwidth() / 2 : 0)}px"
        style:transform="translate({-xPadding}px, -50%)"
      >
        {$y(item)}
      </p>
    {/each}
  {/if}
</div>

<style>
  .label-wrapper {
    position: relative;
    transform: translateX(-100px);
  }
  .bar-label {
    font-size: var(--font-size-small) !important;
    margin: 0;
    position: absolute;
    text-align: right;
    right: 0px;
  }
</style>
