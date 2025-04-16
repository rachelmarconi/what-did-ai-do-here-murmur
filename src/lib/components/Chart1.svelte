<script>
  import ChartBlock from "./chart-parts/ChartBlock.svelte";
  import Toggle from "$components/chart-parts/Toggle.svelte";

  let { title = "", description = "&nbsp;", source, notes } = $props();
  let datawrapperID = ["XGEBV", "tT1N6"];
  let index = $state(0);

  // responsive iframe code form Datawrapper
  if (typeof window !== "undefined") {
    window.addEventListener("message", function (a) {
      if (void 0 !== a.data["datawrapper-height"]) {
        var e = document.querySelectorAll("iframe");
        for (var t in a.data["datawrapper-height"])
          for (var r = 0; r < e.length; r++)
            if (e[r].contentWindow === a.source) {
              var i = a.data["datawrapper-height"][t] + "px";
              e[r].style.height = i;
            }
      }
    });
  }
</script>

<ChartBlock {title} description="" {source} {notes}>
  <div class="top">
    <em>{description}</em>
    <Toggle
      labels={["helpfulness", "dangers"]}
      onClick={() => (index == 0 ? (index = 1) : (index = 0))}
    />
  </div>

  <iframe
    {title}
    aria-label={"Map of sentiment and quotes"}
    id="datawrapper-chart-{datawrapperID[index]}"
    src="https://datawrapper.dwcdn.net/{datawrapperID[index]}"
    scrolling="no"
    frameborder="0"
    style="width: 0; min-width: 100% !important; border: none;"
    height="500"
    data-external="1"
  ></iframe>
</ChartBlock>

<style>
  .top {
    display: flex;
    gap: 10px;
    & > em {
      font-size: 18px;
    }
  }
</style>
