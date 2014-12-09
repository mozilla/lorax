var tags = ["Wal-Mart Stores, Inc.", "Exxon Mobil Corporation", "ChevronTexaco Corporation", "General Electric Company", "Bank of America Corporation", "ConocoPhillips", "AT&amp;T Corp", "Ford Motor Company", "J.P. Morgan Chase &amp; Co", "Hewlett-Packard Company", "Berkshire Hathaway", "Citigroup Inc", "Verizon Communications", "McKesson Corporation", "General Motors Corporation", "American International Group", "Cardinal Health, Inc", "CVS Caremark", "Wells Fargo &amp; Company", "International Business Machines Corporation", "United Health Group Inc", "Procter &amp; Gamble Co", "The Kroger Co", "AmerisourceBergen Corporation", "Costco Wholesale Corp.", "Valero Energy Corp", "Archer-Daniels-Midland Company", "The Boeing Company", "Home Depot, Inc.", "Target Corporation", "WellPoint Health Networks", "Walgreen Company", "Johnson &amp; Johnson", "State Farm Insurance", "Medco Health Solutions Inc", "Microsoft Corporation", "United Technologies Corporation", "Dell, Inc", "Goldman Sachs Group", "Pfizer Inc.", "Marathon Oil Corp.", "Lowe's Companies, Inc.", "United Parcel Service of America, Inc", "Lockheed Martin Corporation", "Best Buy Co., Inc.", "The Dow Chemical Company", "Supervalu Inc", "Sears Holdings Corporation", "International Assets Holding", "PepsiCo, Inc.", "MetLife, Inc.", "Safeway Inc.", "Kraft Foods", "Freddie Mac", "SYSCO Corporation", "Apple Computer, Inc", "The Walt Disney Company", "Cisco Systems, Inc.", "Comcast Corporation", "FedEx Corporation", "Northrop Grumman Corporation", "Intel Corporation", "Aetna Inc.", "New York Life Insurance Company", "Prudential Financial, Inc", "Caterpillar Inc.", "Sprint", "The Allstate Corporation", "General Dynamics Corporation", "Morgan Stanley", "Liberty Mutual", "The Coca-Cola Company", "Humana Inc.", "Honeywell International", "Abbott Laboratories", "News Corp", "HCA Inc.", "Sunoco Inc", "Amerada Hess Corporation"];

fs = require('fs')
fs.readFile('src/data/base/main.json', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  
  data = JSON.parse(data);
  var topic, issue, tag;
  for (topic in data.topics) {
    topic = data.topics[topic];
    for (issue in topic.issues) {

      issue = topic.issues[issue];
      issue.tags = [];
      for(tag = 0; tag < Math.floor(Math.random() * 6) + 3; tag ++) {
        issue.tags.push(getRandomTag());
      }
    }
  }

  console.log(JSON.stringify(data));
});

function getRandomTag () {
  return tags[Math.floor(Math.random() * tags.length)];
}