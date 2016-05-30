var api = {
  main: function(rows, root) {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    var margin = {top: 20, right: 20, bottom: 20, left: 20},
        width = (x - margin.right - margin.left),
        height = 0.8 * (y - margin.top - margin.bottom);

    var diameter = Math.max(Math.min(height, width), 100),
        format = d3.format("$,.0f");

    var galaxy = d3.layout.galaxy()
        .size([width, height])
        .spread(4)
    //    .initialAngle(0) // radians from down
        .value(function(d) { return d.size; });

    // remove all previous items before render
    d3.select('svg').remove();

    var svg = d3.select("body")
        .append('svg')
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    function unflatten(rows, rootName) {
      var root = {name: rootName, children: [], childmap: {}, value: 0, depth: 0};
      var allnodes = [];
      for (var i = 0; i < rows.length; i++) { // rows
          var row = rows[i];
          for (var c = 0, parent = root; c < rows[0].length-1; c++) { //cols
              var node, label = row[c];
              if (! parent.childmap[label]) {
                  node = { name: label, children: [],
                           childmap: {}, parent: parent,
                           value: 0, depth: parent.depth+1};
                  allnodes.push(node);
                  if (!! label) { parent.childmap[label] = node;
                                 parent.children.push(node); }
              }
              if (c == rows[0].length-2) { // last column of names
                  node.value = row[row.length-1];
                  // add value to all parents value;
                  for (var p = parent; p; p = p.parent ) { p.value += node.value; }
              }
              if (!! label) { parent = parent.childmap[label]; }
          }
      }
      // remove the children of leaf nodes
      allnodes.forEach(function(n,i,a) {
          if (n.children.length === 0) {
              n.size = n.value;
              delete n.children;
          } });
      return root;
    }

    var newRoot = unflatten(rows, root);

    var nodes = galaxy.nodes(newRoot);
    var links = galaxy.links(nodes);

    var link = svg.selectAll(".link")
        .data(links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke-width", function(d) { return Math.sqrt(d.value); })
        .call(truncated_line);

    function truncated_line(l) {
        function len (d){
            return Math.sqrt(Math.pow((d.target.y-d.source.y),2) +
                             Math.pow((d.target.x-d.source.x),2));
        }
        l.attr('x1', function(d) {
            return d.source.x +
                (d.target.x-d.source.x)*d.source.r/len(d); });
        l.attr('y1', function(d) { return d.source.y +
                                   (d.target.y-d.source.y)*d.source.r/len(d); });
        l.attr('x2', function(d) { return d.target.x +
                                   (d.source.x-d.target.x)*d.target.r/len(d); });
        l.attr('y2', function(d) { return d.target.y +
                                   (d.source.y-d.target.y)*d.target.r/len(d); });
    }

    var node = svg.datum(newRoot).selectAll(".node")
        .data(nodes)
        .enter().append("g")
        .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) {
            return d.name + ": " + format(d.value)+"B";
        });

    node.append("circle")
        .attr("r", function(d) { return d.r; });

    node.append("text")
        .attr("dy", ".2em")
        .style("text-anchor", "middle")
        .style("font-size", function(d){
          var len = d.name.substring(0, d.r/3).length;
          var size = d.r/3;
          size *= 10/len;
          size += 1;
          return Math.round(size)+'px';
        })
        .text(function(d) { return d.name.substring(0, d.r / 3); });
  },

  resize: function(rows, root) {
    return function() {
      this.main(rows, root);
    }.bind(this);
  }
};

export default api;
