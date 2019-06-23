queue()
    .defer(d3.json, 'static/data/characters.json')
    .await(makeGraphs);
    
function makeGraphs(error, charactersData) {
    var ndx = crossfilter(charactersData);
    
    
    charactersData.forEach(function(d){
        
        d.appearances = parseInt(d.appearances);
        d.first_appearance=parseInt(d.first-appearance);
      
    });
    

    show_alignment(ndx);
    show_identity(ndx);
    gender_selector(ndx);
    show_gender_percent(ndx, 'male characters', '#male-percent');
    show_gender_percent(ndx, 'female characters', '#female-percent');
    show_gender_percent(ndx, 'genderless characters', '#others-percent');
    show_numberOfAppearance(ndx);
    show_eyeColor(ndx);
    show_hairColor(ndx);
    show_alive(ndx);
    
    
    dc.renderAll();

}

/*----------Helper Functions-----------*/

// Reset All Button //

$('#reset-all').click(function() {
    dc.filterAll();
    dc.renderAll();
});


//To remove empty values from grouped data//

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
    var genderGroup = remove_blanks(genderDim.group(), "");

    dc.selectMenu('#genderPercent')
        .dimension(genderDim)
        .group(genderGroup);
}

function show_gender_percent(ndx, sex, element) {
    var genderPercent = ndx.groupAll().reduce(
        // Sum totals for each gender type
        function(p, v) {
            p.total++;
            if (v.sex === sex) {
                p.sex_count++;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if (v.sex === sex) {
                p.sex_count--;
            }
            return p;
        },
        function() {
            return { total: 0, sex_count: 0 };
        }
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format('.2%'))
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









/*--------------Align Barchart---------*/

function show_alignment(ndx) {
    
      //Counting each align group

    function alignmentByGender(dimension, align) {
        return dimension.group().reduce(
            function (p, v) {
                p.total++;
                if (v.align === align) {
                    p.match++;
                };
                return p;
            },
            function (p, v) {
                p.total--;
                if (v.align === align) {
                    p.match--;
                };
                return p;
            },
            function () {
                return { total: 0, match: 0 }
            }
            
        );
        
    };
     // stacked barchart to show number of characters who are good / bad / neutral
    
    var alignmentColors = d3.scale.ordinal()
        .range(['#e9ab18', '#4682B4','#ADDFAD']);
   

    var dim = ndx.dimension(dc.pluck("sex"));
  //  var genderGroup = remove_blanks(dim.group(), "");
    var goodByGender = alignmentByGender(dim, "good characters"); 
    var badByGender = alignmentByGender(dim, "bad characters");
    var neutralByGender = alignmentByGender(dim, "neutral characters");
  
    dc.barChart("#bar-alignment")
        .width(350)
        .height(300)
        .dimension(dim)
        .group(goodByGender, "Good")
        .stack(badByGender, "Bad")
        .stack(neutralByGender, "Neutral")
        .valueAccessor(function (d) {
            if(d.value.total > 0) {
                return (d.value.match / d.value.total) * 100
            } else {
                return 0;
            }
            return d.value.percent * 100;
        })
        .colors(alignmentColors)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Gender")
        .legend(dc.legend().x(290).y(170).itemHeight(15).gap(5))
        .margins({top: 10, right: 100, bottom: 60, left: 30});
}

 /*-----------------Pie Chart Identity -----------------------*/

function show_identity(ndx) {
    var dim = ndx.dimension(dc.pluck("id"));
    var group = remove_blanks(dim.group(), "");
    

    dc.pieChart("#identity")
      .height(300)
      .width(350)
      .radius(125)
      .transitionDuration(1000)
      .dimension(dim)
      .group(group)
      .legend(dc.legend().gap(7));
  }  



/*--------------------scatterplot-------*/

function show_numberOfAppearance(ndx) {
     
      var genderColors = d3.scale.ordinal()
        .domain(["female", "male"])
        .range(["pink", "blue"]);
        
      var yearDim = ndx.dimension(function (d) {
      return d.year;
      
       });  
        
      var xyearDim = ndx.dimension(function(d){
        return [d.year, d.appearances, d.sex];
       });
       
       var yearAppearanceGroup = xyearDim.group();
    
       var minYear = yearDim.bottom(1)[0].year;
       var maxYear = yearDim.top(1)[0].year;
    
    dc.scatterPlot("#appearance")
        .width(800)
        .height(400)
        .x(d3.scale.linear().domain([minYear,maxYear]))
        .brushOn(false)
        .symbolSize(8)
        .clipPadding(10)
        .elasticX(true)
        .xAxisLabel("Year")
        .elasticY(true)
        .yAxisLabel("Apperarance")
        .title(function (d) {
            return d.key[1] + " appearances ";
        })
        
        .colorAccessor(function (d) {
            return d.key[2];
        })
        .colors(genderColors)
        .dimension(yearDim)
        .group(yearAppearanceGroup)
        .margins({top: 10, right: 50, bottom: 75, left: 75});
       
}
/*------------------Eye Color Pie Chart-----------*/

 function show_eyeColor(ndx) {
     
     var pieColors = d3.scale.ordinal()
        .range(['#4682B4','#8C6746','black', '#B1AA4E',	'#FF4500','#ADDFAD','#e9ab18', '#F2BC79', '#B2762D', '#DCAB6E']);
   
    var dim = ndx.dimension(dc.pluck("eye"));
    var group = remove_blanks(dim.group(), "");
    
    dc.pieChart("#eye-color")
      .height(300)
      .width(500)
      .innerRadius(50)
      .radius(125)
      .transitionDuration(1000)
      .colors(pieColors)
      .dimension(dim)
      .group(group)
      .legend(dc.legend().x(400).y(10).itemHeight(12).gap(5));
      
  }  
  
  /*------------------Hair Color Pie Chart-----------*/

 function show_hairColor(ndx) {
     
     var pieColors = d3.scale.ordinal()
        .range(['black','#8C6746','#e9ab18', '#FF4500','#ADDFAD', '#5A87A0','#F2BC79', '#8C6746', '#B1AA4E', '#B2762D', '#DCAB6E']);
   
    var dim = ndx.dimension(dc.pluck("hair"));
    var group = remove_blanks(dim.group(), "");
    
    dc.pieChart("#hair-color")
      .height(300)
      .width(500)
      .innerRadius(50)
      .radius(125)
      .transitionDuration(1000)
      .colors(pieColors)
      .dimension(dim)
      .group(group)
      .legend(dc.legend().x(400).y(10).itemHeight(12).gap(5));
      
  }  
  /*------------------Alive Bar chart-----------*/
  
   function show_alive(ndx) {
    var dim = ndx.dimension(dc.pluck("alive"));
    var group = remove_blanks(dim.group(), "");
    
     var aliveColors = d3.scale.ordinal()
        .range(['#4682B4']);
   
   
    dc.barChart("#bar-alive")
      .width(200)
      .height(400)
      .margins({top: 10,right: 10,bottom: 30,left: 30})
      .colors(aliveColors)
      .dimension(dim)
      .group(group)
      .transitionDuration(1000)
      .x(d3.scale.ordinal())
      .xUnits(dc.units.ordinal)
      .elasticY(false)
      .xAxisLabel("Alive")
      .yAxis()
      .ticks(10);
   }
   
   