<script>
  import { logClickToGA } from "@urbaninstitute/dataviz-components";

  // import { createEventDispatcher } from "svelte";
  // const dispatch = createEventDispatcher();

  let {
    active = $bindable(false),
    labels = ["First", "Second"],
    disabled = false,
    onClick
  } = $props();
</script>

<div class="inline-item">
  <button
    class="container"
    {disabled}
    role="switch"
    aria-checked={active}
    onclick={(e) => {
      onClick(active);
      active = !active;
      logClickToGA(e.target, "chart-4-msa-select-click--" + active);
    }}
    ><p class="label left">{labels[0]}</p>
    <span class="toggle" aria-hidden="true"><span class="circle"></span></span>
    <p class="label right">{labels[1]}</p>
  </button>
</div>

<style>
  /* .inline-item {
    flex: 1 0 auto;
  } */
  .container {
    display: inline-flex;
    appearance: none;
    background: none;
    border: none;
    color: var(--color-black);
    gap: 7px;
    justify-content: start;
    align-items: center;
    cursor: pointer;
    &:focus-visible {
      outline: 2px solid var(--color-gray-shade-dark);
    }
    & > p {
      margin: 0px !important;
    }
  }

  /* lower opacity if disabled */
  .container:disabled {
    opacity: 0.5;
  }

  /* label text */
  .label {
    display: inline-block;
    font-weight: 700;
    font-size: 18px !important;
  }

  .toggle {
    display: inline-block;
    width: 50px;
    height: 24px;
    border-radius: 12px;
    background-color: #05806b;
    border: 1px solid #05806b;
    position: relative;
    transition:
      background-color 250ms ease,
      border 250ms ease;
  }

  .toggle .circle {
    display: inline-block;
    width: 18px;
    height: 18px;
    border-radius: 9px;
    background-color: var(--color-white);
    position: absolute;
    left: 0;
    top: 0;
    transform: translate(2px, 2px);
    transition: transform 250ms ease;
  }

  button[aria-checked="true"] .toggle {
    background-color: #f98100;
    border: 1px solid #f98100;
  }

  button[aria-checked="false"] .left {
    font-weight: 800;
    color: #05806b;
  }

  button[aria-checked="true"] .right {
    font-weight: 800;
    color: #f98100;
  }

  button[aria-checked="true"] .circle {
    background-color: var(--color-white);
    left: none;
    transform: translate(28px, 2px);
  }

  @media (prefers-reduced-motion: reduce) {
    .toggle,
    .toggle .circle {
      transition-duration: 0ms;
    }
  }
</style>
