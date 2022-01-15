
let data = d3.csv("final_data.csv").then((rawData) => {
    loadStates();
    loadCounties();
    /**
     * reads the data and return the names of all the states alphabetically
     * @returns array of names of states in the object
     */
    function getStates() {
        let x = [];
        for (let i = 0; i < rawData.length; i++) {
            isIn = false;
            state = rawData[i].state;
            for (j = 0; j < x.length; j++) {
                if (x[j] == state) {
                    isIn = true;
                };
            };
            if (!isIn) {
                x.push(state);
            };
        };
        return x;
    };

    /**
     * 
     * @param {String with the name of the state to be queried} state 
     * @returns list of the counties associated with the state
     */
    function getCounties(state) {
        let x = [];
        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i].state == state) {
                x.push(rawData[i].county);
            };
        };
        return x
    };

    function loadStates() {
        /**
         * load in the states dropdowns
         */
        states = getStates();
        for (let i = 0; i < states.length; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = states[i];
            document.getElementById('selDataset1').appendChild(opt);
        };
        for (let i = 0; i < states.length; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = states[i];
            document.getElementById('selDataset3').appendChild(opt);
        };
    };

    function loadCounties(){
        /**
         * load in the county drop downs
         */
         counties = getCounties(getStates()[document.getElementById('selDataset1').value]).sort();
         for (let j = 0; j < counties.length; j++) {
             let opt2 = document.createElement('option');
             opt2.value = j;
             opt2.innerHTML = counties[j];
             document.getElementById('selDataset2').appendChild(opt2);
         };
         counties = getCounties(getStates()[document.getElementById('selDataset3').value]).sort();
         for (let j = 0; j < counties.length; j++) {
             let opt2 = document.createElement('option');
             opt2.value = j;
             opt2.innerHTML = counties[j];
             document.getElementById('selDataset4').appendChild(opt2);
         };
    };

    function clearDropDown(id){
        var i, L = document.getElementById(id).options.length - 1;
        for(i = L; i >= 0; i--) {
            document.getElementById(id).remove(i);
        }
    };

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

    document.getElementById('selDataset1').onchange = function optionChanged1(value) {
        clearDropDown('selDataset2');
        loadCounties();
    };
    document.getElementById('selDataset2').onchange = function optionChanged2(value) {
        document.getElementById('sample-metadata1').innerHTML = "";
        loadMetaData1()
    };

    document.getElementById('selDataset3').onchange = function optionChanged3(value) {
        clearDropDown('selDataset4');
        loadCounties();
    };
    document.getElementById('selDataset4').onchange = function optionChanged4(value) {
        document.getElementById('sample-metadata2').innerHTML = "";
        loadMetaData2()
    };
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    // function createBar(index) {
    //     /**
    //      * find the top ten bacterias in the samples and create the bar chart
    //      */
    //     let sample = rawData.samples[index];
    //     let xAxis = sample.sample_values;
    //     let yAxis = [];
    //     let hoverText = sample.otu_labels;
    //     for (let i = 0; i < sample.otu_ids.length; i++) {
    //         yAxis.push("OTU " + sample.otu_ids[i])
    //     };
    //     // create the horizontal bar chart
    //     let hBar = [{
    //         type: 'bar',
    //         x: xAxis.slice(0, 9).reverse(),
    //         y: yAxis.slice(0, 9).reverse(),
    //         orientation: 'h',
    //         text: hoverText.slice(0, 9).reverse()
    //     }];
    //     let layout = {
    //         showlegend: false
    //     };
    //     Plotly.newPlot("bar", hBar, layout);
    // };

    /**
     * initial load ins for the page
     */
    // // load the names into the page.
    // loadNames(rawData.names);
    //load meta-data
    loadMetaData1();
    loadMetaData2();
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
        loadMetaData1();
        loadMetaData2();
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
    function loadMetaData1() {
        /**
         * locate the selected index
        * */
        let countyIndex = document.getElementById('selDataset2').value;
        var index;
        for(let i = 0; i < rawData.length; i++){
            if(rawData[i].county == getCounties(getStates()[document.getElementById('selDataset1').value]).sort()[countyIndex]){
                index = i;
            }
        };

        // generate key-value pair from the metadata using the index and add it
        //     to the associated metadata div
        document.getElementById('sample-metadata1').innerHTML = "";

        //state and county pop
        let str1 = document.createElement('h5')
        str1.innerHTML = `State Population: ${numberWithCommas(rawData[index].statePop)}`
        document.getElementById('sample-metadata1').appendChild(str1);
        let str2 = document.createElement('h5')
        str2.innerHTML = `County Population: ${numberWithCommas(rawData[index].countyPop)}`
        document.getElementById('sample-metadata1').appendChild(str2);
        
    };
    function loadMetaData2() {
        /**
         * locate the selected index
        * */
        let countyIndex = document.getElementById('selDataset4').value;
        var index;
        for(let i = 0; i < rawData.length; i++){
            if(rawData[i].county == getCounties(getStates()[document.getElementById('selDataset3').value]).sort()[countyIndex]){
                index = i;
            }
        };
        // generate key-value pair from the metadata using the index and add it
        //     to the associated metadata div
        document.getElementById('sample-metadata2').innerHTML = "";

        //state and county pop
        let str1 = document.createElement('h5')
        str1.innerHTML = `State Population: ${numberWithCommas(rawData[index].statePop)}`
        document.getElementById('sample-metadata2').appendChild(str1);
        let str2 = document.createElement('h5')
        str2.innerHTML = `County Population: ${numberWithCommas(rawData[index].countyPop)}`
        document.getElementById('sample-metadata2').appendChild(str2);
        
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
    function createGauge() {
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