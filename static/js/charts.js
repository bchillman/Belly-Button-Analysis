function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    let ids = data.names;
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    let id = d3.select('#selDataset').node().value;
    console.log(id)
    let sampleData = data.samples.filter(samp => {
      return samp.id === id;
    });
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
     
    let metaData = data.metadata.filter(meta => {
      return parseInt(meta.id) === parseInt(id);
   });
    
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
      // Done in step 4
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
      // Done in Step 1
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIDs = sampleData[0].otu_ids;
    let otuLabels = sampleData[0].otu_labels;
    let sampleValues = sampleData[0].sample_values;
    
    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    let wfreq = parseFloat(metaData[0].wfreq);
    console.log(wfreq);

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    let yticks = otuIDs.slice(0,10).map(tick => {
      return "OTU" + tick.toString();
    });
   
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      type: 'bar',
      orientation: 'h'
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      xaxis: {title: 'Number of Bacteria'},
      yaxis: {title: 'Sample Name'},
      title: 'Top 10 Bacteria Cultures Found'

    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout)
    // Deliverable 2: 1. Create the trace for the bubble chart.
    var sizes = sampleValues.map(value => {return value/1.5});
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {size: sizes,
        colorscale: [
          ['0.0', 'rgb(165,0,38)'],
          ['0.111111111111', 'rgb(215,48,39)'],
          ['0.222222222222', 'rgb(244,109,67)'],
          ['0.333333333333', 'rgb(253,174,97)'],
          ['0.444444444444', 'rgb(254,224,144)'],
          ['0.555555555556', 'rgb(224,243,248)'],
          ['0.666666666667', 'rgb(171,217,233)'],
          ['0.777777777778', 'rgb(116,173,209)'],
          ['0.888888888889', 'rgb(69,117,180)'],
          ['1.0', 'rgb(49,54,149)']
        ],
        color: otuIDs
      }}];
    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of cultures'}
    }
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    gaugeData = [{
      value: wfreq,
      type: 'indicator',
      mode: 'gauge+number',
      title: {text: 'Belly Button Washing Frequency'},
      gauge: {
        axis: {range: [null,10]},
        steps:  [
          { range: [0,2], color: 'red'},
          {range: [2,4], color: 'orange'},
          {range: [4,6], color: 'yellow'},
          {range: [6,8], color: 'green'},
          {range: [8,10], color: 'blue'}
        ],
        bar: {color: 'black'}
      }
    }];
    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 500, height: 415, margin: { t: 0, b: 0 } 
    };
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot('gauge', gaugeData, gaugeLayout)
  });
}
