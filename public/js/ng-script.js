
var myapp = angular.module("angel", ['ngRoute','angular-loading-bar']);
myapp.controller("homepageCtrl",function($scope,$http,$location,$route){

	$http.get('/fetchProject').then(function(projects){
		$scope.projects=projects.data;
		console.log($scope.projects);
	},function(err){
		console.log(err);
	});
	$scope.donate=function(Id)
	{
		$http.get('/donate/'+Id).then(function(result){
			//alert('Donation Successfull');
			console.log(result.data);
		});
	}
	var d=new Date();
		if(d.getDate()=='1')
		{
			var wallet=prompt("It's 'Pehli Tarikh'.Please Recharge your wallet", "50$");
			$http.get('/putMoney/'+wallet+'/'+Id).then(function(result){
				$scope.wallet=result.data;
			})
		}
	$scope.like=function(param){
		var Id=param;
		$http.get('/likeIt/'+Id).then(function(result){
			alert("successfully liked");
			//$location.path('/');
			$scope.likes=result.likes;
			$route.reload();
		},function(err)
		{
			console.log(err);
		});
	};
	$scope.venue="homepage";
	console.log($scope.venue);
});
myapp.controller("addNewCtrl",function($scope,$http,$location){
	$scope.venue="addNew";
	$scope.save=function(){
		//console.log($scope.pname);
		$http.get('/addNewProject/'+$scope.pname+'/'+$scope.email+'/'+$scope.details+'/'+$scope.address+'/'+$scope.purpose+'/'+$scope.select)
		.then(function(result){
			console.log(result);
			$scope.poster=result.data;
			//var project=result.data;
			$location.path('/');
			/*var Data = {
				document:[]
			};
			Data.document.push({
					"title":project.projectName,
					"content":project.details,
					"address":project.address,
					"main":project.genre[0].main,
					"sub":project.genre[0].sub,
					"household":project.genre[0].household
			});
			//console.log(Data);
			var temp=JSON.stringify(Data);
			//console.log(temp);
			$http.get("https://api.idolondemand.com/1/api/sync/addtotextindex/v1?apikey=2e18280a-7b6d-492e-b157-262819851445&index=angelhack&json="+temp)
			.then(function(result){
				$scope.dummy=result.data;
				$location.path('/');
			},function(err){
				console.log(err);
			});*/
		},function(err){
			console.log(err);
		});
	}
	console.log($scope.venue);
});
myapp.controller("mostVouchedCtrl",function($scope,$http){
	$scope.venue="mostVouched";
	$http.get('/fetchProject').then(function(projects){
		$scope.projects=projects.data;
		console.log($scope.projects);
	},function(err){
		console.log(err);
	});
	$scope.donate=function(Id)
	{
		$http.get('/donate/'+Id).then(function(result){
			//alert('Donation Successfull');
			console.log('there');
		});
	}
	$scope.like=function(param){
		var Id=param;
		$http.get('/likeIt/'+Id).then(function(result){
			alert("successfully updated");
			$scope.likes=result.likes;
			//$location.path('/');
			$route.reload();
		},function(err)
		{
			console.log(err);
		});
	};
	//console.log($scope.venue);
});
myapp.controller("projectCtrl",function($scope,$http,$routeParams,$route){
	$scope.venue="Project";
	$scope.projectID=$routeParams.projectID;
	var Id=$routeParams.projectID;
	$http.get('/fetchSpecific/'+Id).then(function(result){
		//console.log(result);
        	$scope.details=result.data;
        	//console.log($scope.projectID);
        	//console.log($scope.details);
        });
	$scope.donate=function(Id)
	{
		$http.get('/donate/'+Id).then(function(result){
			//alert('Donation Successfull');
			console.log(result.data);
		});
	}
	$scope.loadComments=function(){
		$scope.hide=true;
		$http.get('/fetchComments/'+$routeParams.projectID).then(function(result){
			$scope.comm=result.data;
			console.log($scope.comm);
		});

	}
	$scope.leave=function(){
		var data=$scope.comment;
		$http.get('https://api.idolondemand.com/1/api/sync/analyzesentiment/v1?apikey=2e18280a-7b6d-492e-b157-262819851445&text='+data)
		.then(function(result){
			console.log('here');
			$scope.score=result.data.aggregate.score;
			console.log($scope.score);
			$http.get('/leaveComment/'+$scope.score+'/'+$routeParams.projectID+'/'+data).then(function(result){
			$scope.detail=result.data;
			console.log($scope.detail);
			alert('Your Comment Have been submitted!');
			$route.reload();
		});
		});
		
	}
	
});
myapp.controller("beneficiaryCtrl",function($http,$scope,$location){

	$http.get('/show').then(function(result){
		$scope.details=result.data;
		$scope.Id=result.data._id;
		console.log($scope.details);
		if($scope.details[0].asBeneficiar.projectDetail.length==0)
		{
			alert('You have not created any project yet to be a beneficiary!!');
			$location.path('#/addNew');
		}
	});
});
myapp.controller("contributorCtrl",function($scope,$http,$location){
	$http.get('/show').then(function(result){
		$scope.details=result.data;
		console.log($scope.details[0].asContributor.payment_info);
		if($scope.details[0].asContributor.payment_info.length==0)
		{
			alert("You have not contributed yet!");
			window.open('#/latest')
		}
		$scope.val=$scope.details[0].asContributor.paymentThisMonth/$scope.details[0].asContributor.payment_info.length;
	});
});
myapp.controller("addCtrl",function($scope,$http,$routeParams){
	$scope.venue="adding";
	console.log($scope.purpose);
	console.log($scope.venue);
});
myapp.config(['$routeProvider',function($routeProvider){
	$routeProvider.
	when('/',
	{
			templateUrl:"views/homepage.html",
			controller:"homepageCtrl"
	}).
	when('/project/:projectID',{
		templateUrl:"views/project.html",
		controller:"projectCtrl"
	}).
	when('/beneficiary',{
		templateUrl:"views/beneficiary.html",
		controller:"beneficiaryCtrl"
	}).
	when('/contributor',{
		templateUrl:"views/contributor.html",
		controller:"contributorCtrl"
	}).
	when('/latest',{
		templateUrl:"views/homepage.html",
		controller:"homepageCtrl"
	}).
	when('/addNew',{
		templateUrl:"views/addNew.html",
		controller:"addNewCtrl"
	}).
	when('/mostVouched',{
		templateUrl:"views/mostVouched.html",
		controller:"mostVouchedCtrl"
	}).
	otherwise({
		redirectTo:"/latest"
	});
}]);