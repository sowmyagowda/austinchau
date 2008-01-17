(function() {
  
  var createPieChart = function() {
    var baseUrl = 'http://chart.apis.google.com/chart?';

    var title = 'Austin Chau';
    var chartType = 'p3';
    var dimension = [500, 300]; // width and height    

    var finalUrl = [];

    var data = [20, 30, 50];

    var colors = ['00ff00'];
    var labels = ['A', 'B', 'C'];

    finalUrl.push(baseUrl);

    // dimension
    finalUrl.push('&amp;');
    finalUrl.push('chs=');
    finalUrl.push(dimension[0]);
    finalUrl.push('x');
    finalUrl.push(dimension[1]);
    
    // title
    finalUrl.push('&amp;');
    finalUrl.push('chtt=');
    finalUrl.push(encodeURIComponent(title));
    
    // color
    finalUrl.push('&amp;');
    finalUrl.push('chco=');
    finalUrl.push(colors.join(',')); 
     
    // legend
    finalUrl.push('&amp;');
    finalUrl.push('chl=');
    finalUrl.push(encodeURI(labels.join('|')));          
    
    // chart type
    finalUrl.push('&amp;');
    finalUrl.push('cht=');
    finalUrl.push(chartType);   

    // data
    finalUrl.push('&amp;'); 
    finalUrl.push('chd=t:');
    finalUrl.push(data.join(','));


    return finalUrl.join('');
  }

  var createLineChart = function() {
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
   
  function simpleEncode(values) {
   
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

  $('document').ready(function() {
    
    var url = createLineChart();
    var image = '<img src="' + url +'">';    
    $('#display').append(url + '<br>');
    $('#display').append(image + '<br>');

    url = createPieChart();
    image = '<img src="' + url +'">';    
    $('#display').append(url + '<br>');
    $('#display').append(image + '<br>');


  });

})();
