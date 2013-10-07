var width = 960,
height = 500;

var force = d3.layout.force()
.size([width, height])
.charge(-400)
.linkDistance(40)
.on("tick", tick);

var drag = force.drag();

var svg = d3.select("#network").append("svg")
.attr("width", width)
.attr("height", height);

var link = svg.selectAll(".link"),
node = svg.selectAll(".node");


d3.json("data.json", function(error, graph) {
    force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

    links = link.data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .on("mouseover", linkMouseover)
    .on("mouseout", mouseout);

    gs = node.data(graph.nodes)
    .enter().append("g")
    .call(drag);

    nodes = gs.append("circle")
    .attr("class", "node")
    .attr("r", 12)
    .on("mouseover", nodeMouseover)
    .on("mouseout", mouseout);

    texts = gs.append("text")
    .attr("class", "label")
    .text(function(d) { return d.name; });

    function linkMouseover(d) {
        svg.selectAll(".link").classed("active", function(p) { return p === d; });
        svg.selectAll(".node").classed("active", function(p) { return p === d.source || p === d.target; });
    }

    function nodeMouseover(d) {
        svg.selectAll(".link").classed("active", function(p) { return p.source === d || p.target === d; });

        svg.selectAll(".node").classed("active", function(p) {
            var active = false;
            svg.selectAll(".link.active").each(function(link) {
                if ((p === link.source || p === link.target) && p !== d ) { active = true; };
            });
            return active;
        });

        d3.select('.node[node-index="' + d.index + '"]').classed("selected", true);
    }

    function mouseout() {
        d3.selectAll("#network").selectAll(".active").classed("active", false);
        d3.selectAll(".selected").classed("selected", false);
    }

});

function tick() {
    links.attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    nodes.attr("node-index", function(d) { return d.index; });

    gs.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    });
}


