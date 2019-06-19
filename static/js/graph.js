queue()
    .defer(d3.json, 'static/data/characters.json')
    .await(makeGraphs);
    
function makeGraphs(error, charactersData) {
    var ndx = crossfilter(charactersData);
    

    show_alignment(ndx);
    
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
