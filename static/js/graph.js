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
    show_numberOfAppearance(ndx);
    
    dc.renderAll();

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
        .range(['#e9ab18', '#ADDFAD', '#5A87A0']);
   

    var dim = ndx.dimension(dc.pluck("sex"));
  //  var genderGroup = remove_blanks(dim.group(), "");
    var goodByGender = alignmentByGender(dim, "good characters"); 
    var badByGender = alignmentByGender(dim, "bad characters");
    var neutralByGender = alignmentByGender(dim, "neutral characters");
  
    dc.barChart("#bar-alignment")
        .width(350)
        .height(250)
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
        .legend(dc.legend().x(270).y(170).itemHeight(15).gap(5))
        .margins({top: 10, right: 100, bottom: 30, left: 30});
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
