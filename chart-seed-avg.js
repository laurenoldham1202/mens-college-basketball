const dataAvg = [
    { seed: "1 SEED", miles: 353, color: "#80bad1" },
    { seed: "2 SEED", miles: 482, color: "#5694c1" },
    { seed: "3 SEED", miles: 689, color: "#2c6db1" },
    { seed: "4 SEED", miles: 829, color: "#0146a1" }
];

const marginAvg = { top: 40, right: 20, bottom: 50, left: 60 };
const containerAvg = d3.select("#chart-chapter-5");

// Create SVG once
const svg = containerAvg
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet");

const g = svg.append("g");

function render() {
    // Clear previous render
    g.selectAll("*").remove();

    // Get container width
    const containerWidth = containerAvg.node().getBoundingClientRect().width;
    const width = containerWidth - marginAvg.left - marginAvg.right;
    const height = 400 - marginAvg.top - marginAvg.bottom;

    svg
        .attr("viewBox", `0 0 ${containerWidth} 400`)
        .attr("width", "100%")
        .attr("height", 400);

    g.attr("transform", `translate(${marginAvg.left}, ${marginAvg.top})`);

    // Scales
    const x = d3.scaleBand()
        .domain(dataAvg.map(d => d.seed))
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(dataAvg, d => d.miles)])
        .nice()
        .range([height, 0]);

    // Axes
    g.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y));

    // Bars
    g.selectAll(".bar")
        .data(dataAvg)
        .enter()
        .append("rect")
        .attr("x", d => x(d.seed))
        .attr("y", d => y(d.miles))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.miles))
        .attr("fill", d => d.color);

    // Labels
    g.selectAll(".label")
        .data(dataAvg)
        .enter()
        .append("text")
        .attr("x", d => x(d.seed) + x.bandwidth() / 2)
        .attr("y", d => y(d.miles) - 8)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d => `${d.miles} miles`);

    g.append("text")
        .attr("class", "y-axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -marginAvg.left + 15)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .style("fill", "#000")
        .text("Average travel distance (miles)");

    g.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .style("fill", "#000")
        .text("Average Travel Distance by Seed");


}

// Initial render
render();

// Re-render on resize
window.addEventListener("resize", render);