// TODO 1: Fix bug where 'skip story' is behind overlay in squished screens
// TODO 2: Remove lakes/smaller water features in basemap for more clarity
// TODO 3: Plot school layer on top of secondary seeds
// TODO 4: Combine all resize events/remove
// TODO 5: MOVE FIRST CHART INTO ITS OWN sCRIPT

const layerTypes = {
    'fill': ['fill-opacity'],
    'line': ['line-opacity'],
    'circle': ['circle-opacity', 'circle-stroke-opacity'],
    'symbol': ['icon-opacity', 'text-opacity'],
    'raster': ['raster-opacity'],
    'fill-extrusion': ['fill-extrusion-opacity']
};

const alignments = {
    'left': 'lefty',
    'center': 'centered',
    'right': 'righty'
};

function getLayerPaintType(layer) {
    if (map.getLayer(layer)) {
        const layerType = map.getLayer(layer).type;
        return layerTypes[layerType];
    }
}

function setLayerOpacity(layer) {
    const paintProps = getLayerPaintType(layer.layer);
    if (paintProps) {
        paintProps.forEach(function (prop) {
            map.setPaintProperty(layer.layer, prop, layer.opacity);
        });
    }
}

let story = document.getElementById('story');
const features = document.createElement('div');
features.classList.add(alignments[config.alignment]);
features.setAttribute('id', 'features');

const header = document.createElement('div');

if (config.title) {
    const titleText = document.createElement('h1');
    titleText.innerText = config.title;
    header.appendChild(titleText);
}

if (config.subtitle) {
    const subtitleText = document.createElement('h2');
    subtitleText.innerText = config.subtitle;
    header.appendChild(subtitleText);
}

if (config.byline) {
    const bylineText = document.createElement('p');
    bylineText.innerText = config.byline;
    header.appendChild(bylineText);
}

if (header.innerText.length > 0) {
    header.classList.add(config.theme);
    header.setAttribute('id', 'header');
    story.appendChild(header);
}

config.chapters.forEach((record, idx) => {
    const container = document.createElement('div');
    const chapter = document.createElement('div');

    if (record.title) {
        const title = document.createElement('h3');
        title.innerText = record.title;
        chapter.appendChild(title);
    }

    if (record.image) {
        const image = new Image();
        image.src = record.image;
        chapter.appendChild(image);
    }

    if (record.description) {
        const story = document.createElement('p');
        story.innerHTML = record.description;
        chapter.appendChild(story);
    }

    container.setAttribute('id', record.id);
    container.classList.add('step');
    if (idx === 0) {
        container.classList.add('active');
    }

    chapter.classList.add(config.theme);
    container.appendChild(chapter);
    features.appendChild(container);
});

story.appendChild(features);

const footer = document.createElement('div');

if (config.footer) {
    var footerText = document.createElement('p');
    footerText.innerHTML = config.footer;
    footer.appendChild(footerText);
}

if (footer.innerText.length > 0) {
    footer.classList.add(config.theme);
    footer.setAttribute('id', 'footer');
    story.appendChild(footer);
}

mapboxgl.accessToken = config.accessToken;

const transformRequest = (url) => {
    const hasQuery = url.indexOf("?") !== -1;
    const suffix = hasQuery ? "&pluginName=journalismScrollytelling" : "?pluginName=journalismScrollytelling";
    return {
        url: url + suffix
    }
};

map = new mapboxgl.Map({
    container: 'map',
    style: config.style,
    center: config.chapters[0].location.center,
    zoom: config.chapters[0].location.zoom,
    bearing: config.chapters[0].location.bearing,
    pitch: config.chapters[0].location.pitch,
    scrollZoom: true,  // TODO enabled after timeout?
    zoomSnap: 0.1,
    // fadeTransition: 1000,
    fadeDuration: 1000,
    transformRequest: transformRequest
});

compareMap = new mapboxgl.Map({
    container: 'map-compare',
    style: config.style,
    // center: [0, 0],
    // zoom: 2,
    center: [-98.6, 39.8],
    zoom: 2.85,
});

// marker = new mapboxgl.Marker();
// if (config.showMarkers) {
//     marker.setLngLat(config.chapters[0].location.center).addTo(map);
// }

// instantiate the scrollama
scroller = scrollama();

// ---------------------------------- MAP EXPLORER CONSTANTS ----------------------------------

// popup for mouseover
popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: 'school-popup',
});

filters = {
    weighted: false,
    school: 'all',
    seed: 'all',
    conference: 'all',
    stat: 'mean',
};

highlights = {
    'mean_dist': 588,
    '50%_dist': 394,
    'min_dist': 0.42,
    'max_dist': 2452,
    'count_dist': 87,
    'mean_wtDist': 317,
    '50%_wtDist': 215,
    'min_wtDist': 0.42,
    'max_wtDist': 2452,  // St johns to long beach ca 1986
    'count_wtDist': 87,
};

selectedSchoolDetails = {  // TODO create class?
    id: 'selected-school',
    type: 'circle',
    paint: {
        'circle-color': '#E27600',
        'circle-stroke-opacity': 1,
    },
    visibility: 'visible',
    before: 'sites',
};

avgDistanceDetails = {
    id: 'avg-distance',
    type: 'circle',
    paint: {
        'circle-radius': highlights[setProperty('mean')] / adjustPropCircles(setProperty('mean')),  // average weighted mean
        'circle-color': 'transparent',
        'circle-stroke-opacity': 0.7,
        'circle-stroke-color': '#AA5F0E',
        'circle-stroke-width': 2,
    },
    visibility: 'visible',
    before: '',
};

lineStringDetails = {
    id: 'line',
    type: 'line',
    paint: {
        'line-color': '#999',
        'line-width': 2,
        'line-opacity': 0.75,
    },
    visibility: 'none',
    before: 'sites',
};

siteDetails = {
    id: 'sites',
    type: 'circle',
    paint: {
        'circle-radius': ['match', ['get', 'seed'], 1, 5, 2, 8, 3, 11, 4, 14, 5],
        'circle-color': ['match', ['get', 'seed'], 1, '#80bad1', 2, '#5694c1', 3, '#2c6db1', 4, '#0146a1', '#AAA'],
        'circle-opacity': 1,
    },
    visibility: 'none',
    before: '',
};

schoolDetails = {
    id: 'schools',
    type: 'circle',
    paint: {
        'circle-color': '#E27600',
        'circle-opacity': ['case', ['boolean', ['feature-state', 'clicked'], false], 1, 0.7],
        'circle-stroke-color': ['case', ['boolean', ['feature-state', 'hovered'], false], '#414140', 'whitesmoke'],
        'circle-stroke-opacity': ['case', ['boolean', ['feature-state', 'hovered'], false], 0.7, 0.5],
        'circle-stroke-width': 1.5,
    },
    visibility: 'none',
    before: '',
};

// jQuery map mouseover labels
label = $('.label');
labelText = $('.label-text');
labelSubText = $('.label-subtext');

// jQuery sidebar filter divs
mapExplorer = $('.map-explore');
weightedToggle = $('#weightedToggle');
schoolFilter = $('#schoolFilter');
seedFilter = $('#seedFilter');
conferenceFilter = $('#conferenceFilter');
statFilter = $('#statFilter');

// info card divs
infoHeader = $('.info-header');
infoText = $('.info-text')
infoBtnSchool = $('.footer-left');
infoBtnSeed = $('.footer-right');
card1Header = $('.card-1-header');
card2Header = $('.card-2-header');
card3Header = $('.card-3-header');
card4Header = $('.card-4-header');

mapDiv = $('#map');

// TODO implement random comparison button?
rivals = {
    "St. John's": "Seton Hall",
    "VCU": "Dayton",
    "Virginia Tech": "Virginia",
    "Stanford": "California",
    "Miami (FL)": "Florida State",
    "Dayton": "Xavier",
    "Saint Louis": "Dayton",
    "Seton Hall": "St. John's",
    "USC": "UCLA",
    "Vanderbilt": "Tennessee",
    "Auburn": "Alabama",
    "Saint Joseph's": "Villanova",
    "Maryland": "Duke",
    "NC State": "Wake Forest",
    "UCLA": "Arizona",
    "New Mexico": "UNLV",
    "Arizona": "UCLA",
    "Michigan": "Michigan State",
    "Indiana": "Purdue",
    "Missouri": "Kansas",
    "UConn": "Syracuse",
    "Wichita State": "Kansas State",
    "Iowa": "Iowa State",
    "BYU": "Utah",
    "Creighton": "Nebraska",
    "TCU": "Baylor",
    "Minnesota": "Wisconsin",
    "Boston College": "UMass",
    "Louisville": "Kentucky",
    "Texas": "Oklahoma",
    "Wake Forest": "North Carolina",
    "Iowa State": "Iowa",
    "Utah": "BYU",
    "LSU": "Auburn",  // TODO check??
    "Texas Tech": "Texas",
    "San Diego State": "UNLV",
    "Florida State": "Florida",
    "Gonzaga": "Washington",
    "Oklahoma State": "Oklahoma",
    "Kentucky": "Louisville",
    "Syracuse": "Georgetown",
    "Pittsburgh": "West Virginia",
    "Loyola-Chicago": "DePaul",
    "Cincinnati": "Xavier",
    "Washington State": "",
    "Mississippi State": "",
    "Arkansas": "",
    "Michigan State": "Michigan",
    "North Carolina": "Duke",
    "California": "",
    "Purdue": "Indiana",
    "Oklahoma": "",
    "Xavier": "Cincinnati",
    "Georgetown": "Syracuse",
    "Baylor": "",
    "Kansas": "Kansas State",
    "Wisconsin": "",
    "Memphis": "",
    "Georgia Tech": "",
    "South Carolina": "",
    "Kansas State": "Kansas",
    "Oregon": "",
    "Florida": "",
    "UMass": "",
    "UNLV": "",
    "Washington": "",
    "Temple": "",
    "Houston": "",
    "Marquette": "Wisconsin",
    "Illinois": "Missouri",
    "Ole Miss": "",
    "Duke": "North Carolina",
    "Georgia": "",
    "Virginia": "",
    "Tennessee": "",
    "Clemson": "",
    "Texas A&M": "",
    "Nebraska": "",
    "Ohio State": "",
    "Villanova": "Saint Joseph's",
    "Southern Illinois": "",
    "Notre Dame": "",
    "West Virginia": "Pitt",
    "Alabama": "",
    "Butler": "Xavier",
    "La Salle": "Saint Joseph's",
    "DePaul": "Marquette"
};

story = $('#story');



$('#legend').on('click', (e) => {
    if (e.target.innerText === 'legend_toggle') {
        toggleLegendOpen();
    } else {
        $('.legend-container').detach();
        $('#legend').html(`<span class="material-icons">legend_toggle</span>`);
    }
});

function toggleLegendOpen() {
    $('#legend').html(`<span class="material-icons">close</span>`);

    const schoolLegend = `
    <div class="legend-container" style="background: white; padding: 0.5rem; border-radius: 4px; display: flex;">
      <div class="legend">
        <div class="legend-row">
          <div class="circle" style="width: 8px; height: 8px;"></div>
          <div class="circle" style="width: 16px; height: 16px;"></div>
          <div class="circle" style="width: 23px; height: 23px;"></div>
          <div class="circle" style="width: 31px; height: 31px;"></div>
          <div class="circle" style="width: 44px; height: 44px;"></div>
          <div class="circle" style="width: 77px; height: 77px;"></div>
        </div>

        <div class="legend-row">
          <div class="legend-label" style="width: 38px;">250</div>
          <div class="legend-label" style="width: 46px;">500</div>
          <div class="legend-label" style="width: 53px;">750</div>
          <div class="legend-label" style="width: 61px;">1000</div>
          <div class="legend-label" style="width: 74px;">1500</div>
          <div class="legend-label" style="width: 107px;">2500</div>
        </div>
        <div style="margin-top: 0.5rem">Schools (mean travel distance in miles)</div>
      </div>


    <div class="legend" style="margin-top: auto;">
      <div class="legend-row">
        <div class="circle" style="width: 10px; height: 10px; background: #80bad1 !important;"></div>
        <div class="circle" style="width: 16px; height: 16px; background: #5694c1 !important;"></div>
        <div class="circle" style="width: 22px; height: 22px; background: #2c6db1 !important;"></div>
        <div class="circle" style="width: 28px; height: 28px; background: #0146a1 !important;"></div>
      </div>
      <div class="legend-row">
        <div class="legend-label" style="width: 38px;">1 </div>
        <div class="legend-label" style="width: 46px;">2 </div>
        <div class="legend-label" style="width: 53px;">3 </div>
        <div class="legend-label" style="width: 61px;">4 </div>
      </div>
      <div style="margin-top: 0.5rem">Site locations as seed values</div>
    </div>
    </div>`;

    $('.map-legend').append(schoolLegend);
}

resizeWindow();

// filter 2012 example on seed box mouseover
handleStorySeeds();

// dynamically apply info card defaults before jsons are loaded
setDefaultInfoCard();

// handle chapter progress bar, clicks, mouseover, etc.
handleChapters();

// TODO Refactor to handle oneCount and tenCount separately
function toggleStoryPanel(colors) {
    $('.display-more').on('click', (e) => {
        const defaultText = 'Click to see schools below ▾';
        if (e.target.innerText === defaultText) {
            $('.one-count').addClass('open-panel');
            $('.one-count').removeClass('hidden-panel');
            $('.display-more').html(`Hide schools &#9652;`);

            const oneCount = ['VCU','Virginia Tech','Dayton','Saint Louis','Creighton','Minnesota','TCU','Houston','Loyola–Chicago','California','Texas A&M','Nebraska','Southern Illinois','Butler','La Salle','DePaul','Michigan', 'Arizona', 'UConn', 'Maryland', 'UCLA', 'Indiana', 'Cincinnati', 'Kentucky', 'Pittsburgh', 'North Carolina', 'Louisville', 'Purdue', 'Michigan State', 'Kansas', 'Oklahoma', 'Syracuse', 'Georgetown', 'Florida', 'Duke', 'Villanova', 'Illinois', 'Ohio State'];
            const schoolStyles = [];
            colors.features.forEach(school => {
                oneCount.forEach(item => {
                    if (item === school.name) {
                        schoolStyles.push(item, school.color_1);
                    }
                });
            });
            schoolStyles.push('#AAA');
            map.setPaintProperty('schools', 'circle-color', ['match', ['get', 'school_common_name'], ...schoolStyles]);
        } else {
            $('.one-count').removeClass('open-panel');
            $('.one-count').addClass('hidden-panel');
            $('.display-more').html(defaultText);
            map.setPaintProperty('schools', 'circle-color', '#E27600');
        }
    });
}

function handleStorySeeds() {
    const storySeeds =  [$('#story-seed-1'), $('#story-seed-2'), $('#story-seed-3'), $('#story-seed-4')];
    storySeeds.forEach((story, i) => {
        story.on('mouseover', () => {
            // remove first box's default highlight if another box is moused over (otherwise, seed 1 stays highlighted unless mouseleaves)
            if (i !== 0) {
                $('#story-seed-1').removeClass('seed-hl-active');
            }
            story.addClass('seed-hl-active');  // highlight seed box
            map.setFilter('tourney-sites', ['all', ['==', '$type', 'Point'], ['==', 'feature-type', 'site'], ['==', 'seed', i+1]]);
            map.setFilter('tourney', ['all', ['==', '$type', 'Point'], ['==', 'feature-type', 'school'], ['==', 'seed', i+1]]);
            map.setFilter('tourney-lines', ['==', 'seed', i+1]);
        });

        story.on('mouseleave', () => {
            // remove highlighted style on mouseout
            story.removeClass('seed-hl-active');
        });
    });
}

function handleChapters() {
    generateChapterBtns();
    clickChapter();
    mouseOverChapter();
    mouseOutChapter();
}

function generateChapterBtns() {
    // dynamically push up chapter blocks for each story chapter
    config.chapters.forEach(chapter => {
        $('.chapter-list').append(`<div class='chapter' id="block-${chapter.id}"></div>`);
    });
    $('.chapter-list').append(`<!--<div class='chapter' style="width: 15% !important; background: #5694c1" id="toggle-explore-mode">EXPLORE</div>-->`);
}

function clickChapter() {
    $('.chapter').on('click', (e) => {
        if (e.target.id !== 'toggle-explore-mode') {
            // split chapter id from 'block-' prefix to match with chapter
            const chapterId = e.target.id.split('block-')[1];
            // scroll to the selected chapter with some padding
            $(window).scrollTop($(`#${chapterId}`).offset().top - 100);
        }
    });
}

function resizeWindow() {
    $(window).on('resize', (e) => {
        // console.log('resized')
        adjustMapCenter(e.target.innerWidth);
        // map.resize();
    });
}

// TODO Refactor all adjustments into single method if possible
function adjustMapCenter(innerWidth) {
    const isSmallScreen = innerWidth <= 1215;
    const refLon = isSmallScreen ? -116.5 : -98.5795;

    const center = isSmallScreen ? {lon: -98.5795, lat: 39.8283} : {lon: -116.5, lat: 41.5};

    const introChapters = ['intro', 'chapter-1', 'chapter-2', 'chapter-6'];


    config.chapters.forEach(chapter => {
        if (chapter.location && chapter.location.center.lon === refLon) {
            chapter.location.center = center;  // TODO create const
            map.flyTo(chapter.location);
            // console.log('adj' + chapter.id)

        }

        // TODO: Plot school on top of seeds in story mode - create new layer?
        // TODO BUG: First 4 chapters adjusting screen size messes up placement
        // TODO fix: this happens on first resize, which prompts below (intro chaps) on subsequent resizes
        // if (chapter.location && chapter.location.zoom === 3.5 && innerWidth <= 1400) {
        //   chapter.location.zoom = chapter.location.zoom - 0.25;
        //   // console.log('adj')
        //   // console.log('adj' + chapter.id);
        //
        //   map.flyTo(chapter.location);
        // }

        // TODO Bug: Intro chapter story > explore > story
        introChapters.forEach(chap => {
            if (chap === chapter.id && isSmallScreen) {
                // console.log(isSmallScreen);
                chapter.location.center = center;

                // TODO adjust to 3.25?
                chapter.location.zoom = 3.5;
                map.flyTo(chapter.location);
                // console.log('adjust ' + chapter.id)

            }
        });
    });


}

function mouseOverChapter() {
    // TODO adjust for plotting on top of buttons
    // TODO add mouseover style
    $('.chapter').on('mouseover', (e) => {
        const tooltip = $('.chapter-tooltip');
        // on mouseover, apply chapter title for the selected div chapter id
        config.chapters.forEach(chapter => {
            if (chapter.id === e.target.id.split('block-')[1]) {
                tooltip.text(chapter.title || 'Introduction');
            }
        });

        // console.log(e.target.offsetLeft);
        // toggle visibility and place each tooltip below chapter block
        tooltip.css('left', e.target.offsetLeft);
        tooltip.css('visibility', 'visible');
    });
}

function mouseOutChapter() {
    // clear tooltip on mouseout
    $('.chapter').on('mouseout', () => {
        $('.chapter-tooltip').css('visibility', 'hidden');
    });
}

function enterExploreMode(storyMode = false) {
    // remove story and toggle visibility of explore sidebar on
    story.detach();
    mapExplorer.css('visibility', 'visible');
    // $('.map-menu').css('visibility', 'visible');

    // hide progress bar
    $('.chapter-list').css('visibility', 'hidden');
    $('.skip-story-btn').css('visibility', 'hidden');


    // TODO delete
    // if entering explore mode through story button, remotely toggle radio button group
    if (storyMode) {
        // toggle story/explore mode toggle in toolbar
        $('#toggle-story-mode').removeClass('active');
        $('#toggle-explore-mode').addClass('active');
    }

    // reset default map view
    resetExtent();
    resetAllFilters();
    clearStoryLayers();  // clear all story-mode only layers
    infoBtnSeed.addClass('visible');  // display 'seed >' button



    // REMOVEME
    // map.setLayoutProperty('schools', 'visibility', 'none')



}

function storyScroll(sites, schools) {
    scroller
        .setup({
            step: '.step',
            offset: 0.5,
            progress: true
        })
        .onStepEnter(response => {
            const id = response.element.id;
            const chapter = config.chapters.find(chap => chap.id === id);
            response.element.classList.add('active');

            // console.log(id, chapter)

            // adjust center point in story mode if on small screen
            adjustMapCenter(window.innerWidth);
            // map.resize();

            map.flyTo(chapter.location);
            if (config.showMarkers) {
                marker.setLngLat(chapter.location.center);
            }
            if (chapter.onChapterEnter.length > 0) {
                chapter.onChapterEnter.forEach(setLayerOpacity);
            }

            // highlight the active chapter with orange in progress bar
            $(`#block-${chapter.id}`).addClass('active-chapter');

            // remove `Seed >` button when in story mode and scrolling through chapters
            infoBtnSeed.removeClass('visible');

            if (id === 'intro') {
                // console.log('intro');
                $('#story-seed-1').trigger('mouseover');
                // map.setLayoutProperty('schools', 'visibility', 'visible');  // make visible again if scroll up
            } else if (id === 'chapter-1') {
                // console.log('2');
                $('#story-seed-2').trigger('mouseover');

                // displayTourneyExample();
            } else if (id === 'chapter-2') {
                // display one seeds as default view in chapter-2
                // $('#story-seed-1').trigger('mouseover');
                $('#story-seed-3').trigger('mouseover');


                // <br><br>The system is not foolproof - Duke, a top-ranked 2 seed, fell to the low-ranked 15 seed Lehigh Mountain Hawks
                //   in the first round of the 2012 tournament, despite having traveled fewer than 50 miles to their first game.
                //   2 seeds traveled an average of 155 miles.

                // Playing close to home has many advantages for competing teams:
                //   <ul>
                // <li>They spend less time actually traveling, reducing physical and mental exhaustion</li>
                // <li>They play in the same/similar time zone, avoiding any jet lag issues</li>
                // <li>It allows fans, friends, and families of the teams to travel to the games</li>
                // </ul>

            } else if (id === 'chapter-3') {
                triggerAnimation();
            } else if (id === 'chapter-4') {

                // map.style.stylesheet.layers.forEach((layer) => {
                //   if (layer.type === 'line') {
                //     map.setLayoutProperty(layer.id, 'visibility', 'none');
                //   }
                // });

            } else if (id === 'chapter-5') {
                resetExtent(true);
                map.setLayoutProperty('schools', 'visibility', 'visible');  // make visible again if scroll up
            } else if (id === 'chapter-6') {

                $('#story-seed-1').trigger('mouseleave');
                $('#story-seed-2').trigger('mouseleave');
                $('#story-seed-3').trigger('mouseleave');
                $('#story-seed-4').trigger('mouseover');

                const data = [
                    { seed: "1 SEED", miles: 353, color: "#80bad1" },
                    { seed: "2 SEED", miles: 482, color: "#5694c1" },
                    { seed: "3 SEED", miles: 689, color: "#2c6db1" },
                    { seed: "4 SEED", miles: 829, color: "#0146a1" }
                ];

                const margin = { top: 40, right: 20, bottom: 50, left: 60 };
                const container = d3.select("#chart-chapter-5");

// Create SVG once
                const svg = container
                    .append("svg")
                    .attr("preserveAspectRatio", "xMidYMid meet");

                const g = svg.append("g");

                function render() {
                    // Clear previous render
                    g.selectAll("*").remove();

                    // Get container width
                    const containerWidth = container.node().getBoundingClientRect().width;
                    const width = containerWidth - margin.left - margin.right;
                    const height = 400 - margin.top - margin.bottom;

                    svg
                        .attr("viewBox", `0 0 ${containerWidth} 400`)
                        .attr("width", "100%")
                        .attr("height", 400);

                    g.attr("transform", `translate(${margin.left}, ${margin.top})`);

                    // Scales
                    const x = d3.scaleBand()
                        .domain(data.map(d => d.seed))
                        .range([0, width])
                        .padding(0.3);

                    const y = d3.scaleLinear()
                        .domain([0, d3.max(data, d => d.miles)])
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
                        .data(data)
                        .enter()
                        .append("rect")
                        .attr("x", d => x(d.seed))
                        .attr("y", d => y(d.miles))
                        .attr("width", x.bandwidth())
                        .attr("height", d => height - y(d.miles))
                        .attr("fill", d => d.color);

                    // Labels
                    g.selectAll(".label")
                        .data(data)
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
                        .attr("y", -margin.left + 15)
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


                // resetExtent(true);

            } else if (id === 'chapter-7') {  // 7
                // TODO fix bug when going from shortest travel distance chapter back to these filters
                map.setPaintProperty('schools', 'circle-color', '#E27600');
                // map.setFilter('schools', ['has', 'school_common_name']);
                const oneCount = ['VCU','Virginia Tech','Dayton','Saint Louis','Creighton','Minnesota','TCU','Houston','Loyola–Chicago','California','Texas A&M','Nebraska','Southern Illinois','Butler','La Salle','DePaul'];
                filterMatchMultiple(oneCount);
            } else if (id === 'chapter-8') {  // 8
                map.setPaintProperty('schools', 'circle-color', '#E27600');
                const tenCount = ['Michigan', 'Arizona', 'UConn', 'Maryland', 'UCLA', 'Indiana', 'Cincinnati', 'Kentucky', 'Pittsburgh', 'North Carolina', 'Louisville', 'Purdue', 'Michigan State', 'Kansas', 'Oklahoma', 'Syracuse', 'Georgetown', 'Florida', 'Duke', 'Villanova', 'Illinois', 'Ohio State'];
                filterMatchMultiple(tenCount);
            } else if (id === 'chapter-9') {  // 9
                const blueBloods = {'Duke': '#003087', 'Kentucky': '#0033A0', 'North Carolina': '#7BAFD4', 'Kansas': '#0051BA'};
                filterMatchMultiple(Object.keys(blueBloods));
                const bbStyles = [];
                Object.entries(blueBloods).forEach(([school, color]) => {
                    bbStyles.push(school, color);
                });
                bbStyles.push('#AAA');
                map.setPaintProperty('schools', 'circle-color', ['match', ['get', 'school_common_name'], ...bbStyles]);


//           const data = [
//             { team: "DUKE", miles: 299, color: "#003087" },
//             { team: "KANSAS", miles: 395, color: "#0051BA" },
//             { team: "KENTUCKY", miles: 440, color: "#0033A0" },
//             { team: "UNC", miles: 457, color: "#7BAFD4" }
//           ];
//           const referenceLines = [
//             { value: 394, label: "Blue Bloods mean", align: "right" },
//             { value: 588, label: "All school mean", align: "inside" }
//           ];
//
//
//
//           const margin = { top: 50, right: 85, bottom: 50, left: 80 };
//           const height = 400;
//
//           const container = d3.select("#chart-blue-bloods");
//           if (container.empty()) return;
//
//           const svg = container.append("svg")
//                   .attr("preserveAspectRatio", "xMidYMid meet");
//
//           const g = svg.append("g");
//
//           function render() {
//             g.selectAll("*").remove();
//
//             const containerWidth = container.node().getBoundingClientRect().width;
//             const width = containerWidth - margin.left - margin.right;
//             const innerHeight = height - margin.top - margin.bottom;
//
//             svg
//                     .attr("viewBox", `0 0 ${containerWidth} ${height}`)
//                     .attr("width", "100%")
//                     .attr("height", height);
//
//             g.attr("transform", `translate(${margin.left}, ${margin.top})`);
//
//             // Scales
//             const x = d3.scaleBand()
//                     .domain(data.map(d => d.team))
//                     .range([0, width])
//                     .padding(0.3);
//
//             const y = d3.scaleLinear()
//                     .domain([0, d3.max(data, d => d.miles)])
//                     .nice()
//                     .range([innerHeight, 0]);
//
//             // Axes
//             g.append("g")
//                     .attr("transform", `translate(0, ${innerHeight})`)
//                     .call(d3.axisBottom(x));
//
//             g.append("g")
//                     .call(d3.axisLeft(y));
//
//             // Bars
//             g.selectAll(".bar")
//                     .data(data)
//                     .enter()
//                     .append("rect")
//                     .attr("x", d => x(d.team))
//                     .attr("y", d => y(d.miles))
//                     .attr("width", x.bandwidth())
//                     .attr("height", d => innerHeight - y(d.miles))
//                     .attr("fill", d => d.color);
//
//             // Value labels
//             g.selectAll(".label")
//                     .data(data)
//                     .enter()
//                     .append("text")
//                     .attr("x", d => x(d.team) + x.bandwidth() / 2)
//                     .attr("y", d => y(d.miles) - 8)
//                     .attr("text-anchor", "middle")
//                     .style("font-size", "12px")
//                     .text(d => `${d.miles} miles`);
//
//             // Chart title
//             g.append("text")
//                     .attr("x", width / 2)
//                     .attr("y", -20)
//                     .attr("text-anchor", "middle")
//                     .style("font-size", "18px")
//                     .style("font-weight", "bold")
//                     .text("Average Travel Distance by Team");
//
//             // Y-axis label
//             g.append("text")
//                     .attr("transform", "rotate(-90)")
//                     .attr("x", -innerHeight / 2)
//                     .attr("y", -margin.left + 20)
//                     .attr("text-anchor", "middle")
//                     .style("font-size", "14px")
//                     .text("Average travel distance (miles)");
//
//             // Halo line (draw first)
//             g.selectAll(".ref-line-halo")
//                     .data(referenceLines)
//                     .enter()
//                     .append("line")
//                     .attr("x1", 0)
//                     .attr("x2", width)
//                     .attr("y1", d => y(d.value))
//                     .attr("y2", d => y(d.value))
//                     .attr("stroke", "#fff")
//                     .attr("stroke-width", 5)
//                     .attr("stroke-dasharray", "6,4");
//
// // Actual dotted line
//             g.selectAll(".ref-line")
//                     .data(referenceLines)
//                     .enter()
//                     .append("line")
//                     .attr("x1", 0)
//                     .attr("x2", width)
//                     .attr("y1", d => y(d.value))
//                     .attr("y2", d => y(d.value))
//                     .attr("stroke", "#111")
//                     .attr("stroke-width", 2)
//                     .attr("stroke-dasharray", "6,4");
//
//
//             g.selectAll(".ref-label")
//                     .data(referenceLines)
//                     .enter()
//                     .append("text")
//                     .attr("x", d =>
//                             d.align === "right"
//                                     ? width + margin.right - 2   // right margin area
//                                     : width - 8                   // inside chart
//                     )
//                     .attr("y", d => y(d.value) + 2)
//                     .attr("text-anchor", d =>
//                             d.align === "right" ? "end" : "end"
//                     )
//                     .style("font-size", "10px")
//                     .style("font-weight", "300")
//                     .style("fill", "#111")
//                     .text(d => d.label)
//                     .each(function () {
//                       const bbox = this.getBBox();
//
//                       g.insert("rect", "text")
//                               .attr("x", bbox.x - 4)
//                               .attr("y", bbox.y - 2)
//                               .attr("width", bbox.width + 8)
//                               .attr("height", bbox.height + 4)
//                               .attr("rx", 3)
//                               .attr("fill", "#fff")
//                               .attr("opacity", 0.95);
//                     });
//
//
//
//
//
//           }
//
//           // Initial render
//           render();
//
//           // Responsive resize
//           window.addEventListener("resize", render);


            } else if (id === 'chapter-10') {  // 10
                applyChapterFilters('Arizona', 'Tucson, AZ');
            } else if (id === 'chapter-11') {  // 11
                map.setFilter('schools', ['has', 'school_common_name']);
                resetExtent(true);
                filters.weighted = true;
                applyWeights(schools);
            } else if (id === 'chapter-12') {
                storyModeSchoolSelect(sites, 'St. John\'s');
            } else if (id === 'chapter-13') {  // 13
                storyModeSchoolSelect(sites, 'Michigan');
            } else if (id === 'chapter-14') {  // 14
                storyModeSchoolSelect(sites, 'Kansas');
            } else if (id === 'chapter-15') {  // 15
                storyModeSchoolSelect(sites, 'Villanova');
            } else if (id === 'chapter-16') {  // 16
                storyModeConfDisplay();
            } else if (id === 'chapter-17') {  //17
                storyModeConfDisplay(['Pac-12 Conference', 'Atlantic 10 Conference']);
            } else if (id === 'chapter-18') {  // 18
                storyModeConfDisplay(['American Athletic Conference', 'Big 12 Conference']);
            } else if (id === 'chapter-19') {  // 19
                storyModeConfDisplay(['Southeastern Conference', 'Big 12 Conference', 'Atlantic Coast Conference', 'Missouri Valley Conference', 'Mountain West Conference']);
            } else if (id === 'chapter-20') {  // 20
                resetAllFilters();
                resetExtent(true);
            }

            // TODO Separate one and ten+ seed dropdowns

            // compare blue bloods weighted distances
            // UK does better as a 2 seed than a 1 seed
            // Michigan has done best as a 4 seed - luck of the draw
            // STORY: MSU with v similar 1-2-3 seed rankings, same for Kansas - centrally located, always travels apx same
            // Villanova with low overall mean, farthest travel dist
            // Indiana vs. Cincy
            // Illinois - only school w 10+ appearances without apperance as each seed

            // TODO PRESENTATION: MENTION AND CHECK ALL PROGRESS BAR CHAPTERS - APPEARACNES DONT WORK
            // TODO update README

            // if final chapter
            if (response.index === config.chapters.length - 1) {
                // create new click event each time chapter is enter, or else unique div ID is overwritten
                $('#explore-mode').on('click', () => {
                    enterExploreMode(true);
                });
            }
        })
        .onStepExit(response => {
            const chapter = config.chapters.find(chap => chap.id === response.element.id);
            response.element.classList.remove('active');
            // console.log(response.element.id);
            if (chapter.onChapterExit.length > 0) {
                chapter.onChapterExit.forEach(setLayerOpacity);
            }

            // resetAllFilters();
            // resetExtent(true);

            // remove orange active chapter styling when exiting chapter
            $(`#block-${chapter.id}`).removeClass('active-chapter');
        });

}

function enterStoryMode(sites, schools) {
    $('body').append(story);
    mapExplorer.css('visibility', 'hidden');
    mapExplorer.css('visibility', 'hidden');
    $('.chapter-list').css('visibility', 'visible');
    $('.skip-story-btn').css('visibility', 'visible');

    resetExtent();
    resetAllFilters();
    infoBtnSeed.removeClass('visible');
    storyScroll(sites, schools);  // prevent bug when toggling between chapters to explore back to story, which doesn't reset on intro
}

function clearStoryLayers() {
    // layers from story mode that are for display purposes only
    const layers = ['tourney', 'tourney-sites', 'tourney-lines', 'route', 'point', 'legend-lines', 'legend-point', 'legend-point-avg'];
    layers.forEach(layer => {  // loop through each layer
        if (map.getLayer(layer)) {  // if layer exists and is not 'point' layer
            // set layer type opacity to 0 -- use 'icon' instead of 'circle' for point layer, set circle-stroke-opacity to 0 for point-avg layer only
            map.setPaintProperty(layer, `${layer === 'point' ? 'icon' : map.getLayer(layer).type}${layer === 'legend-point-avg' ? '-stroke' : ''}-opacity`, 0);
        }
    });
}

$('#skip-story').on('click', () => {
    enterExploreMode(true);
    resetExtent();
});


$('#map-compare').on('mouseover', (e) => {
    // TODO add tooltip for comparison mode btn
    // e.append(`<div>DOOT</div>`)
});

// TODO Adjust site mouseover labels - ADD TO SECOND SCHOOL
// TODO Create default matches
// TODO Don't auto default to louisville and ky
function enterComparisonStyles() {
    // $('#map > .mapboxgl-canvas').css('height', '50vh');  // reset original map height to full view height

    $('#map-compare').css('visibility', 'visible');  // make 2nd comparison map visible
    $('#map-compare').css('height', '50vh');  // set 2nd comparison map to 50% height
    $('.comparison-mode').css('visibility', 'visible');  // make comparison mode inputs visible

    mapExplorer.css('visibility', 'hidden');  // hide all comparison mode divs (side panel)
    // $('#map').css('height', '50vh');  // reduce original map to 50% height
    $('#map').css('bottom', '50%');  // reduce original map to 50% height
    map.resize();
    $('.toolbar').css('visibility', 'hidden');  // hide top toolbar divs
    $('.toolbar').css('pointer-events', 'none');  // force stop toolbar click events even when hidden

    // hide whichever info footer btn is visible
    [infoBtnSchool, infoBtnSeed].forEach(footer => {
        if (footer.css('visibility') === 'visible') {
            footer.removeClass('visible');
        }
    });

    // map['_interactive'] = false;
    map.dragPan.disable();
    compareMap.dragPan.disable();


    // $('#map > .mapboxgl-canvas').css('height', '50vh');  // reset original map height to full view height
// console.log($('#map').children);

    // $('.mapboxgl-canvas')[0].height = $('.mapboxgl-canvas')[0].height / 2;
    // map.resize();

    // $('.mapboxgl-canvas')[0].css('height', '400px');

    // $('.mapboxgl-canary').css('height', '50vh');
    // $('.mapboxgl-canary').css('top', '0');
    // $('.mapboxgl-canary').css('position', 'absolute');
}

$('.exit').on('click', () => {
    // TODO adjust map center in top map?
    exitComparisonStyles();
});

function exitComparisonStyles() {
    // $('#map').css('height', '100vh');  // reset original map height to full view height
    $('#map').css('bottom', '0');  // reset original map height to full view height
    // $('#map > .mapboxgl-canvas').css('height', '100vh');  // reset original map height to full view height
    $('#map-compare').css('height', '0');  // set comparison map to 2 height for slide transition
    $('.toolbar').css('visibility', 'visible');  // make top toolbar visible
    $('.toolbar').css('pointer-events', 'auto');  // enable top toolbar click events
    $('.comparison-mode').css('visibility', 'hidden');  // hide comparison mode inputs

    map.resize();
    map.dragPan.enable();
    compareMap.dragPan.enable();

    enterExploreMode();  // make side panel visible again as you enter explore mode
}




// TODO Delete old json, replace with new
// const sitesJson = d3.json('data/cleaned/sites-all-edit.json');
const sitesJson = d3.json('data/edits/distances-sites-GCD.json');
// const schoolsJson = d3.json('data/cleaned/schools-agg.json');
// const schoolsJson = d3.json('data/edits/schools-wtAvg.json');
const schoolsJson = d3.json('data/new_weights/schools-wtAvg-NEWWEIGHTS.json');
// const seedsJson = d3.json('data/cleaned/seeds-by-school.json');
// const seedsJson = d3.json('data/edits/seeds-by-school.json');
const seedsJson = d3.json('data/new_weights/seeds-by-school-NEWWEIGHTS.json');
// const seedsAggJson = d3.json('data/cleaned/seeds-overall.json');
// const seedsAggJson = d3.json('data/edits/seeds-overall.json');
const seedsAggJson = d3.json('data/new_weights/seeds-overall-NEWWEIGHTS.json');
// const confJson = d3.json('data/cleaned/conference-agg.json');
// const confJson = d3.json('data/edits/conference-agg.json');
const confJson = d3.json('data/new_weights/conference-agg-NEWWEIGHTS.json');
const colorsJson = d3.json('data/cleaned/school-colors.json');
const d1Json = d3.json('data/tmp/d1-schools-master.json');
// const tourney2019 = d3.json('data/created/tourney-2019.json');
const tourney2019 = d3.json('data/created/tourney-2012.json');

Promise.all([sitesJson, schoolsJson, seedsJson, seedsAggJson, confJson, colorsJson, d1Json, tourney2019]).then(onLoad);

function onLoad(data) {
    const sites = data[0];
    const schools = data[1];
    const seeds = data[2];
    const seedsAgg = data[3];
    const conf = data[4];
    const colors = data[5];
    const d1 = data[6];
    const tourney = data[7];

    const schoolColorMap = new Map(
        colors.features.map(d => [d.name, d.color_1])
    );

    renderSeedBoxplot(sites, schoolColorMap);


    $('#toggle-explore-mode').on('click', () => {
        enterExploreMode();
    });

    $('#story-mode-btn').on('click', () => {
        enterStoryMode(sites, schools);
    });

    $('.app-mode-toggle').on('click', (e) => {
        if (e.target.innerText === 'Story Mode') {
            // only enter story mode if not already in story mode
            if (!$('#toggle-story-mode')[0].classList.contains('active')) {
                enterStoryMode(sites, schools);
            }
        } else {

            // TODO BUG: Explore mode to storymode in chapter 1 breaks - might be fixed w above bug fix ^
            enterExploreMode();
        }
    });

    $('#compare').on('click', () => {
        // console.log('click');

        // TODO set default comparison if no school selected?
        $('#dropdown-1').text(filters.school !== 'all' ? filters.school : 'Kentucky');

        if ($('#dropdown-1').text() === 'Kentucky') {

            // TODO Hide stat boxes if nothing is selected
            $('#dropdown-2').text('Louisville');
        }

        displayCompareStats($('#dropdown-1').text(), 1);
        displayCompareStats($('#dropdown-2').text(), 2);

        selectSchoolOnMap(map, sites, false, $('#dropdown-1').text());
        selectSchoolOnMap(compareMap, sites, false, $('#dropdown-2').text());

        enterComparisonStyles();

        map.flyTo({center: [-98.6, 39.8], zoom: 2.85 });
        compareMap.flyTo({center: [-98.6, 39.8], zoom: 2.85 });

    });

    $('.dropdown-menu-1').on('click', (e) => {
        selectSchoolOnMap(map, sites, false, e.target.innerText);
        map.flyTo({center: [-98.6, 39.8], zoom: 2.85 });
        infoBtnSeed.removeClass('visible');  // UGH I HATE THIS BUG
        displayCompareStats(e.target.innerText, 1);
        $('#dropdown-1').text(e.target.innerText);
    });

    $('.dropdown-menu-2').on('click', (e) => {
        selectSchoolOnMap(compareMap, sites, false, e.target.innerText);
        compareMap.flyTo({center: [-98.6, 39.8], zoom: 2.85 });
        infoBtnSeed.removeClass('visible');  // UGH I HATE THIS BUG
        displayCompareStats(e.target.innerText, 2);
        $('#dropdown-2').text(e.target.innerText);
    });

    // TODO Display stats on default before click event
    // TODO add school colors?
    // TODO Default to label 'select comparison school' instead of alabama/1st school in 2nd filter
    // TODO add weights on mouseover?
    function displayCompareStats(selectedSchool, order) {
        schools.features.forEach(school => {
            if (school.properties.school_common_name === selectedSchool) {

                $(`.compare-text-mean-${order}`).text(returnStat(school, 'mean'));
                $(`.compare-text-med-${order}`).text(returnStat(school, '50%'));
                $(`.compare-text-min-${order}`).text(returnStat(school, 'min'));
                $(`.compare-text-max-${order}`).text(returnStat(school, 'max'));

                $(`.compare-text-${order}-seed-1`).text(returnSeedStat(school, 1));
                $(`.compare-text-${order}-seed-2`).text(returnSeedStat(school, 2));
                $(`.compare-text-${order}-seed-3`).text(returnSeedStat(school, 3));
                $(`.compare-text-${order}-seed-4`).text(returnSeedStat(school, 4));

            }
        });

        function returnStat(school, stat) {
            return school.properties[`${stat}_dist`].toFixed() + ' mi';
        }

        function returnSeedStat(school, seed) {
            const seedMap = {1: 'oneSeed', 2: 'twoSeed', 3: 'threeSeed', 4: 'fourSeed'};
            return school.properties[seedMap[seed]] ? school.properties[seedMap[seed]].mean.toFixed() + ' mi' : 'N/A';
        }
    }

    // $('.map-menu').on('mouseover', (e) => {
    //   console.log(e.target.offsetLeft);
    // });

    $('#extent').on('mouseover', (e) => {
        $('.btn-tooltip').css('left', e.target.offsetLeft);
        $('.btn-tooltip').css('visibility', 'visible');
        $('.btn-tooltip').text('Reset map and filters');
    });

    $('#extent').on('mouseout', () => {
        $('.btn-tooltip').css('visibility', 'hidden');
    });

    $('#compare').on('mouseover', (e) => {
        $('.btn-tooltip').css('left', e.target.offsetLeft);
        $('.btn-tooltip').css('visibility', 'visible');
        $('.btn-tooltip').text('Compare two schools');
    });

    $('#compare').on('mouseout', () => {
        $('.btn-tooltip').css('visibility', 'hidden');
    });

    $('#story-mode-btn').on('mouseover', (e) => {
        $('.btn-tooltip').css('left', e.target.offsetLeft - 20);
        $('.btn-tooltip').css('visibility', 'visible');
        $('.btn-tooltip').text('Return to story');
    });

    $('#story-mode-btn').on('mouseout', () => {
        $('.btn-tooltip').css('visibility', 'hidden');
    });

    // iterate over schools and seeds geojson layers before manipulating map
    // push schools to schoolFilter dropdown, apply seed values to school feature properties
    iterateGeojsonSource(schools, seeds, colors);
    clickFooterBtn(seedsAgg, seeds, sites);
    toggleStoryPanel(colors);

    //  geojsons created by reading jupyter notebook output CSVs into QGIS and converted
    map.on('load', () => {

        // plot 2012 tournament example and legend, which are displayed in story mode chapters
        plot2012example(tourney);
        plotLegend();

        // generate all map layers for main and comparison maps
        createAllLayers(schools, sites, map);
        createAllLayers(schools, sites, compareMap);

        map.addLayer({
            id: 'points-circle',
            type: 'circle',
            source: {
                type: 'geojson',
                data: schools,
            },
            paint: {
                'circle-radius': [
                    'interpolate',
                    ['linear'],
                    ['zoom'],

                    // Low zoom (CONUS view)
                    3, [
                        'interpolate',
                        ['linear'],
                        ['get', 'mean_dist'],
                        150, 4,
                        300, 6,
                        600, 10,
                        1000, 14,
                        1400, 16,
                        1700, 17,
                        2200, 18
                    ],

                    // High zoom (local view)
                    8, [
                        'interpolate',
                        ['linear'],
                        ['get', 'mean_dist'],
                        150, 8,
                        300, 12,
                        600, 18,
                        1000, 24,
                        1400, 27,
                        1700, 28,
                        2200, 30
                    ]
                ],
                'circle-color': [
                    'interpolate',
                    ['linear'],
                    ['get', 'mean_dist'],
                    // ['#ffffd4','#fed98e','#fe9929','#cc4c02']
                    150,  '#fde7d3',  // very light peach
                    300,  '#f9cfa5',
                    600,  '#f6b26b',
                    1000, '#ec8f3a',  // strong orange
                    1400, '#d8731f',
                    1700, '#c65f12',
                    2200, '#a84300'   // deep rust (cap)
                ],

                'circle-opacity': 1,
                'circle-stroke-color': 'rgba(90, 60, 30, 0.6)',
                'circle-stroke-width': 1
            },
            layout: {
                visibility: 'none'
            }
        });

        map.on('mousemove', 'points-circle', (e) => {
            // console.log(e.features[0].properties)
        })

        // filter for selected conference OR display all for 'all conference' selection (filter for features that have school common name field)
        const confFilter = filters.conference !== 'all' ? ['==', 'conference', filters.conference] : ['has', 'school_common_name'];
        // filter for seeds that have seed aggregate field or display all for all seed selection
        const seedFilter = ['has', filters.seed === 'all' ? 'school_common_name' : filters.seed];
        // apply multiple filters with 'all'
        map.setFilter('points-circle', ['all', confFilter, seedFilter]);

        // map events
        onSiteHover();
        onCompareSiteHover();
        onSchoolHover();
        onSchoolClick(sites);

        // explore sidebar filter events
        onWeightedToggle(schools);
        selectSchool(sites);
        selectConference();
        selectSeed();
        selectStat(schools);

        displayDefaultMap();

        // TODO add symbols back for explore mode?
        // hide map labels for explorer view
        map.style.stylesheet.layers.forEach((layer) => {
            if (layer.type === 'symbol') {
                map.removeLayer(layer.id);
            }
        });
        compareMap.style.stylesheet.layers.forEach((layer) => {
            if (layer.type === 'symbol') {
                compareMap.removeLayer(layer.id);
            }
        });

        $('.toolbar').css('pointer-events', 'auto');  // force stop toolbar click events even when hidden


        // STORYTELLING MODE
        // todo move map div abs position to not have to add padding once story mode is exited, reset bearing on resetExtent
        storyScroll(sites, schools);
    });
}

window.addEventListener("resize", () => {
    sitesJson.then(renderSeedBoxplot);
});
function storyModeConfDisplay(matchArray = null) {
    resetExtent(true);
    styleConferences();
    if (matchArray) {
        // match multiple filter values
        filterMatchMultiple(matchArray, 'conference');
    }
}

function displayTourneyExample() {
    map.setFilter('tourney-sites', ['all', ['==', '$type', 'Point'], ['==', 'feature-type', 'site']]);
    map.setFilter('tourney', ['all', ['==', '$type', 'Point'], ['==', 'feature-type', 'school']]);
    map.setFilter('tourney-lines', ['has', 'seed']);
}

function filterMatchMultiple(matchArray, matchField = 'school_common_name', layer = 'schools') {
    // map.setFilter('schools', ['match', ['get', 'school_common_name'], oneCount, true, false]);

    map.setFilter(layer, ['match', ['get', matchField], matchArray, true, false]);
}

function storyModeSchoolSelect(sites, school) {
    filters.school = school;
    selectSchoolOnMap(map, sites, true);
    map.setLayoutProperty('schools', 'visibility', 'none');
}

function plotLegend() {

    // all coordinate pairs for legend points
    const coordPairs = [[-98.5795, 39.8283], [-98.5795, 40.8283], [-98.5795, 38.8283], [-95.5795, 39.8283],
        [-101.5795, 39.8283], [-93.5795, 35.8283], [-103.5795, 43.8283], [-103.5795, 35.8283],
        [-93.5795, 43.8283], [-98.5795, 32.8283], [-98.5795, 46.8283], [-87.5795, 39.8283], [-109.5795, 39.8283],];

    // map to associate data type with each feature properties
    const pairMap = {0: 'center', 1: '1seed', 2: '1seed', 3: '2seed', 4: '2seed', 5: '3seed', 6: '3seed',
        7: '3seed', 8: '3seed', 9: '4seed', 10: '4seed', 11: '4seed', 12: '4seed'};

    const pointFeatures = [];
    const lineFeatures = [];
    coordPairs.forEach((pair, i) => {
        // push point feature coordinates and associated data type for styling
        pointFeatures.push( {type: 'Feature', geometry: {type: 'Point', coordinates: pair}, properties: {type: pairMap[i]}});

        if (i > 0) {  // skip first point, which represents school/center
            // push linestring features from center to each point
            lineFeatures.push({type: 'Feature', geometry: {type: 'LineString', coordinates: [[-98.5795, 39.8283], pair]}});
        }
    });

    // update linestrings as arcs
    lineFeatures.forEach(line => {
        arcLineString(line);
    });

    map.addLayer({
        id: 'legend-point-avg',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [{type: 'Feature', geometry: {type: 'Point', coordinates: [-98.5795, 39.8283]}}]
            }
        },
        paint: {
            'circle-radius': 9,
            'circle-color': 'transparent',
            'circle-stroke-opacity': 0,
            'circle-stroke-color': '#AA5F0E',
            'circle-stroke-width': 2,
        }
    });

    map.addLayer({
        id: 'legend-point',
        type: 'circle',
        source: {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: pointFeatures
            }
        },
        paint: {
            'circle-opacity': 0,
            'circle-color': ['match', ['get', 'type'], 'center', '#E27600', '1seed', '#80bad1', '2seed', '#5694c1', '3seed', '#2c6db1', '4seed', '#0146a1', 'black'],
            'circle-radius': ['match', ['get', 'type'], 'center', 7, '1seed', 5, '2seed', 8, '3seed', 11, '4seed', 14, 7],
        }
    });

    map.addLayer({
        id: 'legend-lines',
        type: 'line',
        source:  {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: lineFeatures
            }
        },
        paint: {
            'line-color': '#404041',
            'line-opacity': 0,
        }
    }, 'legend-point');
}

function plot2012example(tourney) {
    map.addLayer({
        id: 'tourney',
        type: 'circle',
        source: {type: 'geojson', data: tourney},
        paint: {
            'circle-radius': 6.5,
            'circle-opacity': 0,
            'circle-color': '#555',
        },
        filter: ['all', ['==', '$type', 'Point'], ['==', 'feature-type', 'school']]
    });

    map.addLayer({
        id: 'tourney-sites',
        type: 'circle',
        source: {type: 'geojson', data: tourney},
        paint: {
            'circle-radius': 10,
            'circle-opacity': 0,
            'circle-color': ['match', ['get', 'seed'], 1, '#80bad1', 2, '#5694c1', 3, '#2c6db1', 4, '#0146a1', 'orange'],
        },
        filter: ['all', ['==', '$type', 'Point'], ['==', 'feature-type', 'site']]
    });

    map.addLayer({
        id: 'tourney-lines',
        type: 'line',
        source: {type: 'geojson', data: tourney},
        paint: {
            'line-color': '#666',
            'line-opacity': 0,
            'line-dasharray': [3, 3]
        },
        filter: ['==', '$type', 'LineString']
    }, 'tourney');
}

function styleConferences() {
    map.setFilter('schools', ['has', 'school_common_name']);
    map.setPaintProperty('schools', 'circle-radius', 8);  // todo reset schools style on scroll up and down OR put in sep layer
    map.setPaintProperty('schools', 'circle-opacity', 1);
    map.setPaintProperty('schools', 'circle-color',
        ['match', ['get', 'conference'],
            'American Athletic Conference', '#7F3C8D',
            'Atlantic 10 Conference', '#11A579',
            'Atlantic Coast Conference', '#3969AC',
            'Big 12 Conference', '#F2B701',
            'Big East Conference', '#E73F74',
            'Big Ten Conference', '#80BA5A',
            'Missouri Valley Conference', '#E68310',
            'Mountain West Conference', '#008695',
            'Pac-12 Conference', '#CF1C90',
            'Southeastern Conference', '#f97b72',
            'West Coast Conference', '#4b4b8f', '#666666'
        ]);
}

function clickFooterBtn(seedsAgg, seeds, sites) {
    infoBtnSeed.on('click', (e) => {
        const val = {};
        // console.log(seedsAgg);
        infoBtnSchool.addClass('visible');
        infoBtnSeed.removeClass('visible');
        // infoBtnSeed.css('visibility', 'hidden');
        if (filters.school === 'all') {

            // TODO add info-text to updateInfoCard obj
            // TODO persist school or seed view when school is selected? update on select school, reset extent
            card1Header.html('mean distance of all <strong>1 seeds</strong> ');
            card2Header.html('mean distance of all <strong>2 seeds</strong> ');
            card3Header.html('mean distance of all <strong>3 seeds</strong> ');
            card4Header.html('mean distance of all <strong>4 seeds</strong> ');

            const seedInfoCard = {
                // header: 'All Top Seeded Schools 1985 - 2019',
                card1: seedsAgg.features[0].properties.mean_dist.toFixed() + ' miles',
                card1text: ``,
                card2: seedsAgg.features[1].properties.mean_dist.toFixed() + ' miles',
                card2text: ``,
                card3: seedsAgg.features[2].properties.mean_dist.toFixed() + ' miles',
                card3text: ``,
                card4: seedsAgg.features[3].properties.mean_dist.toFixed() + ' miles',
                card4text: ``,
                // card5: '',  // TODO persist count?
                // card5text: '',
            };
            updateInfoCard(seedInfoCard);
        } else {
            seeds.features.forEach(school => {
                if (filters.school === school.properties.school_common_name) {
                    // create object of all seed values
                    val[school.properties.seed] = school.properties;

                    // TODO create fn
                    card1Header.html('mean distance as a <strong>1 seed</strong>');
                    card2Header.html('mean distance as a <strong>2 seed</strong>');
                    card3Header.html('mean distance as a <strong>3 seed</strong>');
                    card4Header.html('mean distance as a <strong>4 seed</strong>');

                    const card = {
                        card1: val[1] ? val[1].mean.toFixed() + ' miles' : '-',
                        card1text: applyInfoSeedText(val, 1),
                        card2: val[2] ? val[2].mean.toFixed() + ' miles' : '-',
                        card2text: applyInfoSeedText(val, 2),
                        card3: val[3] ? val[3].mean.toFixed() + ' miles' : '-',
                        card3text: applyInfoSeedText(val, 3),
                        card4: val[4] ? val[4].mean.toFixed() + ' miles' : '-',
                        card4text: applyInfoSeedText(val, 4),
                    };
                    updateInfoCard(card);

                }
            })
        }
    });

    infoBtnSchool.on('click', () => {

        resetInfoCard();

        if (filters.school === 'all') {
            setDefaultInfoCard();
        } else {
            selectSchoolOnMap(map, sites);
        }
    });
}

function resetInfoCard() {
    infoBtnSchool.removeClass('visible');
    infoBtnSeed.addClass('visible');
    // infoBtnSeed.css('visibility', 'visible');
    card1Header.html('mean distance traveled');
    card2Header.html('median distance traveled');
    card3Header.html('minimum distance traveled');
    card4Header.html('maximum distance traveled');
}

function applyInfoSeedText(value, seed) {
    if (value[seed]) {
        return `- ${value[seed].count} appearances as a ${seed} seed
      - median distance: ${value[seed]['50%'].toFixed()} miles
      - shortest distance: ${value[seed].min.toFixed()} miles
      - farthest distance: ${value[seed].max.toFixed()} miles
      `;
    } else {
        return `No appearances as a ${seed} seed`;
    }
}

// TODO Consolidate into single chapter?
function applyChapterFilters(school, site) {
    schoolFilter.val(school);  // todo school not set to all when entering explore mode from selected schools
    schoolFilter.trigger('change');

    // set filter to display only selected school and site
    ['sites', 'line'].forEach(layer => {
        // TODO apply site seed styling
        map.setFilter(layer, ['==', 'site', site]);  // TODO apply thicker line style on zoom
    });

    // loop through line layer
    map.getSource('line')['_data'].features.forEach(line => {
        // find geometry for line that matches the selected school and site
        if (line.properties.site === site && line.properties.school_common_name === school) {
            fitMapBounds(line.geometry, map);  // fit bounds to specific example
        }
    });

    // TODO toggle schools back on
    map.setLayoutProperty('schools', 'visibility', 'none');
    map.setPaintProperty('line', 'line-width', 2);
    // map.setPaintProperty('line', 'line-color', '#404041');
}

function setDefaultInfoCard() {
    // dynamically set default info card whether weighted toggle is true or false on load
    const defaultInfoCard = {
        header: 'All Top Seeded Schools 1985 - 2019',
        card1: highlights[setProperty('mean')] + ' miles',
        card1text: `${highlights['mean_wtDist']} miles WEIGHTED mean \n \n Average for top seeded schools 1985 - 2019`,  // TODO make constant
        card2: highlights[setProperty('50%')] + ' miles',
        card2text: `${highlights['50%_wtDist']} miles WEIGHTED median \n \n Average for top seeded schools 1985 - 2019`,
        card3: highlights[setProperty('min')] + ' miles',
        card3text: 'University of Arizona to Tucson, AZ as a 1 seed in 2000',
        card4: highlights[setProperty('max')] + ' miles',
        // card4text: 'Syracuse University to San Jose, CA as a 4 seed in 2013',
        card4text: 'St. John\'s University to Long Beach, CA as a 1 seed in 1986',
        card5: 87,
        card5text: 'different schools with appearances',
    };
    updateInfoCard(defaultInfoCard);
}

/**
 * Set weighted or unweighted property value, e.g. 'mean_wtDist' or 'mean_dist'
 **/
function setProperty(stat = filters.stat) {
    return `${stat}_${filters.weighted ? 'wtD' : 'd'}ist`;
}

// iterate over schools and seeds geojson layers before manipulating map
function iterateGeojsonSource(schools, seeds, colors) {
    const allSchools = [];  // empty array to push school values
    const allMin = [];  // empty array to push minimum values  // TODO do this in JN?

    schools.features.forEach(school => {
        // apply colors to school geojson
        colors.features.forEach(color => {
            if (school.properties.school_common_name === color.name) {
                school.properties['color_1'] = color['color_1'];
                // TODO change colors for yellows
                school.properties['color_2'] = color['color_2'] === '#FFF' ? color['color_1'] : color['color_2'];
                school.properties['color_neutral'] = color['color_neutral'];
            }
        });

        // push all schools to array to be sorted before pushing to dropdown
        allSchools.push(school.properties.school_common_name);
        allMin.push(school.properties.min_dist);

        // TODO Move to node script?
        // apply seed property to schools geojson to match with seed dropdown values
        seeds.features.forEach(seed => {
            if (school.properties.school_common_name === seed.properties.school_common_name) {
                if (seed.properties.seed === 1) {
                    school.properties['oneSeed'] = seed.properties;
                } else if (seed.properties.seed === 2) {
                    school.properties['twoSeed'] = seed.properties;
                } else if (seed.properties.seed === 3) {
                    school.properties['threeSeed'] = seed.properties;
                } else if (seed.properties.seed === 4) {
                    school.properties['fourSeed'] = seed.properties;
                }
            }
        });
    });

    // all school dropdown inputs (main school filter, 2 comparison inputs)
    const inputs = [schoolFilter, $('#school-compare-1'), $('#school-compare-2')];
    allSchools.sort();  // sort schools alphabetically


    allSchools.forEach(s => {

        $('.dropdown-menu-1').append(`<a class="dropdown-item" href="#">${s}</a>`);
        $('.dropdown-menu-2').append(`<a class="dropdown-item" href="#">${s}</a>`);

        // loop through  dropdown inputs and push school names to each one
        inputs.forEach(input => {
            pushSchoolsToInputs(input, s);
        });

    });
}

function pushSchoolsToInputs(input, school) {
    input.append(`<option value="${school}">${school}</option>`);
}

function resetFilter(filter) {
    // reset 'mean' instead of 'all' for statFilter and true for weighted toggle
    filter.val(filter === statFilter ? 'mean' : filter === weightedToggle ? false : 'all');
    filter.trigger(filter.val === weightedToggle ? 'click' : 'change');  // trigger change event
    filters.weighted = false;  // manually set weighted filter to false
}

function resetAllFilters(excludeFilter = null) {
    let filters = [weightedToggle, schoolFilter, seedFilter, conferenceFilter, statFilter];
    if (excludeFilter) {
        const index = filters.indexOf(excludeFilter);
        filters.splice(index, 1);
        excludeFilter.val('all');
    }
    filters.forEach(filter => {
        resetFilter(filter);
    });
}

function displayDefaultMap() {
    $('#extent').on('click', () => {
        resetExtent();
        resetAllFilters();
    });
}

function resetExtent(storyMode = false) {

    // only run if in explore mode - otherwise causes bug where seed btn is shown in story mode
    if (!storyMode) {
        // return to default view with seed btn visible and school btn hidden
        infoBtnSchool.trigger('click');
        // reset info card to all school defaults
        setDefaultInfoCard();
    }

    map.setBearing(0);  // todo create fn?
    map.setPitch(0);
    map.setLayoutProperty('schools', 'visibility', 'visible');

    // reset default gray color to info box infoHeader
    infoHeader.css('background', '#414140');
    infoHeader.css('color', 'whitesmoke');
    infoHeader.css('border-color', '#AAA');

    const layers = ['sites', 'line', 'avg-distance', 'selected-school']; // TODO create constants
    layers.forEach(layer => {
        map.setLayoutProperty(layer, 'visibility', 'none');
    });

    map.setPaintProperty('schools', 'circle-color', '#E27600');
    map.setPaintProperty('schools', 'circle-opacity', 0.7);

    const layerGeometry = {type: 'Polygon', coordinates: []};
    const layerCoords = [];

    map.getSource('schools')['_data'].features.forEach(feature => {
        layerCoords.push(feature.geometry.coordinates);
    });

    layerGeometry.coordinates = [layerCoords];

    // TODO Simplify with a master fn
    if (storyMode) {
        const sub = window.innerWidth <= 1400 ? 0.25 : 0;
        const center = window.innerWidth <= 1250 ? [-98.5795, 39.8283] : [-116.5, 41.5];
        map.flyTo({center: center, zoom: 3.5 - sub });

    } else {
        // fit bounds to school layer
        fitMapBounds(layerGeometry, map);
    }
}

// TODO Refactor for all screen and storyMode adjustments
function fitMapBounds(layerGeometry, map) {
    const isSmallScreen = window.innerWidth <= 1215;  // determine if browser is small screen
    const padding = isSmallScreen ? 250 : 50;  // if browser is small screen, increase padding - extra left for storymode
    map.fitBounds(turf.bbox(layerGeometry), { padding:
            {top: padding, right: padding, bottom: padding, left: isSmallScreen ? padding : 450},
        duration: 3000 });
}

// TODO Add slider for numbers of appearances?
function selectSchool(sites) {
    schoolFilter.on('change', (e) => {
        // apply selected school to filters
        filters.school = e.target.value;
        selectSchoolOnMap(map, sites);

        if (filters.school !== 'all') {
            selectSchoolOnMap(map, sites);
        } else {
            resetExtent();
        }
    });
}

function selectStat(schools) {
    statFilter.on('change', (e) => {
        // set filter constant with changed stat
        filters.stat = e.target.value;

        // property of filter, e.g. mean_dist, mean_wtDist, etc.
        const prop = setProperty();
        const stops = createStops(schools, prop);

        map.setPaintProperty('schools', 'circle-radius', { property: prop, stops: stops });
        map.setPaintProperty('selected-school', 'circle-radius', { property: prop, stops: stops });
        map.setPaintProperty('avg-distance', 'circle-radius', highlights[prop] / adjustPropCircles(prop));
    });
}

function selectSchoolOnMap(map, sites, storyMode = false, input = filters.school) {  // TODO iterate over layer source instead of geojson directly

    // reset info card to 'school' view any time a new school is selected
    resetInfoCard();

    const lineFeatures = [];
    let min = null;
    let max = null;

    const tmp = {};

    map.getSource('schools')['_data'].features.forEach(feature => {

        // tmp[feature.properties.school_common_name] = '';
        // console.log(JSON.stringify(tmp));

        // selected school
        if (feature.properties.school_common_name === input) {

            // close any open popups
            popup.remove();

            // hide other schools when school is selected to reduce visual mess
            map.setLayoutProperty('schools', 'visibility', 'none');

            // create empty bounding geometry for fitBounds argument
            const layerGeometry = {type: 'Polygon', coordinates: []};
            // coordinate array (formatted[[0,0],[1,1],[...]) to be pushed to layerGeometry coordinates
            // start with school point coordinates
            const layerCoords = [feature.geometry.coordinates];

            // loop through all tournament sites
            sites.features.forEach(site => {
                // filter sites for the selected school
                if (site.properties.school_common_name === feature.properties.school_common_name) {
                    // console.log(site);
                    // push site coordinates to single array
                    layerCoords.push(site.geometry.coordinates);
                    // wrap coords
                    layerGeometry.coordinates = [layerCoords];

                    // push linestring features to a feature array to be inserted into lines layer geojson source
                    createLineFeatures(lineFeatures, site, feature);
                }

                // set minimum and maximum distances for info cards
                // iterate through sites and match to the min and max distances traveled, to fixed with for exact match
                if (site.properties.distance.toFixed(4) === feature.properties.min_dist.toFixed(4)) {
                    min = site.properties;
                }
                if (site.properties.distance.toFixed(4) === feature.properties.max_dist.toFixed(4)) {
                    max = site.properties;
                }
            });

            // update linestrings as arcs
            lineFeatures.forEach(line => {
                arcLineString(line);
            });


            if (storyMode) {
                const size = window.innerWidth <= 1215 ? 200 : 750;
                map.fitBounds(turf.bbox(layerGeometry), { padding: {top: 100, bottom: 100, right: 200, left: size}, duration: 3000 });
            } else {
                // fit bounds to school and sites
                fitMapBounds(layerGeometry, map);
            }

            // push linestring features to line layer source
            map.getSource('line').setData({ type: 'FeatureCollection', features: lineFeatures });

            // difference between school averages and overall averages // TODO add min and max avg? or compare against overall min and max?
            const diffDistMed = (feature.properties['50%_dist'] - highlights['50%_dist']).toFixed();
            const differenceDist = (feature.properties.mean_dist - highlights.mean_dist).toFixed();

            const inputs = {
                header: feature.properties.school_full_name,
                card1: `${feature.properties.mean_dist.toFixed()} miles`,
                card1text: `${feature.properties.mean_wtDist.toFixed()} miles WEIGHTED mean \n \n ${differenceDist} miles ${differenceText(differenceDist)} all-school average (${highlights.mean_dist} miles)`,
                card2: `${feature.properties['50%_dist'].toFixed()} miles`,
                card2text: `${feature.properties['50%_wtDist'].toFixed()} miles WEIGHTED median \n \n ${diffDistMed} miles  ${differenceText(diffDistMed)} all-school average (${highlights['50%_dist']} miles)`,
                card3: `${feature.properties.min_dist.toFixed()} miles`,
                card3text: `${min.city}, ${min.state} to ${min.site} as a ${min.seed} seed in ${min.year}`,
                card4: `${feature.properties.max_dist.toFixed()} miles`,
                card4text: `${max.city}, ${max.state} to ${max.site} as a ${max.seed} seed in ${max.year}`,
                card5: feature.properties.count_dist,
                card5text: 'Appearances as 1-4 seed',  // TODO put subinfoHeader w list of number of apperances as each seed
            };
            updateInfoCard(inputs);  // update highlights/info card with school info
            applySchoolLabelStyles(feature);  // style mouseover label with school colors
            styleLayers(feature, map);  // style and filter school, site, and line layers based on selected school
            setAvgDistanceLayer(feature, map);  // set average distance circle at same location as selected school, apply source to layer
        }
    });
}


function applySchoolLabelStyles(feature) {
    // TODO conditions for white
    // apply colors associated with selected school to info cards
    infoHeader.css('background', feature.properties.color_1);
    infoHeader.css('border-color', feature.properties.color_2);
    infoHeader.css('color', adjustHeaderColor(feature.properties));

    // add style tags because jQuery does not apply to CSS pseudo classes
    infoHeader.append(`<style>.info-row:hover > .info-stat {background: ${feature.properties.color_2}</style>`);
    infoHeader.append(`<style>.info-row:hover > .info-stat {color: ${adjustInfoTextColor(feature.properties)}</style>`);
    infoHeader.append(`<style>.info-row:hover > .info-stat {border-color: ${feature.properties.color_2}</style>`);
    infoHeader.append(`<style>.info-row:hover > .info-text {border-color: ${feature.properties.color_2}</style>`);
}

function adjustInfoTextColor(featureProps) {
    const schools = ['Oklahoma', 'Oregon', 'California', 'Baylor', 'Indiana', 'Iowa State', 'Kansas State', 'LSU', 'Loyola–Chicago', 'Marquette', 'Maryland', 'Michigan', 'Minnesota', 'Pittsburgh', 'Saint Louis', 'UNLV', 'USC'];
    return schools.includes(featureProps.school_common_name) ? featureProps.color_1 : 'whitesmoke';
}

function adjustHeaderColor(featureProps) {
    const schools = ['Iowa', 'Missouri', 'Wichita State', 'La Salle', 'VCU', 'Purdue'];
    return schools.includes(featureProps.school_common_name) ? featureProps.color_2 : 'whitesmoke';
}

function differenceText(value) {
    return value >= 0 ? 'ABOVE' : 'BELOW';
}

function createLineFeatures(lineFeatures, site, feature) {
    // push linestring features to a feature array to be inserted into lines layer geojson source
    lineFeatures.push({
        'type': 'Feature',
        'properties': site.properties,  // apply all school/site metadata to linestring
        'geometry': {
            'type': 'LineString',
            // set school geometry and site geometry to create linetring between the two
            'coordinates': [feature.geometry.coordinates, site.geometry.coordinates],
        }
    });
}

function setAvgDistanceLayer(feature, map) {  // TODO rename fn
    // create formatted mapbox/geojson feature to apply to avg-distance layer source
    const avgDistance = [{
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: feature.geometry.coordinates,
        },
        properties: feature.properties,
    }];

    // apply geojson source to selected school layer
    map.getSource('selected-school').setData({ type: 'FeatureCollection', features: avgDistance });

    // TODO apply to avg-distance layer - update with full agg values? (e.g. compare school min to overall min? or avg min?)
    const property = setProperty();

    // apply circle radius based on data-driven radiuses
    map.setPaintProperty('selected-school', 'circle-radius',
        // radius dynamically determined by currently selected filters
        { property: property, stops: createStops(map.getSource('selected-school')['_data'], property) }
    );

    // apply above geojson to avg-distance layer
    map.getSource('avg-distance').setData({ type: 'FeatureCollection', features: avgDistance });

    // toggle visibility of layer back on if previously set to none (e.g. in resetExtent)
    ['avg-distance', 'selected-school'].forEach(layer => {
        map.setLayoutProperty(layer, 'visibility', 'visible');
    });
}

function setAvgDistanceLayerCompare(feature) {  // TODO rename fn
    // create formatted mapbox/geojson feature to apply to avg-distance layer source
    const avgDistance = [{
        type: "Feature",
        geometry: {
            type: "Point",
            coordinates: feature.geometry.coordinates,
        },
        properties: feature.properties,
    }];

    // apply geojson source to selected school layer
    compareMap.getSource('selected-school').setData({ type: 'FeatureCollection', features: avgDistance });

    // TODO apply to avg-distance layer - update with full agg values? (e.g. compare school min to overall min? or avg min?)
    const property = setProperty();

    // apply circle radius based on data-driven radiuses
    compareMap.setPaintProperty('selected-school', 'circle-radius',
        // radius dynamically determined by currently selected filters
        { property: property, stops: createStops(compareMap.getSource('selected-school')['_data'], property) }
    );

    // apply above geojson to avg-distance layer
    compareMap.getSource('avg-distance').setData({ type: 'FeatureCollection', features: avgDistance });

    // toggle visibility of layer back on if previously set to none (e.g. in resetExtent)
    ['avg-distance', 'selected-school'].forEach(layer => {
        compareMap.setLayoutProperty(layer, 'visibility', 'visible');
    });
}

function styleLayers(feature, map) {
    // gray out non-selected schools
    grayOutSchools();

    // filter site layer and toggle visibility on for sites and lines that match the clicked school
    ['sites', 'line'].forEach(layer => {
        map.setFilter(layer, ['==', 'school_common_name', feature.properties.school_common_name]);
        map.setLayoutProperty(layer, 'visibility', 'visible');
    });
}

function styleLayersCompare(feature) {
    // gray out non-selected schools
    grayOutSchools();

    // filter site layer and toggle visibility on for sites and lines that match the clicked school
    ['sites', 'line'].forEach(layer => {
        compareMap.setFilter(layer, ['==', 'school_common_name', feature.properties.school_common_name]);
        compareMap.setLayoutProperty(layer, 'visibility', 'visible');
    });
}

function grayOutSchools() {
    const styles = ['color', 'opacity'];
    styles.forEach(style => {
        map.setPaintProperty('schools', `circle-${style}`, ['case', ['boolean', ['feature-state', 'clicked'], false],
            style === 'color' ? '#E27600' : 1, style === 'color' ? '#D2D4D4' : 0.7]);
    });
}

function selectSeedOrConf(filterUI, filter) {
    filterUI.on('change', (e) => {
        // apply selected conference to filters
        filters[filter] = e.target.value;
        // console.log(e.target.value);

        // loop through schools layer
        map.getSource('schools')['_data'].features.forEach(school => {
            // console.log(school);
            // if a school is currently selected but does not belong to the selected conference, reset to default map view
            if (school.properties.school_common_name === filters.school) {
                const schoolMissingFilter = filter === 'conference' ? school.properties[filter] !== filters[filter] :
                    !Object.keys(school.properties).includes(filters[filter]);

                // console.log(!Object.keys(school.properties).includes(filters[filter]))

                if (schoolMissingFilter) { // TODO REMOVE IF YOU HIDE ALL OTHER SCHOOLS WHEN SCHOOL IS SELECTED
                    // TODO remove selected school and set selected filter?
                    resetExtent();  // hides selected school, sites, lines, etc. and resets bounds
                    // TODO Display an error message for this resetting?
                    resetAllFilters(filterUI);  // resets all filters EXCEPT conference filter
                    // resets filters explicitly so that setMapFilters below displays ALL schools
                    filters[filter] = 'all';
                }
            }
        });

        setMapFilters();
    });
}

// TODO allow multiple conference selections?
function selectConference() {
    selectSeedOrConf(conferenceFilter, 'conference');

}

function selectSeed() {
    selectSeedOrConf(seedFilter, 'seed');
}

/**
 * Sets condition for 'all' values in seed and conference filter - school layer is handled with resetExtent()
 **/
function setMapFilters() {
    // filter for selected conference OR display all for 'all conference' selection (filter for features that have school common name field)
    const confFilter = filters.conference !== 'all' ? ['==', 'conference', filters.conference] : ['has', 'school_common_name'];
    // filter for seeds that have seed aggregate field or display all for all seed selection
    const seedFilter = ['has', filters.seed === 'all' ? 'school_common_name' : filters.seed];
    // apply multiple filters with 'all'
    map.setFilter('schools', ['all', confFilter, seedFilter]);
}

// apply weighted or unweighted mean distance depending on toggle position
function onWeightedToggle(geojson) {
    weightedToggle.on('click', (e) => {

        // update global filters
        filters.weighted = e.target.checked;

        // separate fn to apply weights so no error occurs from setting weighted filter with checked value
        applyWeights(geojson);
    });
}

function applyWeights(geojson) {
    // set weighted distance if toggle checked - if not, set regular unweighted distance
    const property = setProperty();
    const stops = createStops(geojson, property);

    map.setPaintProperty('schools', 'circle-radius', { property: property, stops: stops });

    // apply selected school circle radius based on data-driven radiuses
    map.setPaintProperty('selected-school', 'circle-radius',
        { property: property, stops: createStops(map.getSource('selected-school')['_data'], property) }
    );

    // adjust average distance circle based on weighted toggle status, divide property by set value for mean and max values only
    map.setPaintProperty('avg-distance', 'circle-radius', highlights[property] / adjustPropCircles(property));
}

function adjustPropCircles(property) {
    return property === 'min_dist' || property === 'min_wtDist' ? 100 :
        property === 'count_dist' || property === 'count_wtDist' ? 1 : 65;
}

function createStops(geojson, property) {
    const values = [];
    const stops = [];

    geojson.features.forEach((feature, i) => {
        feature['id'] = i;  // add ids to school geojson for featureState functionality
        values.push(feature.properties[property]);
    });

    const sortedValues = values.sort((a, b) => { return a-b });
    sortedValues.forEach(val => {
        stops.push([val, val / adjustPropCircles(property)]);
    });
    return stops;
}

function onSchoolClick(sites, colors) {
    map.on('click', 'schools', (e) => {
        // save selected school in filters
        filters.school = e.features[0].properties.school_common_name;
        // set school filter dropdown value as clicked school
        schoolFilter.val(filters.school);
        selectSchoolOnMap(map, sites, colors);
    });
}

// TODO create class or interface for contentObject?
function updateInfoCard(contentObject) {
    infoHeader.text(contentObject['header']);
    $('.card-1').text(contentObject['card1']);
    $('.card-1-subtext').text(contentObject['card1text']);
    $('.card-2').text(contentObject['card2']);
    $('.card-2-subtext').text(contentObject['card2text']);
    $('.card-3').text(contentObject['card3']);
    $('.card-3-subtext').text(contentObject['card3text']);
    $('.card-4').text(contentObject['card4']);
    $('.card-4-subtext').text(contentObject['card4text']);
    $('.card-5').text(contentObject['card5']);
    $('.card-5-subtext').text(contentObject['card5text']);
}

function statFriendlyName(stat = filters.stat) {
    return stat === 'mean' ? 'mean' :
        stat === '50%' ? 'median' :
            stat === 'min' ? 'minimum' :
                stat === 'max' ? 'maximum' :
                    stat === 'count' ? 'count' : '';
}

// both dark: iowa, missouri, wichita, la salle, vcu, purdue
// light text, dark subtext: georgia tech??, unc, miami, florida, ok state, clemson
function adjustLabelColors(school, subtext = false) {
    const schools = ['Iowa', 'Missouri', 'Purdue', 'Georgia Tech', 'VCU', 'La Salle', 'Wichita State', 'Oklahoma State', 'Clemson', 'Vandy', 'Florida', 'Miami (FL)', 'North Carolina'];
    if (schools.includes(school)) {
        return subtext ? '#444' : '#555';
    } else {
        return subtext ? '#CCC' : 'whitesmoke';
    }
}

function onSchoolHover() {
    // empty hoverId, resets on each school mouseover
    let hoverId = null;

    map.on('mousemove', 'schools', (e) => {
        // console.log(e.features[0].properties)
        // change cursor to pointer to indicate clickability
        this.map.getCanvas().style.cursor = 'pointer';

        // reset basic school style for popup
        // TODO add +/- overall avg?

        // University of Iowa, Creighton, Mizzou, Purdue, Georgia IT, VCU, La Salle
        label.css('background', e.features[0].properties['color_1']);
        label.css('color', adjustLabelColors(e.features[0].properties.school_common_name));
        labelSubText.css('color', adjustLabelColors(e.features[0].properties.school_common_name, true));

        label.addClass('visible');  // make popup visible on school mouseover
        labelText.text(e.features[0].properties.school_full_name);  // apply school name to label
        // apply selected stat distance in label subtext
        labelSubText.text(`${e.features[0].properties[setProperty()].toFixed()} miles (${statFriendlyName()} distance traveled)`);

        // apply dark stroke on mouseover  // TODO fix - this doesn't seem to be working?
        if (hoverId) {
            map.setFeatureState({ source: 'schools', id: hoverId }, { hovered: false });
        }
        hoverId = e.features[0].id;
        map.setFeatureState({ source: 'schools', id: hoverId }, { hovered: true });
    });

    map.on('mouseleave', 'schools', () => {
        // change cursor to pointer to indicate clickability
        this.map.getCanvas().style.cursor = 'grab';
        label.removeClass('visible');  // hide label on mouseleave todo is this needed?
        // remove visual affordance on mouseleave
        map.setFeatureState({ source: 'schools', id: hoverId }, { hovered: false });
    });
}

function onSiteHover() {
    // TODO add visual afforance to line+site? Add invisible thicker linestring layer for smoother popup
    const layers = ['sites', 'line'];
    layers.forEach(layer => {
        // TODO fix bug where site label doesnt work over a school, ex: Iowa site in Nashville overwitten by Vandy
        map.on('mousemove', layer, (e) => {
            // console.log(layer)
            applySiteLabelStyles(e.features[0].properties);
        });

        map.on('mouseleave', layer, () => {
            label.removeClass('visible');  // hide label on mouseleave
        });
    });
}

function onCompareSiteHover() {
    // TODO add visual afforance to line+site? Add invisible thicker linestring layer for smoother popup
    const layers = ['sites', 'line'];
    layers.forEach(layer => {
        // TODO fix bug where site label doesnt work over a school, ex: Iowa site in Nashville overwitten by Vandy
        compareMap.on('mousemove', layer, (e) => {
            applyCompareSiteLabelStyles(e.features[0].properties);
        });

        compareMap.on('mouseleave', layer, () => {
            $('.label-compare').removeClass('visible');  // hide label on mouseleave
        });
    });
}

function backgroundColor(property) {
    return property.seed === 1 ? '#80bad1' :
        property.seed === 2 ? '#5694c1' :
            property.seed === 3 ? '#2c6db1' :
                property.seed === 4 ? '#0146a1' : '#AAA';
}

function applyCompareSiteLabelStyles(props) {
    const content = `${props.school_common_name} played ${props.distance.toFixed()}
            miles from home in ${props.site} in ${props.year} as a ${props.seed} seed.`;

    // update label text and styles TODO add +/- from seed avg
    $('.label-compare').addClass('visible');  // make info label visible
    $('.label-text-compare').text(content);  // apply site info content
    $('.label-subtext-compare').text('');  // apply site info content
    $('.label-compare').css('background', backgroundColor(props));  // apply styles based on seed
    $('.label-compare').css('color', 'white');
}

function applySiteLabelStyles(props) {
    const content = `${props.school_common_name} played ${props.distance.toFixed()}
            miles from home in ${props.site} in ${props.year} as a ${props.seed} seed.`;

    // update label text and styles TODO add +/- from seed avg
    label.addClass('visible');  // make info label visible
    labelText.text(content);  // apply site info content
    labelSubText.text('');  // apply site info content
    label.css('background', backgroundColor(props));  // apply styles based on seed
    label.css('color', 'white');
}

function createLayer(layerInfo, sourceData = { type: 'FeatureCollection', features: [] }, map) {
    // layer without geojson source - source is added dynamically
    map.addLayer({
        id: layerInfo.id,
        type: layerInfo.type,
        source: {
            type: 'geojson',
            data: sourceData,
        },
        paint: layerInfo.paint,
        layout: {
            visibility: layerInfo.visibility,
        }
    }, layerInfo.before);  // layer to place before plotting
}

function createAllLayers(schools, sites, map) {
    // TODO SITES: Apply layering so that higher seeds/smaller circles plot on top of lower seeds
    // sort geojson in descending order to plot larger circles underneath smaller ones
    // TODO Sort for each stat selection
    // TODO SCHOOLS sorting causes bug when select school, click weighted toggle, then click a diff school - plots multi schools
    // geojson.features.sort((a, b) => (a.properties.mean_dist > b.properties.mean_dist) ? 1 : -1).reverse();

    const property = setProperty();
    const stops = createStops(schools, property);
    schoolDetails.paint['circle-radius'] = {property: property, stops: stops};

    const layerDetails = [schoolDetails, siteDetails, lineStringDetails, avgDistanceDetails, selectedSchoolDetails];
    layerDetails.forEach(details => {
        const source = details === siteDetails ? sites : details === schoolDetails ? schools : null;
        createLayer(details, source, map);
    });
}

function arcLineString(lineFeature) {
    const lineDistance = turf.lineDistance(lineFeature, {units: 'kilometers'});
    const arc = [];
    // number of steps to use in the arc and animation, more steps means a smoother arc and animation, but too many steps will result in a low frame rate
    const steps = 250;

    // draw an arc between the `origin` & `destination` of the two points
    for (let i = 0; i < lineDistance; i += lineDistance / steps) {
        const segment = turf.along(lineFeature, i, {units: 'kilometers'});
        arc.push(segment.geometry.coordinates);
    }
    lineFeature.geometry.coordinates = arc;
}

function triggerAnimation() {
    const origin = [-122.414, 37.776];
    const destination = [-77.032, 38.913];

    // simple line from origin to destination.
    const route = {type: 'FeatureCollection', features: [{type: 'Feature', geometry: {type: 'LineString', coordinates: [origin, destination]}}]};
    // single point that animates along the route, coordinates are initially set to origin
    const point = {type: 'FeatureCollection', features: [{type: 'Feature', properties: {}, geometry: {type: 'Point', coordinates: origin}}]};
    const steps = 250;

    // create arc from linestring
    arcLineString(route.features[0]);

    // increment the value of the point measurement against the route
    let counter = 0;

    // TODO put in map.load
    // Aad a source and layer displaying a point which will be animated in a circle
    if (!this.map.getSource('route')) {
        map.addSource('route', {'type': 'geojson', 'data': route});
        map.addSource('point', {'type': 'geojson', 'data': point});

        map.addLayer({
            'id': 'route',
            'source': 'route',
            'type': 'line',
            'paint': {
                'line-width': 2,
                'line-color': '#007cbf'
            }
        });

        map.addLayer({
            'id': 'point',
            'source': 'point',
            'type': 'symbol',
            'paint': {'icon-color': 'red'},
            'layout': {
                'icon-image': 'airport-15',
                'icon-rotate': ['get', 'bearing'],
                'icon-rotation-alignment': 'map',
                'icon-allow-overlap': true,
                'icon-ignore-placement': true
            }
        });
    }

    function animate() {
        // Update point geometry to a new position based on counter denoting the index to access the arc
        point.features[0].geometry.coordinates = route.features[0].geometry.coordinates[counter];

        // Calculate the bearing to ensure the icon is rotated to match the route arc - the bearing is calculate between the current point and the next point, except at the end of the arc use the previous point and the current point
        point.features[0].properties.bearing = turf.bearing(
            turf.point(route.features[0].geometry.coordinates[counter >= steps ? counter - 1 : counter]),
            turf.point(route.features[0].geometry.coordinates[counter >= steps ? counter : counter + 1])
        );

        // update the source with this new data
        map.getSource('point').setData(point);

        // request the next frame of animation so long the end has not been reached
        if (counter < steps) {
            requestAnimationFrame(animate);
        }
        counter = counter + 1;
    }
    // start animation
    animate(counter);
}

// STORYMAP: setup resize event
window.addEventListener('resize', scroller.resize);