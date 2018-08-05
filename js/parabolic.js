// SVG.js
var draw = SVG('drawing');

var DataChange = function() {
    // draw the thing
    $('#frequency-span').text(frequency.getValue());
    $('#points-span').text(points.getValue());

    draw.clear();

    var p = points.getValue();
    var f = frequency.getValue();
    var angle = 360 / p;
    var anglerad = angle * Math.PI / 180;
    var radius = $('#drawing').height() / 2;
    var step = radius / f;

    var lines = [];
    for (var i = 0; i < p; ++i) {
        var x = Math.sin(i * anglerad);
        var y = Math.cos(i * anglerad);

        var ex = radius + x * radius;
        var ey = radius + y * radius;

        lines.push(new Victor(x, y));

        draw.line(radius, radius, radius + radius * x, radius + radius * y).stroke({ width: 1 });
    }

    for (var i = 0; i < p; ++i) {
        var vec1 = lines[i];
        var vec2 = lines[(i + 1) % lines.length];

        for (var n = 0; n < f; ++n) {
            var s = radius * ((1 / f) * (n + 1));
            var e = radius * (1 - (1 / f) * n);
            
            draw.line(radius + vec1.x * s, radius + vec1.y * s, radius + vec2.x * e, radius + vec2.y * e).stroke({ width: 1 });
        }
    }
    $('#svgsource').text(draw.svg());
    $('#drawingimg').attr("src", "data:image/svg+xml;base64," + btoa(draw.svg()));
};

var points = $('#points-slider').slider()
		.on('slide', DataChange)
        .data('slider');
        
var frequency = $('#frequency-slider').slider()
        .on('slide', DataChange)
        .data('slider');

DataChange();

var saveSVG = function() {
    var svg = draw.svg();
    var preface = '<?xml version="1.0" standalone="no"?>\r\n';
    var svgBlob = new Blob([preface, svg], {type:"image/svg+xml;charset=utf-8"});
    var svgUrl = URL.createObjectURL(svgBlob);
    var downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = "para.svg";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
};
