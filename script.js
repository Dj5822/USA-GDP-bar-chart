const leftPadding = 60;
const rightPadding = 20;
const topPadding = 10;
const botPadding = 90;

const width = 1860;
const height = 840;

d3.select('body').append('h1').text("USA GDP").attr("id", "title");

fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(response => response.json())
	.then(data => {
        const dataset = data["data"];

        // bar horizontal distribution scale.
        const xScale = d3.scaleTime()
                        .domain([new Date(Date.parse(dataset[0][0])),
                        new Date(Date.parse(dataset[dataset.length-1][0])+7948800000)])
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

        var tooltip = d3.select('body').append('div')
                            .attr("id", "tooltip")
                            .style("width", "150px")
                            .style("height", "50px")
                            .style("opacity", 0);
        
        var dateText = tooltip.append("label").attr("id", "data-date");
        var gdpText = tooltip.append("label");

        svg.selectAll('rect').data(dataset).enter().append('rect')
            .attr("width", 5)
            .attr("height", (d, i) => {
                return height-botPadding-yScale(d[1]);
            })
            .attr("x", (d, i) => {
                return xScale(new Date(Date.parse(d[0])));
            })
            .attr("y", (d, i) => {
                return yScale(d[1]);
            })
            .style("fill", "blue")
            .attr("class", "bar")
            .attr("data-date", (d, i) => d[0])
            .attr("data-gdp", (d, i) => d[1])
            .on('mouseover', (d, i) => {
                dateText.text(d[0]);
                gdpText.text(`$${d[1]} billion`);
                tooltip.transition().duration(200).style("opacity", 0.9);
                if (i > dataset.length/2) {
                    tooltip.style("left", `${xScale(i) - 150}px`);
                }
                else {
                    tooltip.style("left", `${xScale(i)}px`);
                }
                if (yScale(d[1]) < height / 2) {
                    tooltip.style("top", `${yScale(d[1]) + 50}px`);
                }
                else {
                    tooltip.style("top", `${yScale(d[1]) - 50}px`);
                }
            })
            .on('mouseout', (d, i) => {
                tooltip.transition().duration(200).style("opacity", 0);
            });
        
        svg.append('g').attr("id", "x-axis")
                        .attr("transform", "translate(0," + (height - botPadding) + ")")
                        .call(xAxis);
        
        svg.append('g').attr("id", "y-axis")
                        .attr("transform", "translate(" + leftPadding + ", 0)")
                        .call(yAxis);

        svg.append('text').text("Gross Domestic Product ($Billion)")
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .attr("x", -height/3)
            .attr("y", 90);
        
            svg.append('text').text("Year")
            .attr("x", width/2)
            .attr("y", height - 30);
    });

