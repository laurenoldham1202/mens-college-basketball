function renderSeedBoxplot(json, schoolColorMap) {
    const seedColors = {
        1: "#80bad1",
        2: "#5694c1",
        3: "#2c6db1",
        4: "#0146a1"
    };

    const container = d3.select("#boxplot-seed-mean");
    if (container.empty()) return;

    container.select("svg").remove();

    const margin = { top: 50, right: 10, bottom: 50, left: 40 };
    const height = 420;
    const width =
        container.node().getBoundingClientRect().width -
        margin.left -
        margin.right;

    const svg = container.append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height}`)
        .attr("width", "100%")
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const innerHeight = height - margin.top - margin.bottom;

    // ---- Data prep ----
    const data = json.features
        .map(d => ({
            seed: d.properties.seed,
            year: +d.properties.year,
            site: d.properties.site,
            school: d.properties.school_common_name,
            distance: +d.properties.distance,
        }))
        .filter(d => !isNaN(d.distance));

    const grouped = d3.group(data, d => d.seed);
    const seeds = Array.from(grouped.keys()).sort((a, b) => +a - +b);

    const seedDomain = ["All", ...seeds];

    // ---- Boxplot stats ----
    const stats = seeds.map(seed => {
        const values = grouped.get(seed)
            .map(d => d.distance)
            .sort(d3.ascending);

        const q1 = d3.quantile(values, 0.25);
        const q3 = d3.quantile(values, 0.75);
        const iqr = q3 - q1;

        // console.log(d3.max(values))
        return {
            seed,
            min: d3.min(values).toPrecision(2),
            max: d3.max(values),
            q1,
            q3,
            median: d3.quantile(values, 0.5),
            iqr,
            values
        };
    });

    const allValues = data
        .map(d => d.distance)
        .sort(d3.ascending);

    const allStats = {
        seed: "All",
        mean: d3.mean(allValues),
        min: d3.min(allValues),
        q1: d3.quantile(allValues, 0.25),
        median: d3.quantile(allValues, 0.5),
        q3: d3.quantile(allValues, 0.75),
        max: d3.max(allValues)
    };

    const overallLabels = [
        { key: "min",    label: "Min",    value: allStats.min,    dx: 2 },
        { key: "median", label: "Median", value: allStats.median, dx: 8 },
        { key: "mean",   label: "Mean",   value: allStats.mean,   dx: 42 },
        { key: "max",    label: "Max",    value: allStats.max,    dx: 0 }
    ];




    // ---- Scales ----
    const x = d3.scaleLinear()
        .domain([0, d3.max(stats, d => d.max)])
        .nice()
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(seedDomain)
        .range([0, innerHeight])
        .padding(0.4);


    // // ---- Axes ----
    // g.append("g")
    //     .attr("transform", `translate(0, ${innerHeight})`)
    //     .call(d3.axisBottom(x));

    g.append("g")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(
            d3.axisBottom(x)
                .tickValues(
                    d3.range(0, x.domain()[1] + 1, 500)
                )
        );



    g.append("g")
        .call(d3.axisLeft(y));









    const boxHeightAll = y.bandwidth();

    const overall = g.append("g")
        .attr("transform", `translate(0, ${y("All")})`);

// IQR box
    overall.append("rect")
        .attr("x", x(allStats.q1))
        .attr("width", x(allStats.q3) - x(allStats.q1))
        .attr("height", boxHeightAll)
        .attr("fill", "#eee")
        .attr("stroke", "#444")
        .attr("stroke-width", 2);

// Median
    overall.append("line")
        .attr("x1", x(allStats.median))
        .attr("x2", x(allStats.median))
        .attr("y1", 0)
        .attr("y2", boxHeightAll)
        .attr("stroke", "#111")
        .attr("stroke-width", 2);

// Whisker
    overall.append("line")
        .attr("x1", x(allStats.min))
        .attr("x2", x(allStats.max))
        .attr("y1", boxHeightAll / 2)
        .attr("y2", boxHeightAll / 2)
        .attr("stroke", "#444")
        .attr("stroke-width", 2);

    
    
    
    
    
    

    // ---- Boxplots ----
    const boxHeight = y.bandwidth();

    const box = g.selectAll(".box")
        .data(stats)
        .enter()
        .append("g")
        .attr("transform", d => `translate(0, ${y(d.seed)})`);

    // IQR box
    box.append("rect")
        .attr("x", d => x(d.q1))
        .attr("width", d => x(d.q3) - x(d.q1))
        .attr("height", boxHeight)
        .attr("fill", d => seedColors[+d.seed] || "#ccc")
        .attr("opacity", 0.8)
        .attr("stroke", d => seedColors[+d.seed])
        .attr("stroke-width", 2);

    // Median
    box.append("line")
        .attr("x1", d => x(d.median))
        .attr("x2", d => x(d.median))
        .attr("y1", 0)
        .attr("y2", boxHeight)
        .attr("stroke", "#111")
        .attr("stroke-width", 2);

    // Whisker line
    box.append("line")
        .attr("x1", d => x(d.min))
        .attr("x2", d => x(d.max))
        .attr("y1", boxHeight / 2)
        .attr("y2", boxHeight / 2)
        .attr("stroke", "#333")
        .attr("stroke-width", 2);

    // points = g.selectAll(".point")
    //     .data(pointData)
    //     .enter()
    //     .append("circle")
    //     .attr("class", "point")
    //     .attr("cx", d => x(d.distance))
    //     .attr("cy", d => y(d.seed))
    //     .attr("r", 3)
    //     .attr("fill", "#999")
    //     .attr("opacity", 0.35)
    //     .attr("data-school", d => d.school_common_name);
    //
    // const comparisonLayer = g.append("g")
    //     .attr("class", "comparison-layer");



    // ---- Points ----
    g.selectAll(".point")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.distance))
        .attr("cy", d =>
            y(d.seed) + y.bandwidth() / 2 +
            (Math.random() - 0.5) * y.bandwidth() * 0.4
        )
        .attr("r", d => {
            const s = stats.find(v => v.seed === d.seed);
            // make outliers stand out
            // return (d.distance < s.q1 - 1.5 * s.iqr ||
            //     d.distance > s.q3 + 1.5 * s.iqr)
            //     ? 5
            //     : 3;
            return 3
        })
        .attr("fill", "#E27600")
        .attr("opacity", 0.45)

        // ---------- INTERACTION ----------
        .on("mouseover", function (event, d) {
            console.log(d)
            const color = schoolColorMap.get(d.school) || "#000";

            d3.select(this)
                .attr("r", 7)
                .attr("fill", color)
                .attr("opacity", 1);

            tooltip
                .style("opacity", 1)
                .html(`
        <strong>${d.school}</strong><br/>
        Site: ${d.site}<br/>
        Year: ${+d.year}<br/>
        Distance: ${d.distance.toFixed(1)} miles
      `);
        })

        .on("mousemove", function (event) {
            tooltip
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 28}px`);
        })

        .on("mouseout", function () {
            d3.select(this)
                .attr("r", 3)
                .attr("fill", "#E27600")
                .attr("opacity", 0.45);

            tooltip.style("opacity", 0);
        });


    // ---- Titles ----
    g.append("text")
        .attr("x", width / 2)
        .attr("y", -20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Travel Distance Distribution by Seed");

    g.append("text")
        .attr("x", width / 2)
        .attr("y", innerHeight + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        .text("Travel distance (miles)");

    g.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -innerHeight / 2)
        .attr("y", -margin.left + 15)
        .attr("text-anchor", "middle")
        .style("font-size", "13px")
        // .style("font-weight", "600")
        .text("Seeds");


    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "chart-tooltip")
        .style("position", "absolute")
        .style("background", "#fff")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("padding", "6px 8px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    overall.selectAll(".overall-label")
        .data(overallLabels)
        .enter()
        .append("text")
        .attr("x", d => {
            const px = x(d.value) + d.dx;

            // Prevent overlap with left axis
            return Math.max(px, 16);
        })
        .attr("y", -6)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .style("font-weight", d =>
            d.key === "median" || d.key === "mean" ? "600" : "400"
        )
        .style("fill", d =>
            d.key === "mean" ? "#c00" : "#111"
        )
        .text(d => `${d.label}: ${Math.round(d.value)}`);


    // overall mean line
    overall.append("line")
        .attr("x1", x(allStats.mean))
        .attr("x2", x(allStats.mean))
        .attr("y1", 0)
        .attr("y2", y.bandwidth())
        .attr("stroke", "#c00")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", "4,3");


}
