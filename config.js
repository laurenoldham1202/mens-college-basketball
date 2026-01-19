const config = {
    style: 'mapbox://styles/laurenoldham1202/ck9d9t3360puw1ilehqxfc0oa',
    accessToken: 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm9lemUxOGc1dWttMzI5dDI5aGtvIn0.3xAukiULCDm0OId5yIgXOA',
    showMarkers: false,
    theme: 'light',
    alignment: 'left',
    footer: `Map created by <strong>Lauren Oldham</strong>
      <br>Check out the <a href="https://github.com/laurenoldham1202/march-madness" target="_blank">project repository</a> for more info!`,
    chapters: [
        {
            id: 'intro',
            description: `
<!--<div class="center" style="text-align: center;"><img src="./images/bball-2.png"></div>-->
<img src="./images/bball-2.png" style="float: left; margin-right: 1rem;">
<p><span class="capital-font" style="font-size: 26pt;">Every year in March,</span> 
the top college basketball programs are placed in a tournament bracket, which determines <em>who</em> and <em>where</em>
teams will play during NCAA's men's college basketball championship. <span class="material-icons button-icon" id="details-modal" data-toggle="modal" data-target="#about-modal">help</span></p> 

<p>Top ranked teams are supposed to be given a <span class="geo-source" data-toggle="modal" data-target="#geo-source-modal">geographic advantage early in the tournament</span>, which is intended to 
simulate a home-court advantage - if they play close to 'home,' fanbases are able to travel to watch 
the games.</p>

<div class="story-hl">
The map shows the overall top ranked teams (1 seeds) from the 2012 NCAA Men's Basketball tournament, who 
traveled an average distance of 147 miles to their first-round game.
</div>



<div class="scroll-container" style="width: 100%; overflow: hidden;">
  <div class="scroll" style="float: right;">Scroll &#8681;</div>
</div>

            `,
            // image: './images/logo.png',
            // image: './images/bball-2.png',
            location: {
                center: { lon: -86.54989, lat: 38.96481 },
                zoom: 5.34,
                pitch: 0.00,
                bearing: 0.00
            },
            onChapterEnter: [
                {layer: 'tourney-sites', opacity: 1},
                {layer: 'tourney-lines', opacity: 1},
                {layer: 'tourney', opacity: 1},
                {layer: 'schools', opacity: 0},
            ],
            onChapterExit: []
        },
        {
            id: 'chapter-1',
            title: 'Tournament Seeding',
            description: `
<!--Securing a top seed is intended to reward top-performing teams for dominating the regular season (prior to the -->
<!--tournament). Unlike many professional sports' championship tournaments, March Madness is a single-elimination tournament,-->
<!--meaning that teams only have one chance per match-up to advance until a final winner is left.-->
Top-performing schools are rewarded for their regular season performance in several ways, but most importantly, <strong>(1) they
are matched up against the lowest ranked teams in the tournament</strong>, and <strong>(2) they get to play close to home early in the 
tournament.</strong>

<br><br>
In a single elimination tournament, every edge a team has can make or break their chances at advancing toward the 
national title. 

<div class="story-hl">
The system is not foolproof - Duke, a top-ranked 2 seed, fell to the low-ranked 15 seed Lehigh Mountain Hawks
in the first round of the 2012 tournament, despite having traveled fewer than 50 miles to their first game.
2 seeds traveled an average of 155 miles.
</div>
            `,
            location: {
                center: { lon: -95.19207, lat: 37.96458 },
                zoom: 4.7,
                pitch: 0,
                bearing: 0
            },
            onChapterEnter: [
                {layer: 'tourney-sites', opacity: 1},
                {layer: 'tourney-lines', opacity: 1},
                {layer: 'tourney', opacity: 1},
                {layer: 'schools', opacity: 0},
            ],
            onChapterExit: []
        },
        {
            id: 'chapter-2',
            title: 'Why Does the First Round Site Matter?',
            image: '',
            location: {
                center: { lon: -103.41378, lat: 37.33339 },
                zoom: 3.85,
                pitch: 0,
                bearing: 0.00
            },
            description: `

            Playing close to home has many advantages for competing teams:
            <ul>
            <li>They spend less time actually traveling, reducing physical and mental exhaustion</li>
            <li>They play in the same/similar time zone, avoiding any jet lag issues</li>
            <li>It allows fans, friends, and families of the teams to travel to the games</li>
            </ul>
            
            <div class="story-hl">
            Traveling farther still, 3 seeds in the 2012 tournament averaged 424 miles to their first round-site, more 
            than the 1 and 2 seed averages combined.
            </div>

<!--            According to the NCAA Selection Committee, <strong>top teams are given geographic preference when determining-->
<!--            <em>where</em> they play in the first round of the tournament</strong>.-->
<!--            -->
<!--            <br><br>-->
<!--            Playing closer to 'home' can be extremely advantageous during the tournament. Not only does it reduce time -->
<!--            spent traveling, but more importantly, <strong>it simulates a home court advantage</strong> by allowing fan-->
<!--            bases to easily travel to the games.-->
<!--            -->
<!--            <br><br>-->
<!--            <span class="bold">The NCAA Selection Committee claims to give geographic preference to the top seeds in order of their rank </span>- -->
<!--            one seeds get the highest preference, then two seeds, then three, then four (remaining seeds are not given-->
<!--            explicit geographic considerations). So is it true? <span class="bold">I analyzed March Madness tournament data from 2015 to-->
<!--            2019 to put the claim to the test.</span>-->
<!--            -->
<!--            <br><br>-->
<!--            <div style="text-align: center">Mouse over seeds to display first-round site on the map-->
<!--            <div class="seed-hl-row">-->
<!--                <div class="seed-hl seed-hl-active" id="story-seed-1" style="background: #80bad1">-->
<!--                    <div class="seed-hl-text">1 Seeds</div>-->
<!--                </div> -->
<!--               -->
<!--               <div class="seed-hl" id="story-seed-2" style="background: #5694c1">-->
<!--                    <div class="seed-hl-text">2 Seeds</div>-->
<!--                </div>-->
<!--                       -->
<!--               <div class="seed-hl" id="story-seed-3" style="background: #2c6db1">-->
<!--                    <div class="seed-hl-text">3 Seeds</div>-->
<!--                </div>-->
<!--                       -->
<!--               <div class="seed-hl" id="story-seed-4" style="background: #0146a1">-->
<!--                    <div class="seed-hl-text">4 Seeds</div>-->
<!--               </div>-->
<!--            </div>-->
<!--            </div>-->
            `,
            onChapterEnter: [
                {layer: 'tourney-sites', opacity: 1},
                {layer: 'tourney-lines', opacity: 1},
                {layer: 'tourney', opacity: 1},
                {layer: 'schools', opacity: 0},
            ],
            onChapterExit: [
                {layer: 'tourney-sites', opacity: 0},
                {layer: 'tourney-lines', opacity: 0},
                {layer: 'tourney', opacity: 0},
            ]
        },

      // TODO new chapter for audience, fans wanting to see how their teams fared, etc.
        {
            id: `chapter-6`,
            title: `Purpose`,
            location: {
                center: {lon: -116.5, lat: 41.5},
                zoom: 3.5,
                pitch: 0.00,
                bearing: 0.00,
            },
            description: `
            No matter the outcome, teams <em>want</em> to play close to home whenever possible.
            <br><br>
            To test the claim of geographic preference for highly ranked schools, I analyzed the travel distances of the
            top 4 seeds during the first round of each March Madness tournament from 1985 to 2019.
            <div class="story-hl">
            Traveling an average distance of 1338 miles, 4 seeds could hardly claim any geographic preference in 2012.
            Even so, three of the four teams survived the first weekend, advancing to the Elite Eight. 
            </div>
            
                        <div style="text-align: center">Mouse over seeds to display first-round site on the map
            <div class="seed-hl-row">
                <div class="seed-hl" id="story-seed-1" style="background: #80bad1">
                    <div class="seed-hl-text">1 Seeds</div>
                </div> 
               
               <div class="seed-hl" id="story-seed-2" style="background: #5694c1">
                    <div class="seed-hl-text">2 Seeds</div>
                </div>
                       
               <div class="seed-hl" id="story-seed-3" style="background: #2c6db1">
                    <div class="seed-hl-text">3 Seeds</div>
                </div>
                       
               <div class="seed-hl seed-hl-active" id="story-seed-4" style="background: #0146a1">
                    <div class="seed-hl-text">4 Seeds</div>
               </div>
            </div>
            </div>
            `,
            onChapterEnter: [
                {layer: 'tourney-sites', opacity: 1},
                {layer: 'tourney-lines', opacity: 1},
                {layer: 'tourney', opacity: 1},
                {layer: 'schools', opacity: 0},
            ],
            onChapterExit: [
                {layer: 'tourney-sites', opacity: 0},
                {layer: 'tourney-lines', opacity: 0},
                {layer: 'tourney', opacity: 0},
            ]
        },

        {
            // TODO remove fitbounds from school selection to give better reference for distances?
          id: 'chapter-3',
          title: `Methodology`,
            location: {
                center: {lon: -116.5, lat: 41.5},
                zoom: 3.25,
                pitch: 0.00,
                bearing: 0.00,
            },
          description: `
Tournament data for each top seed (1-4) and its respective first-round site location was 
collected from <a href="https://www.sports-reference.com/cbb/postseason/" target="_blank">Sports Reference</a>. The data was
cleaned, analyzed, and manipulated primarily using Python 3 libraries (pandas, geopandas, and geocoder) in Jupyter Notebooks.

<br><br>Distances are calculated as <strong>Great Circle distances</strong> with the haversine formula, or 'as the crow flies,' i.e. the
shortest possible distance between two points. This distance calculation does not account for how teams actually
traveled to their tournament sites (e.g. flying versus driving). Site locations are also inexact, with coordinates placed
in the site's city center rather than the exact arena in which the game was played.

<br><br>More information can be found at the <a href="https://github.com/laurenoldham1202/march-madness" target="_blank">project repository</a>.
`,
            onChapterEnter: [
                {layer: 'schools', opacity: 0},
                {layer: 'route', opacity: 1},
                {layer: 'point', opacity: 1},
            ],
            onChapterExit: [
                {layer: 'route', opacity: 0},
                {layer: 'point', opacity: 0},
            ]
        },
        {
            id: 'chapter-4',
            title: 'Reading the Map',
            location: {
                center: {lon: -116.5, lat: 41.5},
                zoom: 3.25,
                pitch: 0.00,
                bearing: 0.00,
            },
            // TODO adjust these styles for responsive design
            description: `
<strong>Schools</strong> are represented as proportional circles on the map (based on their unweighted mean travel 
distance).
<div class="legend-container">
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
</div>
<br>
<strong>Tournament sites</strong> are also represented as proportional circles based on the school's seed in that 
year's tournament.
<br><br>

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
<br>
<strong>Linestrings</strong> connect the school to the site location to visualize the distance between the two points.
<!--<hr>-->
<!--According to the selection process, a school with fair site locations should see a radial pattern with 1 seed sites-->
<!--closest to the school, 2 seeds farther out, and so on, with 4 seed sites the farthest from the school. 4 seed sites that-->
<!--are close and 1 seed sites that are far from schools are particularly noteworthy for breaking the pattern of higher seed-->
<!--= closer site.-->
`,
            onChapterEnter: [
                {layer: 'legend-lines', opacity: 1},
                {layer: 'legend-point', opacity: 1},
                {layer: 'legend-point-avg', opacity: 1},
                {layer: 'schools', opacity: 0},
            ],
            onChapterExit: [
                {layer: 'legend-lines', opacity: 0},
                {layer: 'legend-point', opacity: 0},
                {layer: 'legend-point-avg', opacity: 0},
            ]
        },
        {
            id: 'chapter-5',
            title: 'Distances by Seed',
            image: '',
            description: `Analysis of data from 1985 to 2019 falls in line with the NCAA's claim of 
            geographic preference for higher seeds, with 
            <br><strong>1 seeds averaging the shortest travel distance,
            <br>2 seeds averaging the second shortest travel distance,
             <br>3 seeds average the third shortest travel distance, and
              <br>4 seeds traveling
            the furthest of all top ranked seeds</strong>.
   
<!--            <div class="seed-hl-row">-->
<!--                <div class="seed-hl" style="background: #80bad1">-->
<!--                    <div class="seed-hl-title" style="color: white !important;">1 SEED</div>-->
<!--                    <div class="seed-hl-text">353 miles</div>-->
<!--                </div> -->
<!--               -->
<!--               <div class="seed-hl" style="background: #5694c1">-->
<!--                    <div class="seed-hl-title">2 SEED</div>-->
<!--                    <div class="seed-hl-text">482 miles</div>-->
<!--                </div>-->
<!--                       -->
<!--               <div class="seed-hl" style="background: #2c6db1">-->
<!--                    <div class="seed-hl-title">3 SEED</div>-->
<!--                    <div class="seed-hl-text">689 miles</div>-->
<!--                </div>-->
<!--                       -->
<!--               <div class="seed-hl" style="background: #0146a1">-->
<!--                    <div class="seed-hl-title">4 SEED</div>-->
<!--                    <div class="seed-hl-text">829 miles</div>-->
<!--               </div>-->
<!--            </div>-->
            
            <div id="chart-chapter-5" style="margin-top: 1rem;"></div>

            `,
            location: {
                center: [-113.72917, 48.58938],
                zoom: 12.92,
                pitch: 39.50,
                bearing: 36.00
            },
            onChapterEnter: [
                {layer: 'schools', opacity: 0.7},
            ],
            onChapterExit: []
        },
        {
            id: 'chapter-7',  // 7
            title: 'Schools with 1 Appearance as Top Seed',
            image: '',
            location: {
                center: {lon: -116.5, lat: 41.5},
                zoom: 3.25,
                pitch: 0.00,
                bearing: 0.00,
            },
            description: `
            For many schools, making it into the tournament is a huge accomplishment by itself - earning a top seed is
            even more uncommon.
            
            <br><br>Of the 87 schools to have earned a top seed since 1985, <strong>16 of them made only
            a single appearance</strong> with that ranking, traveling a mean distance of <strong>809 miles</strong> (221
            miles above the overall average).
            
            <br><br>Notably, both the <strong>shortest and longest average travel distances</strong> are for schools with
             1 top-
             seed appearance: Depaul University (~13 miles) and Virginia Tech University (~2261 miles), respectively.
            
            <div class="display-more">Click to see schools below &#9662;</div>
            <div class="one-count hidden-panel">
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#FFB300"><div class="seed-hl-title" style="color: #444">VCU</div></div>
                    <div class="seed-hl" style="background:#630031"><div class="seed-hl-title">Virginia Tech</div></div>
                    <div class="seed-hl" style="background:#CE1141"><div class="seed-hl-title">Dayton</div></div>
                    <div class="seed-hl" style="background:#003DA5"><div class="seed-hl-title">St. Louis</div></div>
                </div>            
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#005CA9"><div class="seed-hl-title">Creighton</div></div>
                    <div class="seed-hl" style="background:#7A0019"><div class="seed-hl-title">Minnesota</div></div>
                    <div class="seed-hl" style="background:#4D1979"><div class="seed-hl-title">TCU</div></div>
                    <div class="seed-hl" style="background:#C8102E"><div class="seed-hl-title">Houston</div></div>
                </div>            
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#922247"><div class="seed-hl-title">Loyola-Chicago</div></div>
                    <div class="seed-hl" style="background:#003262"><div class="seed-hl-title">California</div></div>
                    <div class="seed-hl" style="background:#500000"><div class="seed-hl-title">Texas A&M</div></div>
                    <div class="seed-hl" style="background:#E41C38"><div class="seed-hl-title">Nebraska</div></div>
                </div>            
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#720000"><div class="seed-hl-title">Southern Illinois</div></div>
                    <div class="seed-hl" style="background:#13294B"><div class="seed-hl-title">Butler</div></div>
                    <div class="seed-hl" style="background:#FFCC00"><div class="seed-hl-title" style="color: #444">La Salle</div></div>
                    <div class="seed-hl" style="background:#005EB8"><div class="seed-hl-title">DePaul</div></div>
                </div>
            </div>
            `,
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'chapter-8',  // 8
            title: 'Schools with 10+ Appearances as Top Seed',
            image: '',
            location: {
                center: {lon: -116.5, lat: 41.5},
                zoom: 3.25,
                pitch: 0.00,
                bearing: 0.00,
            },
            description: `
            On the flip side, many schools have strong programs that consistently perform at the top level - <strong>22
            schools have made 10 or more appearances as a top seed</strong>, traveling a mean distance very close to the
            overall average at <strong>561 miles</strong> (17 miles below overall average).
            
            <div class="display-more">Click to see schools below &#9662;</div>
            <div class="one-count hidden-panel">
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#00274C"><div class="seed-hl-title">Michigan</div></div>
                    <div class="seed-hl" style="background:#CC0033"><div class="seed-hl-title">Arizona</div></div>
                    <div class="seed-hl" style="background:#000E2F"><div class="seed-hl-title">UConn</div></div>
                    <div class="seed-hl" style="background:#E03A3E"><div class="seed-hl-title">Maryland</div></div>
                </div>            
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#2D68C4"><div class="seed-hl-title">UCLA</div></div>
                    <div class="seed-hl" style="background:#990000"><div class="seed-hl-title">Indiana</div></div>
                    <div class="seed-hl" style="background:#E00122"><div class="seed-hl-title">Cincinnati</div></div>
                    <div class="seed-hl" style="background:#0033A0"><div class="seed-hl-title">Kentucky</div></div>
                </div>            
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#003594"><div class="seed-hl-title">Pittsburgh</div></div>
                    <div class="seed-hl" style="background:#7BAFD4"><div class="seed-hl-title" style="color: #444">North Carolina</div></div>
                    <div class="seed-hl" style="background:#AD0000"><div class="seed-hl-title">Louisville</div></div>
                    <div class="seed-hl" style="background:#CEB888"><div class="seed-hl-title" style="color: #444">Purdue</div></div>
                </div>            
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#18453B"><div class="seed-hl-title">Michigan State</div></div>
                    <div class="seed-hl" style="background:#0051BA"><div class="seed-hl-title">Kansas</div></div>
                    <div class="seed-hl" style="background:#841617"><div class="seed-hl-title">Oklahoma</div></div>
                    <div class="seed-hl" style="background:#D44500"><div class="seed-hl-title">Syracuse</div></div>
                </div>
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#041E42"><div class="seed-hl-title">Georgetown</div></div>
                    <div class="seed-hl" style="background:#FA4616"><div class="seed-hl-title">Florida</div></div>
                    <div class="seed-hl" style="background:#003087"><div class="seed-hl-title">Duke</div></div>
                    <div class="seed-hl" style="background:#00205B"><div class="seed-hl-title">Villanova</div></div>
                </div>
                <div class="seed-hl-row">
                    <div class="seed-hl" style="background:#13294B"><div class="seed-hl-title">Illinois</div></div>
                    <div class="seed-hl" style="background:#BB0000"><div class="seed-hl-title">Ohio State</div></div>
                    <div class="seed-hl" style="visibility: hidden"></div>
                    <div class="seed-hl" style="visibility: hidden"></div>
                </div>
            </div>
            `,
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'chapter-9', // 9
            title: 'Blue Bloods',
            image: '',
            description: `
            Schools that have historically dominated the college basketball scene have achieved an (unofficial) elite 
            title - <strong>Blue Bloods</strong>. More than just their team colors, Blue Bloods are oftentimes the most 
            prestigious (and hated) teams in the sport. But more often than not, they <em>do</em> prevail during March 
            Madness. While the Blue Blood status is up for debate for many teams, the core 4 are:
            
         
            <div id="chart-blue-bloods" style="width:100%; max-width:900px;"></div>

<!--            <div class="seed-hl-row">-->
<!--                <div class="seed-hl" style="background:#003087">-->
<!--                  <div class="seed-hl-title">DUKE</div>-->
<!--                  <div class="seed-hl-text">299 miles</div>-->
<!--                </div>-->
<!--                <div class="seed-hl" style="background:#0051BA">-->
<!--                  <div class="seed-hl-title">KANSAS</div>-->
<!--                  <div class="seed-hl-text">395 miles</div>-->
<!--                </div>-->
<!--              <div class="seed-hl" style="background:#0033A0">-->
<!--                  <div class="seed-hl-title">KENTUCKY</div>-->
<!--                  <div class="seed-hl-text">440 miles</div>-->
<!--              </div>-->
<!--              <div class="seed-hl" style="background:#7BAFD4">-->
<!--                  <div class="seed-hl-title">UNC</div>-->
<!--                  <div class="seed-hl-text">457 miles</div>-->
<!--              </div>-->

            </div>
            
            
            <!-- Duke: 299, 200-->
            <!-- UK: 440, 327-->
            <!-- UNC: 457, 307-->
            <!-- Kan: 395, 275-->
            <!-- TODO Adjust weighted dist calculations - 2: 0.73, 3: 0.51, 4: 0.43 -->
            With a collective <strong>108 March Madness appearances</strong> since 1985, the Blue Bloods traveled an
            average of only <strong>394 miles</strong> (194 miles below overall average).
            
            `,
            location: {
                center: { lon: -95.91291, lat: 36.54204 },
                zoom: 4.5,
                pitch: 0.00,
                bearing: 0.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        // {
        //     id: 'chapter-10',  // 10
        //     title: 'Single Shortest Travel Distance',
        //     image: '',
        //     description: `The <strong>University of Arizona</strong> traveled the single shortest distance, barely leaving campus to travel
        //     <strong>less than half a mile</strong> to their first round site in Tucson in 2000 as a 1 seed.
        //
        //      <br><br>
        //      Unfortunately for the Wildcats,
        //     the close proximity didn't give them enough of a boost to beat out Wisconsin in the second round of the
        //     tournament.`,
        //     onChapterEnter: [],
        //     onChapterExit: []
        // },
//         {
//             id: 'chapter-11',  // 11
//             title: 'Weighted Distance',
//             image: '',
//             description: `
//             Making apples-to-apples comparisons amongst schools based on their mean travel distance is not optimal -
//             travel distances are expected to fluctuate based on the frequency of appearances of each seed in a school's
//             history.
//
//             <br><br>
//             To allow for more accurate comparison amongst schools, weights were applied based on seed values.
//
//              <div class="seed-hl-row">
//                 <div class="seed-hl" style="background: #80bad1">
//                     <div class="seed-hl-title" style="color:white">1 SEED</div>
//                     <div class="seed-hl-text">1.00</div>
//                 </div>
//
//                <div class="seed-hl" style="background: #5694c1">
//                     <div class="seed-hl-title">2 SEED</div>
//                     <div class="seed-hl-text">0.73</div>
//                 </div>
//
//                <div class="seed-hl" style="background: #2c6db1">
//                     <div class="seed-hl-title">3 SEED</div>
//                     <div class="seed-hl-text">0.51</div>
//                 </div>
//
//                <div class="seed-hl" style="background: #0146a1">
//                     <div class="seed-hl-title">4 SEED</div>
//                     <div class="seed-hl-text">0.43</div>
//                </div>
//             </div>
//             <br>
//             The weights are derived from the overall seed averages. Based on data from 1985 to 2019, <strong>2 seeds
//             travel ~1.3 times farther than 1 seeds</strong>, <strong>3 seeds travel nearly double the distance of 1
//             seeds</strong>, and <strong>4 seeds travel ~2.3 times farther than 1 seeds.</strong>
//   <!-- <div class="seed-hl-row">-->
// <!--                <div class="seed-hl" style="background: #80bad1">-->
// <!--                    <div class="seed-hl-title">1 SEED</div>-->
// <!--                    <div class="seed-hl-text">1.00</div>-->
// <!--                </div> -->
// <!--               -->
// <!--               <div class="seed-hl" style="background: #5694c1">-->
// <!--                    <div class="seed-hl-title">2 SEED</div>-->
// <!--                    <div class="seed-hl-text">0.75</div>-->
// <!--                </div>-->
// <!--                       -->
// <!--               <div class="seed-hl" style="background: #2c6db1">-->
// <!--                    <div class="seed-hl-title">3 SEED</div>-->
// <!--                    <div class="seed-hl-text">0.50</div>-->
// <!--                </div>-->
// <!--                       -->
// <!--               <div class="seed-hl" style="background: #0146a1">-->
// <!--                    <div class="seed-hl-title">4 SEED</div>-->
// <!--                    <div class="seed-hl-text">0.25</div>-->
// <!--               </div>-->
// <!--            </div>-->
// <!--            <br>-->
// <!--            The weights are roughly proportional to the pool of first round site locations. For the 16 top seeded teams,-->
// <!--            there are 16 possible (non-unique) site locations. 1 seeds get premiere geographic preference (~100% of -->
// <!--            teams get optimal placement). 2 seeds get top pick from the remaining pool (12/16), then 3 seeds from that -->
// <!--            remaining pool (8/16), and finally, 4 seeds get the remaining pick (4/16).-->
//             `,
//             location: {
//                 center: { lon: -95.91291, lat: 36.54204 },
//                 zoom: 4.8,
//                 pitch: 0.00,
//                 bearing: 0.00
//             },
//             onChapterEnter: [],
//             onChapterExit: []
//         },
      // {
      //   id: 'chapter-12',
      //   title: 'Longest Weighted Average and Overall Travel Distance',
      //   image: '',
      //   description: `The school with the highest mean travel distance with at least 5 appearances is <strong>St. John's University</strong>
      //        in Queens, New York. The Red Storm traveled an average of <strong>1,604 miles</strong> over 5 appearances. St. John's also represents
      //        the highest WEIGHTED mean travel distance at 1,332 miles.
      //
      //         <br><br>Interestingly, the Red Storm have fared better geographically
      //        as lower seeds than as higher seeds - they traveled 1,900+ miles in all three of their appearances as a 1 and 2 seed,
      //        but only between 500-900 miles as a 3 and 4 seed.
      //        `,
      //   onChapterEnter: [],
      //   onChapterExit: []
      // },
      //   {
      //       id: 'chapter-13',  // TODO fix 13
      //       title: 'Travel by Seed Discrepancies',
      //       image: '',
      //       description: `
      //       Another school that has fared notably better as a lower seed is the <strong>University of Michigan</strong>.
      //
      //       <br><br>
      //       With 13 top-seeded tournament appearances since 1985, the Wolverines traveled an average of only <strong>
      //       245 miles as a 4 seed</strong>, while traveling significantly higher distances as 1, 2, and 3 seeds.
      //       <br><br>
      //       <div class="seed-hl-row">
      //           <div class="seed-hl" style="background: #80bad1">
      //               <div class="seed-hl-title">1 SEED</div>
      //               <div class="seed-hl-text">910 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #5694c1">
      //               <div class="seed-hl-title">2 SEED</div>
      //               <div class="seed-hl-text">414 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #2c6db1">
      //               <div class="seed-hl-title">3 SEED</div>
      //               <div class="seed-hl-text">1,027 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #0146a1">
      //               <div class="seed-hl-title">4 SEED</div>
      //               <div class="seed-hl-text">245 miles</div>
      //          </div>
      //       </div>
      //
      //       `,
      //       onChapterEnter: [],
      //       onChapterExit: []
      //   },
      //
      //   {
      //       id: 'chapter-14',  // TODO fix  14
      //       title: 'Consistent Travel Distances',
      //       image: '',
      //       description: `
      //       Other schools have far less varied travel distances.
      //
      //       <br><br>
      //       <strong>The University of Kansas</strong>, located near the exact center of the contiguous United States,
      //       has an average distance range from <strong>312 miles as a 1 seed</strong> to <strong>556 miles as a 4 seed</strong>,
      //       a difference of only approximately 250 miles.
      //       <br><br>
      //       <div class="seed-hl-row">
      //           <div class="seed-hl" style="background: #80bad1">
      //               <div class="seed-hl-title">1 SEED</div>
      //               <div class="seed-hl-text">312 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #5694c1">
      //               <div class="seed-hl-title">2 SEED</div>
      //               <div class="seed-hl-text">431 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #2c6db1">
      //               <div class="seed-hl-title">3 SEED</div>
      //               <div class="seed-hl-text">432 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #0146a1">
      //               <div class="seed-hl-title">4 SEED</div>
      //               <div class="seed-hl-text">556 miles</div>
      //          </div>
      //       </div>
      //       `,
      //       onChapterEnter: [],
      //       onChapterExit: []
      //   },
      //
      //   {
      //       id: 'chapter-15',  // TODO fix 15
      //       title: 'Consistent Travel Distances',
      //       image: '',
      //       description: `
      //       A more recent top-tier program, <strong>Villanova University</strong>, has seen similar consistency and even
      //       more favorable travel distances.
      //
      //       <br><br>
      //       Having won two of the last 4 national titles (2016, 2018), the Wildcats
      //       have an average distance range from <strong>193 miles as a 1 seed</strong> to <strong>381 miles as a 4 seed
      //       </strong>, with an overall maximum distance of only 682 miles.
      //
      //       <br><br>
      //       <div class="seed-hl-row">
      //           <div class="seed-hl" style="background: #80bad1">
      //               <div class="seed-hl-title">1 SEED</div>
      //               <div class="seed-hl-text">193 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #5694c1">
      //               <div class="seed-hl-title">2 SEED</div>
      //               <div class="seed-hl-text">198 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #2c6db1">
      //               <div class="seed-hl-title">3 SEED</div>
      //               <div class="seed-hl-text">297 miles</div>
      //           </div>
      //
      //          <div class="seed-hl" style="background: #0146a1">
      //               <div class="seed-hl-title">4 SEED</div>
      //               <div class="seed-hl-text">381 miles</div>
      //          </div>
      //       </div>
      //       `,
      //       onChapterEnter: [],
      //       onChapterExit: []
      //   },

        {
            id: 'chapter-16',  // 16
            title: 'Distance by Conference',
            image: '',
            description: `Like many sports, the NCAA divides schools into discrete, geographically clustered conferences.
            Of the 32 D1 conferences, only 11 have produced top seeded teams in March Madness:
            
            <div id="chart-conferences" style="width:100%; max-width:1000px;"></div>

<!--            <div class="conference-list" style="margin-top: 1rem;">-->
<!--              <div class="conference-row">-->
<!--                  <div class="conference" style="background: #7F3C8D">American Athletic Conference (544 miles)</div>-->
<!--                  <div class="conference" style="background: #11A579">Atlantic 10 Conference (969 miles)</div>-->
<!--                  <div class="conference" style="background: #3969AC">Atlantic Coast Conference (600 miles)</div>-->
<!--                  <div class="conference" style="background: #F2B701">Big 12 Conference (545 miles)</div>-->
<!--              </div>-->
<!--              <div class="conference-row">-->
<!--                  <div class="conference" style="background: #E73F74">Big East Conference (700 miles)</div>-->
<!--                  <div class="conference" style="background: #80BA5A">Big Ten Conference (698 miles)</div>-->
<!--                  <div class="conference" style="background: #E68310">Missouri Valley Conference (671 miles)</div>-->
<!--                  <div class="conference" style="background: #008695">Mountain West Conference (629 miles)</div>-->
<!--              </div>-->
<!--              <div class="conference-row">-->
<!--                  <div class="conference" style="background: #CF1C90">Pac-12 Conference (811 miles)</div>-->
<!--                  <div class="conference" style="background: #f97b72">Southeastern Conference (562 miles)</div>-->
<!--                  <div class="conference" style="background: #4b4b8f">West Coast Conference (602 miles)</div>-->
<!--                  <div class="conference" style="background: transparent"></div>-->
<!--              </div>-->
<!--            </div>-->
            Does the geography of these conferences affect their travel distance during March Madness?
            `,
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'chapter-17',  //17
            title: 'Conferences with the Longest Mean Travel Distance',
            image: '',
            description: `The conferences with the highest mean travel distances are two coastal conferences: the 
            <span style="color: #CF1C90;"><strong>Pac-12</strong></span>
            on the Pacific West coast, who averaged <span style="color: #CF1C90;"><strong>773 travel miles</strong></span>, and the <span style="color: #11A579;"><strong>Atlantic 10</strong></span> on the Atlantic East coast, 
            who averaged <span style="color: #11A579;"><strong>832 travel miles</strong></span>.
            
            <br><br>Even applying weights by seed couldn't help these conferences - they remained the first and third longest traveling
            conferences, traveling a weighted 483 and 457 miles respectively.`,
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'chapter-18',  // 18
            title: 'Conferences with the Shortest Mean Travel Distance',
            image: '',
            description: `On the flip side, the conferences with the lowest mean travel distances are more centrally-
            located, with the <span style="color: #F2B701;"><strong>Big 12 Conference</strong></span> traveling an 
            average of <span style="color: #F2B701;"><strong>506 miles</strong></span> from the Great Plains region and 
            the <span style="color: #7F3C8D;"><strong>American Athletic Conference</strong></span> traversing and 
            average <span style="color: #7F3C8D;"><strong>494 miles</strong></span>.`,
            onChapterEnter: [],
            onChapterExit: []
        },
      // TODO fix for new weights
      // {
      //   id: 'chapter-19',  // 19
      //   title: 'Conferences with the Shortest Weighted Mean Travel Distance',
      //   image: '',
      //   description: `Applying weights to the conference distances, however, paints an unclear picture of any geographic trends.
      //   These conferences are vaguely concentrated in the Great Plains/Southeast, but are not strictly bound there.
      //
      //   <br><br>The <span style="color: #E68310;"><strong>Missouri Valley Conference</strong></span> has the overall shortest weighted travel distance at <span style="color: #E68310;"><strong>142 miles</strong></span>, but only has 2 March
      //   Madness appearances. Four conferences have weighted travel distances between 280 and 288 miles: <span style="color: #F2B701;"><strong>Big 12 (280 miles)</strong></span>,
      //   <span style="color: #3969AC;"><strong>Atlantic Coast Conference (282 miles)</strong></span>, <span style="color: #008695;"><strong>Mountain West Conference (283 miles)</strong></span>, and <span style="color: #f97b72;"><strong>Southeastern Conference (288 miles)</strong></span>.
      //   `,
      //   onChapterEnter: [],
      //   onChapterExit: []
      // },
        {
            id: 'chapter-20',  // 20
            title: 'Conclusion',
            image: '',
            description: `So is there any method to the madness? It would appear that way. Generally speaking, a school
            has a better chance at earning a geographic advantage in the first round of March Madness as a higher seed.
            
            <br><br>Perhaps unsurprisingly, it is also advantageous to be a more centrally-located school rather than geographically
            isolated on a coast (despite there being many more urban centers with arenas in the more densely populated 
            East Coast).
            
            <br><br>Outliers will come into play every year and it's not perfect system, but the math checks out.
            
            <br><br>Explore the interactive map to see how your school fares in March Madness travels!
            
             <div class="buttons" style="text-align: center;">
              <button class="button" id="explore-mode">Explore Map</button>
             </div>
            `,
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};
