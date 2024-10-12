// char bar data
const data = [
  {
    x: ["prioarty 4", "prioarty 3", "prioarty 2", "prioarty 1"],
    y: [40, 64, 33, 70],
    marker: {
      color: [
        "#8AD1A4",
        "rgba(254, 247, 196, 9.9)",
        "rgba(252, 185, 138, 9.9)",
        "rgba(222,45,38, 9.9)",
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

