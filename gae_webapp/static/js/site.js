$(document).ready(function() {
	//showQuestionario();
});

function setLang(locale) {
	showQuestionario(locale);
	$("#lang").hide();
}

function showQuestionario(locale) {
	$.getJSON('/static/js/survey.json', function(data) {    
	    Survey
	    .StylesManager
	    .applyTheme("bootstrap");
	    Survey.defaultBootstrapCss.navigationButton = "btn";
	    window.survey = new Survey.Model(data);
	    survey
	    .onComplete
	    .add(function (result) {
	    	let questionarioMap = getMap(data);
	    	saveQuestionario(result.data, questionarioMap);
	    	//$("#survey").html(JSON.stringify(result.data));
	    	setTimeout(function() { 
	    		window.location.href = "/"; 
	    	} , 2000);
	    });
	    survey.locale = locale;
	    $("#survey").Survey({model: survey});
	});
}

function getMap(questionario) {
	let result = {};
	let pages = questionario['pages'];
	$.each(pages, function( i, v ) {
		let elements = v['elements'];
		$.each(elements, function( ii, vv ) {
			if (vv['rows']) {
				$.each(vv['rows'], function( iii, vvv ) {
					result[vvv['value']] = vvv['text']['it'];
				});
			} else {
				result[vv['name']] = vv['title'];
			}
		});
	});
	return result;
}

function saveQuestionario(risposte, map) {
	let payload = {'risposte': risposte, 'map': map}
	$.ajax({
		  type: "POST",
		  url: 'save',
		  contentType : 'application/json',
		  data: JSON.stringify(payload),
		  success: function( res, status, xhr ) {
			  console.log("Questionario salvato");
		  },
		});
}