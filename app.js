
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
// Load states in drop downs
    function loadStates() {
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
// Load
    function loadCounties() {
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
//Clear Drop when a new selection is made
    function clearDropDown(id) {
        var i, L = document.getElementById(id).options.length - 1;
        for (i = L; i >= 0; i--) {
            document.getElementById(id).remove(i);
        }
    };
    function loadNames(names) {
        for (let i = 0; i < names.length; i++) {
            let opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = names[i];
            document.getElementById('selDataset').appendChild(opt);
        };
    };
//Load Functions and update site when a dropdown is changed 
    document.getElementById('selDataset1').onchange = function optionChanged1(value) {
        clearDropDown('selDataset2');
        loadCounties();
        createGuage1()
        createGuage3()
    };
    document.getElementById('selDataset2').onchange = function optionChanged2(value) {
        document.getElementById('sample-metadata1').innerHTML = "";
        loadMetaData1();
        createGuage1()
        createGuage3()
    };
    document.getElementById('selDataset3').onchange = function optionChanged3(value) {
        clearDropDown('selDataset4');
        loadCounties();
        createGuage2();
        createGuage4()
    };
    document.getElementById('selDataset4').onchange = function optionChanged4(value) {
        document.getElementById('sample-metadata2').innerHTML = "";
        loadMetaData2();
        createGuage2();
        createGuage4()
    };
//Format numbers in population to include commas
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
//Create Gauge Charts for population in poor or fair health
    function createGuage1() {
        let countyIndex = document.getElementById('selDataset2').value;
        var index;
        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i].county == getCounties(getStates()[document.getElementById('selDataset1').value]).sort()[countyIndex]) {
                index = i;
            }
        };
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: rawData[index]["pofHealth %"],
                title: { text: "Population Poor or Fair Health %" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [null, 100] },
                'bgcolor': "steelblue",
                'bar': {'color': "red"}, }
            }
        ];
        var layout = { width: 550 };
        Plotly.newPlot('gauge1', data, layout);
    };
    function createGuage2() {
        let countyIndex = document.getElementById('selDataset4').value;
        var index;
        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i].county == getCounties(getStates()[document.getElementById('selDataset3').value]).sort()[countyIndex]) {
                index = i;
            }
        };
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: rawData[index]["pofHealth %"],
                title: { text: "Population Poor or Fair Health %" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [null, 100] },
                'bgcolor': "steelblue",
                'bar': {'color': "red"}, }
            }
        ];
        var layout = { width: 550 };
        Plotly.newPlot('gauge2', data, layout);
    };    

    function createGuage3() {
        let countyIndex = document.getElementById('selDataset2').value;
        var index;
        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i].county == getCounties(getStates()[document.getElementById('selDataset1').value]).sort()[countyIndex]) {
                index = i;
            }
        };
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: rawData[index]["obesity %"],
                title: { text: "Population Obesity %" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 500 },
                gauge: { axis: { range: [null, 100] },
                'bgcolor': "steelblue",
                'bar': {'color': "red"}, }
            }
        ];
        var layout = { width: 550 };
        Plotly.newPlot('gauge3', data, layout);
    };
    function createGuage4() {
        let countyIndex = document.getElementById('selDataset4').value;
        var index;
        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i].county == getCounties(getStates()[document.getElementById('selDataset3').value]).sort()[countyIndex]) {
                index = i;
            }
        };
        var data = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: rawData[index]["obesity %"],
                title: { text: "Population Obesity %" },
                type: "indicator",
                mode: "gauge+number",
                delta: { reference: 400 },
                gauge: { axis: { range: [null, 100] },
                'bgcolor': "steelblue",
                'bar': {'color': "red"}, }
            }
        ];
        var layout = { width: 550 };
        Plotly.newPlot('gauge4', data, layout);
    };    
//initial load ins for the page
    loadMetaData1();
    loadMetaData2();
    createGuage1();
    createGuage2();
    createGuage3();
    createGuage4()
//Functions for Population Metadata in first drop down selection
    function loadMetaData1() { 
        let countyIndex = document.getElementById('selDataset2').value;
        var index;
        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i].county == getCounties(getStates()[document.getElementById('selDataset1').value]).sort()[countyIndex]) {
                index = i;
            }
        };

        // generate key-value pair from the metadata using the index and add it
        //     to the associated metadata div
        document.getElementById('sample-metadata1').innerHTML = "";

    //Display State Population
        let str1 = document.createElement('h5')
        str1.innerHTML = `State Population: ${numberWithCommas(rawData[index].statePop)}`
        document.getElementById('sample-metadata1').appendChild(str1);   
    //Display County Population   
        let str2 = document.createElement('h5')
        str2.innerHTML = `County Population: ${numberWithCommas(rawData[index].countyPop)}`
        document.getElementById('sample-metadata1').appendChild(str2);
    //Display for unemployment
        let str3 = document.createElement('h5')
        str3.innerHTML = `Percent Unemployed: ${numberWithCommas(rawData[index].unemployment)}`
        document.getElementById('sample-metadata1').appendChild(str3);
        
        let str4 = document.createElement('h5')
        str4.innerHTML = `Premature Death: ${numberWithCommas(rawData[index].preDeath)}`
        document.getElementById('sample-metadata1').appendChild(str4);
    };


//Functions for Population Metadata in second drop down selection
    function loadMetaData2() {
        let countyIndex = document.getElementById('selDataset4').value;
        var index;
        for (let i = 0; i < rawData.length; i++) {
            if (rawData[i].county == getCounties(getStates()[document.getElementById('selDataset3').value]).sort()[countyIndex]) {
                index = i;
            }
        };
        // generate key-value pair from the metadata using the index and add it
        //     to the associated metadata div
        document.getElementById('sample-metadata2').innerHTML = "";

        //Display for State Population 1
        let str1 = document.createElement('h5')
        str1.innerHTML = `State Population: ${numberWithCommas(rawData[index].statePop)}`
        document.getElementById('sample-metadata2').appendChild(str1);
        
        //Display for County Population 2
        let str2 = document.createElement('h5')
        str2.innerHTML = `County Population: ${numberWithCommas(rawData[index].countyPop)}`
        document.getElementById('sample-metadata2').appendChild(str2);

        let str3 = document.createElement('h5')
        str3.innerHTML = `Percent Unemployed: ${numberWithCommas(rawData[index].unemployment)}`
        document.getElementById('sample-metadata2').appendChild(str3);

        let str4 = document.createElement('h5')
        str4.innerHTML = `Premature Death: ${numberWithCommas(rawData[index].preDeath)}`
        document.getElementById('sample-metadata2').appendChild(str4);

    };    
});