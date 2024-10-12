// char bar data
const data = [
  {
    x: ["prioarty 4", "prioarty 3", "prioarty 2", "prioarty 1"],
    y: [20, 0, 23, 70],
    marker: {
      color: [
        "rgba(221, 251, 231, .8)",
        "rgba(254, 247, 196, .5)",
        "rgba(252, 185, 138, .5)",
        "rgba(222,45,38, .5)",
      ],
    },
    type: "bar",
  },
];

var layout = {
  barcornerradius: 8,

  height: 250,
 
};


Plotly.newPlot("myDiv", data, layout);

