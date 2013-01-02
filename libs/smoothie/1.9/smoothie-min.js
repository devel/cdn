// MIT License:
//
// Copyright (c) 2010-2011, Joe Walnes
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/**
 * Smoothie Charts - http://smoothiecharts.org/
 * (c) 2010-2012, Joe Walnes
 *
 * v1.0: Main charting library, by Joe Walnes
 * v1.1: Auto scaling of axis, by Neil Dunn
 * v1.2: fps (frames per second) option, by Mathias Petterson
 * v1.3: Fix for divide by zero, by Paul Nikitochkin
 * v1.4: Set minimum, top-scale padding, remove timeseries, add optional timer to reset bounds, by Kelley Reynolds
 * v1.5: Set default frames per second to 50... smoother.
 *       .start(), .stop() methods for conserving CPU, by Dmitry Vyal
 *       options.iterpolation = 'bezier' or 'line', by Dmitry Vyal
 *       options.maxValue to fix scale, by Dmitry Vyal
 * v1.6: minValue/maxValue will always get converted to floats, by Przemek Matylla
 * v1.7: options.grid.fillStyle may be a transparent color, by Dmitry A. Shashkin
 *       Smooth rescaling, by Kostas Michalopoulos
 * v1.8: Set max length to customize number of live points in the dataset with options.maxDataSetLength, by Krishna Narni
 * v1.9: Display timestamps along the bottom, by Nick and Stev-io
 *       (https://groups.google.com/forum/?fromgroups#!topic/smoothie-charts/-Ywse8FCpKI%5B1-25%5D)
 *       Refactored by Krishna Narni, to support timestamp formatting function
 */function TimeSeries(a){a=a||{},a.resetBoundsInterval=a.resetBoundsInterval||3e3,a.resetBounds=a.resetBounds===undefined?!0:a.resetBounds,this.options=a,this.data=[],this.maxValue=Number.NaN,this.minValue=Number.NaN,a.resetBounds&&(this.boundsTimer=setInterval(function(a){return function(){a.resetBounds()}}(this),a.resetBoundsInterval))}function SmoothieChart(a){a=a||{},a.grid=a.grid||{fillStyle:"#000000",strokeStyle:"#777777",lineWidth:1,millisPerLine:1e3,verticalSections:2},a.millisPerPixel=a.millisPerPixel||20,a.fps=a.fps||50,a.maxValueScale=a.maxValueScale||1,a.minValue=a.minValue,a.maxValue=a.maxValue,a.labels=a.labels||{fillStyle:"#ffffff"},a.interpolation=a.interpolation||"bezier",a.scaleSmoothing=a.scaleSmoothing||.125,a.maxDataSetLength=a.maxDataSetLength||2,a.timestampFormatter=a.timestampFormatter||null,this.options=a,this.seriesSet=[],this.currentValueRange=1,this.currentVisMinValue=0}TimeSeries.prototype.resetBounds=function(){this.maxValue=Number.NaN,this.minValue=Number.NaN;for(var a=0;a<this.data.length;a++)this.maxValue=isNaN(this.maxValue)?this.data[a][1]:Math.max(this.maxValue,this.data[a][1]),this.minValue=isNaN(this.minValue)?this.data[a][1]:Math.min(this.minValue,this.data[a][1])},TimeSeries.prototype.append=function(a,b){this.data.push([a,b]),this.maxValue=isNaN(this.maxValue)?b:Math.max(this.maxValue,b),this.minValue=isNaN(this.minValue)?b:Math.min(this.minValue,b)},SmoothieChart.prototype.addTimeSeries=function(a,b){this.seriesSet.push({timeSeries:a,options:b||{}})},SmoothieChart.prototype.removeTimeSeries=function(a){this.seriesSet.splice(this.seriesSet.indexOf(a),1)},SmoothieChart.prototype.streamTo=function(a,b){var c=this;this.render_on_tick=function(){c.render(a,(new Date).getTime()-(b||0))},this.start()},SmoothieChart.prototype.start=function(){this.timer||(this.timer=setInterval(this.render_on_tick,1e3/this.options.fps))},SmoothieChart.prototype.stop=function(){this.timer&&(clearInterval(this.timer),this.timer=undefined)},SmoothieChart.timeFormatter=function(a){function b(a){return(a<10?"0":"")+a}return b(a.getHours())+":"+b(a.getMinutes())+":"+b(a.getSeconds())},SmoothieChart.prototype.render=function(a,b){var c=a.getContext("2d"),d=this.options,e={top:0,left:0,width:a.clientWidth,height:a.clientHeight};c.save(),b-=b%d.millisPerPixel,c.translate(e.left,e.top),c.beginPath(),c.rect(0,0,e.width,e.height),c.clip(),c.save(),c.fillStyle=d.grid.fillStyle,c.clearRect(0,0,e.width,e.height),c.fillRect(0,0,e.width,e.height),c.restore(),c.save(),c.lineWidth=d.grid.lineWidth||1,c.strokeStyle=d.grid.strokeStyle||"#ffffff";if(d.grid.millisPerLine>0)for(var f=b-b%d.grid.millisPerLine;f>=b-e.width*d.millisPerPixel;f-=d.grid.millisPerLine){c.beginPath();var g=Math.round(e.width-(b-f)/d.millisPerPixel);c.moveTo(g,0),c.lineTo(g,e.height),c.stroke();if(d.timestampFormatter){var h=new Date(f),i=d.timestampFormatter(h),j=c.measureText(i).width/2+c.measureText(F).width+4;g<e.width-j&&(c.fillStyle=d.labels.fillStyle,c.fillText(i,g-c.measureText(i).width/2,e.height-2))}c.closePath()}for(var k=1;k<d.grid.verticalSections;k++){var l=Math.round(k*e.height/d.grid.verticalSections);c.beginPath(),c.moveTo(0,l),c.lineTo(e.width,l),c.stroke(),c.closePath()}c.beginPath(),c.strokeRect(0,0,e.width,e.height),c.closePath(),c.restore();var m=Number.NaN,n=Number.NaN;for(var o=0;o<this.seriesSet.length;o++){var p=this.seriesSet[o].timeSeries;isNaN(p.maxValue)||(m=isNaN(m)?p.maxValue:Math.max(m,p.maxValue)),isNaN(p.minValue)||(n=isNaN(n)?p.minValue:Math.min(n,p.minValue))}if(isNaN(m)&&isNaN(n)){c.restore();return}d.maxValue!=null?m=d.maxValue:m*=d.maxValueScale,d.minValue!=null&&(n=d.minValue);var q=m-n;this.currentValueRange+=d.scaleSmoothing*(q-this.currentValueRange),this.currentVisMinValue+=d.scaleSmoothing*(n-this.currentVisMinValue);var r=this.currentValueRange,s=this.currentVisMinValue;for(var o=0;o<this.seriesSet.length;o++){c.save();var p=this.seriesSet[o].timeSeries,t=p.data,u=this.seriesSet[o].options;while(t.length>=d.maxDataSetLength&&t[1][0]<b-e.width*d.millisPerPixel)t.splice(0,1);c.lineWidth=u.lineWidth||1,c.fillStyle=u.fillStyle,c.strokeStyle=u.strokeStyle||"#ffffff",c.beginPath();var v=0,w=0,x=0;for(var y=0;y<t.length;y++){var z=Math.round(e.width-(b-t[y][0])/d.millisPerPixel),A=t[y][1],B=A-s,C=e.height-(r?Math.round(B/r*e.height):0),D=Math.max(Math.min(C,e.height-1),1);if(y==0)v=z,c.moveTo(z,D);else switch(d.interpolation){case"line":c.lineTo(z,D);break;case"bezier":default:c.bezierCurveTo(Math.round((w+z)/2),x,Math.round(w+z)/2,D,z,D)}w=z,x=D}t.length>0&&u.fillStyle&&(c.lineTo(e.width+u.lineWidth+1,x),c.lineTo(e.width+u.lineWidth+1,e.height+u.lineWidth+1),c.lineTo(v,e.height+u.lineWidth),c.fill()),c.stroke(),c.closePath(),c.restore()}if(!d.labels.disabled){c.fillStyle=d.labels.fillStyle;var E=parseFloat(m).toFixed(2),F=parseFloat(n).toFixed(2);c.fillText(E,e.width-c.measureText(E).width-2,10),c.fillText(F,e.width-c.measureText(F).width-2,e.height-2)}c.restore()};