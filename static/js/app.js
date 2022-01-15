let data = d3.csv("data/final_data.csv").then((rawData) => {
console.log(rawData)
function loadNames(names) {
    for (let i = 0; i < names.length; i++) {
        let opt = document.createElement('option');
        opt.value = i;
        opt.innerHTML = names[i];
        document.getElementById('selDataset1').appendChild(opt);

    };
    loadNames(rawData.names);

    document.getElementById('selDataset1').onchange = function optionChanged() {
        // re-load the meta-data
        loadMetaData();
        // re-load the bar chart
        createBar(document.getElementById('selDataset1').value);
        // re-load the bubble chart
        createBubble(document.getElementById('selDataset1').value);
        // re-load the gauge
        createGauge(document.getElementById('selDataset1').value);
    };
};
