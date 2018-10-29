google.charts.load("current", {packages:["corechart", "table", "annotatedtimeline"]});
google.charts.setOnLoadCallback(firstRun);


function drawCharts() {
	if(isDataRangeValid()) {
		$("#preloader").show();
		$("#result").html("");
		$("#timeseries").html("");
		
		$.ajax({
		      type: "GET",
		      url: "/admin/get-questions",
		      contentType: "application/json",
		      success: function (questions) {
		      $("#preloader").hide();
		      for (let i in questions) {
		    	  drawChart(questions[i]["key"], questions[i]["text"], $("#from_date").val(), $("#to_date").val());
		    	  changeTo("chart", "timeseries", "table");
		      } 
		    	  
		      },
		      error: function (xhr, ajaxOptions, thrownError) {
		    	console.log(xhr.status);
		    	console.log(thrownError);
		      }
		    });
		
		let payload = '{ "from": "' + $("#from_date").val() + '", "to": "' + $("#to_date").val() + '" }'
		$.ajax({
			type: "POST",
		      url: "/admin/get-answers-by-day",
		      contentType: "application/json",
		      data: payload,
		      success: function (answers) {
		    	  $("#totalnum").html("Numero di risposte nel periodo: " + answers['total']);
		    	  drawTimeSeries(answers);
		      },
		      error: function (xhr, ajaxOptions, thrownError) {
		    	console.log(xhr.status);
		    	console.log(thrownError);
		      }
		});
	}

}

function drawTimeSeries(answers) {
	$("#timeseries").html("");
	let data = new google.visualization.DataTable();
    data.addColumn('date', 'Data');
    data.addColumn('number', 'Risposte');
    let rows = [];
    $.each(answers['data'], function( index, value ) {
    	rows.push([new Date(value[0]), value[1]]);
    });
    data.addRows(rows);

    $("#timeseries").append('<div class="row"><div class="col s12" style="margin-top: 20px">Serie temporale</div></div>');
    $("#timeseries").append('<div class="row"><div class="col s12"><div id="timechart" style="width: 100%; height: 500px;"></div></div></div>');
    
    let chart = new google.visualization.AnnotatedTimeLine(document.getElementById('timechart'));
    chart.draw(data, {
    	displayAnnotations: false,
    	width: '100%', 
    	height: '100%'	
    });
}

function drawChart(qid, title, from, to) {
	let payload = '{ "qid": "' + qid + '", "from": "' + from + '", "to": "' + to + '" }'
	$.ajax({
	      type: "POST",
	      url: "/admin/get-answers",
	      contentType: "application/json",
	      data: payload,
	      success: function (answers) {
	    	
	    	$("#result").append('<div class="row"><div class="col s12 title" style="margin-top: 20px">' + title + '</div></div>');
	    	$("#result").append('<div class="row"><div class="col s12"><div class="chart" id="'+ qid +'"></div></div><div class="col s12"><div style="display:none" class="table" id="'+ qid +'_table"></div></div></div>');
	        let data = google.visualization.arrayToDataTable(answers);
	        var options = {
	        		width: '100%', 
	  	      	  	height: '100%',
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

function changeTo(toshow, tohide1, tohide2) {
	$( "." + tohide1 ).each(function( index ) {
		$( this ).hide();
	});
	
	$( "." + tohide2 ).each(function( index ) {
		$( this ).hide();
	});
	
	$( "." + toshow ).each(function( index ) {
		$( this ).show();
	});	
	
	if (toshow == "timeseries") {
		$( ".title" ).each(function( index ) {
			$( this ).hide();
		});
	} else {
		$( ".title" ).each(function( index ) {
			$( this ).show();
		});
	}
}

function showTimeSeries() {
	if($("#timeseries").is(":visible")) {
		$("#timeseries").hide();
	} else {
		$("#timeseries").show();
	}
	
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

function setActive(id) {
	$(".mynavbtn").each(function( index ) {
		$( this ).removeClass("active");
	});
	$("#"+id).addClass("active");
}

function firstRun() {
	$("#date_range").hide();
	setActive("month");
	var today = new Date();
	$("#from_date").val("01-" + (today.getMonth()+1) + "-" + today.getFullYear());
	$("#to_date").val(today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear());
	drawCharts();
}

function drawToday() {
	$("#date_range").hide();
	setActive("today");
	var today = new Date();
	var todayString = today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear();
	$("#from_date").val(todayString);
	$("#to_date").val(todayString);
	drawCharts();
}

function drawMonth() {
	$("#date_range").hide();
	firstRun();
	drawCharts();
}

function drawYear() {
	$("#date_range").hide();
	setActive("year");
	var today = new Date();
	$("#from_date").val("01-01-" + today.getFullYear());
	$("#to_date").val(today.getDate() + "-" + (today.getMonth()+1) + "-" + today.getFullYear());
	drawCharts();
}

function showCustom() {
	$("#date_range").show();
	setActive("custom");
}

function isDataRangeValid() {
	if ($("#from_date").val() && $("#to_date").val() && $("#from_date").val() != "" && $("#to_date").val() != "") {
		let fromDateSplitted = $("#from_date").val().split("-");
		let currFrom = new Date(fromDateSplitted[2] + "-" + fromDateSplitted[1] + "-" + fromDateSplitted[0] + "T00:00:00Z");
		let toDateSplitted = $("#to_date").val().split("-");
		let currTo = new Date(toDateSplitted[2] + "-" + toDateSplitted[1] + "-" + toDateSplitted[0] + "T23:59:59Z");
		if (currTo > currFrom) {
			return true;
		}
		M.toast({html: 'Date non compatibili!'});
		return false;
	}
}