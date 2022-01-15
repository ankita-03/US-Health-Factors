/**
 * read the json file using d3
 */
 let data = d3.json("data/samples.json").then((rawData) => {
    /**
     * create var for name and load that data into the <select>
     */
    function loadNames(names) {
        for (let i = 0; i < names.length; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = names[i];
            document.getElementById('selDataset').appendChild(opt);
        };
    };

    /**
     * initial load ins for the page
     */
    // load the names into the page.
    loadNames(rawData.names);
    //load meta-data
    loadMetaData();
    //create the hbar chart
    createBar(document.getElementById('selDataset').value);
    //load bubble chart
    createBubble(document.getElementById('selDataset').value);
    //load the gauge
    createGauge(document.getElementById('selDataset').value);

    /**
     * when a name is selected update the page with the new data
     */
    document.getElementById('selDataset').onchange = function optionChanged() {
        // re-load the meta-data
        loadMetaData();
        // re-load the bar chart
        createBar(document.getElementById('selDataset').value);
        // re-load the bubble chart
        createBubble(document.getElementById('selDataset').value);
        // re-load the gauge
        createGauge(document.getElementById('selDataset').value);
    };

    /**
     * Update the meta-data
     */
    function loadMetaData() {
        /**
         * locate the selected index
        * */
        let index = document.getElementById('selDataset').value;

        // generate key-value pair from the metadata using the index and add it
        //     to the associated metadata div
        document.getElementById('sample-metadata').innerHTML = "";
        for (const [key, value] of Object.entries(rawData.metadata[index])) {
            let str = document.createElement('h5')
            str.innerHTML = `${key}: ${value}`
            document.getElementById('sample-metadata').appendChild(str);
        };
    };

    /**
     * Generate hotizontal bar chart
     */
    function createBar(index) {
        /**
         * find the top ten bacterias in the samples and create the bar chart
         */
        let sample = rawData.samples[index];
        let xAxis = sample.sample_values;
        let yAxis = [];
        let hoverText = sample.otu_labels;
        for (let i = 0; i < sample.otu_ids.length; i++) {
            yAxis.push("OTU " + sample.otu_ids[i])
        };
        // create the horizontal bar chart
        let hBar = [{
            type: 'bar',
            x: xAxis.slice(0, 9).reverse(),
            y: yAxis.slice(0, 9).reverse(),
            orientation: 'h',
            text: hoverText.slice(0, 9).reverse()
        }];
        let layout = {
            showlegend: false
        };
        Plotly.newPlot("bar", hBar, layout);
    };

    /**
    * create the bubble chart
    */
    function createBubble(index) {
        /**
        * create the bubble chart
        */
        let sample = rawData.samples[index];
        let bubble = [{
            x: sample.otu_ids,
            y: sample.sample_values,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids
            },
            text: sample.otu_labels
        }];
        let layout = {
            showlegend: false
        };
        Plotly.newPlot('bubble', bubble, layout);
    };

    /**
     * create the gauge
     */
    function createGauge(index) {
        /**
        * create the gauge
        */
        let sample = rawData.samples[index];
        // value is calculated as the average amount of sample values found / 100
        let sum = 0;
        for (let i = 0; i < sample.sample_values.length; i++) {
            sum += sample.sample_values[i];
        };
        let avg = sum / sample.sample_values.length / 4;
        var data = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: avg,
                title: { text: "Belly Button Washing Frequency", font: { size: 24 } },
                gauge: {
                    axis: { range: [0, 9], tickcolor: "darkblue" },
                    bar: { color: "darkblue" },
                    bgcolor: "white",
                    bordercolor: "gray",
                    steps: [
                        { range: [0, 3], color: "lightgreen" },
                        { range: [3, 6], color: "yellow" },
                        { range: [6, 9], color: "red" }
                    ],
                }
            }
        ];
        var layout = {
            margin: { t: 50, r: 50, l: 50, b: 50 },
            font: { color: "darkblue", family: "Arial" }
        };

        Plotly.newPlot('gauge', data, layout);
        if (avg <= 3) {
            document.getElementById('reading').innerHTML = `You should be scrubbing ${Math.trunc(avg)} times a week. \nThere isn't much of a worry of bacteria!`;
        } else if (avg > 3 && avg <= 6) {
            document.getElementById('reading').innerHTML = `You should be scrubbing ${Math.trunc(avg)} times a week. \nThere should be a moderate concern of bacteria!`;
        } else if (avg > 6) {
            document.getElementById('reading').innerHTML = `You should be scrubbing ${Math.trunc(avg)} times a week. \nThere is a high amount of bacteria detected! Maintain a healthy amount of cleaning.`;
        }
    };
});