let input = document.querySelector('input');
let textarea = document.querySelector('textarea');
let para1 = document.querySelector('p');
let table = document.querySelector("table");
// get the context for this canvas to be used in making our chart 
let chartContext = document.getElementById('myChart').getContext('2d');
let userMap = new Map();
let singleUserMap = new Map();
let twoTimeUserMap = new Map();
let threeTimeUserMap = new Map();
let fourTimeUserMap = new Map();
let fiveAndAboveTimeUserMap = new Map();
let tableData;

//read input file
input.addEventListener('change', () => {
    let files = input.files;
    let file = files[0];


    if (files.length === 0) return;

    let reader = new FileReader();
    reader.onload = (e) => {
        const file = e.target.result;
        const lines = file.split(/\r\n|\n/);
        processData(lines);
        // textarea.value = lines.join('\n');
    };


    reader.onerror = (e) => alert(e.target.error.name);
    reader.readAsText(file);

})

// distribute data based on user properties, extract total order and amount
function processData(linesOfData) {
    // console.log(linesOfData[0]);
    // console.log(linesOfData.length);
    let x;
    let totalOrders = 0;
    for (x = 1; x <= linesOfData.length - 1; x++) {
        const line = linesOfData[x];
        const items = line.split(',');
        const date = items[0].trim();
        const phone = items[1].trim();
        const userName = items[2].trim();
        const order = items[3].trim();
        totalOrders += parseInt(order);
        if (userMap.has(userName)) {
            userMap.get(userName).push({ phone: phone, date: date, order: order });
        }
        else {
            userMap.set(userName, [{ phone: phone, date: date, order: order }])
        }
    }
    // console.log(userMap);
    document.getElementById("para1").innerHTML = 'Total number of orders are : ' + (linesOfData.length - 1).toString();
    document.getElementById("para2").innerHTML = 'Total amount of orders are : ' + (totalOrders).toString();
    extractCustomerFreq();
}

//extract user groups based on their frequency of ordering
function extractCustomerFreq() {
    for (let key of userMap.keys()) {
        if (userMap.get(key).length > 4) {
            fiveAndAboveTimeUserMap.set(key, userMap.get(key));
        }
        else if (userMap.get(key).length == 4) {
            fourTimeUserMap.set(key, userMap.get(key));
        }
        else if (userMap.get(key).length == 3) {
            threeTimeUserMap.set(key, userMap.get(key));
        }
        else if (userMap.get(key).length == 2) {
            twoTimeUserMap.set(key, userMap.get(key));
        }
        else {
            singleUserMap.set(key, userMap.get(key));
        }
    }
    tableData = [{ freq:"1", count: singleUserMap.size }, { freq:"2", count: twoTimeUserMap.size }, { freq:"3", count: threeTimeUserMap.size }, { freq:"4", count: fourTimeUserMap.size }, { freq:"5+", count: fiveAndAboveTimeUserMap.size }];
    generateTableHead(table, ["No of Orders", "Count of Customers"]);
    generateTable(table, tableData);
    generateBarGraph();
}

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        let th = document.createElement("th");
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }
    }
}

 function generateBarGraph()
{
    //global options
    Chart.defaults.global.defaultFontFamily = 'Lato';
    Chart.defaults.global.defaultFontSize = 15;
    Chart.defaults.global.defaultFontColor = '#750CA2';

    // create a new object of chart
    let barChart = new Chart(chartContext, {
        type: "bar", //pie, horizontalBar, line, doughnut, radar
        data: {
            labels: ['1', '2', '3', '4', '5+'],
            datasets: [{
                label: 'User count',
                data: [singleUserMap.size, twoTimeUserMap.size, threeTimeUserMap.size, fourTimeUserMap.size, fiveAndAboveTimeUserMap.size],
                backgroundColor:['#77F267', '#F2DF67', '#F29E67', '#E6F267', '#67F2EF'],
                borderWidth:1,
                borderColor:'black',
                hoverBorderWidth:2,
                hoverBorderColor:'white'
            }],
            
        },
        //properties here will override the global properties
        options: {
            title:{
                display:true,
                text:'Order freq of customers',
                fontSize:20
            },
            //clicking on legend either shows the graph or removes it 
            legend:{
                // position:'right',
                labels:{
                    fontColor:'black'
                }
            },
            layout:{
                padding:{
                    left:0,
                    top:50,
                    right:0,
                    bottom:0
                }
            },
            tooltips:{
                // enabled:false
            },
            scales: {
                yAxes: [{
                    ticks: {
                        //to start y scale from 0, else it will start from minimum value in data
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


