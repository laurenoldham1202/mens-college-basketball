
const data = [
    { team: "DUKE", miles: 299, color: "#003087" },
    { team: "KANSAS", miles: 395, color: "#0051BA" },
    { team: "KENTUCKY", miles: 440, color: "#0033A0" },
    { team: "UNC", miles: 457, color: "#7BAFD4" }
];

const referenceLines = [
    { value: 394, label: "Blue Bloods mean", align: "right" },
    { value: 588, label: "All school mean", align: "inside" }
];

const margin = { top: 50, right: 85, bottom: 50, left: 80 };
const height = 400;
const container = d3.select("#chart-blue-bloods");

function render() {
    if (container.empty()) return;

    const svg = container.append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g");

    g.selectAll("*").remove();

    const containerWidth = container.node().getBoundingClientRect().width;
    const width = containerWidth - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg
        .attr("viewBox", `0 0 ${containerWidth} ${height}`)
        .attr("width", "100%")
        .attr("height", height);

    g.attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Scales
    const x = d3.scaleBand()
        .domain(data.map(d => d.team))
        .range([0, width])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.miles)])
        .nice()
        .range([innerHeight, 0]);

    // Axes
    g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(d3.axisBottom(x));

    g.append("g")
        .call(d3.axisLeft(y));

    // Bars
    g.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => x(d.team))
        .attr("y", d => y(d.miles))
        .attr("width", x.bandwidth())
        .attr("height", d => innerHeight - y(d.miles))
        .attr("fill", d => d.color);

    // Value labels
    g.selectAll(".label")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => x(d.team) + x.bandwidth() / 2)
        .attr("y", d => y(d.miles) - 8)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .text(d => `${d.miles} miles`);

    // Chart title
    g.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Average Travel Distance by Team");

    // Y-axis label
    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 20)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("Average travel distance (miles)");

    // Halo line (draw first)
    g.selectAll(".ref-line-halo")
        .data(referenceLines)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d.value))
        .attr("y2", d => y(d.value))
        .attr("stroke", "#fff")
        .attr("stroke-width", 5)
        .attr("stroke-dasharray", "6,4");

// Actual dotted line
    g.selectAll(".ref-line")
        .data(referenceLines)
        .enter()
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => y(d.value))
        .attr("y2", d => y(d.value))
        .attr("stroke", "#111")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "6,4");


    g.selectAll(".ref-label")
        .data(referenceLines)
        .enter()
        .append("text")
        .attr("x", d =>
            d.align === "right"
                ? width + margin.right - 2   // right margin area
                : width - 8                   // inside chart
        )
        .attr("y", d => y(d.value) + 2)
        .attr("text-anchor", d =>
            d.align === "right" ? "end" : "end"
        )
        .style("font-size", "10px")
        .style("font-weight", "300")
        .style("fill", "#111")
        .text(d => d.label)
        .each(function () {
            const bbox = this.getBBox();

            g.insert("rect", "text")
                .attr("x", bbox.x - 4)
                .attr("y", bbox.y - 2)
                .attr("width", bbox.width + 8)
                .attr("height", bbox.height + 4)
                .attr("rx", 3)
                .attr("fill", "#fff")
                .attr("opacity", 0.95);
        });
}

// Initial render
render();

// Responsive resize
window.addEventListener("resize", render);