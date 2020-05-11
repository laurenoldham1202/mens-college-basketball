const config = {
    style: 'mapbox://styles/laurenoldham1202/ck9d9t3360puw1ilehqxfc0oa',
    accessToken: 'pk.eyJ1IjoibGF1cmVub2xkaGFtMTIwMiIsImEiOiJjaW55dm9lemUxOGc1dWttMzI5dDI5aGtvIn0.3xAukiULCDm0OId5yIgXOA',
    showMarkers: false,
    theme: 'light',
    alignment: 'left',
    title: 'March Madness',
    subtitle: 'Distance of Top Seeded Schools',
    byline: '',
    footer: 'Map created by Lauren Oldham',
    chapters: [
        {
            id: 'intro',
            // title: 'Introduction placeholder',
            // image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/2015-06-19_Glacier_National_Park_%28U.S.%29_8633.jpg/800px-2015-06-19_Glacier_National_Park_%28U.S.%29_8633.jpg',
            description: `Every year in March, the top 68 Division 1 men's college basketball programs are selected to compete for the NCAA's national championship title in a single-elimination competition colloquially called March Madness. While the selection process and tournament format for March Madness have changed considerably since its inception in 1939, countless fans have become devoted to understanding and predicting the tournament field in the study of 'Bracketology.' The modern era of the tournament began in 1985 with a final field of 64 teams and preferential seeding to determine the year's bracket.`,
            location: {
                center: [-112.5, 41.5],
                zoom: 3.75,
                pitch: 0.00,
                bearing: 0.00,
            },
            onChapterEnter: [
                {
                    layer: 'gnpglaciers-1998',
                    opacity: 0.25
                },
                {
                    layer: 'glaciernp-boundary',
                    opacity: 0.25
                }
            ],
            onChapterExit: [
                {
                    layer: 'gnpglaciers-1998',
                    opacity: 0.25
                },
                {
                    layer: 'glaciernp-boundary',
                    opacity: 0
                }
            ]
        },
        {
            id: 'chapter-1',
            // title: 'More details',
            image: '',
            description: `In theory, higher ranked teams are rewarded by playing the lowest ranked teams in the tournament. Furthermore, according to the NCAA's selection process, top seeded teams are to have geographic preference over lower seeded teams in the first two rounds of the tournament (if possible - other factors are considered). I want to analyze the first/second round sites for each of the top 4 seeded teams (four teams in each seed for 16 total top teams each year) from 1985 to 2020 to establish patterns, potential biases, and test the NCAA's claim of geographic preference.`,
            location: {
                center: [-113.72917, 48.58938],
                zoom: 12.92,
                pitch: 39.50,
                bearing: 36.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'chapter-2',
            title: '',
            image: '',
            description: `Obsessed with so-called 'chaos,' college basketball fans thrive on the unpredictability of the first and second rounds of the NCAA tournament. While higher ranked/seeded teams are expected to make deep runs, it is not uncommon for them to get upset by lower ranked teams (sorry UVA fans). Teams want every advantage they can entering the first weekend of the tournament. The advantage of playing at a site closer to the school location is both pragmatic and psychological. The players are still attending classes, so it is logistically easier to travel shorter distances. Furthermore, playing closer to the school allows the team's fan base and families a better opportunity to watch them play, giving them as much of a home court advantage as possible.`,

             //  `The entire field of teams is ranked 1 to 68, with 1 being the top or best team overall, and 68
             // being the lowest/worst. The teams are further divided into four regions of sixteen teams each (only 64
             // teams make the official bracket), with top teams having higher seeds (1-4) and worse teams having lower
             // seeds (5-16). The NCAA Selection Committee rewards the best performing teams in the field by pitting them
             // against the worst performing teams through this system, wherein a better team plays against a worse team to
             // help pave an easier path to the National Championship game.`,

            location: {
                center: [-113.72917, 48.58938],
                zoom: 12.92,
                pitch: 39.50,
                bearing: 36.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'chapter-3',
            title: '',
            image: '',
            description: `When looking at raw euclidean distances, the data falls in line with the NCAA's claim of 
            geographic preference for higher seeds, with 1 seeds averaging the shortest travel distance, 2 seeds averaging
            the second shortest travel distance, 3 seeds average the third shortest travel distance, and 4 seeds traveling
            the furthest of all seeds.
            
            <ul>
            <li>1: 376.4681913845625</li>
            <li>2: 513.247101929549</li>
            <li>3: 742.7582078752471</li>
            <li>4: 922.6727014730162</li>
            </ul>
            `,
            location: {
                center: [-113.72917, 48.58938],
                zoom: 12.92,
                pitch: 39.50,
                bearing: 36.00
            },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'chapter-4',
            title: '',
            image: '',
            description: `One seeds averaged a travel distance of roughly 376 miles, approximately the same distance from
            Minneapolis, Minnesota to Kansas City, Missouri, where 1 seed University of Minnesota Golden Gophers played in 1997.
            `,
            // location: {
            //     center: [-113.72917, 48.58938],
            //     zoom: 12.92,
            //     pitch: 39.50,
            //     bearing: 36.00
            // },
            onChapterEnter: [],
            onChapterExit: []
        },
        {
            id: 'final-chapter',
            title: '',
            image: '',
            description: ``,
            location: {
                center: [-113.72917, 48.58938],
                zoom: 12.92,
                pitch: 39.50,
                bearing: 36.00
            },
            onChapterEnter: [],
            onChapterExit: []
        }
    ]
};
