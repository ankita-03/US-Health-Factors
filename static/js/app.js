//read the json file using d3
let data = d3.csv("data/final_data.csv").then((rawData) => {
console.log(rawData)
})