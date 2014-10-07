$(function () {
    var contribChart;

    var industryNames = {};
    var industryIndexes = [];

    var contribTable = [
        {
            name: '2010',
            data: []
        },
        {
            name: '2012',
            data: []
        },
        {
            name: '2014',
            data: []
        }
    ];

    var moneyFormatter = d3.format('$,.0f');

    function arrayObjectIndexOf(a, value, property) {
        for(var i = 0, len = a.length; i < len; i++) {
            if (a[i][property] === value) return i;
        }
        return -1;
    }

    function createContribChart() {
        return new Contour({
            el: '.bar-grouped',

            chart: {
                height: 50 * industryIndexes.length,
                padding: {
                    left: 450,
                }
            },

            xAxis: {
                labels: { formatter:
                    function (ind) { return industryNames[industryIndexes[ind]]; }
                } 
            },

            yAxis: {
                // Log scale isn't perfect for this visualization because it sometimes
                // makes it hard to appriciate the magnitudes of difference between
                // years of contributions. But it is probably the best that we can do,
                // if we want to be able to compare the contributions of deep pocketed
                // industries alongside less-well-off ones.
                type: 'log'
            },

            tooltip: {
                formatter: function (d) {
                    return industryNames[industryIndexes[d.x]] + '<br>' + moneyFormatter(d.y);
                }
            },

            legend: {
                vAlign: 'bottom',
                hAlign: 'left',
                direction: 'horizontal'
            }
        })
        .cartesian()
        .horizontal()
        .bar(contribTable)
        .legend(contribTable)
        .tooltip()
        .render();
    }

    function updateContribChart(data) {
        for (var i = 0; i < data.length; ++i) {
            var record = data[i];
            var year = contribTable[arrayObjectIndexOf(contribTable, record.Cycle.toString(), 'name')];
            var industryIndex = industryIndexes.indexOf(record.RealCode);

            if (industryIndex > -1) {
                year.data[industryIndex] += record.Amount;
            }
        }

        if (!contribChart) {
            contribChart = createContribChart();
        } else {
            contribChart.setData(contribTable).render();
        }
    }

    function fetchContribs(data) {
        updateContribChart(data.contributions);

        if (data.existsMore) {
            $.get('/contributions', { lastSeen: data.lastSeen, max: 12000 }, fetchContribs);
        }
    }

    function setupContributions() {
        for (var i = 0; i < 3; ++i) {
            contribTable[i].data = _.range(0, industryIndexes.length, 0);
        }

        $.get('/contributions', { max: 12000 }, fetchContribs);
    }

    function setupIndustries(data) {
        industryNames = data;
        industryIndexes = Object.getOwnPropertyNames(industryNames);   
    }

    function setup() {
        // pull in data about industries, then start pulling in contributions
        $.get('/data/industries.json', function (data) {
            setupIndustries(data);
            setupContributions(); 
        });
    }

    setup();
});
