define(["js/qlik"], function(qlik) {
		
	angular.module('senseApp').controller('SampleController', SampleController);
	SampleController.$inject = ['$scope'];

	function SampleController($scope) {
		$scope.selections = []; 

		$scope.messages = {
			hello: 'Hello! This message is generated within an Angular controller.'
		};         
		
		// set a timeout function to show interactivity
		window.setTimeout(function(){
			$scope.messages.hello = 'Dynamic apps are possible with Angular and Qlik.'; 
			
			// load a new qlik object in the same div           
			senseApp.getObject('qlik_object', 'f8aebc69-7221-43f2-a242-69e643910459'); 
		}, 4000); 

		// connect to the operations monitor app
		var senseApp = qlik.openApp('5f6ff48b-bf74-4367-8745-6a43dd807943', config); 
		
		// Get an object from the operations monitor
		senseApp.getObject('qlik_object', 'sXmnF'); // add your own object ID here 
		
		// This will fire every time selections change
		senseApp.getList('SelectionObject', function(the_selections){
			console.log('the_selections is', the_selections); 
			angular.copy(the_selections.qSelectionObject.qSelections, $scope.selections);             
		}); 

		// get the selections bar
		senseApp.getObject('CurrentSelections','CurrentSelections');

	}

	
	// return from define module 
	return {}
});