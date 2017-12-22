var CanvasChart = function () {
    var ctx;
    var margin = { top: 40, left: 75, right: 0, bottom: 75 };
    var chartHeight, chartWidth, yMax, xMax, data;
    var maxYValue = 0;
    var maxXValue = 0;
    var minXValue=0;
    var ratio = 0;
    var ratioX = 0;
    var renderType = { lines: 'lines', points: 'points' };
    var tipCanvas;
    var dots = [];

    var render = function(canvasId, dataObj) {
        tipCanvas = document.getElementById("tip");

        document.getElementById(canvasId).addEventListener('mousemove', function(e) {
            handleMouseMove(e,dataObj.dataPoints);
          });

        data = dataObj;
        getMaxDataYValue();
        var canvas = document.getElementById(canvasId);
        chartHeight = canvas.getAttribute('height');
        chartWidth = canvas.getAttribute('width');
        canvas.width=chartWidth;
        xMax = chartWidth - (margin.left + margin.right);
        yMax = chartHeight - (margin.top + margin.bottom);
        ratio = yMax / maxYValue;
        ratioX =  xMax/maxXValue;
        ctx = canvas.getContext("2d");
        renderChart();
    };

    var renderChart = function () {
        renderLinesAndLabels();

        //render data based upon type of renderType(s) that client supplies
        if (data.renderTypes == undefined || data.renderTypes == null) data.renderTypes = [renderType.lines];
        for (var i = 0; i < data.renderTypes.length; i++) {
            renderData(data.renderTypes[i]);
        }
    };

    var getMaxDataYValue = function () {
        for (var i = 0; i < data.dataPoints.length; i++) {
            if (data.dataPoints[i].x > maxXValue) maxXValue = data.dataPoints[i].x;
            if (data.dataPoints[i].x < minXValue) minXValue = data.dataPoints[i].x;

        }
        maxYValue = data.dataPoints.length;
    };

    var renderLinesAndLabels = function () {
        //Vertical guide lines
        var yInc = (yMax - margin.top)/ data.dataPoints.length;
        var yPos = 0;
        var yLabelInc = (maxYValue * ratio) / data.dataPoints.length;
        var xInc = getXInc();
        var xPos = margin.left;
        for (var i = 0; i < data.dataPoints.length; i++) {
            yPos += (i == 0) ? margin.top : yInc;

            if(yPos <= yMax)
            {
                //Draw horizontal lines
                drawLine(margin.left, yPos, xMax, yPos, '#E8E8E8');

                //y axis labels
                ctx.font = (data.dataPointFont != null) ? data.dataPointFont : '10pt Calibri';
                //var txt = Math.round(maxYValue - ((i == 0) ? 0 : yPos / ratio));

                var yDate = new Date(data.dataPoints[i].y.toString());

                var txt = yDate.getDate() 
                + "-" + (yDate.getMonth() + 1)
                + "-" + yDate.getFullYear();
                var txtSize = ctx.measureText(txt);
                ctx.fillText(txt, margin.left - ((txtSize.width >= 14) ? txtSize.width : 10) - 7, yPos + 4);
            }
            //x axis labels
            if(xPos <= xMax)
            {                
                //xPos += (i == 0) ? margin.left : xInc;
                // txt = data.dataPoints[i].x;
                var txt = Math.round(maxXValue- (maxXValue - ((i == 0) ? 0 : xPos/ ratioX)));
                txtSize = ctx.measureText(txt);
                //To avoid mixing texts for large data, set alternate label bit dowanwards.
                if((i%2) == 0)
                {
                    ctx.fillText(txt, xPos, yMax + (margin.bottom / 2));
                }
                else
                {
                    ctx.fillText(txt, xPos, yMax + (margin.bottom / 3));
                }
            
                //Draw verticle lines            
                drawLine(xPos, margin.top, xPos, yMax,'#E8E8E8');
             }

            xPos += xInc;
        }

        //Vertical line
        drawLine(margin.left, margin.top, margin.left, yMax, 'black');

        //Horizontal Line
        drawLine(margin.left, yMax, xMax, yMax, 'black');
    };

    var renderData = function(type) {
        dots = [];
        var xInc = getXInc();
        var yInc = (yMax - margin.top)/ data.dataPoints.length;
        var prevX = 0, 
            prevY = 0;
            
        for (var i = 0; i < data.dataPoints.length; i++) {
            var pt = data.dataPoints[i];
            // var ptY = (maxYValue - pt.y) * ratio;
            var ptY = (i*yInc) + margin.top;
            if (ptY < margin.top) ptY = margin.top;            
            if (ptY > yMax) ptY = yMax;

            //var ptX = (i * xInc) + margin.left;
            var ptX = (((maxXValue - (maxXValue - pt.x)) * ratioX) < margin.left) ? margin.left : ((maxXValue - (maxXValue - pt.x)) * ratioX);
            if (ptX > xMax) ptX = xMax;

            if (i > 0 && type == renderType.lines) {
                //Draw connecting lines
                drawLine(ptX, ptY, prevX, prevY, 'black', 2);
            }

            if (type == renderType.points) {
                var radgrad = ctx.createRadialGradient(ptX, ptY, 2, ptX - 5, ptY - 5, 0);
                /*radgrad.addColorStop(0, 'Green');
                radgrad.addColorStop(0.9, 'White');*/
                ctx.beginPath();
                ctx.fillStyle = radgrad;
                //Render circle
                ctx.arc(ptX, ptY, 2, 0, 2 * Math.PI, false)
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#000';
                ctx.stroke();
                ctx.closePath();
            }

            // define tooltips for each data point
            var yDate = new Date(pt.y.toString());

            var tooltipTxt = yDate.getDate() 
            + "-" + (yDate.getMonth() + 1)
            + "-" + yDate.getFullYear();

    dots.push({
        x: ptX,
        y: ptY,
        r: 4,
        rXr: 16,
        color: "red",
        tip: pt.x + "," + tooltipTxt
    });

            prevX = ptX;
            prevY = ptY;
        }
    };

    var getXInc = function() {
        return Math.round((xMax) / data.dataPoints.length) - 1;
    };

    var drawLine = function(startX, startY, endX, endY, strokeStyle, lineWidth) {
        if (strokeStyle != null) ctx.strokeStyle = strokeStyle;
        if (lineWidth != null) ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.closePath();
    };

    

    // show tooltip when mouse hovers over dot
var handleMouseMove = function (e, data) {
    var canvasOffset = $("#linechartCanvas").offset();
    var  inputDivHeight =parseInt(document.getElementById("inputdiv").offsetHeight);

    var offsetX = canvasOffset.left;
    var offsetY = canvasOffset.top;
    var tipCtx = tipCanvas.getContext("2d");

    mouseX = parseInt(e.pageX - offsetX);
    mouseY = parseInt(e.pageY -  offsetY);
    
    // Put your mousemove stuff here
    var hit = false;
    for (var i = 0; i < dots.length; i++) {
        var dot = dots[i];
        var dx = mouseX - dot.x;
        var dy = mouseY - dot.y;
        if (dx * dx + dy * dy < dot.rXr) {
            tipCanvas.style.left = (dot.x-20) + 'px';
            tipCanvas.style.top =  (dot.y + (inputDivHeight - 10)) + 'px'; 
            tipCanvas.style.position = "absolute";

            tipCtx.clearRect(0, 0, tipCanvas.width, tipCanvas.height); 
            //                  tipCtx.rect(0,0,tipCanvas.width,tipCanvas.height);
            tipCtx.fillText(dot.tip, 5, 15);
            hit = true;
        }
    }
    if (!hit) {
        tipCanvas.style.left = "-200px";
    }
}

    return {
        renderType: renderType,
        render: render
    };
} ();

exports.CanvasChart = CanvasChart;