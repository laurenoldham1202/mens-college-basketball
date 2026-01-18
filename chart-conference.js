function renderConferenceChartHorizontal() {
    let data = [
        { name: "American Athletic Conference", miles: 544, color: "#7F3C8D" },
        { name: "Atlantic 10 Conference", miles: 969, color: "#11A579" },
        { name: "Atlantic Coast Conference", miles: 600, color: "#3969AC" },
        { name: "Big 12 Conference", miles: 545, color: "#F2B701" },
        { name: "Big East Conference", miles: 700, color: "#E73F74" },
        { name: "Big Ten Conference", miles: 698, color: "#80BA5A" },
        { name: "Missouri Valley Conference", miles: 671, color: "#E68310" },
        { name: "Mountain West Conference", miles: 629, color: "#008695" },
        { name: "Pac-12 Conference", miles: 811, color: "#CF1C90" },
        { name: "Southeastern Conference", miles: 562, color: "#f97b72" },
        { name: "West Coast Conference", miles: 602, color: "#4b4b8f" }
    ];

    // Remove the word 'Conference' from each name
    data = data.map(d => ({
        name: d.name.replace(/ Conference$/i, ""),
        miles: d.miles,
        color: d.color
    }));

    // Sort shortest → longest
    data.sort((a, b) => a.miles - b.miles);

    const margin = { top: 50, right: 50, bottom: 30, left: 105 };
    const height = 500;

    const container = d3.select("#chart-conferences");
    if (container.empty()) return;

    const svg = container.append("svg")
        .attr("preserveAspectRatio", "xMidYMid meet");

    const g = svg.append("g");

    function render() {
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
        const y = d3.scaleBand()
            .domain(data.map(d => d.name))
            .range([0, innerHeight])
            .padding(0.3);

        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.miles)])
            .nice()
            .range([0, width]);

        // Axes
        g.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "12px");

        g.append("g")
            .attr("transform", `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("font-size", "12px");

        // Bars
        g.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("y", d => y(d.name))
            .attr("x", 0)
            .attr("height", y.bandwidth())
            .attr("width", d => x(d.miles))
            .attr("fill", d => d.color);

        // Value labels
        g.selectAll(".label")
            .data(data)
            .enter()
            .append("text")
            .attr("x", d => x(d.miles) + 5)
            .attr("y", d => y(d.name) + y.bandwidth() / 2 + 4)
            .attr("text-anchor", "start")
            .style("font-size", "11px")
            .style("fill", "#111")
            .text(d => `${d.miles} miles`);

        // Chart title
        g.append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text("Average Travel Distance by Conference");

        // X-axis label
        g.append("text")
            .attr("x", width / 2)
            .attr("y", innerHeight + 50)
            .attr("text-anchor", "middle")
            .style("font-size", "14px")
            .text("Average travel distance (miles)");
    }

    render();
    window.addEventListener("resize", render);
}

// Call the chart
renderConferenceChartHorizontal();
