### Overview
This is a visualization of industry spending on congressional campaigns from 2010 through 2014.

This visualization is driven by data from the [Center for Responsive Politics](https://www.opensecrets.org/) and [Maplight](http://maplight.org/).

### To Run
First, unzip the data! Extract `./contribution-vis/data.zip` into `./contribution-vis/data/`. Your new `data` directory should contain `contributions.json` and `industries.json`.

```
cd committee-contribution-vis
npm install
npm app.js
```

The visualization will be at `http://localhost:8000/`
