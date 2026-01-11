# March Madness Top 4 Seeds and First Round Site Preference (1985-2019)

[View live project here!](https://laurenoldham1202.github.io/mens-college-basketball/)

## I. Introduction

Every year in March, college basketball fans anxiously await Selection Sunday to see if their team made the NCAA Men’s Basketball National Championship tournament, affectionately referred to as March Madness. March Madness is a three week-long single-elimination tournament in which 64 teams compete to take home the highly coveted National Championship title. The fun isn’t just reserved for fans - countless people from all across the globe fill out tournament brackets and bet on which teams will make deep runs and ultimately win it all.

While coaches, teams, and fans alike want to see their preferred team effortlessly stroll through the Sweet Sixteen, Elite Eight, and Final Four to play in the National Championship game, they first have to survive the first weekend of the tournament. Putting the ‘madness’ into March Madness, the first and second rounds of the tournament (Round of 64 and Round of 32, respectively) are historically filled with the most chaos, with underdog teams defying odds by knocking out highly favored teams early on. Because of the precedence for upsets in the first round of the tournament, there is a lot of focus on the matchups and locations for each competing team. 

Selection Sunday does more than just determine who gets into the tournament - it also determines **where the chosen teams play**, **who they play against**, and **how highly they are ranked**.

Each team is listed from best to worst with an overall rank, a number 1 to 64*, in which 1 represents the overall best team in the tournament and 64 represents the worst. These rankings are then grouped into 16 seeds of four teams each, wherein 1 seeds are the best teams and 16 seeds are the worst teams. 

**Many considerations go into the creation of March Madness brackets, but the idea is that higher seeds are rewarded for their regular season performance by playing against the lowest ranked teams. Additionally, the selection committee is supposed to give top ranked teams geographic preference in their first round sites.**

Because March Madness is a single-elimination tournament, teams only have one shot in each round to advance to the next level. All teams put their best foot forward, but there's no room for an off game - one bad night can (and has) cost the best team in the nation a shot at the national title. Many lower ranked teams don't make it into the tournament very often and have the tenacity to try to become the next Cinderella story. Furthermore, unlike most professional sports tournaments, March Madness is a sudden-death tournament in which each match-up only plays once - the winning team advances, while the losing team gets sent home until next year.

Teams want every advantage at their disposal when going into the tournament, and having a closer first-round site can be incredibly beneficial both physically and psychologically.

Student athletes still officially attend classes during the tournament, so shorter travel times are logistically easier; not only that, but traveling long distances via bus or air can be physically draining.
Games are played from early morning to late at night across multiple time zones, so it's also ideal to play in or near your home time zone.
Perhaps most importantly, playing near your school allows your fanbase to easily travel to the games, simulating as much of a [home court advantage](https://kenpom.com/blog/mining-point-spread-data-home-court-advantage/)  as possible. When the tides turn against a team in a game, nothing fires them up like a raucous home crowd.
The NCAA Selection Committee claims to give geographic preference to the top seeds in order of their rank - one seeds get the highest preference, then two seeds, then three, then four (remaining seeds are not given explicit geographic considerations).

**In this project, I test the claim that higher ranked/seeded teams are given geographic preference over lower ranked teams during the first tournament rounds of March Madness from 1985 to 2019.**

### A. Literature Review

* [NCAA Has a Geography Problem](https://www.thebiglead.com/2019/02/10/the-ncaa-tournament-has-a-geography-problem-and-should-move-a-western-venue/)
* [Home Team Bias in Bracket Predictions](https://www.cbssports.com/college-basketball/news/homer-bias-is-real-and-it-will-derail-your-march-madness-bracket/)
* [East Coast Bias in March Madness Selection](https://honors.libraries.psu.edu/catalog/14064)
* [Eastern Bias](https://www.usatoday.com/story/sports/ncaab/2018/03/15/ncaa-tournament-has-curious-eastern-slant-bias/429897002/)
* [Making March Madness](https://books.google.com/books?id=zHsnDwAAQBAJ&pg=PA231&lpg=PA231&dq=march+madness+geographical+bias&source=bl&ots=sowe_VDUU4&sig=ACfU3U0rGr27TqR1NsO5Ygxv84bCcB7tug&hl=en&sa=X&ved=2ahUKEwiK9Lqlq9HnAhWHVN8KHTEYAIAQ6AEwCHoECAsQAQ)
* [Home Court Advantage Analysis](https://www.boydsbets.com/college-basketball-home-court-advantage/)

## II. Methodology

Data were primarily pulled from [sports-reference.com](https://www.sports-reference.com/cbb/postseason/) and subsequently
cleaned, manipulated, and analyzed with various Python 3 packages via Jupyter Notebooks. QGIS was also utilized for 
initial case studies for project feasibility and converting to properly formatted geojsons. The primary Python 3 packages
used include:

- [Pandas](https://pandas.pydata.org/)
- [Geopandas](https://geopandas.org/) 
- [Geocoder](https://geocoder.readthedocs.io/) 

### A. Data

#### Raw Tournament Data

Raw data for the first round of each tournament from 1985 to 2019 was copied into a CSV with the year as the column name 
and the first round teams, seeds, sites, and scores as the rows. The raw data was then imported in a Jupyter Notebook 
(`notebooks/data-prep.ipynb`) and cleaned with a Python 3 script resulting in a CSV formatted as:
- 5 columns (seed, school, site, year, id)
- `seed` column is the numeric seed value for each team (1, 2, 3, or 4)
- `school` is the shorthand name for each participating school (e.g. UNC instead of University of North Carolina)
- `site` is the city and state of each school's first round site location (formatted as full city name and state 
abbreviation, e.g. Columbus, OH)
- `year` is the tournament year
- `id` is a unique ID for each school and its associated site for each year's tournament

In addition to each of the 16 teams for years 1985-2019, new rows for each site were appended to the CSV (with a 
matching ID) to eventually analyze the distance between each school and their first-round sites. This data was saved as 
`data/raw/mm-85-19-cleaned.csv`.

This data will be used to calculate the distance between each school and its site location.

#### School Locations and Metadata

The cleaned tournament file includes the shorthand school names, but no other geographic information for participating 
programs. To get locations and other relevant metadata (conference, team mascot, etc.) for each school, the list of 
[NCAA Division 1 Institutions](https://en.wikipedia.org/wiki/List_of_NCAA_Division_I_institutions)
was pulled from Wikipedia and saved as CSV (`data/raw/d1-master-list.csv`). The data was cleaned using Pandas in Python 3
(`notebooks/school-metadata-merge.ipynb`) and merged with the original tournaments file.

In addition to the above data columns, the `tourney-metadata` CSV includes the following data columns:
- `school_full_name` is the official school name (e.g. University of California Los Angeles instead of UCLA)
- `team` is the school mascot 
- `city` is the school's city
- `state` is the school's state	
- `type` is the type of institution, e.g. private or public
- `conference` is the NCAA conference that the team belongs to, e.g. Southeastern Conference


#### Geocoding

Having the school and site locations is only the first step in determining the distance between the two. 
These location addresses must be geocoded to find their latitude and longitude, which can then be used to calculate the 
distances. First, the school addresses and site locations must be concatenated into a single string to create a generic 
address, e.g. Gonzaga University Spokane Washington. For schools, the `school_full_name`, `city`, and `state` columns are 
concatenated. For the site locations, the original data (the city and state) is copied over directly.

Because geocoding is a time consuming process and an open source tool is being used, the inputs should be limited as 
much as possible. To reduce the number of addresses to geocode, the dataset can be filtered for only the unique addresses 
and merged back into the full dataset.

Leveraging the Python 3 [geocoder](https://geocoder.readthedocs.io/) package, each unique location is passed 
into the open source [OpenStreetMap](https://geocoder.readthedocs.io/providers/OpenStreetMap.html) geocoder 
(`notebooks/geocode.ipynb`). Once geocoding failures are identified, they are manually fixed and run again, resulting in 
a full geocoded dataset. 


#### Distance calculation

Having the school and site location coordinates, distances can be calculated between the two for each data point 
(`notebooks/distance-calculation.ipynb`) utilizing the haversine formula, which calculates the shortest possible distance
between two points. Matching the school location with the site through 
the matching id, distance was calculated between the points. The school and site datasets were saved as separate CSVs.

#### Analysis

The final results were aggregated in several different ways:
1. Overall averages (minimum, maximum, mean, median, and count) for all schools from 1985 - 2019
2. Overall averages **by seed** for all schools
3. Averages **by school**
4. Averages **by seed and school** 
5. Averages **by conference**

Weights were also applied to the distances to normalize the data. Making apples-to-apples comparisons amongst schools 
based on their mean travel distance is not optimal - travel distances are expected to fluctuate based on the frequency 
of appearances of each seed in a school's history.

To allow for more accurate comparison amongst schools, weights were applied based on seed values.
* 1 seeds: 1.00
* 2 seeds: 0.73
* 3 seeds: 0.51
* 4 seeds: 0.43

The weights are derived from the overall seed averages. Based on data from 1985 to 2019, 2 seeds
travel ~1.3 times farther than 1 seeds (353/482 = 0.73), 3 seeds travel nearly double the distance of 1
seeds (353/689 = 0.51), and 4 seeds travel ~2.3 times farther than 1 seeds (353/829 = 0.43).


#### Sources

Seeding and Selection Process:
* [Historical NCAA March Madness statistics](https://www.sports-reference.com/cbb/postseason/)
* [Selection Committee Rules](https://www.ncaa.com/news/basketball-men/article/2018-10-19/how-field-68-teams-picked-march-madness)

Tournament Statistics:
* [Scores and Seeds 1985-2019](https://data.world/michaelaroy/ncaa-tournament-results/workspace/file?filename=Big_Dance_CSV.csv)
* [Region, Seeds, and Scores 1985-2016](https://data.world/sports/ncaa-mens-march-madness/workspace/file?filename=NCAA+Mens+March+Madness+Historical+Results.csv)
* [Region, Seeds, and Scores 1985-2018](https://data.world/sportsvizsunday/april-ncaa/workspace/file?filename=NCAA+Mens+Basketball+Results.csv)

Style:
* [Team colors 1](https://en.wikipedia.org/wiki/Module:College_color)
* [Team colors 2](https://teamcolorcodes.com/ncaa-color-codes/)
* [Team colors 3](https://usteamcolors.com/ncaa-division-1/)

Interactive Sports Maps:
* [College Football Fanbases](https://www.nytimes.com/interactive/2014/10/03/upshot/ncaa-football-map.html#5,42.944,-91.752)
* [All D1 College Basketball Teams](https://www.google.com/maps/d/u/0/viewer?dg=feature&ie=UTF8&oe=UTF8&msa=0&mid=1bXEv7hQrqKE6DccLudQ-oywpdZ0&ll=35.710909718852356%2C-113.24631124999996&z=4)
* [CBB Player Hometowns (app defunct)](http://www.thepostgame.com/every-ncaa-basketball-players-hometown-map)
* [North American Professional Championships](http://www.slate.com/articles/sports/sports_nut/2012/05/sports_championship_map_explore_every_championship_in_the_history_of_mlb_the_nba_the_nhl_and_the_nfl_.html)

Other Scrollytelling Maps:
* [Ridgecrest, CA Earthquakes](https://www.nytimes.com/interactive/2019/07/19/us/california-earthquakes.html)
* [Midwest Flooding](https://www.nytimes.com/interactive/2019/09/11/us/midwest-flooding.html?te=1&nl=morning-briefing&emc=edit_NN_p_20190912&section=topNews?campaign_id=9&instance_id=12323&segment_id=16950&user_id=f0e74355e8fe8b3573e180f2b848b4bd&regi_id=80404684tion=topNews)
* [Louisiana Toxic Air](https://projects.propublica.org/louisiana-toxic-air/)
* [Shape of Slavery](https://pudding.cool/2017/01/shape-of-slavery/)
* [North Korea Missile Range](https://www.abc.net.au/news/2017-10-16/north-korea-missile-range-map/8880894)
* [Earthquake Triggers](https://www.williamrchase.com/vizrisk/vizrisk_main/)
* [General Scrollytelling Examples](https://vallandingham.me/scroll_talk/examples/)


### B. Medium for Delivery

The map is an interactive, web browser-based application. It has responsive design and be accessible across multiple 
devices. The map is optimal for large browsers. The map explorer is limited in mobile.

#### Technology Stack

The web application is written in vanilla Javascript and utilizes various supplemental Javascript libraries and
frameworks. It leverages HTML, CSS, and Javascript for forming and styling the app.

**Frameworks and Toolkits**

[Bootstrap](https://getbootstrap.com/) is leveraged to create responsive design and UI components. 
[jQuery](https://jquery.com/) is used to handle events and dynamic styling of elements. 

**Style**

[Google Fonts](https://fonts.google.com/) is used for the application's font face. *****TBD*****
[Material](https://material.io/resources/icons/?style=baseline) is used for button icons.

**Map**

The map is built with [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/) - the story mode utilizes the [Mapbox
Storytelling](https://github.com/mapbox/storytelling) plugin. It also leverages[Turf.js](http://turfjs.org/) for 
additional geospatial formatting and analysis.

### C. Application Layout

Initial wireframes included below:

![Default map view mockup](wireframes/map1.jpg)

Figure 1 shows the initial mockup of the default view of the web application with the basic functionality of filters and
map interaction.

![Updated map view mockup](wireframes/map2.jpg)

Figure 2 shows an updated view of the application filters and highlight cards.

![Mobile mockup](wireframes/mobile.jpg)

Figure 3 shows a simple mobile mockup. The filters will be expandable from the top of the map and the highlight cards 
will be placed at the bottom of the map.

### D. Thematic Representation

Because the main subject matter of the map are point locations (schools and tournament sites) and distances between them,
the primary thematic representation are proportional circles and linestrings.

On load, each school is represented as a proportional circle based on its average distance traveled from 1985 to 
2019 (i.e. schools with lower average distances are represented by smaller circles than schools with higher average 
distances, which are larger). The user has the option to filter the data for several different summary 
statistics, such as the minimum and maximum distances traveled. The proportional circle radius correspond to the 
selected data filter.

Clicking on a school displays all of its site locations as a 1-4 seed from 1985-2019. These site locations are also 
represented as proportional circles, with higher seeds represented as smaller circles. The site locations also 
use a sequential color scheme (lighter blue = higher seed, darker blue = lower seed) to further signify the seed of 
each school that tournament year.

The distance of between the selected school and each tournament site is implicitly visualized with a simple linestring
extending from the school to the site. Longer distances are represented by longer linestrings.

### E. User Interaction

The map is broken into two sections: **Story Mode** and **Explorer Mode**.

**Toolbar** The toolbar at the top of the application is accessible during both story and explore modes. It includes
a button toggle to switch between modes. Additionally, while story mode is active, the toolbar includes a progress 
indicator/chapter selector in which the selected story chapter is highlighted orange. Hovering over each blue chapter
bar displays a tooltip indicating the chapter title; clicking the bar will jump to that chapter. 


**Story Mode**

In story mode, the user cannot interact with the map directly. Some story chapters have interactive elements in the 
scrolling text boxes, but the map itself is inaccessible.

The story gives background information about how seeding works and why it matters. It also shows some notable highlights
and fun data aggregations. It is geared toward basketball-beginners and fans who want to see highlights at a glance.

**Explorer Mode** 

In explorer mode, the user is able to interact with the web application through both the map and other user interface elements.

**Map**

The map is fully interactive with various click and mouseover event handlers. The default view of the map 
displays all schools that have been a 1-4 seed between 1985 and 2019. The user can click the school locations to toggle 
on the site locations associated with that school. This interaction will also trigger a visual affordance - the selected 
school's proportional circle opacity will increase and the unselected schools will be grayed out.

Clicking a school also updates a highlight card that displays some statistics for that school's tournament site 
analysis. Mousing over features (schools and sites) also toggles informational popups.

The user can return to the default view of the map by clicking the map icon button in the top right corner. A legend
can also be toggled in the bottom left corner of the map.

**Filters**

The user is able to customize their map selections through a variety of toggle and dropdown filters.

A switch toggle allows the user to easily select the weighted or unweighted distance analysis; the weighted analysis
adjusts distances based on the seed.

Dropdown menus for filtering options include:

- Statistics (mean, median, minimum, maximum, etc.)
- Seed (1, 2, 3, 4, all) 
- Conference (ACC, SEC, Big 10, etc.)
- Schools

Where applicable, selecting a filter automatically updates the map and vice versa, e.g. if the user selects a school
from the dropdown menu, the map pans and zooms to that school and its sites as though the user had clicked on the map.

**Highlight Cards**

Each view of the map has an information card with various highlights. The default view of the map shows 
highlights/statistics for all schools over the 1985-2019 period. Selecting a school will show highlights for only that 
school over the same time period. There is also an option to view highlights at the seed-level aggregation.


### F. Aesthetics and Design Considerations

The application design is simple, clean, and sleek. The color schemes reference the NCAA's official March 
Madness logos, which are variable but consistently utilize blues, oranges, and neutrals (black, white, and gray):

![March Madness Logo 1](images/marchmadness1.jpeg) 

![March Madness Logo 2](images/marchmadness2.png)

The UI is fairly simple and unfussy. The map itself had a variety of interactions and affordances, so the rest of 
the application is kept clean.

### G. Conclusion

Higher ranked teams, on average, do travel shorter distances than lower ranked teams in the first round of March Madness.

One seeds traveled an average of 353 miles.

Two seeds traveled an average of 482 miles.

Three seeds traveled an average of 689 miles.

Four seeds traveled an average of 829 miles.

Furthermore, when considering geographically clustered conferences, it appears that **centrally-located teams travel
shorter distances than Eastern/Western coastal teams**.

---
#### Planned Work

* Adjust responsive design (especially in story mode)
* Add option to compare two school directly in explore mode
* Rework March Madness terminology

#### Future Considerations

* Add a toggle to shift between the overall school analysis and a year by year map view of each tournament. 
* Add logos for each tournament year, as well as mascots or team logos
* Adjust weights based on seed averages
* Potential way to consider East vs. West bias?
    * Create hexbin map with fairly large bins (covering large regions of the US, e.g. Pacific NW, West, Southwest, etc.)
    * Count total number of schools (ALL D1 schools?) within each bin, divide by total to create weight for each region
    * Apply region and weight to distances
* Add final scores, W/L, region, championship site, school averages, etc.
* Add heatmap-like underlay for distance to each point?
* Add a count slider to adjust based on number of tournament appearances
* Find significant upsets and correlate/associate with distance?
* Use orange (more than avg) and blue (less than avg) proportional circles at default view - upon clicking school, 
school average is shown with fill and overall average shown with dotted line?
