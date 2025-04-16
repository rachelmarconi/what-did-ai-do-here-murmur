# what-did-ai-do-here-murmur

For this project, I focused on storytelling. A user may want an overview of the data, with a few pull-out graphics, before diving into the full dataset -- so I created a few sections where data can be explained before opening into the wider tool.

Since data were randomized, chart type was difficult to land on as no trends were evident to assist decision-making. I went with bubbles for fun, since I haven't played with them much recently, but included some stacked bars in the full tool.

I ended up tossing the sentiment column in favor of keyword extraction and eyeballed categorization, tacked onto the ends of each row. With more time, I would've pulled out my computational journalism notes and reached for NLP, removing stopwords and seeing what remains.

# Building this project

To run this project, clone it, open the directory, and use this set of commands:

```
npm install
npm run dev
```

and navigate to localhost:5173.

# How I built this project

I used Figma for mockups. I pulled up R for data manipulation (see my script in the data folder). I used Svelte and a few components from the open-source Urban components library that I helped create. I leaned on LayerCake, a dataviz library for Svelte, and DataWrapper for a chart where out-of-the-box is ok. I also used ArchieML for static text, to keep content separate from code.

# What I wanted to complete but didn't

I like to work on animations, smooth transitions, and better labeling and annotation of charts. I wasn't happy with labels inside bubbles instead of forced outside. The hierarchy for the full tool needs work, as the title seems secondary to the filters. I wanted to break open the dropdowns and edit the text within to match my mockups and keep with the color palette. Same with the checkbox checked color. I thought about normalizing stacked bars to 100%, but ended up not. I didn't check what it does on mobile.

# My biggest downfall

I definitely spent too much time on the data manipulation within the tool. Looking back now, I could have streamlined data generation so that it's being manipulated only once and held in external stores.
