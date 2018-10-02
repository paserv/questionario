function showQuestionario() {
	$.getJSON('/static/js/survey.json', function(data) {
	    console.log(data);
	    window.survey = new Survey.Model(data);
	    survey
	    .onComplete
	    .add(function (result) {
	        document
	            .querySelector('#survey')
	            .innerHTML = "result: " + JSON.stringify(result.data);
	    });

	$("#survey").Survey({model: survey});
	});
}
