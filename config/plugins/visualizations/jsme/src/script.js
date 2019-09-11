// import * as d3 from "d3";
// import * as _ from "underscore";

import * as JSApplet from "./jsme.nocache";
// var Datasets = window.bundleEntries.chartUtilities.Datasets;

_.extend(window.bundleEntries || {}, {
    load: function(options) {
         //this function will be called after the JavaScriptApplet code has been loaded.
        function jsmeOnLoad() {
            jsmeApplet = new JSApplet.JSME("jsme_container", "380px", "340px");
        }
        // var chart = options.chart;
        // Datasets.request({
        //     dataset_id: chart.get("dataset_id"),
        //     dataset_groups: chart.groups,
        //     success: function(groups) {
        //         var colors = d3.scaleOrdinal(d3.schemeCategory20);
        //         var error = null;
        //         _.each(groups, function(group, group_index) {
        //             try {
        //                 var svg = d3.select("#" + (options.targets[group_index] || options.targets[0]));
        //                 var height = parseInt(svg.style("height"));
        //                 var width = parseInt(svg.style("width"));
        //                 var maxValue = d3.max(group.values, function(d) {
        //                     return Math.max(d.x, d.y);
        //                 });
        //                 svg
        //                     .selectAll("bubbles")
        //                     .data(group.values)
        //                     .enter()
        //                     .append("circle")
        //                     .attr("r", function(d) {
        //                         return Math.abs(d.z) * 20 / maxValue;
        //                     })
        //                     .attr("cy", function(d, i) {
        //                         return height * d.y / maxValue;
        //                     })
        //                     .attr("cx", function(d) {
        //                         return width * d.x / maxValue;
        //                     })
        //                     .style("stroke", colors(group_index))
        //                     .style("fill", "white");
        //             } catch (err) {
        //                 error = err;
        //             }
        //         });
        //         if (error) {
        //             chart.state("failed", error);
        //         } else {
        //             chart.state("ok", "Workshop chart has been drawn.");
        //         }
        //         options.process.resolve();
        //     }
        // });
    }
});
