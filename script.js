const leftPadding = 60;
const rightPadding = 20;
const topPadding = 10;
const botPadding = 30;

const width = 1860;
const height = 820;

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
	.then(data => {
        const dataset = data["data"];

        // bar horizontal distribution scale.
        const xScale = d3.scaleLinear()
                        .domain([0, dataset.length])
                        .range([leftPadding, width - rightPadding]);

        // bar height scale.
        const yScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset, d => d[1])])
                        .range([height-botPadding, topPadding]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        const svg = d3.select('body').append('svg')
                        .attr("width", width).attr("height", height)
                        .style("background-color", "#DDDDDD");

        svg.selectAll('rect').data(dataset).enter().append('rect')
            .attr("width", 5)
            .attr("height", (d, i) => {
                return height-botPadding-yScale(d[1]);
            })
            .attr("x", (d, i) => {
                return xScale(i);
            })
            .attr("y", (d, i) => {
                return yScale(d[1]);
            }).style("fill", "blue");
        
        svg.append('g').attr("id", "x-axis")
                        .attr("transform", "translate(0," + (height - botPadding) + ")")
                        .call(d3.axisBottom(
                            d3.scaleLinear()
                                .domain([parseInt(dataset[0][0].split("-")[0]),
                                 parseInt(dataset[dataset.length-1][0].split("-")[0])])
                                .range([leftPadding, width - rightPadding])
                        ));
        
        svg.append('g').attr("id", "y-axis")
                        .attr("transform", "translate(" + leftPadding + ", 0)")
                        .call(yAxis);

        d3.select('body').append('h1').text("USA GDP");
        
        d3.select('body').append('p').text(JSON.stringify(data));
    });

