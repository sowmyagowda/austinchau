  var googlechart = {};

  googlechart.Chart = function(type, title, width, height, color) {
    this.baseUrl = 'http://chart.apis.google.com/chart?';
    this.type = type;
    this.title = title;
    this.width = width;
    this.height = height;
    this.color = color;

    this.dataMap = {};
    this.dataMapTotal = 0;
  }

  googlechart.Chart.prototype.addData = function(name, label) {
    if (name in this.dataMap) {
      this.dataMap[name].count++;
    } else {
      var newData = {};
      newData.id = name;
      newData.label = label;
      newData.count = 1;
      this.dataMap[name] = newData;
    }
    
    this.dataMapTotal++;
    
  }

  googlechart.Chart.prototype.getChartUrl = function() {

    var finalUrl = [];

    finalUrl.push(this.baseUrl);

    // chart type
    finalUrl.push('cht=');
    finalUrl.push(this.type); 

    // dimension
    finalUrl.push('&amp;');
    finalUrl.push('chs=');
    finalUrl.push(this.width);
    finalUrl.push('x');
    finalUrl.push(this.height);
    
    // colors
    var colors = [];
    if (this.color) {
      colors.push(this.color);
    }
    finalUrl.push('&amp;');
    finalUrl.push('chco=');
    finalUrl.push(colors.join(',')); 
    
    var percentData = [];
    var labelData = [];

    for (var id in this.dataMap) {
      var data = this.dataMap[id];
      data.percent = ((data.count / this.dataMapTotal) * 100).toFixed(2);
      percentData.push(data.percent);
      labelData.push(data.label + ' ' + data.percent + '%');
    }

    finalUrl.push('&amp;'); 
    finalUrl.push('chd=t:');
    finalUrl.push(percentData.join(','));

    finalUrl.push('&amp;');
    finalUrl.push('chl=');
    finalUrl.push(encodeURI(labelData.join('|')));          
    
    // title
    finalUrl.push('&amp;');
    finalUrl.push('chtt=');
    finalUrl.push(encodeURIComponent(this.title + ' (Total: ' + this.dataMapTotal + ')'));

    return finalUrl.join('');

  }

  googlechart.getChartUrl = function(chart) {

    var baseUrl = 'http://chart.apis.google.com/chart?';
    var finalUrl = [];

    finalUrl.push(baseUrl);

    // chart type
    finalUrl.push('cht=');
    finalUrl.push(chart.type); 

    // dimension
    finalUrl.push('&amp;');
    finalUrl.push('chs=');
    finalUrl.push(chart.width);
    finalUrl.push('x');
    finalUrl.push(chart.height);
    
    // colors
    var colors = [];
    if (chart.color) {
      colors.push(chart.color);
    }
    finalUrl.push('&amp;');
    finalUrl.push('chco=');
    finalUrl.push(colors.join(',')); 
     
    // data & label
    var chartData = {};
    var totalCount = chart.items.length;
    
    for (var i = 0; i < chart.items.length; i++ ) {
      
      var item = chart.items[i];
      var itemName = item.name;

      if (!(itemName in chartData)) {      
        var data = {};
        data.id = itemName;
        data.label = item.label;
        data.count = 1;
        chartData[data.id] = data;
      } else {
        var data = chartData[itemName];
        data.count++;
      }                  
    }

    var percentData = [];
    var labelData = [];

    for (dataId in chartData) {
      var data = chartData[dataId];

      data.percent = ((data.count / totalCount) * 100).toFixed(2);
      percentData.push(data.percent);
      labelData.push(data.label + ' ' + data.percent + '%');
    }

    finalUrl.push('&amp;'); 
    finalUrl.push('chd=t:');
    finalUrl.push(percentData.join(','));

    finalUrl.push('&amp;');
    finalUrl.push('chl=');
    finalUrl.push(encodeURI(labelData.join('|')));          
    
    // title
    finalUrl.push('&amp;');
    finalUrl.push('chtt=');
    finalUrl.push(encodeURIComponent(chart.title + ' (Total: ' + totalCount + ')'));

    return finalUrl.join('');
  }

  googlechart.createPieChart = function(chart) {

    var baseUrl = 'http://chart.apis.google.com/chart?';
    var chartType = 'p3';
    var finalUrl = [];

    finalUrl.push(baseUrl);

    // chart type
    finalUrl.push('cht=');
    finalUrl.push(chartType); 

    // dimension
    finalUrl.push('&amp;');
    finalUrl.push('chs=');
    finalUrl.push(chart.width);
    finalUrl.push('x');
    finalUrl.push(chart.height);
    
    // title
    finalUrl.push('&amp;');
    finalUrl.push('chtt=');
    finalUrl.push(encodeURIComponent(chart.title));
    
    // colors
    var colors = [];
    if (chart.color) {
      colors.push(chart.color);
    } else {
      for (var i=0;i<chart.data.length ;i++ ) {
        var color = chart.data[i].color;
        colors.push(color);
      }
    }
    finalUrl.push('&amp;');
    finalUrl.push('chco=');
    finalUrl.push(colors.join(',')); 
     
    // labels
    var labels = [];
    for (var i=0;i<chart.data.length ;i++ ) {
      labels.push(chart.data[i].label);
    }
    finalUrl.push('&amp;');
    finalUrl.push('chl=');
    finalUrl.push(encodeURI(labels.join('|')));          
    
    // data
    var data = [];
    for (var i=0;i<chart.data.length ;i++ ) {
      data.push(chart.data[i].percent);
    }
    finalUrl.push('&amp;'); 
    finalUrl.push('chd=t:');
    finalUrl.push(data.join(','));

    return finalUrl.join('');
  }

  googlechart.createLineChart = function() {
    var baseUrl = 'http://chart.apis.google.com/chart?';

    var title = 'Austin Chau';
    var chartType = 's';
    var dimension = [500, 300]; // width and height    

    var finalUrl = [];

    var dataX = [20, 40, 30];
    var dataY = [40, 100, 30];

    var colors = ['00ff00','ff0000','0000ff'];
    var legends = ['first set of data'];
    var labelX = ['A', 'B', 'C'];

    finalUrl.push(baseUrl);

    finalUrl.push('&amp;');
    finalUrl.push('chtt=');
    finalUrl.push(encodeURIComponent(title));

    finalUrl.push('&amp;');
    finalUrl.push('chxt=');
    finalUrl.push('x,y');

    finalUrl.push('&amp;');
    finalUrl.push('chco=');
    finalUrl.push(colors.join(',')); 
     
    finalUrl.push('&amp;');
    finalUrl.push('chdl=');
    finalUrl.push(encodeURI(legends.join(',')));          

    finalUrl.push('&amp;');
    finalUrl.push('chs=');
    finalUrl.push(dimension[0]);
    finalUrl.push('x');
    finalUrl.push(dimension[1]);

    finalUrl.push('&amp;');
    finalUrl.push('cht=');
    finalUrl.push(chartType);
    
    // axie label
    finalUrl.push('&amp;');
    finalUrl.push('chxt:x,y');
    finalUrl.push('&amp;');
    finalUrl.push('chxl=');
    finalUrl.push('0:|');
    finalUrl.push(labelX.join('|'));    
    // axie position
    finalUrl.push('&amp;');
    finalUrl.push('chxp=');
    finalUrl.push('0,');
    finalUrl.push(dataX.join(','));    

    finalUrl.push('&amp;');
    finalUrl.push('chd=t:');
    finalUrl.push(dataX.join(','));
    finalUrl.push('|');
    finalUrl.push(dataY.join(','));   

    return finalUrl.join('');
  }
   
  googlechart.simpleEncode = function(values) {
   
    var simpleEncoding = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    var chartData = ['s:'];
      for (var i = 0; i < values.length; i++) {
        var currentValue = values[i];
        if (!isNaN(currentValue) && currentValue >= 0) {
          chartData.push(simpleEncoding.charAt(currentValue));
        } else {
          chartData.push('_');
        }
      }
    return chartData.join('');
  }
