// queryUrl = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
// // d3.json(queryUrl).then((data)=> {
    // console.log(data);
// }); <- OK! data returneed as expected

function buildMetadata(sample_id) {
  // get the metadata field
  queryUrl = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";
  d3.json(queryUrl).then((data)=> {
    //console.log(data);
    //get the metadata field;
    metaDataObject = data.metadata;
    
    // Filter the metadata for the object with the desired sample number
    for (let i = 0; i< metaDataObject.length; i++){
      
      this_sample_id = metaDataObject[i].id;
      if (this_sample_id == sample_id){
        //console.log("SAMPLE_ID: " ,this_sample_id);
        
        //console.log(this_matadata);
        let this_metadataObject = metaDataObject[i]
        
        // Use d3 to select the panel with id of `#sample-metadata`
        let panel = d3.selectAll('#sample-metadata');
        
        // Use `.html("") to clear any existing metadata
        panel.html('');
        
        let content = "";
        // use d3 to append new tags for each key-value 
        for (const [key, value] of Object.entries(this_metadataObject)){
           //console.log(key, value);
        // panel.html(`${key}: ${value}`);
           content = content + key + ": " + value + "<br>"
           //console.log(content);
        // let content = "bob: 45<br>alice: 23<br>ted: 32<br>"
        }
        panel.html(`${content}`);
        break;
      }
    }
  });
}

// function to build both charts
function buildCharts(sample_id) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    sampleObject = data.samples;

    // Filter the samples for the object with the desired sample number
    
    let otu_ids = [];
    let otu_labels = [];
    let sample_values = [];
    
    for (let i = 0; i< sampleObject.length; i++){
      
      this_sample_id = sampleObject[i].id;
      if (this_sample_id == sample_id){
        //console.log(sampleObject);
        // Get the otu_ids, otu_labels, and sample_values
        otu_ids = sampleObject[i].otu_ids;
        otu_labels = sampleObject[i].otu_labels;
        sample_values = sampleObject[i].sample_values;
      }

    }
    // Build a Bubble Chart
    const xArray = otu_ids;
    const yArray = sample_values;
    const labels = otu_labels;
    //console.log(xArray);
    let size_values = sample_values.map(item => item * 0.8);

    const trace1 = {
      x: xArray,
      y: yArray,
      mode: 'markers',
      //hover: otu_labels,
      //text: otu_labels,
      marker: {
        color: otu_ids,
        opacity: 0.75,
        size: size_values
      },
      text: labels,
    };

    const data2 = [trace1];

    const layout = {
      title: "Bubbles Bacteria Cultures Per Sample",
      xaxis: {title: "OTU_ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    // Render the Bubble Chart
    Plotly.newPlot("bubble", data2, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let otu_strings  = otu_ids.map(item => "OTU " + String(item) );
    let otu_id_dict = {
      otu_id: otu_strings,
      otu_id_string: otu_strings
    }
   
    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    
    // make a ditionary that links otu_id to sample_value, then sort by value
    let value_by_id_dict = {};
    for(let i = 0; i < otu_ids.length; i++){
      value_by_id_dict[otu_ids[i]] = sample_values[i];
    }
    items = Object.keys(value_by_id_dict).map(
      (key) => { return [key, value_by_id_dict[key]] });
    
    items.sort(
      (a,b) => { return b[1] - a[1]}
    );

    let otu_ids_sorted_by_value = items.map( (e) => {return e[0]});

    let h_bar_x = [];
    let h_bar_y = [];
    let h_bar_y_tick_label = [];

    for (let k = 0; k < 10; k++){
      let this_otu_id = otu_ids_sorted_by_value[k];
      let this_otu_tick_label = "OTU " + String(this_otu_id);
      h_bar_x.push(this_otu_id);
      h_bar_y.push(value_by_id_dict[this_otu_id])
      h_bar_y_tick_label.push(this_otu_tick_label);
      //console.log(`${k}: ${this_otu_id} ${value_by_id_dict[this_otu_id]}`);
    }

    // reverse the axis values to get required orientation
    h_bar_y.reverse();
    h_bar_y_tick_label.reverse();

    // specify chart
    let h_bar_chart = [{
      type: 'bar',
      x: h_bar_y,
      y: h_bar_y_tick_label,
      orientation: 'h'
    }];
 
    const layout2 = {
      title: "Top Ten Bacteria Cultures Found",
      xaxis: {title: "Number of Bacteria"}
      // yaxis: {title: "Number of Bacteria"}
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', h_bar_chart, layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let namesObject = data.names;
    //console.log(namesObject);
    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    dropdown.selectAll('options')
      .data(namesObject)
      .enter()
      .append('option')
      .text( d => d)
      .attr("value", d => d);

    // Get the first sample from the list

    let first_id = namesObject[0];
    // Build charts and metadata panel with the first sample
    buildMetadata(first_id);
    buildCharts(first_id);
  });
}
  
 function optionChanged(dynamic_sample_id){
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(dynamic_sample_id);
  buildCharts(dynamic_sample_id);
};

// Initialize the dashboard
init();

// Event Handler
// Function for event listener
dropdown.on("change", function(){
  const dynamic_sample_id = d3.select(this).property("value");
  console.log("dynamic_sample_id: ", dynamic_sample_id);
  optionChanged(dynamic_sample_id);
});
