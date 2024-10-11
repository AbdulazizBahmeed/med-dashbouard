// char bar data
const data = [
  {
    x: ["prioarty 4", "prioarty 3", "prioarty 2", "prioarty 1"],
    y: [20, 14, 23, 50],
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

  barcornerradius: 15,
};


Plotly.newPlot("myDiv", data, layout);


// tooltips functions

function showTooltip(flag) {
  switch (flag) {
    case 1:
      document.getElementById("tooltip1").classList.remove("hidden");
      break;
    case 2:
      document.getElementById("tooltip2").classList.remove("hidden");
      break;
    case 3:
      document.getElementById("tooltip3").classList.remove("hidden");
      break;
  }
}

function hideTooltip(flag) {
  switch (flag) {
    case 1:
      document.getElementById("tooltip1").classList.add("hidden");
      break;
    case 2:
      document.getElementById("tooltip2").classList.add("hidden");
      break;
    case 3:
      document.getElementById("tooltip3").classList.add("hidden");
      break;
  }
}