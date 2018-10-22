google.charts.load("current", {packages:["corechart", "table"]});
google.charts.setOnLoadCallback(drawCharts);


function drawCharts() {
	$.ajax({
	      type: "GET",
	      url: "/admin/get-questions",
	      contentType: "application/json",
	      success: function (questions) {
	        
	      for (let i in questions) {
	    	  drawChart(questions[i]["key"], questions[i]["text"], "2018-10-15", "2018-10-17");
	      } 
	    	  
	      },
	      error: function (xhr, ajaxOptions, thrownError) {
	    	console.log(xhr.status);
	    	console.log(thrownError);
	      }
	    });
}

var g_answers = [];
function drawChart(qid, title, from, to) {
	g_answers = [];
	let payload = '{ "qid": "' + qid + '", "from": "' + from + '", "to": "' + to + '" }'
	$.ajax({
	      type: "POST",
	      url: "/admin/get-answers",
	      contentType: "application/json",
	      data: payload,
	      success: function (answers) {
	    	
	    	g_answers = answers;
	    	//$("#result").append('<div class="row"><div class="col col-sm-12 col-md-6"><div id="' + qid +'" style="width: 100%"></div></div><div class="col col-sm-12 col-md-6"><div id="' + qid +'_table" style="margin-top:30px"></div></div></div>');
	    	$("#result").append('<div class="row" style="margin-left: 0px"><div class="col col-sm-12">' + title + '</div>');
	    	$("#result").append('<div class="row">');
	    	$("#result").append('<div class="col col-sm-12"><div class="chart" id="'+ qid +'"></div></div>');
	    	$("#result").append('<div class="col col-sm-12"><div style="display:none" class="table" id="'+ qid +'_table"></div></div>');
	    	$("#result").append('</div>');
	    	
	        let data = google.visualization.arrayToDataTable(answers);
	        var options = {
	        		legend: 'right',
	                pieSliceText: 'percentage',
	                backgroundColor: {strokeWidth: 1 },
	                chartArea:{left:20,top:20,width:'80%',height:'80%'}
	        };
	        let currChart = new google.visualization.PieChart(document.getElementById(qid));
	        currChart.draw(data, options);
	        

	        let dataTable = new google.visualization.DataTable();
	        dataTable.addColumn('string', 'Risposta');
	        dataTable.addColumn('number', 'Numero risposte');
	        dataTable.addRows(answers.slice(1));
	        let table = new google.visualization.Table(document.getElementById(qid +'_table'));
	        table.draw(dataTable, {
	      	  showRowNumber: false, 
	      	  width: '100%', 
	      	  height: '100%',
	      	  cssClassNames: {
	      		  headerRow : "bcol"
	      	  	}
	          });

	      },
	      error: function (xhr, ajaxOptions, thrownError) {
	    	console.log(xhr.status);
	    	console.log(thrownError);
	      }
	});
}

function changeTo(from, to) {
	$("#" + from + "_btn").hide();
	$("#" + to + "_btn").show();
	
	$( "." + to ).each(function( index ) {
		$( this ).hide();
	});
	
	$( "." + from ).each(function( index ) {
		$( this ).show();
	});
	
}
/**
//google.charts.load('current', {'packages':['table']});
google.charts.setOnLoadCallback(drawTable);

function drawTable() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Risposta');
  data.addColumn('number', 'Numero risposte');
  data.addRows([
    ['Mike',  123],
    ['Jim',   4333],
    ['Alice', 3433]
  ]);

  var table = new google.visualization.Table(document.getElementById('table_div'));

  table.draw(data, {
	  showRowNumber: false, 
	  width: '100%', 
	  height: '100%',
	  cssClassNames: {
		  headerRow : "bcol"
	  }
		  });
}
*/