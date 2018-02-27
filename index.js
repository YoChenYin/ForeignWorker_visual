     var margin = {
             top: 20,
             right: 20,
             bottom: 110,
             left: 50
         },
         margin2 = {
             top: 430,
             right: 20,
             bottom: 30,
             left: 50
         },
         width_pop = 960 - margin.left - margin.right,
         height_pop = 500 - margin.top - margin.bottom,
         height2 = 500 - margin2.top - margin2.bottom;

     var x = d3.time.scale().range([0, width_pop]),
         x2 = d3.time.scale().range([0, width_pop]),
         y = d3.scale.linear().range([height_pop, 0]),
         y2 = d3.scale.linear().range([height2, 0]);
     var xAxis = d3.svg.axis().scale(x).orient("Bottom"),
         xAxis2 = d3.svg.axis().scale(x2).orient("Bottom"),
         yAxis = d3.svg.axis().scale(y).orient("left");
     var brush = d3.svg.brush().x(x2)
         .on("brush", brushed);
     var svg_pop = d3.select("#population").append("svg")
         .attr("width", width_pop + margin.left + margin.right)
         .attr("height", height_pop + margin.top + margin.bottom + 50);

     svg_pop.append("defs").append("clipPath")
         .attr("id", "clip")
         .append("rect")
         .attr("width", width_pop)
         .attr("height", height_pop);
     var focus = svg_pop.append("g")
         .attr("class", "focus")
         .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
     var context = svg_pop.append("g")
         .attr("class", "context")
         .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");
     d3.csv("database/data.csv", type, function (error, data) {
         if (error) throw error;

         x.domain([2001, 2019]);
         y.domain([d3.min(data, function (d) {
             return d.growth_rate;
         }) - 3, d3.max(data, function (d) {
             return d.growth_rate;
         }) + 3]);
         x2.domain(x.domain());
         y2.domain(y.domain());
         // append scatter plot to main chart area 
         var dots = focus.append("g"),
             dots_tw = focus.append("g"),
             dots_info = focus.append("g"),
             ratio = focus.append("g");

         var Gradient = d3.scale.linear().domain([300150, 663234]).range(['#A5DEE4', '#26453D']);
         var Gradient1 = d3.scale.linear().domain([9454000, 11382000]).range(['#DAC9A6', '#E8B647']);
         dots.attr("clip-path", "url(#clip)");
         dots_tw.attr("clip-path", "url(#clip)");
         dots_info.attr("clip-path", "url(#clip)");
         ratio.attr("clip-path", "url(#clip)");
         dots.selectAll(".dot")
             .data(data)
             .enter().append("circle")
             .attr('class', 'dot')
             .attr("r", function (d) {
                 return d.移工總計 / 25000;
             })
             .attr("cx", function (d) {
                 return x(d.年分);
             })
             .attr("cy", function (d) {
                 return y(d.growth_rate);
             })
             .attr("fill", function (d) {
                 return Gradient(d.移工總計);
             })
             .attr('id', function (d, i) {
                 return 'dots' + i;
             });
         dots_tw.selectAll(".dot_tw")
             .data(data)
             .enter().append("circle")
             .attr('class', 'dot_tw')
             .attr("r", function (d) {
                 return d.台勞 / 120000;
             })
             .style("opacity", .4)
             .attr("cx", function (d) {
                 return x(d.年分);
             })
             .attr("cy", function (d) {
                 if (d.growth_rate > 6)
                     return y(d.growth_rate) + d.台勞 / 130000;
                 else
                     return y(d.growth_rate) - d.台勞 / 130000;
             })
             .attr("fill", function (d) {
                 return Gradient1(d.台勞);
             })
             .attr("visibility", "hidden")
             .attr('id', function (d, i) {
                 return 'dots_tw' + i;
             });
         dots_info.selectAll(".dot_info")
             .data(data)
             .enter().append("text")
             .attr('class', 'dot_info')
             .attr('id', function (d, i) {
                 return 'dots_info' + i;
             }).text(function (d, i) {
                 return d.growth_rate;
             })
             .attr("x", function (d) {
                 return x(d.年分) - 15;
             })
             .attr("y", function (d) {
                 return y(d.growth_rate) - 10;
             })
             .attr("visibility", "hidden")
             .call(textstyle);
             var _f = d3.format(".0f");
        ratio.selectAll(".ratio")
             .data(data)
             .enter().append("text")
             .attr('class', 'ratio')
             .attr('id', function (d, i) {
                 return 'ratio' + i;
             }).text(function (d, i) {
                 return "移工 : 台勞 = 1 : "+_f(d.台勞/d.移工總計);
             })
             .attr("x", function (d) {
                 return x(d.年分) - 75;
             })
             .attr("y", function (d) {
                 if(d.growth_rate>6)
                    return y(d.growth_rate) + 80;
                 else
                    return y(d.growth_rate) - 80;
             })
             .attr("visibility", "hidden")
             .attr('font-size',18)
             .attr('font-weight',800)
             .attr('font-family', "'Noto Sans TC', sans-serif")
             .attr('fill','#6E552F');

         focus.append("g")
             .attr("class", "axis axis--x")
             .attr("transform", "translate(0," + height_pop + ")")
             .call(xAxis);
         focus.append("g")
             .attr("class", "axis axis--y")
             .call(yAxis);

         focus.append("text")
             .attr("transform", "rotate(-90)")
             .attr("y", 0 - margin.left)
             .attr("x", 0 - (height_pop / 2))
             .attr("dy", "1em")
             .style("text-anchor", "middle")
             .text("移工逐年成長率")
             .call(textstyle1);

         svg_pop.append("text")
             .attr("transform",
                 "translate(" + ((width_pop + margin.right + margin.left) / 2) + " ," +
                 (height_pop + margin.top + margin.bottom) + ")")
             .style("text-anchor", "middle")
             .text("西元年").call(textstyle1);

         // append scatter plot to brush chart area      
         var dots_b = context.append("g");
         dots_b.attr("clip-path", "url(#clip)");
         dots_b.selectAll("dot")
             .data(data)
             .enter().append("circle")
             .attr('class', 'dotContext')
             .attr("r", 3)
             .style("opacity", .9)
             .attr("cx", function (d) {
                 return x2(d.年分);
             })
             .attr("cy", function (d) {
                 return y2(d.growth_rate);
             }).attr("fill", function (d) {
                 return Gradient(d.移工總計);
             })
             .attr("id", function (d, i) {
                 return "dots_b" + i;
             });
         context.append("g")
             .attr("class", "axis axis--x")
             .attr("transform", "translate(0," + height2 + ")")
             .call(xAxis2);
         context.append("g")
             .attr("class", "brush")
             .call(brush)
             .selectAll("rect")
             .attr("y", -6)
             .attr("height", height2 + 7);

         svg_pop.append('circle').attr({
             'transform': 'translate(50,520)',
             'r': 5,
             'fill': '#26453D',
         })
         svg_pop.append("text").text('外籍移工人數').attr('transform', 'translate(70,525)').call(textstyle1);
         svg_pop.append('circle').attr({
             'transform': 'translate(170,520)',
             'r': 5,
             'fill': '#E8B647',
         })
         svg_pop.append("text").text('台灣就業人數').attr('transform', 'translate(180,525)').call(textstyle1);

         //event
         var last = 0;
         var flag = 0;
         dots.selectAll(".dot").on('mouseover', function (d, i) {
             if (flag = 0) {
                 last = i;
                 flag = 1;
             }
             if (last != i) {
                 //total text
                 $("#year").text(d.年分);
                 $("#total").text(d.移工總計);    
                 if (Number(d.移工總計) < Number(d.原住民)) {
                    $("#aboriginal").text(" ");
                } else {
                    $("#aboriginal").html("已超越原住民人數 " + d.原住民);
                }
                 d3.select('#dots' + last).transition().duration(300).ease('poly', 2).attr({
                    r: function (d) {
                        return d.移工總計 / 25000;
                    }, 
                    fill: function (d) {
                         return Gradient(d.移工總計);
                     },
                     opacity: 1
                 });
                 d3.select('#dots_b' + last).transition().duration(300).ease('poly', 2).attr({
                    
                      fill: function (d) {
                         return Gradient(d.移工總計);
                     },
                     opacity: 1
                 });
                 d3.select('#dots_tw' + last).transition().duration(300).ease('poly', 2).attr({
                     visibility: 'hidden'

                 });
                 d3.select('#dots_info' + last).transition().duration(300).ease('poly', 2).attr({
                     visibility: 'hidden'
                 });
                 d3.select('#ratio' + last).transition().duration(300).ease('poly', 2).attr({
                    visibility: 'hidden'
                });
                 flag = 0;
             }
             //(litter circle)
             d3.select(this).transition().duration(300).ease('poly', 2).attr({
                r: function (d) {
                    return d.移工總計 / 120000;
                },
                 
                 opacity: 1
             })
             d3.select('#dots_b' + i).transition().duration(300).ease('poly', 2).attr({
                 fill: '#8E354A'

             })
             last = i;
             //labor of taiwan(big circle)
             d3.select('#dots_tw' + i).transition().duration(600).ease('poly', 2).attr({
                 visibility: 'visable',
                 opacity: 0.7
             })
             d3.select('#dots_info' + i).transition().duration(600).ease('poly', 2).attr({
                 visibility: 'visable'
             })
             d3.select('#ratio' + i).transition().duration(600).ease('poly', 2).attr({
                visibility: 'visable'
            })
         });

     });
     //create brush function redraw scatterplot with selection
     function brushed() {
         x.domain(brush.empty() ? x2.domain() : brush.extent());
         focus.selectAll(".dot")
             .attr("cx", function (d) {
                 return x(d.年分);
             })
             .attr("cy", function (d) {
                 return y(d.growth_rate);
             });
         focus.selectAll(".dot_tw")
             .attr("cx", function (d) {
                 return x(d.年分);
             })
             .attr("cy", function (d) {
                 if (d.growth_rate > 6)
                     return y(d.growth_rate) + d.台勞 / 130000;
                 else
                     return y(d.growth_rate) - d.台勞 / 130000;
             });
         focus.selectAll(".dot_info")
             .attr("x", function (d) {
                 return x(d.年分) - 15;
             })
             .attr("y", function (d) {
                 return y(d.growth_rate) - 10;
             });
             focus.selectAll(".ratio")
             .attr("x", function (d) {
                 return x(d.年分) - 75;
             })
             .attr("y", function (d) {
                 if(d.growth_rate>6)
                    return y(d.growth_rate) + 80;
                 else
                    return y(d.growth_rate) - 80;
             });
         focus.select(".axis--x").call(xAxis);
     };

     function textstyle1(t) {
         t.attr({
             'fill': "#373C38",
             'font-size': '1vw',
             'font-weight': '500',
             'font-family': "'Noto Sans TC', sans-serif"
         });
     }

     function textstyle(t) {
         t.attr({
             'fill': "#6E552F",
             'font-size': '1vw',
             'font-weight': 'border',
             'font-family': "'Inconsolata', monospace"
         });
     }

     function type(d) {
         d.年分 = d.年分;
         d.growth_rate = +d.growth_rate;
         return d;
     };


     d3.csv("database/donutdata.csv", function (error, dataset) {

         if (error) throw error;
         var country = [],
             type = [],
             item3k = [],
             itemcare = [];
         var country_data = [];
         var type_data = [];
         var item3k_data = [];
         var itemcare_data = [];
         for (var i = 0; i < 16; i++) {
             country = [];
             type = [];
             item3k = [];
             itemcare = [];
             country.push(dataset[i].印尼, dataset[i].菲律賓, dataset[i].泰國, dataset[i].越南, dataset[i].其他);
             type.push(dataset[i].Industrial_labor, dataset[i].caregiver);
             item3k.push(dataset[i].threek, dataset[i].ind);
             itemcare.push(dataset[i].看護工, dataset[i].care);

             country_data[i] = country;
             type_data[i] = type;
             item3k_data[i] = item3k;
             itemcare_data[i] = itemcare;
         }
         console.log(country_data);
         var width = 400,
             height = 250,
             cwidth = 25,
             offsetX = 20;


         var pie = d3.layout.pie()
             .sort(null);

         var arc = d3.svg.arc();

         var svg1 = d3.select("#donut_from").append("svg")
             .attr("width", width)
             .attr("height", height)
             .append("g")
             .attr("transform", "translate(" + width / 2 + "," + height * 4 / 7 + ")");

         var gs1 = svg1.selectAll("g").data(d3.values(country_data)).enter().append("g");
         var color1 = ["#64363C", '#BEC23F', "#FFB11B", "#F596AA"];
         var path1 = gs1.selectAll("path")
             .data(function (d) {
                 return pie(d);
             })
             .enter().append("path")
             .attr("fill", function (d, i) {
                 return color1[i];
             })
             .attr("stroke", "#ffffff")
             .transition().duration(250)
             .attr("d", function (d, i, j) {
                 if (j == 15) return arc.innerRadius(60).outerRadius(90)(d)
             });



         var width2 = 250;
         var height2 = 200;
         var svg2 = d3.select("#donut_work").append("svg")
             .attr("width", width2)
             .attr("height", height2)
             .append("g")
             .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");


         var gs2 = svg2.selectAll("g").data(d3.values(type_data)).enter().append("g");

         var path2 = gs2.selectAll("path")
             .data(function (d) {
                 return pie(d);
             })
             .enter().append("path")
             .attr("fill", function (d, i) {
                 if (i < 2) return color1[i];
             })
             .attr("stroke", "#ffffff")
             .attr("d", function (d, i, j) {
                 if (j == 15) return arc.innerRadius(60).outerRadius(90)(d)
             })

         var svg3 = d3.select("#donut_threek").append("svg")
             .attr("width", width2)
             .attr("height", height2)
             .append("g")
             .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");



         var gs3 = svg3.selectAll("g").data(d3.values(item3k_data)).enter().append("g");
         var color2 = ["#64363C", "#D7C4BB"];
         var path3 = gs3.selectAll("path")
             .data(function (d) {
                 return pie(d);
             })
             .enter().append("path")
             .attr("fill", function (d, i) {
                 return color2[i];
             })
             .attr("d", function (d, i, j) {
                 if (j == 15) return arc.innerRadius(60).outerRadius(90)(d)
             })
         svg3.append("text").text("產業外勞從事3k行業比例")
             .attr("transform", "translate(-90,0)")
             .attr({
                 "font-size": "1vw",
                 "font-weight": "bold",
                 "font-family": "'Noto Sans TC', sans-serif"
             });
         var svg4 = d3.select("#donut_care").append("svg")
             .attr("width", width2)
             .attr("height", height2)
             .append("g")
             .attr("transform", "translate(" + width2 / 2 + "," + height2 / 2 + ")");


         var gs4 = svg4.selectAll("g").data(d3.values(itemcare_data)).enter().append("g");
         var color3 = ["#FFB11B", "#FAF9B6"];
         var path4 = gs4.selectAll("path")
             .data(function (d) {
                 return pie(d);
             })
             .enter().append("path")
             .attr("fill", function (d, i) {
                 return color3[i];
             })
             .attr("d", function (d, i, j) {
                 if (j == 15) return arc.innerRadius(60).outerRadius(90)(d)
             })
         svg4.append("text").text("社福外勞從事看護工比例")
             .attr("transform", "translate(-90,0)")
             .attr({
                 "font-size": "1vw",
                 "font-weight": "bold",
                 "font-family": "'Noto Sans TC', sans-serif"

             });
         /*圖例*/
         var width_legend = 300,
             height_legend = 90;
         var legend_from = d3.select("#donut_from").append("svg").attr("width", width_legend).attr("height", height_legend);
         var g_legend = legend_from.append("g");
         var text_from = ["印尼", "菲律賓", "泰國", "越南"];
         var text_ind = ["產業外勞", "社福外勞"];
         g_legend.selectAll("g")
             .data(country_data)
             .enter()
             .append("rect")
             .attr('width', 10)
             .attr("height", 10)
             .attr("fill", function (d, i) {
                
                 if (i < 4)
                     return color1[i];
                 else if (i < 6)
                     return color1[i - 4];
             })
             .attr("transform", function (d, i) {
                 if (i < 4)
                     return "translate(0," + (5 + 20 * i) + ")";
                 else if (i < 6)
                     return "translate(220," + (5 + 20 * (i - 4)) + ")";
             })
             .attr('id',function(d,i){
                 return 'legend'+i;
             })
             .attr('visibility', function (d, i) {
                 if (i > 3) return 'hidden';
             });
         g_legend.selectAll("g")
             .data(country_data)
             .enter()
             .append("text")
             .attr('width', 100)
             .attr("height", 80)
             .text(function (d, i) {
                 if (i < 4)
                     return text_from[i];
                 /* else if(i<6)
                return  text_ind[i-4] ;*/
             })
             .attr("transform", function (d, i) {
                 if (i < 4)
                     return "translate(25," + (14 + 18 * i) + ")"
                 else if (i < 6)
                     return "translate(250," + (14 + 18 * (i - 4)) + ")";
             })
             .attr('id',function(d,i){
                return 'legend'+i;
            })
             .attr({
                 "font-size": "1vw",
                 "font-weight": "bold"
             });

         /*LineChart*/
         //append svg ,g and set position
         d3.csv("database/Linedata.csv", function (csvdata) {
             if (error) throw error;
             var width_Line = 650,
                 height_Line = 350;
             var padding = {
                 top: 30,
                 right: 50,
                 bottom: 50,
                 left: 50
             };
             var svgLineChart = d3.select("#linechart").append('svg').attr({
                 'width': width_Line,
                 'height': height_Line
             });
             var LineChart = svgLineChart.append('g');
             LineChart.attr('transform', "translate(" + padding.top + "," + padding.left + ')');

             //x,y軸比例尺
             var xScale = d3.scale.linear().domain(d3.extent(csvdata, function (d) {
                 return d.年分;
             })).range([0, width_Line - padding.left - padding.right]);
             var Ymax = d3.max(csvdata, function (d) {
                 if (parseInt(d.國內) > parseInt(d.外勞)) {
                     return d.國內;
                 } else {
                     return d.外勞;
                 }
             });
             var yScale = d3.scale.linear().domain([0, Ymax]).range([height_Line - padding.top - padding.bottom, 0]);

             //創建x,y軸
             var xAxis = d3.svg.axis().scale(xScale).orient('bottom');
             var yAxis = d3.svg.axis().scale(yScale).tickFormat(function(d){return d+'%';}).orient('left');

             //call axis
             LineChart.append('g').attr('class', 'axis').attr('transform', 'translate(0,' + (height_Line - padding.top - padding.bottom) + ')')
                 .call(xAxis).attr({
                     'stroke': '#000',
                     'stroke-width': '2px',
                     'fill': 'none'
                 })
                 .selectAll('text')
                 .attr({
                     'fill': 'black',
                     'stroke': 'none',
                     'font-weight':500,
                     'font-family': "'Inconsolata', monospace"
                 });
             LineChart.append('g').attr('class', 'axis').call(yAxis)
                 .attr({
                     'stroke': '#000',
                     'stroke-width': '2px',
                     'fill': 'none'
                 })
                 .selectAll('text')
                 .attr({
                     'fill': 'black',
                     'stroke': 'none',
                     'font-weight':500,
                     'font-family': "'Inconsolata', monospace"
                 });
                
                
             //折線(產業移工&社福移工)
             var Line = [];
             Line[0] = d3.svg.line().x(function (d) {
                 return xScale(d.年分);
             }).y(function (d) {
                 return yScale(d.國內);
             }).interpolate('linear');
             LineChart.append('path').attr('class', 'line').attr('d', Line[0](csvdata))
                 .attr({
                     'stroke': '#E8B647',
                     'stroke-width': '1px',
                     'fill': 'none'
                 });
             Line[1] = d3.svg.line().x(function (d) {
                 return xScale(d.年分);
             }).y(function (d) {
                 return yScale(d.外勞);
             }).interpolate('linear');
             LineChart.append('path').attr('class', 'line').attr('d', Line[1](csvdata))
                 .attr({
                     'stroke': '#26453D',
                     'stroke-width': '1px',
                     'fill': 'none'
                 });

             //標記點
             LineChart.append('g').selectAll('circle')
                 .data(csvdata)
                 .enter()
                 .append('circle')
                 .attr('cx', function (d) {

                     return xScale(d.年分);
                 })
                 .attr('cy', function (d) {

                     return yScale(d.國內);
                 })
                 .attr('r', 3)
                 .attr('fill', '#E8B647')
                 .attr('opacity', function (d, i) {
                     return 1;
                     // if(i!=0)
                     //     return 0;
                 })
                 .attr('id', function (d, i) {
                     return 'dot' + i;
                 });
             LineChart.append('g').selectAll('circle')
                 .data(csvdata)
                 .enter()
                 .append('circle')
                 .attr('cx', function (d) {
                     return xScale(d.年分);
                 })
                 .attr('cy', function (d) {
                     return yScale(d.外勞);
                 })
                 .attr('r', 3)
                 .attr('fill', '#26453D')
                 .attr('opacity', function (d, i) {
                     return 1;
                     // if(i!=0)
                     //     return 0;
                 })
                 .attr('id', function (d, i) {
                     return 'dot' + i;
                 });
                 LineChart.append("text").text('台灣勞工職災率').attr('transform', 'translate(25,255)').call(textstyle1);
                 LineChart.append("text").text('外籍勞工職災率').attr('transform', 'translate(150,255)').call(textstyle1);
                 LineChart.append('circle').attr({
                    'transform': 'translate(15,250)',
                    'r': 5,
                    'fill': '#E8B647',
                })
                LineChart.append('circle').attr({
                    'transform': 'translate(140,250)',
                    'r': 5,
                    'fill': '#26453D',
                })
                 //標記文字
             var offsetY = 1;
             LineChart.append('g').attr('class', 'mark1');
             LineChart.append('g').attr('class', 'mark2');
             for (var i = 1; i < 3; i++) {
                 LineChart.select('.mark' + i).selectAll('text')
                     .data(csvdata)
                     .enter()
                     .append('text')
                     .attr({
                         'x': function (d) {
                             return xScale(d.年分);
                         },
                         'fill': "black",
                         'font-size': '1vw',
                         'font-weight': 'bold',
                         'font-family': "'Inconsolata', monospace",
                         'visibility': 'hidden',
                         'id': function (d, i) {
                             return 'mark' + i;
                         }
                     });
             }
             LineChart.select('.mark1').selectAll('text').text(function (d) {
                 return d.國內
             }).attr('y', function (d) {
                 if (Math.floor(d.國內, 0) == Math.floor(d.外勞, 0)) {
                     return yScale(offsetY + d.國內);
                 } else
                     return yScale(d.國內);
             })
             LineChart.select('.mark2').selectAll('text').text(function (d) {
                 return d.外勞
             }).attr('y', function (d) {
                 if (Math.floor(d.國內, 0) == Math.floor(d.外勞, 0)) {
                     return yScale(d.外勞 - offsetY);
                 } else
                     return yScale(d.外勞);
             })

             /*TimeLine*/
             //append svg,g and set size
             var svgTime = d3.select("#timeLine").append('svg');
             svgTime = d3.select("#timeLine").select('svg').attr({
                 'width': 80,
                 'height': 500
             });
             var TimeLine = svgTime.append('g');

             //year
             TimeLine.selectAll('text')
                 .data(dataset)
                 .enter()
                 .append('text')
                 .text(function (d) {
                     return d.年分;
                 })
                 .attr({
                     'x': 30,
                     'y': function (d, i) {
                         return (20 + (i + 1) * 30)
                     },
                     'fill': "gray",
                     'font-size': '1vw',
                     'font-weight': 'bold',
                     'font-family': "'Inconsolata', monospace"
                 });
            var religion = [];
            religion.push("印尼<br>伊斯蘭教<br>可能每日要求祈禱數次<br>不吃豬肉、齋戒月白天禁水禁食","菲律賓<br>天主教<br>星期日可能要求去教堂","泰國<br>佛教","越南<br>佛教");
             //逐年變動
             TimeLine.selectAll('text')
                 .on('mouseover', function (d, i) {
                     d3.selectAll("text").attr({
                        'font-size': "1vw",
                    });
                     //bigger circle
                     d3.select(this).attr({
                         'font-size': "1.5vw",
                     });
                     svg1.selectAll("g").selectAll("path")
                         .transition().duration(20000).ease('poly', '3')
                         .attr("d", function (d, i1, j) {
                             if (j == i) {
                                 return arc.innerRadius(60).outerRadius(90)(d);
                             }
                         });
                     gs2.selectAll("path")
                         .transition().duration(20000).ease('poly', '3')
                         .attr("fill", function (d, i) {
                             return color1[i];
                         })
                         .attr("d", function (d, i1, j) {
                             if (j == i) return arc.innerRadius(60).outerRadius(90)(d);
                         });
                     gs3.selectAll("path")
                         .transition().ease('poly', '2')
                         .attr("fill", function (d, i) {
                             return color2[i];
                         })
                         .attr("d", function (d, i1, j) {
                             if (j == i) return arc.innerRadius(60).outerRadius(90)(d);
                         });
                     gs4.selectAll("path")
                         .transition().ease('poly', '2')
                         .attr("fill", function (d, i) {
                             return color3[i];
                         })
                         .attr("d", function (d, i1, j) {
                             if (j == i) return arc.innerRadius(60).outerRadius(90)(d);
                         });



                 })
                 .on('mouseout', function (d, i) {
                     
                     svg1.selectAll("g").selectAll("path").on("mouseover", function (d, i, j) {
                         d3.selectAll("path").attr("opacity", 0.7);
                         $("#religion").html(religion[i]);
                         d3.select(this).attr("opacity", 1).attr("d", function (d) {
                             return arc.innerRadius(60).outerRadius(95)(d);
                         })
                         g_legend.selectAll('rect').attr("opacity", 0.7);
                         g_legend.selectAll('text').attr("opacity", 0.7);
                         g_legend.selectAll('#legend'+i).attr("opacity", 1);
                         g_legend.selectAll('#legend'+i).attr("opacity", 1);

                     }).on("mouseout", function (d, i1, j1) {
                         d3.selectAll("path").attr("opacity", 1);
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(90)(d);
                         })
                     });
                     gs2.selectAll("path").on("mouseover", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(95)(d);
                         })
                     }).on("mouseout", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(90)(d);
                         })
                     });
                     gs3.selectAll("path").on("mouseover", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(95)(d);
                         })
                     }).on("mouseout", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(90)(d);
                         })
                     });
                     gs4.selectAll("path").on("mouseover", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(95)(d);
                         })
                     }).on("mouseout", function (d, i, j) {
                         d3.select(this).attr("d", function (d, i, j) {
                             return arc.innerRadius(60).outerRadius(90)(d);
                         })
                     });

                 });
             svg1.selectAll("path").on("mouseover", function (d, i, j) {
                $("#religion").html(religion[i]);
                g_legend.selectAll('rect').attr("opacity", 0.7);
                g_legend.selectAll('text').attr("opacity", 0.7);
                g_legend.selectAll('#legend'+i).attr("opacity", 1);
                g_legend.selectAll('#legend'+i).attr("opacity", 1);
                 d3.selectAll("path").attr("opacity", 0.7);
                 d3.select(this).attr("opacity", 1).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(95)(d);
                 })
             }).on("mouseout", function (d, i, j) {
                 d3.selectAll("path").attr("opacity", 1);
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(90)(d);
                 })
             });
             gs2.selectAll("path").on("mouseover", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(95)(d);
                 })
             }).on("mouseout", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(90)(d);
                 })
             });
             gs3.selectAll("path").on("mouseover", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(95)(d);
                 })
             }).on("mouseout", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(90)(d);
                 })
             });
             gs4.selectAll("path").on("mouseover", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(95)(d);
                 })
             }).on("mouseout", function (d, i, j) {
                 d3.select(this).attr("d", function (d, i, j) {
                     return arc.innerRadius(60).outerRadius(90)(d);
                 })
             });

         });

     });

     $(function() {
        $(window).scroll(function() {
            var scrollVal = $(this).scrollTop();
            console.log(scrollVal);
            if ((scrollVal > 1780 && scrollVal<2000)||(scrollVal > 2290 && scrollVal<2500)) {
                $('#timeLine').css('visibility', 'visible');
            } else {
                $('#timeLine').css('visibility', 'hidden');
            }
        });
    });
     // /*chartbar*/
     // var w = 560;
     // var h = 300;

     // //比例
     // var scaleX = d3.scale.linear().range([0, w]).domain([0, 110000]);
     // var scaleY = d3.scale.linear().range([0, h]).domain([0, 190]);

     // //append svg,g
     // var svgBar = d3.select("#MW_in_TW").append("svg");
     // svgBar = d3.select("#MW_in_TW").select("svg")
     //     .attr({
     //         'x': 0,
     //         'y': 0,
     //         width:2* w,
     //         height: 300
     //     });
     // var chartBar = svgBar.append('g');

     // //insert into path to draw
     // d3.csv("data/2002.csv",function(error,data_year){
     //     if(error) throw error;
     //     chartBar.selectAll("path")
     //     .data(data_year)
     //     .enter()
     //     .append("path");
     // var Gradient_b = d3.scale.linear().domain([1,22]).range(['#00BCD4','#006064'])
     //     //設定元素參數
     // chartBar.selectAll('path')
     // .attr("d", function(d,i) {
     //         if(d.項目 == "台灣")
     //         {
     //             return;
     //         }else{
     //             --i;
     //         var x1 = 100; //bar 起始點
     //         var x2 = 100; //bar 終點
     //         var y1 = scaleY(i * 10); //bar 起始高
     //         var y2 = scaleY(i * 10 + 8);
     //             return (
     //             "M" + x1 + " " + y1 +
     //             "L" + x2 + " " + y1 +
     //             "L" + x2 + " " + y2 +
     //             "L" + x1 + " " + y2 + "Z"
     //         );
     //         }
     // })
     // .attr('fill', function (d, i) {
     //     return Gradient_b(i);
     // })
     // .transition().duration(1000).ease('poly', '3')
     // .attr("d", function (d,i) {  
     //     if(d.項目 == "台灣")
     //     {
     //         return;
     //     }else{
     //         --i;
     //         var x1 = 100; //bar 起始點
     //         var x2 = 100 + scaleX(d.總計); //bar 終點
     //         var y1 = scaleY(i * 10); //bar 起始高
     //         var y2 = scaleY(i * 10 + 8);
     //     return (
     //         "M" + x1 + " " + y1 +
     //         "L" + x2 + " " + y1 +
     //         "L" + x2 + " " + y2 +
     //         "L" + x1 + " " + y2 + "Z"
     //     );
     // }
     // })
     // .attr('fill', function (d, i) {
     //         return  Gradient_b(i);
     // });
     // //長條圖國家文字
     // chartBar.selectAll('text')
     // .data(data_year)
     // .enter()
     // .append('text')
     // .attr({
     //     'x': 50,
     //     'y': function (d, i) {
     //         if(d.項目 == "台灣")
     //         {
     //             return;
     //         }else{
     //             --i;
     //         return scaleY(i * 10 + 5);}
     //     },
     //     'fill': 'black',
     //     'font-size': '10px',
     //     'font-weight': 'bold',
     //     'font-family': '微軟正黑體'
     // })
     // .text(function (d, i) {
     //     if(d.項目 == "台灣")
     //     {
     //         return;
     //     }else{
     //         return d.項目;
     //     }
     // });
     // });
     // // /*甜甜圈*/
     // // var width_d = 460,
     // //     height_d = 300,
     // //     radius = Math.min(width_d,height_d)/2;
     // // var pie = d3.layout.pie().sort(null);
     // // var arc = d3.svg.arc().innerRadius(radius - 100).outerRadius(radius-50);
     // // var donut = d3.select("#donut").append("svg");

     // // donut = d3.select("svg").attr("width",width_d).attr("height",height_d);
     // // var donut_C = donut.append("g");
     // // donut_C.attr("transform","translate("+width_d/2+","+height_d/2+")");
     // //               var color = d3.scale.category20();
     // //               var dataset = {
     // //                 apples: [53245, 28479, 19697, 24037, 40245],
     // //               };
     // // d3.csv("data.csv",function(error,data){

     // //     if (error) throw error;
     // //     var path = donut_C.selectAll("path").data(pie(dataset. apples)).enter().append("path")
     // //                     .attr("fill",function(d,i){return color(i);})
     // //                     .attr("d",arc);
     // // });

     // //逐年變動
     // TimeLine.selectAll('circle')
     //     .on('mouseover', function (d, i) {
     //         //bigger circle
     //         d3.select(this).attr({
     //             'r': 6,
     //             'opacity':1
     //         });
     //         //changing chartbar
     //         var filename = 2002+i;
     //         d3.csv("data/"+filename+".csv",function(error,update){
     //             if (error) throw error;
     //         chartBar.selectAll('path')
     //                 .transition().duration(1000).ease('poly', '2')
     //                 .selectAll('path')
     //                 .data(update)
     //                 .attr("d", function (d, i) {
     //                     if(d.項目 == "台灣")
     //                     {
     //                         return;
     //                     }else{
     //                         --i;
     //                     var x1 = 100; //bar 起始點
     //                     var x2 = 100 + scaleX(d.總計); //bar 終點
     //                     var y1 = scaleY(i * 10); //bar 起始高
     //                     var y2 = scaleY(i * 10 + 8);

     //                 return (
     //                     "M" + x1 + " " + y1 +
     //                     "L" + x2 + " " + y1 +
     //                     "L" + x2 + " " + y2 +
     //                     "L" + x1 + " " + y2 + "Z"
     //                 );
     //             }
     //             });
     //         // chartBar.selectAll('.ratio')
     //         //     .attr('opacity', '0')
     //         //     .transition().duration(1000).ease('poly', '2')
     //         //     .text(function (d1, i1) {

     //         //             if (i1 == 0) {
     //         //                 dev = [];
     //         //                 num = [];
     //         //             }
     //         //             if (i1 < 5) {
     //         //                 dev.push(d1[i + 1]);
     //         //             } else {

     //         //                 var ratio = 100 * (d1[i + 1] + dev[i1 - 5]) / sum;
     //         //                 num.push(d1[i + 1] + dev[i1 - 5]);
     //         //                 return ratio.toFixed(2) + "%"
     //         //             }
     //         //         }
     //         //     )
     //         //     .attr('x', function (d1, i1) {
     //         //         if (i1 >= 5) {
     //         //             return 160 + scaleX(num[i1 - 5])
     //         //         }
     //         //     })
     //         //     .attr('opacity', '1');
     //     })
     //         //Linechart     
     //         LineChart.selectAll('#mark'+i).attr('visibility','visible');
     //         LineChart.selectAll('#dot'+i).attr('opacity','1');})
     //     .on('mouseout', function (d,i) {
     //         d3.select(this).attr({
     //             'r': 3,
     //             'opacity':0.7
     //         });
     //         LineChart.selectAll('#mark'+i).attr('visibility','hidden');
     //         LineChart.selectAll('#dot'+i).attr('opacity','1');
     //     });
     // });