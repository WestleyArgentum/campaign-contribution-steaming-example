
var fs = require('fs'),
    express = require('express'),
    app = express();

// load in the contribution data
var contributions = fs.readFileSync(__dirname + '/contribution-vis/data/contributions.json');
contributions = JSON.parse(contributions);

app.use(express.static(__dirname + '/contribution-vis'));

app.get('/contributions', function(req, res) {
    var lastSeen = parseInt(req.query.lastSeen, 10) || -1,
        max = parseInt(req.query.max, 10) || 10,
        rangeStart = lastSeen + 1,
        rangeEnd = Math.min(rangeStart + max, contributions.length);

    res.status(200).json({
        contributions: contributions.slice(rangeStart, rangeEnd),
        lastSeen: rangeEnd - 1,
        existsMore: rangeEnd < contributions.length
    });
});

app.listen(8000);
