<script>
  import "@urbaninstitute/dataviz-components/style"; // import _normalize.css and _typography.css (urban-specific classes)
  import { Block, HeadingAlt, Headline, TextBlock } from "@urbaninstitute/dataviz-components";
  import "../app.css"; // import project-specific global styles
  import archieData from "$data/site_content.aml";

  import Chart1 from "$components/Chart1.svelte";
  import Chart2A from "$components/Chart2A.svelte";
  import Chart5A from "$components/Chart5A.svelte";
  import FullTool from "$components/FullTool.svelte";

  let chartComponentArray = [Chart1, Chart2A, Chart5A];

  console.log("👋 Welcome to the page!");
</script>

<div class="header-top-margin"></div>
<Headline
  headline="Here is the title of the survey data walkthrough"
  date="January 49, 2025"
  width="wide"
/>

<!-- INTRO -->
<div class="intro-gradient">
  {#each archieData.intro as block, i}
    <TextBlock>
      {#if i == 0}
        <strong style="font-size: 24px;">{@html block.value}</strong>
      {:else}
        {@html block.value}
      {/if}
    </TextBlock>
  {/each}
</div>

<!-- CHARTS -->
{#each archieData.sections as block, sectionIndex}
  {@const ChartBlockID = chartComponentArray[sectionIndex]}

  {#if sectionIndex != 0}
    <div class="breaker"></div>
  {/if}

  <div class="content-container">
    <div class="left-side-text">
      <Block><h2>{block.section_title}</h2></Block>
      {#each block.text as text}
        <TextBlock>
          {@html text.value}
        </TextBlock>
      {/each}
    </div>
    <div class="right-side-chart">
      <ChartBlockID
        title={block.title}
        description={block.description}
        source={block.source}
        notes={block.notes}
      />
    </div>
  </div>
  <br /><br />
{/each}

<div class="breaker"></div>
<!--FULL TOOL-->
<Block><h2>{archieData.full_tool_title}</h2></Block>
<TextBlock>
  {@html archieData.full_tool_how_to}
</TextBlock>
<FullTool />

<!-- ABOUT -->
<div class="breaker-last-chart-margin"></div>
<Block width="body">
  <div class="breaker-section"></div>
  <HeadingAlt content={"Methodology and AI"} />
</Block>
{#each archieData.about_the_data as block}
  <TextBlock>
    {@html block.value}
  </TextBlock>
{/each}

<TextBlock>
  {@html archieData.view_on_git_text}
</TextBlock>

<style>
  .header-top-margin {
    display: block;
    height: 57px;
    transition: 250ms ease-in-out;
    @media screen and(max-width: 768px) {
      height: 41px;
    }
    @media screen and (max-width: 375px) {
      height: 17px;
    }
  }
  .breaker {
    height: 240px;
    display: block;

    @media screen and (max-width: 1190px) {
      height: 120px;
    }
  }
  .breaker-section {
    height: 60px;
    border-top: 1px var(--color-gray) solid;
    margin-top: 128px;
    display: block;
  }
  .breaker-last-chart-margin {
    height: 112px;

    @media screen and (max-width: 1190px) {
      height: 42px;
    }
  }

  .intro-gradient {
    background: linear-gradient(180deg, #fff 10.5%, #f5f5f5 100%);
    padding-top: 128px;
    padding-bottom: 80px;
    margin-bottom: 240px;

    @media screen and (max-width: 1190px) {
      margin-bottom: 112px;
    }
  }
  .content-container {
    display: grid;
    position: relative;
    grid-template-columns: 1fr 116px 600px;
    max-width: 1190px;
    margin: 0 auto;

    @media screen and (max-width: 1190px) {
      display: block;
    }
  }
  .right-side-chart {
    margin-top: 145px;
    grid-column-start: 3;
    position: sticky;
    align-self: start;
    top: var(--spacing-20);

    @media screen and (max-width: 1190px) {
      position: static;
      margin-bottom: 42px;
      margin-top: 40px;
    }
  }
  .left-side-text {
    grid-column-start: 1;
    padding-top: 30px;
  }
</style>
