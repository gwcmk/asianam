var states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

var statesToCode = { 
  'Alabama': 'AL',
  'Alaska': 'AK',
  'American Samoa': 'AS',
  'Arizona': 'AZ',
  'Arkansas': 'AR',
  'California': 'CA',
  'Colorado': 'CO',
  'Connecticut': 'CT',
  'Delaware': 'DE',
  'District Of Columbia': 'DC',
  'Federated States Of Micronesia': 'FM',
  'Florida': 'FL',
  'Georgia': 'GA',
  'Guam': 'GU',
  'Hawaii': 'HI',
  'Idaho': 'ID',
  'Illinois': 'IL',
  'Indiana': 'IN',
  'Iowa': 'IA',
  'Kansas': 'KS',
  'Kentucky': 'KY',
  'Louisiana': 'LA',
  'Maine': 'ME',
  'Marshall Islands': 'MH',
  'Maryland': 'MD',
  'Massachusetts': 'MA',
  'Michigan': 'MI',
  'Minnesota': 'MN',
  'Mississippi': 'MS',
  'Missouri': 'MO',
  'Montana': 'MT',
  'Nebraska': 'NE',
  'Nevada': 'NV',
  'New Hampshire': 'NH',
  'New Jersey': 'NJ',
  'New Mexico': 'NM',
  'New York': 'NY',
  'North Carolina': 'NC',
  'North Dakota': 'ND',
  'Northern Mariana Islands': 'MP',
  'Ohio': 'OH',
  'Oklahoma': 'OK',
  'Oregon': 'OR',
  'Palau': 'PW',
  'Pennsylvania': 'PA',
  'Puerto Rico': 'PR',
  'Rhode Island': 'RI',
  'South Carolina': 'SC',
  'South Dakota': 'SD',
  'Tennessee': 'TN',
  'Texas': 'TX',
  'Utah': 'UT',
  'Vermont': 'VT',
  'Virgin Islands': 'VI',
  'Virginia': 'VA',
  'Washington': 'WA',
  'West Virginia': 'WV',
  'Wisconsin': 'WI',
  'Wyoming': 'WY' 
}

var tables = {
  "B19013": "medianIncome",
  "B19013H": "medianIncomeWhite",
  "B19013B": "medianIncomeAfricanAmerican",
  "B19013C": "medianIncomeAmericanIndian",
  "B19013D": "medianIncomeAsian",
  "B19013I": "medianIncomeLatino"
}

var medianIncomeData = {};

// builds maps from ACS data
$.getJSON("output.json", function(json) {
  for (var tableId in tables) {
    for (var key in json.data) {
      var state = json.geography[key].name;
      var stateCode = statesToCode[state];

      for (var k in json.data[key][tableId].estimate) {
        var medianIncome = json.data[key][tableId].estimate[k]
      }

      medianIncomeData[stateCode] = {
        medianIncome: medianIncome
      }
    }

    var medianIncomeMap = new Datamap({
      element: document.getElementById(tables[tableId]),
      scope: 'usa',
      geographyConfig: {
        popupTemplate: function(geo, data) {
          return '<div class="hoverinfo">' +
            geo.properties.name + '<br>Median Income: ' +  data.medianIncome +
            '</div>';
        }
      },
      data: medianIncomeData
    });
  }

  // datamaps doesn't seem to build the map if the element is hidden,
  // so it needs to wait until the map is finished before hiding it
  $('.median-income-map').each(function() {
    // $(this).addClass("hidden");
    $(this).hide();
  })

  // show "All" map by default
  $('#medianIncome').show().addClass('active');
});

function addMap(id, json) {
  for (var key in json.data) {
    var state = json.geography[key].name;
    var stateCode = statesToCode[state];

    for (var k in json.data[key][idToTables[id]].estimate) {
      var medianIncome = json.data[key][idToTables[id]].estimate[k]
    }

    medianIncomeData[stateCode] = {
      medianIncome: medianIncome
    }
  }

  var medianIncomeMap = new Datamap({
    element: document.getElementById('medianIncome'),
    scope: 'usa',
    geographyConfig: {
      popupTemplate: function(geo, data) {
        return '<div class="hoverinfo">' +
          geo.properties.name + '<br>Median Income: ' +  data.medianIncome +
          '</div>';
      }
    },
    data: medianIncomeData
  });
}

$(document).ready(function() {
  $( "select" ).change(function() {
    var id = "#" + $( "select option:selected" ).val();
    $('.active').fadeOut(100);
    $(id).delay(100).fadeIn(500).addClass('active');
  })
})