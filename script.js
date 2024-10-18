
const data = [
  {
    x: ["priority 4", "priority 3", "priority 2", "priority 1"],
    // bar chart values
    y: [40, 64, 33, 70],
    marker: {
      color: [
        // bar colors
        "#8AD1A4",
        "rgba(254, 247, 196, 0.9)",
        "rgba(252, 185, 138, 0.9)",
        "rgba(222, 45, 38, 0.9)",
      ],
    },
    type: "bar",
  },
];


var layout = {
  autosize: true,          
  height: 250,             
  margin: {
    t: 20,               
    b: 50,                 
    l: 50,
    r: 20                  
  },
  bargap: 0.4,             
  barcornerRadius: 8       
};


Plotly.newPlot("myDiv", data, layout, { responsive: true });
