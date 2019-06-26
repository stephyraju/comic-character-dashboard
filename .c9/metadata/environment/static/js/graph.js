{"changed":true,"filter":false,"title":"graph.js","tooltip":"/static/js/graph.js","value":"queue()\n    .defer(d3.json, 'static/data/characters.json')\n    .await(makeGraphs);\n    \nfunction makeGraphs(error, charactersData) {\n    var ndx = crossfilter(charactersData);\n    \n   \n    \n    charactersData.forEach(function(d){\n        \n        d.appearances = parseInt(d.appearances);\n        d.first_appearance=parseInt(d.first-appearance);\n      \n    });\n    console.log();\n\n    show_alignment(ndx);\n    show_identity(ndx);\n    gender_selector(ndx);\n    show_gender_percent(ndx, 'male characters', '#male-percent');\n    show_gender_percent(ndx, 'female characters', '#female-percent');\n    show_gender_percent(ndx, 'genderless characters', '#others-percent');\n    show_numberOfAppearance(ndx);\n    show_eyeColor(ndx);\n    show_hairColor(ndx);\n    show_alive(ndx);\n    show_listCharacters(ndx);\n   \n    updateResult(ndx);\n   \n    \n    dc.renderAll();\n\n}\n\n/*----------Helper Functions-----------*/\n\n\n\n\n//To remove empty values from grouped data//\n\nfunction remove_blanks(group, value_to_remove) {\n    \n    return {\n        all: function() {\n            return group.all().filter(function(d) {\n                return d.key !== value_to_remove;\n            });\n        }\n    };\n}\n\n/*------------Gender count and Percentage ---------*/\n\nfunction gender_selector(ndx) {\n    var genderDim = ndx.dimension(dc.pluck('sex'));\n    var genderGroup = remove_blanks(genderDim.group(), \"\");\n\n    dc.selectMenu('#genderPercent')\n        .dimension(genderDim)\n        .group(genderGroup);\n}\n\nfunction show_gender_percent(ndx, sex, element) {\n    var genderPercent = ndx.groupAll().reduce(\n        // Sum totals for each gender type\n        function(p, v) {\n            p.total++;\n            if (v.sex === sex) {\n                p.sex_count++;\n            }\n            return p;\n        },\n        function(p, v) {\n            p.total--;\n            if (v.sex === sex) {\n                p.sex_count--;\n            }\n            return p;\n        },\n        function() {\n            return { total: 0, sex_count: 0 };\n        }\n    );\n\n    dc.numberDisplay(element)\n        .formatNumber(d3.format('.2%'))\n        .valueAccessor(function(d) {\n            if (d.sex_count == 0) {\n                return 0;\n            }\n            else {\n                return (d.sex_count / d.total);\n            }\n        })\n        .group(genderPercent);\n}\n\n\n/*--------------Align Barchart---------*/\n\nfunction show_alignment(ndx) {\n    \n      //Counting each align group\n\n    function alignmentByGender(dimension, align) {\n        return dimension.group().reduce(\n            function (p, v) {\n                p.total++;\n                if (v.align === align) {\n                    p.match++;\n                };\n                return p;\n            },\n            function (p, v) {\n                p.total--;\n                if (v.align === align) {\n                    p.match--;\n                };\n                return p;\n            },\n            function () {\n                return { total: 0, match: 0 }\n            }\n            \n        );\n        \n    };\n     // stacked barchart to show number of characters who are good / bad / neutral\n    \n    var alignmentColors = d3.scale.ordinal()\n        .range(['#e9ab18', '#4682B4','#0E9E8D']);   //,'#ADDFAD'\n   \n\n    var dim = ndx.dimension(dc.pluck(\"sex\"));\n  //  var genderGroup = remove_blanks(dim.group(), \"\");\n    var goodByGender = alignmentByGender(dim, \"good characters\"); \n    var badByGender = alignmentByGender(dim, \"bad characters\");\n    var neutralByGender = alignmentByGender(dim, \"neutral characters\");\n  \n    dc.barChart(\"#bar-alignment\")\n        \n        .height(300)\n        .width(350)\n        //.useViewBoxResizing(true) //to make the chart responsive\n         .centerBar(true)\n        .dimension(dim)\n        .group(goodByGender, \"Good\")\n        .stack(badByGender, \"Bad\")\n        .stack(neutralByGender, \"Neutral\")\n        .valueAccessor(function (d) {\n            if(d.value.total > 0) {\n                return (d.value.match / d.value.total) * 100\n            } else {\n                return 0;\n            }\n            return d.value.percent * 100;\n        })\n        .colors(alignmentColors)\n        .x(d3.scale.ordinal())\n        .xUnits(dc.units.ordinal)\n        .barPadding(0.2)\n        .xAxisLabel(\"Gender\")\n        .legend(dc.legend().x(290).y(170).itemHeight(15).gap(5))\n        .margins({top: 10, right: 100, bottom: 60, left: 30});\n       \n        \n}\n\n /*-----------------Pie Chart Identity -----------------------*/\n\nfunction show_identity(ndx) {\n    var dim = ndx.dimension(dc.pluck(\"id\"));\n    var group = remove_blanks(dim.group(), \"\");\n    \n     var pieColors = d3.scale.ordinal()\n      .range(['#e9ab18', '#4682B4','#ADDFAD']);\n\n    dc.pieChart(\"#identity\")\n      .height(250)\n      .width(400)\n      .radius(115)\n      .transitionDuration(1000)\n      .colors(pieColors)\n      .dimension(dim)\n      .group(group)\n      .legend(dc.legend().x(310).y(10).itemHeight(10).gap(5));\n  }  \n\n\n\n/*--------------------scatterplot--------------*/\n\nfunction show_numberOfAppearance(ndx) {\n     \n      var genderColors = d3.scale.ordinal()\n        .domain([\"female\", \"male\"])\n        .range([\"pink\", \"blue\"]);\n        \n      var yearDim = ndx.dimension(function (d) {\n      return d.year;\n      \n       });  \n        \n      var xyearDim = ndx.dimension(function(d){\n        return [d.year, d.appearances, d.sex];\n       });\n       \n       var yearAppearanceGroup = xyearDim.group();\n    \n       var minYear = yearDim.bottom(1)[0].year;\n       var maxYear = yearDim.top(1)[0].year;\n    \n    dc.scatterPlot(\"#appearance\")\n        .width(800)\n        .height(400)\n        .x(d3.scale.linear().domain([minYear,maxYear]))\n        .brushOn(false)\n        .symbolSize(8)\n        .clipPadding(10)\n        .elasticX(true)\n        .xAxisLabel(\"Year\")\n        .elasticY(true)\n        .yAxisLabel(\"Apperarance\")\n        .title(function (d) {\n            return d.key[1] + \" appearances \";\n        })\n        \n        .colorAccessor(function (d) {\n            return d.key[2];\n        })\n        .colors(genderColors)\n        .dimension(yearDim)\n        .group(yearAppearanceGroup)\n        .margins({top: 10, right: 50, bottom: 75, left: 75});\n       \n}\n/*------------------Eye Color Pie Chart-----------*/\n\n function show_eyeColor(ndx) {\n     \n     var pieColors = d3.scale.ordinal()\n        .range(['#4682B4','#8C6746','black', '#B1AA4E',\t'#FF4500','#ADDFAD','#e9ab18', '#F2BC79', '#B2762D', '#DCAB6E']);\n   \n    var dim = ndx.dimension(dc.pluck(\"eye\"));\n    var group = remove_blanks(dim.group(), \"\");\n    \n    dc.pieChart(\"#eye-color\")\n      .height(300)\n      .width(500)\n      .innerRadius(50)\n      .radius(125)\n      .transitionDuration(1000)\n      .colors(pieColors)\n      .dimension(dim)\n      .group(group)\n      .legend(dc.legend().x(400).y(10).itemHeight(12).gap(5));\n      \n  }  \n  \n  /*------------------Hair Color Pie Chart-----------*/\n\n function show_hairColor(ndx) {\n     \n     var pieColors = d3.scale.ordinal()\n        .range(['black','#8C6746','#e9ab18', '#FF4500','#ADDFAD', '#5A87A0','#F2BC79', '#8C6746', '#B1AA4E', '#B2762D', '#DCAB6E']);\n   \n    var dim = ndx.dimension(dc.pluck(\"hair\"));\n    var group = remove_blanks(dim.group(), \"\");\n    \n    dc.pieChart(\"#hair-color\")\n      .height(300)\n      .width(500)\n      .innerRadius(50)\n      .radius(125)\n      .transitionDuration(1000)\n      .colors(pieColors)\n      .dimension(dim)\n      .group(group)\n      .legend(dc.legend().x(400).y(10).itemHeight(12).gap(5));\n      \n  }  \n  /*------------------Alive Bar chart-----------*/\n  \n   function show_alive(ndx) {\n    var dim = ndx.dimension(dc.pluck(\"alive\"));\n    var group = remove_blanks(dim.group(), \"\");\n    \n     var aliveColors = d3.scale.ordinal()\n        .range(['#4682B4']);\n   \n   \n    dc.barChart(\"#bar-alive\")\n      .width(200)\n      .height(400)\n      .margins({top: 10,right: 10,bottom: 30,left: 30})\n      .colors(aliveColors)\n      .dimension(dim)\n      .group(group)\n      \n      .transitionDuration(1000)\n      .x(d3.scale.ordinal())\n      .xUnits(dc.units.ordinal)\n      .elasticY(false)\n      .xAxisLabel(\"Alive\")\n      .yAxis()\n      .ticks(10);\n   }\n   \n   /*------------------List of characters-----------*/\n    \n   \n function show_listCharacters(ndx) {  \n   var dataTable = dc.dataTable(\"#all-characters\");\n  \n   var dim = ndx.dimension(dc.pluck(\"name\"));\n // console.log(dim.top(Infinity));\n  \n     dataTable\n     \n      .dimension(dim)\n      .group(function(d) {\n        return \"\";\n      })\n      .columns([\"name\", \"urlslug\", \"first appearance\"])\n      .size(Infinity)\n      .sortBy(dc.pluck(\"name\")) // This line of code is corrected by stackoverflow\n\n      .order(d3.ascending)\n      .transitionDuration(1000);\n     \n      \n       }\n  /*-----------------Table Pagination-----------*/\n  \n          var resultStart = 0; var resultEnd =21;\n          var ndx;\n          var dataTable = dc.dataTable;\n          \n          function displayResult() {\n            \n             \n            document.getElementById(\"start\").innerHTML = resultStart;\n            document.getElementById(\"end\").innerHTML = resultStart + resultEnd-1;\n\n            document.getElementById(\"totalSize\").innerHTML = ndx.size();\n\n\n            d3.select('#prev').attr('disabled', resultStart-resultEnd < 0 ? 'true' : null);\n            d3.select('#next').attr('disabled', resultStart+resultEnd >= ndx.size() ? 'true' : null);\n        }\n\n          function updateResult() {\n\n            dataTable.beginSlice(resultStart);\n            dataTable.endSlice(resultStart + resultEnd);\n            displayResult();\n        }\n\n        function prev() {\n          resultStart -= resultEnd;\n          updateResult();\n          dataTable.redraw();\n        }\n\n          function next() {\n            resultStart += resultEnd;\n            updateResult();\n            dataTable.redraw();\n        }","undoManager":{"mark":99,"position":100,"stack":[[{"start":{"row":166,"column":8},"end":{"row":166,"column":26},"action":"insert","lines":[".yAxis().ticks(6);"],"id":1108}],[{"start":{"row":166,"column":8},"end":{"row":166,"column":26},"action":"remove","lines":[".yAxis().ticks(6);"],"id":1109}],[{"start":{"row":162,"column":22},"end":{"row":162,"column":23},"action":"remove","lines":["3"],"id":1110}],[{"start":{"row":162,"column":22},"end":{"row":162,"column":23},"action":"insert","lines":["2"],"id":1111}],[{"start":{"row":145,"column":8},"end":{"row":146,"column":7},"action":"remove","lines":["","       "],"id":1112},{"start":{"row":145,"column":8},"end":{"row":146,"column":0},"action":"remove","lines":["",""]}],[{"start":{"row":145,"column":4},"end":{"row":145,"column":8},"action":"remove","lines":["    "],"id":1113},{"start":{"row":145,"column":0},"end":{"row":145,"column":4},"action":"remove","lines":["    "]}],[{"start":{"row":163,"column":61},"end":{"row":164,"column":0},"action":"insert","lines":["",""],"id":1114},{"start":{"row":164,"column":0},"end":{"row":164,"column":8},"action":"insert","lines":["        "]}],[{"start":{"row":164,"column":8},"end":{"row":164,"column":25},"action":"insert","lines":[".yAxis().ticks(6)"],"id":1115}],[{"start":{"row":163,"column":60},"end":{"row":163,"column":61},"action":"remove","lines":[";"],"id":1116}],[{"start":{"row":164,"column":25},"end":{"row":164,"column":26},"action":"insert","lines":[";"],"id":1117}],[{"start":{"row":164,"column":7},"end":{"row":164,"column":26},"action":"remove","lines":[" .yAxis().ticks(6);"],"id":1118}],[{"start":{"row":163,"column":60},"end":{"row":163,"column":61},"action":"insert","lines":[";"],"id":1120}],[{"start":{"row":163,"column":35},"end":{"row":163,"column":36},"action":"remove","lines":["0"],"id":1121},{"start":{"row":163,"column":34},"end":{"row":163,"column":35},"action":"remove","lines":["1"]}],[{"start":{"row":163,"column":45},"end":{"row":163,"column":46},"action":"remove","lines":["5"],"id":1122},{"start":{"row":163,"column":44},"end":{"row":163,"column":45},"action":"remove","lines":["5"]}],[{"start":{"row":163,"column":44},"end":{"row":163,"column":45},"action":"insert","lines":["6"],"id":1123},{"start":{"row":163,"column":45},"end":{"row":163,"column":46},"action":"insert","lines":["0"]}],[{"start":{"row":163,"column":34},"end":{"row":163,"column":35},"action":"insert","lines":["1"],"id":1124},{"start":{"row":163,"column":35},"end":{"row":163,"column":36},"action":"insert","lines":["0"]},{"start":{"row":163,"column":36},"end":{"row":163,"column":37},"action":"insert","lines":["0"]}],[{"start":{"row":144,"column":20},"end":{"row":145,"column":0},"action":"insert","lines":["",""],"id":1125},{"start":{"row":145,"column":0},"end":{"row":145,"column":8},"action":"insert","lines":["        "]},{"start":{"row":145,"column":8},"end":{"row":145,"column":9},"action":"insert","lines":["w"]},{"start":{"row":145,"column":9},"end":{"row":145,"column":10},"action":"insert","lines":["i"]}],[{"start":{"row":145,"column":9},"end":{"row":145,"column":10},"action":"remove","lines":["i"],"id":1126},{"start":{"row":145,"column":8},"end":{"row":145,"column":9},"action":"remove","lines":["w"]}],[{"start":{"row":145,"column":8},"end":{"row":145,"column":9},"action":"insert","lines":["."],"id":1127},{"start":{"row":145,"column":9},"end":{"row":145,"column":10},"action":"insert","lines":["w"]},{"start":{"row":145,"column":10},"end":{"row":145,"column":11},"action":"insert","lines":["i"]}],[{"start":{"row":145,"column":11},"end":{"row":145,"column":12},"action":"insert","lines":["d"],"id":1128},{"start":{"row":145,"column":12},"end":{"row":145,"column":13},"action":"insert","lines":["t"]},{"start":{"row":145,"column":13},"end":{"row":145,"column":14},"action":"insert","lines":["h"]}],[{"start":{"row":145,"column":14},"end":{"row":145,"column":16},"action":"insert","lines":["()"],"id":1129}],[{"start":{"row":145,"column":15},"end":{"row":145,"column":16},"action":"insert","lines":["3"],"id":1130},{"start":{"row":145,"column":16},"end":{"row":145,"column":17},"action":"insert","lines":["5"]},{"start":{"row":145,"column":17},"end":{"row":145,"column":18},"action":"insert","lines":["0"]}],[{"start":{"row":145,"column":19},"end":{"row":146,"column":0},"action":"insert","lines":["",""],"id":1131},{"start":{"row":146,"column":0},"end":{"row":146,"column":8},"action":"insert","lines":["        "]}],[{"start":{"row":146,"column":8},"end":{"row":146,"column":64},"action":"insert","lines":[".useViewBoxResizing(true) //to make the chart responsive"],"id":1132}],[{"start":{"row":146,"column":7},"end":{"row":146,"column":8},"action":"insert","lines":["/"],"id":1133},{"start":{"row":146,"column":8},"end":{"row":146,"column":9},"action":"insert","lines":["/"]}],[{"start":{"row":164,"column":7},"end":{"row":164,"column":64},"action":"remove","lines":[" .legend(dc.legend().x(290).y(170).itemHeight(15).gap(5))"],"id":1134}],[{"start":{"row":164,"column":7},"end":{"row":164,"column":64},"action":"insert","lines":[" .legend(dc.legend().x(290).y(170).itemHeight(15).gap(5))"],"id":1135}],[{"start":{"row":164,"column":7},"end":{"row":164,"column":64},"action":"remove","lines":[" .legend(dc.legend().x(290).y(170).itemHeight(15).gap(5))"],"id":1136}],[{"start":{"row":146,"column":9},"end":{"row":146,"column":10},"action":"remove","lines":[" "],"id":1137},{"start":{"row":146,"column":8},"end":{"row":146,"column":9},"action":"remove","lines":["/"]},{"start":{"row":146,"column":7},"end":{"row":146,"column":8},"action":"remove","lines":["/"]}],[{"start":{"row":146,"column":7},"end":{"row":146,"column":8},"action":"insert","lines":[" "],"id":1138}],[{"start":{"row":146,"column":8},"end":{"row":146,"column":9},"action":"insert","lines":["/"],"id":1139},{"start":{"row":146,"column":9},"end":{"row":146,"column":10},"action":"insert","lines":["/"]}],[{"start":{"row":164,"column":7},"end":{"row":164,"column":64},"action":"insert","lines":[" .legend(dc.legend().x(290).y(170).itemHeight(15).gap(5))"],"id":1140}],[{"start":{"row":151,"column":7},"end":{"row":158,"column":10},"action":"remove","lines":[" .valueAccessor(function (d) {","            if(d.value.total > 0) {","                return (d.value.match / d.value.total) * 100","            } else {","                return 0;","            }","            return d.value.percent * 100;","        })"],"id":1141}],[{"start":{"row":151,"column":7},"end":{"row":158,"column":10},"action":"insert","lines":[" .valueAccessor(function (d) {","            if(d.value.total > 0) {","                return (d.value.match / d.value.total) * 100","            } else {","                return 0;","            }","            return d.value.percent * 100;","        })"],"id":1142}],[{"start":{"row":133,"column":47},"end":{"row":133,"column":48},"action":"insert","lines":["/"],"id":1143},{"start":{"row":133,"column":48},"end":{"row":133,"column":49},"action":"insert","lines":["/"]}],[{"start":{"row":133,"column":48},"end":{"row":133,"column":49},"action":"remove","lines":["/"],"id":1144},{"start":{"row":133,"column":47},"end":{"row":133,"column":48},"action":"remove","lines":["/"]}],[{"start":{"row":133,"column":46},"end":{"row":133,"column":56},"action":"remove","lines":[",'#ADDFAD'"],"id":1145}],[{"start":{"row":133,"column":49},"end":{"row":133,"column":50},"action":"insert","lines":[" "],"id":1146},{"start":{"row":133,"column":50},"end":{"row":133,"column":51},"action":"insert","lines":[" "]},{"start":{"row":133,"column":51},"end":{"row":133,"column":52},"action":"insert","lines":[" "]},{"start":{"row":133,"column":52},"end":{"row":133,"column":53},"action":"insert","lines":["/"]},{"start":{"row":133,"column":53},"end":{"row":133,"column":54},"action":"insert","lines":["/"]}],[{"start":{"row":133,"column":54},"end":{"row":133,"column":64},"action":"insert","lines":[",'#ADDFAD'"],"id":1147}],[{"start":{"row":163,"column":29},"end":{"row":164,"column":0},"action":"insert","lines":["",""],"id":1148},{"start":{"row":164,"column":0},"end":{"row":164,"column":8},"action":"insert","lines":["        "]},{"start":{"row":164,"column":8},"end":{"row":164,"column":9},"action":"insert","lines":["."]},{"start":{"row":164,"column":9},"end":{"row":164,"column":10},"action":"insert","lines":["e"]}],[{"start":{"row":164,"column":10},"end":{"row":164,"column":11},"action":"insert","lines":["l"],"id":1149},{"start":{"row":164,"column":11},"end":{"row":164,"column":12},"action":"insert","lines":["a"]},{"start":{"row":164,"column":12},"end":{"row":164,"column":13},"action":"insert","lines":["s"]},{"start":{"row":164,"column":13},"end":{"row":164,"column":14},"action":"insert","lines":["t"]},{"start":{"row":164,"column":14},"end":{"row":164,"column":15},"action":"insert","lines":["i"]},{"start":{"row":164,"column":15},"end":{"row":164,"column":16},"action":"insert","lines":["c"]}],[{"start":{"row":164,"column":9},"end":{"row":164,"column":16},"action":"remove","lines":["elastic"],"id":1150},{"start":{"row":164,"column":9},"end":{"row":164,"column":17},"action":"insert","lines":["elasticX"]}],[{"start":{"row":164,"column":17},"end":{"row":164,"column":19},"action":"insert","lines":["()"],"id":1151}],[{"start":{"row":164,"column":18},"end":{"row":164,"column":19},"action":"insert","lines":["t"],"id":1152},{"start":{"row":164,"column":19},"end":{"row":164,"column":20},"action":"insert","lines":["r"]},{"start":{"row":164,"column":20},"end":{"row":164,"column":21},"action":"insert","lines":["u"]},{"start":{"row":164,"column":21},"end":{"row":164,"column":22},"action":"insert","lines":["e"]}],[{"start":{"row":164,"column":7},"end":{"row":164,"column":23},"action":"remove","lines":[" .elasticX(true)"],"id":1153},{"start":{"row":164,"column":7},"end":{"row":165,"column":0},"action":"remove","lines":["",""]}],[{"start":{"row":164,"column":6},"end":{"row":164,"column":7},"action":"remove","lines":[" "],"id":1154},{"start":{"row":164,"column":5},"end":{"row":164,"column":6},"action":"remove","lines":[" "]},{"start":{"row":164,"column":4},"end":{"row":164,"column":5},"action":"remove","lines":[" "]},{"start":{"row":164,"column":0},"end":{"row":164,"column":4},"action":"remove","lines":["    "]}],[{"start":{"row":316,"column":1},"end":{"row":316,"column":2},"action":"insert","lines":["/"],"id":1155},{"start":{"row":316,"column":2},"end":{"row":316,"column":3},"action":"insert","lines":["/"]}],[{"start":{"row":337,"column":0},"end":{"row":337,"column":38},"action":"insert","lines":["var ndx = crossfilter(charactersData);"],"id":1156}],[{"start":{"row":337,"column":0},"end":{"row":337,"column":1},"action":"insert","lines":[" "],"id":1157},{"start":{"row":337,"column":1},"end":{"row":337,"column":2},"action":"insert","lines":[" "]},{"start":{"row":337,"column":2},"end":{"row":337,"column":3},"action":"insert","lines":[" "]},{"start":{"row":337,"column":3},"end":{"row":337,"column":4},"action":"insert","lines":[" "]},{"start":{"row":337,"column":4},"end":{"row":337,"column":5},"action":"insert","lines":[" "]},{"start":{"row":337,"column":5},"end":{"row":337,"column":6},"action":"insert","lines":[" "]},{"start":{"row":337,"column":6},"end":{"row":337,"column":7},"action":"insert","lines":[" "]},{"start":{"row":337,"column":7},"end":{"row":337,"column":8},"action":"insert","lines":[" "]},{"start":{"row":337,"column":8},"end":{"row":337,"column":9},"action":"insert","lines":[" "]},{"start":{"row":337,"column":9},"end":{"row":337,"column":10},"action":"insert","lines":[" "]}],[{"start":{"row":337,"column":10},"end":{"row":337,"column":11},"action":"insert","lines":[" "],"id":1158},{"start":{"row":337,"column":11},"end":{"row":337,"column":12},"action":"insert","lines":[" "]},{"start":{"row":337,"column":12},"end":{"row":337,"column":13},"action":"insert","lines":[" "]}],[{"start":{"row":337,"column":51},"end":{"row":338,"column":0},"action":"insert","lines":["",""],"id":1159},{"start":{"row":338,"column":0},"end":{"row":338,"column":13},"action":"insert","lines":["             "]}],[{"start":{"row":337,"column":12},"end":{"row":337,"column":51},"action":"remove","lines":[" var ndx = crossfilter(charactersData);"],"id":1160}],[{"start":{"row":333,"column":44},"end":{"row":333,"column":50},"action":"remove","lines":["----*/"],"id":1161}],[{"start":{"row":366,"column":9},"end":{"row":366,"column":15},"action":"insert","lines":["----*/"],"id":1162}],[{"start":{"row":310,"column":4},"end":{"row":310,"column":52},"action":"remove","lines":["var dataTable = dc.dataTable(\"#all-characters\");"],"id":1163}],[{"start":{"row":313,"column":4},"end":{"row":313,"column":52},"action":"insert","lines":["var dataTable = dc.dataTable(\"#all-characters\");"],"id":1164}],[{"start":{"row":315,"column":0},"end":{"row":315,"column":1},"action":"insert","lines":[" "],"id":1165}],[{"start":{"row":313,"column":2},"end":{"row":313,"column":3},"action":"remove","lines":[" "],"id":1166}],[{"start":{"row":366,"column":9},"end":{"row":366,"column":15},"action":"remove","lines":["----*/"],"id":1167}],[{"start":{"row":333,"column":44},"end":{"row":333,"column":50},"action":"insert","lines":["----*/"],"id":1168}],[{"start":{"row":333,"column":50},"end":{"row":334,"column":0},"action":"insert","lines":["",""],"id":1169},{"start":{"row":334,"column":0},"end":{"row":334,"column":2},"action":"insert","lines":["  "]}],[{"start":{"row":351,"column":0},"end":{"row":351,"column":28},"action":"insert","lines":["var dataTable = dc.dataTable"],"id":1170}],[{"start":{"row":351,"column":28},"end":{"row":351,"column":30},"action":"insert","lines":["()"],"id":1171}],[{"start":{"row":351,"column":29},"end":{"row":351,"column":30},"action":"insert","lines":["n"],"id":1172},{"start":{"row":351,"column":30},"end":{"row":351,"column":31},"action":"insert","lines":["d"]},{"start":{"row":351,"column":31},"end":{"row":351,"column":32},"action":"insert","lines":["x"]}],[{"start":{"row":351,"column":0},"end":{"row":351,"column":1},"action":"insert","lines":[" "],"id":1173},{"start":{"row":351,"column":1},"end":{"row":351,"column":2},"action":"insert","lines":[" "]},{"start":{"row":351,"column":2},"end":{"row":351,"column":3},"action":"insert","lines":[" "]},{"start":{"row":351,"column":3},"end":{"row":351,"column":4},"action":"insert","lines":[" "]},{"start":{"row":351,"column":4},"end":{"row":351,"column":5},"action":"insert","lines":[" "]},{"start":{"row":351,"column":5},"end":{"row":351,"column":6},"action":"insert","lines":[" "]},{"start":{"row":351,"column":6},"end":{"row":351,"column":7},"action":"insert","lines":[" "]},{"start":{"row":351,"column":7},"end":{"row":351,"column":8},"action":"insert","lines":[" "]},{"start":{"row":351,"column":8},"end":{"row":351,"column":9},"action":"insert","lines":[" "]},{"start":{"row":351,"column":9},"end":{"row":351,"column":10},"action":"insert","lines":[" "]}],[{"start":{"row":351,"column":10},"end":{"row":351,"column":11},"action":"insert","lines":[" "],"id":1174}],[{"start":{"row":350,"column":35},"end":{"row":351,"column":0},"action":"insert","lines":["",""],"id":1175},{"start":{"row":351,"column":0},"end":{"row":351,"column":14},"action":"insert","lines":["              "]}],[{"start":{"row":352,"column":44},"end":{"row":353,"column":0},"action":"insert","lines":["",""],"id":1176},{"start":{"row":353,"column":0},"end":{"row":353,"column":11},"action":"insert","lines":["           "]}],[{"start":{"row":352,"column":10},"end":{"row":352,"column":44},"action":"remove","lines":[" var dataTable = dc.dataTable(ndx)"],"id":1177}],[{"start":{"row":350,"column":35},"end":{"row":351,"column":14},"action":"remove","lines":["","              "],"id":1178},{"start":{"row":350,"column":35},"end":{"row":351,"column":10},"action":"remove","lines":["","          "]}],[{"start":{"row":335,"column":49},"end":{"row":336,"column":0},"action":"insert","lines":["",""],"id":1179},{"start":{"row":336,"column":0},"end":{"row":336,"column":10},"action":"insert","lines":["          "]},{"start":{"row":336,"column":10},"end":{"row":336,"column":11},"action":"insert","lines":["v"]},{"start":{"row":336,"column":11},"end":{"row":336,"column":12},"action":"insert","lines":["a"]},{"start":{"row":336,"column":12},"end":{"row":336,"column":13},"action":"insert","lines":["r"]}],[{"start":{"row":336,"column":13},"end":{"row":336,"column":14},"action":"insert","lines":[" "],"id":1180},{"start":{"row":336,"column":14},"end":{"row":336,"column":15},"action":"insert","lines":["n"]},{"start":{"row":336,"column":15},"end":{"row":336,"column":16},"action":"insert","lines":["d"]}],[{"start":{"row":336,"column":16},"end":{"row":336,"column":17},"action":"insert","lines":["x"],"id":1181}],[{"start":{"row":336,"column":17},"end":{"row":336,"column":18},"action":"insert","lines":[";"],"id":1182}],[{"start":{"row":336,"column":18},"end":{"row":337,"column":0},"action":"insert","lines":["",""],"id":1183},{"start":{"row":337,"column":0},"end":{"row":337,"column":10},"action":"insert","lines":["          "]},{"start":{"row":337,"column":10},"end":{"row":337,"column":11},"action":"insert","lines":["v"]},{"start":{"row":337,"column":11},"end":{"row":337,"column":12},"action":"insert","lines":["a"]},{"start":{"row":337,"column":12},"end":{"row":337,"column":13},"action":"insert","lines":["r"]}],[{"start":{"row":337,"column":12},"end":{"row":337,"column":13},"action":"remove","lines":["r"],"id":1184},{"start":{"row":337,"column":11},"end":{"row":337,"column":12},"action":"remove","lines":["a"]},{"start":{"row":337,"column":10},"end":{"row":337,"column":11},"action":"remove","lines":["v"]}],[{"start":{"row":337,"column":10},"end":{"row":337,"column":59},"action":"insert","lines":[" var dataTable = dc.dataTable(\"#all-characters\");"],"id":1185}],[{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["("],"id":1186},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["\""]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["#"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["a"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["l"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["l"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["-"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["c"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["h"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["a"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["r"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["a"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["c"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["t"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["e"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["r"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["s"]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":["\""]},{"start":{"row":337,"column":39},"end":{"row":337,"column":40},"action":"remove","lines":[")"]}],[{"start":{"row":337,"column":10},"end":{"row":337,"column":11},"action":"remove","lines":[" "],"id":1187}],[{"start":{"row":352,"column":9},"end":{"row":357,"column":9},"action":"remove","lines":[" function updateResult() {","           ","           dataTable.beginSlice(resultStart);","           dataTable.endSlice(resultStart + resultEnd);","           displayResult();","        }"],"id":1188},{"start":{"row":352,"column":9},"end":{"row":357,"column":9},"action":"insert","lines":[" function updateResult() {","","            dataTable.beginSlice(resultStart);","            dataTable.endSlice(resultStart + resultEnd);","            displayResult();","        }"]}],[{"start":{"row":29,"column":17},"end":{"row":29,"column":18},"action":"insert","lines":["n"],"id":1189},{"start":{"row":29,"column":18},"end":{"row":29,"column":19},"action":"insert","lines":["d"]},{"start":{"row":29,"column":19},"end":{"row":29,"column":20},"action":"insert","lines":["x"]}],[{"start":{"row":352,"column":32},"end":{"row":352,"column":33},"action":"insert","lines":["n"],"id":1190},{"start":{"row":352,"column":33},"end":{"row":352,"column":34},"action":"insert","lines":["d"]},{"start":{"row":352,"column":34},"end":{"row":352,"column":35},"action":"insert","lines":["x"]}],[{"start":{"row":352,"column":34},"end":{"row":352,"column":35},"action":"remove","lines":["x"],"id":1191},{"start":{"row":352,"column":33},"end":{"row":352,"column":34},"action":"remove","lines":["d"]},{"start":{"row":352,"column":32},"end":{"row":352,"column":33},"action":"remove","lines":["n"]}],[{"start":{"row":295,"column":18},"end":{"row":296,"column":0},"action":"insert","lines":["",""],"id":1192},{"start":{"row":296,"column":0},"end":{"row":296,"column":6},"action":"insert","lines":["      "]}],[{"start":{"row":296,"column":6},"end":{"row":296,"column":22},"action":"insert","lines":[".centerBar(true)"],"id":1193}],[{"start":{"row":296,"column":21},"end":{"row":296,"column":22},"action":"remove","lines":[")"],"id":1194},{"start":{"row":296,"column":20},"end":{"row":296,"column":21},"action":"remove","lines":["e"]},{"start":{"row":296,"column":19},"end":{"row":296,"column":20},"action":"remove","lines":["u"]},{"start":{"row":296,"column":18},"end":{"row":296,"column":19},"action":"remove","lines":["r"]},{"start":{"row":296,"column":17},"end":{"row":296,"column":18},"action":"remove","lines":["t"]},{"start":{"row":296,"column":16},"end":{"row":296,"column":17},"action":"remove","lines":["("]},{"start":{"row":296,"column":15},"end":{"row":296,"column":16},"action":"remove","lines":["r"]},{"start":{"row":296,"column":14},"end":{"row":296,"column":15},"action":"remove","lines":["a"]},{"start":{"row":296,"column":13},"end":{"row":296,"column":14},"action":"remove","lines":["B"]},{"start":{"row":296,"column":12},"end":{"row":296,"column":13},"action":"remove","lines":["r"]},{"start":{"row":296,"column":11},"end":{"row":296,"column":12},"action":"remove","lines":["e"]},{"start":{"row":296,"column":10},"end":{"row":296,"column":11},"action":"remove","lines":["t"]},{"start":{"row":296,"column":9},"end":{"row":296,"column":10},"action":"remove","lines":["n"]},{"start":{"row":296,"column":8},"end":{"row":296,"column":9},"action":"remove","lines":["e"]},{"start":{"row":296,"column":7},"end":{"row":296,"column":8},"action":"remove","lines":["c"]}],[{"start":{"row":296,"column":6},"end":{"row":296,"column":7},"action":"remove","lines":["."],"id":1195},{"start":{"row":296,"column":5},"end":{"row":296,"column":6},"action":"remove","lines":[" "]}],[{"start":{"row":296,"column":5},"end":{"row":297,"column":0},"action":"remove","lines":["",""],"id":1196}],[{"start":{"row":296,"column":4},"end":{"row":296,"column":5},"action":"remove","lines":[" "],"id":1197},{"start":{"row":296,"column":0},"end":{"row":296,"column":4},"action":"remove","lines":["    "]}],[{"start":{"row":294,"column":5},"end":{"row":294,"column":6},"action":"insert","lines":["/"],"id":1198},{"start":{"row":294,"column":6},"end":{"row":294,"column":7},"action":"insert","lines":["/"]}],[{"start":{"row":299,"column":19},"end":{"row":300,"column":0},"action":"insert","lines":["",""],"id":1199},{"start":{"row":300,"column":0},"end":{"row":300,"column":6},"action":"insert","lines":["      "]}],[{"start":{"row":300,"column":6},"end":{"row":300,"column":23},"action":"insert","lines":[" .centerBar(true)"],"id":1200}],[{"start":{"row":300,"column":6},"end":{"row":300,"column":23},"action":"remove","lines":[" .centerBar(true)"],"id":1201}],[{"start":{"row":294,"column":7},"end":{"row":294,"column":8},"action":"remove","lines":[" "],"id":1202},{"start":{"row":294,"column":6},"end":{"row":294,"column":7},"action":"remove","lines":["/"]},{"start":{"row":294,"column":5},"end":{"row":294,"column":6},"action":"remove","lines":["/"]}],[{"start":{"row":294,"column":5},"end":{"row":294,"column":6},"action":"insert","lines":[" "],"id":1203}],[{"start":{"row":146,"column":66},"end":{"row":147,"column":0},"action":"insert","lines":["",""],"id":1204},{"start":{"row":147,"column":0},"end":{"row":147,"column":8},"action":"insert","lines":["        "]}],[{"start":{"row":147,"column":8},"end":{"row":147,"column":25},"action":"insert","lines":[" .centerBar(true)"],"id":1205}],[{"start":{"row":147,"column":8},"end":{"row":147,"column":25},"action":"remove","lines":[" .centerBar(true)"],"id":1206},{"start":{"row":147,"column":8},"end":{"row":148,"column":0},"action":"remove","lines":["",""]}],[{"start":{"row":147,"column":4},"end":{"row":147,"column":8},"action":"remove","lines":["    "],"id":1207},{"start":{"row":147,"column":0},"end":{"row":147,"column":4},"action":"remove","lines":["    "]}],[{"start":{"row":38,"column":0},"end":{"row":41,"column":0},"action":"insert","lines":["$(document).ready(function() {","    $(\"#myModal\").modal('show');","});",""],"id":1208}],[{"start":{"row":38,"column":0},"end":{"row":41,"column":0},"action":"remove","lines":["$(document).ready(function() {","    $(\"#myModal\").modal('show');","});",""],"id":1209}]]},"ace":{"folds":[],"scrolltop":540,"scrollleft":0,"selection":{"start":{"row":38,"column":0},"end":{"row":38,"column":0},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":48,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1561526727920}