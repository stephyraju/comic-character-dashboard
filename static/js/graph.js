queue()
  .defer(d3.json, 'static/data/characters.json')
  .await(makeGraphs);
  
function makeGraphs(error, charactersData) {
  var ndx = crossfilter(charactersData);
  
   // Convert data attributes to integers.
   
  charactersData.forEach(function(d) {
    d.appearances = parseInt(d.appearances);
    if (isNaN(d.appearances)) {
      d.appearances = 0;
    }
  });
  
   // Call the functions for each individual graph.
  
  gender_selector(ndx);
  show_alignment(ndx);
  show_identity(ndx);
  show_gender_percent(ndx, ['male'], '#male-percent');
  show_gender_percent(ndx, ['female'], '#female-percent');
  show_gender_percent(ndx, ['genderless','transgender','unknown'], '#others-percent');//grouped three values to one
  show_numberOfAppearance(ndx);
  show_eyeColor(ndx);
  show_hairColor(ndx);
  show_alive(ndx);
  show_listCharacters(ndx);

  dc.renderAll();
}

/*----------Helper Functions-----------*/

//To remove empty values from grouped data//
//remove_blanks function is taken from Code Institute student Dave Laffan-superhero-dashboard//

function remove_blanks(group, value_to_remove) {
  return {
    all: function() {
      return group.all().filter(function(d) {
        return d.key !== value_to_remove;
      });
    }
  };
}

/*------------Gender count and Percentage ---------*/

function gender_selector(ndx) {
  var genderDim = ndx.dimension(dc.pluck('sex'));
  var genderGroup = genderDim.group();

  dc.selectMenu('#genderPercent')
    .dimension(genderDim)
    .group(genderGroup);
}

function show_gender_percent(ndx, listOfValues, element) {
  var genderPercent = ndx.groupAll().reduce(
    // Sum totals for each gender type
    function(p, v) {
      p.total++;
      if (listOfValues.includes(v.sex)) {
        p.sex_count++;
      }
      return p;
    },
    function(p, v) {
      p.total--;
      if (listOfValues.includes(v.sex)) {
        p.sex_count--;
      }
      return p;
    },
    function() {
      return { total: 0, sex_count: 0 };
    }
  );

  dc.numberDisplay(element)
    .formatNumber(d3.format('.2%')) // format number as percentage
    .valueAccessor(function(d) {
      if (d.sex_count == 0) {
        return 0;
      }
      else {
        return (d.sex_count / d.total);
      }
    })
    .group(genderPercent);
}

 /*-----------------Pie Chart Identity ---------------*/

function show_identity(ndx) {
  var dim = ndx.dimension(dc.pluck('id'));
  var group = remove_blanks(dim.group(), "");
  
   var pieColors = d3.scale.ordinal()
   .range(['#e9ab18', '#4682B4','#ADDFAD']);

  dc.pieChart("#identity")
   .height(250)
   .width(400)
   .radius(100)
   .transitionDuration(1000)
   .colors(pieColors)
   .dimension(dim)
   .group(group)
   .useViewBoxResizing(true)
   .legend(dc.legend().x(300).y(10).itemHeight(10).gap(10));
}

/*--------------Align Barchart---------*/

function show_alignment(ndx) {
  //Counting each align group
  function alignmentByGender(dimension, align) {
    return dimension.group().reduce(
      function (p, v) {
        p.total++;
        if (v.align === align) {
          p.match++;
        }
        return p;
      },
      function (p, v) {
        p.total--;
        if (v.align === align) {
          p.match--;
        }
        return p;
      },
      function () {
        return { total: 0, match: 0 };
      }
    );
  }
   // stacked barchart to show number of characters who are good / bad / neutral
  
  var alignmentColors = d3.scale.ordinal()
    .range(['#e9ab18', '#4682B4','#0E9E8D']);  

  var dim = ndx.dimension(dc.pluck('sex'));
  var goodByGender = alignmentByGender(dim, 'good characters'); 
  var badByGender = alignmentByGender(dim, 'bad characters');
  var neutralByGender = alignmentByGender(dim, 'neutral characters');
  
  dc.barChart("#bar-alignment")
    .height(350)
    .width(550)
    .useViewBoxResizing(true) //to make the chart responsive
    .dimension(dim)
    .group(goodByGender, 'Good')
    .stack(badByGender, 'Bad')
    .stack(neutralByGender, 'Neutral')
    .valueAccessor(function (d) {
      if(d.value.total > 0) {
        return Math.round((d.value.match / d.value.total) * 100);
          
      } else {
        return 0;
      }
      return Math.round(d.value.percent * 100); 
    })
    .renderTitle(true)
    .title(function (d) {
      return d.key + " " + Math.round((d.value.match / d.value.total) * 100) + '%';
        })
    .colors(alignmentColors)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel('Gender')
    .legend(dc.legend().x(490).y(10).itemHeight(15).gap(10))
    .margins({top: 10, right: 100, bottom: 80, left: 120});
}

/*--------------------scatterplot--------------*/

function show_numberOfAppearance(ndx) {
  var genderColors = d3.scale.ordinal()
    .domain(['female', 'male'])
    .range(['pink', 'blue']);
  
  var yearDim = ndx.dimension(function (d) {
    return d.year;
  }); 
    
  var xyearDim = ndx.dimension(function(d){
    return [d.year, d.appearances, d.sex, d.name];
  });
  
  var yearAppearanceGroup = xyearDim.group();
  var minYear = yearDim.bottom(1)[0].year;
  var maxYear = yearDim.top(1)[0].year;

  dc.scatterPlot('#appearance')
    .height(450)
    .width(750)
    .x(d3.scale.linear().domain([minYear,maxYear]))
    .brushOn(false)
    .symbolSize(8)
    .clipPadding(10)
    .elasticX(true)
    .xAxisLabel("Year")
    .elasticY(true)
    .yAxisLabel("Apperarance")
    .title(function (d) {
      return d.key[3] + ":" + d.key[1] + " " + 'appearances';
    })
    .colorAccessor(function (d) {
      return d.key[2];
    })
    .colors(genderColors)
    .dimension(yearDim)
    .group(yearAppearanceGroup)
    .margins({top: 10, right: 50, bottom: 80, left: 55});
}
 /*------------------Alive Bar chart-----------*/
 
function show_alive(ndx) {
  var dim = ndx.dimension(dc.pluck('alive'));
  var group = remove_blanks(dim.group(), "");
  
  var aliveColors = d3.scale.ordinal()
    .range(['#4682B4']);

  dc.barChart('#bar-alive')
    .height(350)
    .width(250)
    .useViewBoxResizing(true)
    .colors(aliveColors)
    .dimension(dim)
    .group(group)
    .transitionDuration(1000)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .elasticY(false)
    .xAxisLabel("Alive")
    .margins({top: 10,right: 40,bottom: 50,left: 80})
    .yAxis()
    .ticks(10);
}

/*------------------Eye Color Pie Chart-----------*/

function show_eyeColor(ndx) {
  var pieColors = d3.scale.ordinal()
    .range(['#4682B4','#8C6746','black', '#B1AA4E',	'#FF4500','#ADDFAD','#e9ab18', '#F2BC79', '#B2762D', '#DCAB6E']);
  
  var dim = ndx.dimension(dc.pluck('eye'));
  var group = remove_blanks(dim.group(), "");
  
  dc.pieChart('#eye-color')
   .height(300)
   .width(550)
   .innerRadius(50)
   .radius(125)
   .transitionDuration(1000)
   .colors(pieColors)
   .dimension(dim)
   .group(group)
   .useViewBoxResizing(true)
   .legend(dc.legend().x(430).y(10).itemHeight(12).gap(5));
}
 
 /*------------------Hair Color Pie Chart-----------*/

 function show_hairColor(ndx) {
   
   var pieColors = d3.scale.ordinal()
    .range(['black','#8C6746','#e9ab18', '#FF4500','#ADDFAD', '#5A87A0','#F2BC79', '#8C6746', '#B1AA4E', '#B2762D', '#DCAB6E']);
  
  var dim = ndx.dimension(dc.pluck("hair"));
  var group = remove_blanks(dim.group(), "");
  
  dc.pieChart('#hair-color')
   .height(300)
   .width(550)
   .innerRadius(50)
   .radius(125)
   .transitionDuration(1000)
   .colors(pieColors)
   .dimension(dim)
   .group(group)
   .useViewBoxResizing(true)
   .legend(dc.legend().x(430).y(10).itemHeight(12).gap(5));
 } 
 
/*------------------List of characters Table-----------*/
  
 function show_listCharacters(ndx) {
  var dataTable = dc.dataTable('#all-characters');
  var dim = ndx.dimension(dc.pluck('name'));
  var resultStart = 0;
  var resultEnd = 101;

  function updateResult() {
    function displayResult() {
      document.getElementById('start').innerHTML = resultStart;
      document.getElementById('end').innerHTML = resultStart + resultEnd-1;
      document.getElementById('totalSize').innerHTML = ndx.size();
      d3.select('#prev').attr('disabled', resultStart-resultEnd < 0 ? 'true' : null);
      d3.select('#next').attr('disabled', resultStart+resultEnd >= ndx.size() ? 'true' : null);
   }
  
    dataTable.beginSlice(resultStart);
    dataTable.endSlice(resultStart + resultEnd);
    displayResult();
  }

  dataTable
    .dimension(dim)
    .group(function(d) {
      return "";
    })
    .columns(['name', 'urlslug', 'first appearance'])
    .size(Infinity)
    .sortBy(dc.pluck('name')) // This line of code is corrected by stackoverflow
    .order(d3.ascending)
    .transitionDuration(1000);

  updateResult();

  $('#prev').click(function() {
    resultStart -= resultEnd;
    updateResult();
    dataTable.redraw();
  });

  $('#next').click(function() {
    resultStart += resultEnd;
    updateResult();
    dataTable.redraw();
  });
}