<script>
  import allData from "$data/us_ai_survey_unique_50.csv";
  import { BasicDropdown } from "@urbaninstitute/dataviz-components";
  import ExploreTool from "./ExploreTool.svelte";
  import { range } from "d3-array";
  // import ChartBlock from "./chart-parts/ChartBlock.svelte";
  // import { percentFormat } from "$utils/format.svelte";

  let questions_list = [
    { label: "whether AI is beneficial for progress", value: "q1_rating" },
    { label: "whether AI is trustworthy in decision-making", value: "q2_rating" },
    { label: "whether AI will benfit individual lives", value: "q3_open" },
    { label: "whether AI will lead to job loss", value: "q4_rating" },
    { label: "what concerns people have about AI", value: "q5_open" }
  ];
  let active_question = $state(questions_list[0].value);

  let chunks_list = [
    { label: "education level", value: "education_level" },
    { label: "income level", value: "income" }
  ];
  let active_chunk = $state(chunks_list[0].value);

  let var_list = ["income", "education_level", "age", "gender", "state"];
  let possible_values_list = $derived([
    ["Low", "Lower-Middle", "Upper-Middle", "High"],
    [
      "High School",
      "Some College",
      "Associate Degree",
      "Bachelor's Degree",
      "Master’s Degree",
      "Doctorate"
    ],
    ["18-34", "36-49", "50-64", "65-75"],
    ["Male", "Female", "Non-binary"],
    allData
      .map((d) => d.state)
      .reduce((acc, curr) => {
        if (!acc.includes(curr)) {
          acc.push(curr);
        }
        return acc;
      }, [])
      .sort()
  ]);

  let active_filters = $state(possible_values_list);

  let current_data = $derived(
    allData == undefined || possible_values_list == undefined || active_question == null
      ? []
      : active_filters.reduce((acc, curr, i) => {
          if (i == 2) {
            return acc.filter((d) => {
              //for each datapoint still around, check if it falls in any active age range
              let keepMe = false;
              curr.forEach((rangeStr) => {
                let range = rangeStr.split("-");
                if (d[var_list[i]] >= +range[0] && d[var_list[i]] <= +range[1]) {
                  keepMe = true;
                }
              });
              return keepMe;
            });
          } else {
            return acc.filter((d) => curr.includes(d[var_list[i]]));
          }
        }, allData)
  );

  let formatted_data = $derived(
    ["q3_open", "q5_open"].includes(active_question)
      ? current_data.map((d) => ({ ...d, identity: 1 }))
      : current_data
          .map((d) => ({ chunk: d[active_chunk], question: d[active_question] }))
          .reduce((acc, curr) => {
            if (acc.length == 0 || acc.find((d) => d.question == curr.question) == undefined) {
              let needed_vals = possible_values_list[var_list.indexOf(active_chunk)];
              let obj = Object.fromEntries(needed_vals.map((d) => [d, 0]));
              obj.question = curr.question;
              acc.push(obj);
            }
            acc.find((d) => d.question == curr.question)[curr.chunk]++;
            return acc;
          }, [])
  );
</script>

<div class="container">
  <div class="left-panel">
    {#each var_list as variable, i}
      <h4>{variable.toUpperCase()}</h4>
      <div class="inputs">
        {#each possible_values_list[i] as label}
          <label class={variable == "age" || variable == "state" ? "inline" : ""}
            ><input
              type="checkbox"
              value={label}
              checked
              bind:group={active_filters[i]}
            />{label}</label
          >
        {/each}
      </div>
    {/each}
  </div>
  <div class="main-screen">
    <div class="title">
      <h3>Exploring</h3>
      <di class="inline-drop"
        ><BasicDropdown
          id="select-question"
          bind:value={active_question}
          data={questions_list}
          inlineLabel="Choose a question."
          dropdownWidth={360}
        /></di
      >

      <h3>sorted by</h3>
      <div class="inline-drop">
        <BasicDropdown
          id="select-chunks"
          bind:value={active_chunk}
          data={chunks_list}
          inlineLabel="Choose a category to chunk by."
          dropdownWidth={260}
        />
      </div>
    </div>
    <div class="chart-container">
      <ExploreTool data={formatted_data} question={active_question} chunk={active_chunk} />
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    margin: 0 50px;
    gap: 60px;
  }
  .left-panel {
    flex: 0 1 auto;
    min-width: 250px;
    max-width: 350px;
  }
  .main-screen {
    flex: 1 0 auto;
  }
  .title,
  .title h3,
  .inline-drop,
  .inline-drop:first-child {
    display: inline-block !important;
    width: fit-content !important;
  }
  .inline-drop {
    margin: 0px 10px;
  }
  .inputs {
    margin-left: 45px;
  }
  label {
    display: block;

    &.inline {
      display: inline-block;
      margin-left: 15px;
    }
  }
</style>
