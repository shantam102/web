var app = angular.module('myApp',[]);
 



app.directive('ngFiles', ['$parse', function ($parse) {

            function fn_link(scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                    onChange(scope, { $files: event.target.files });
                });
            };

            return {
                link: fn_link
            }
        } ]);



app.controller('AppControler', function($scope, $http) {
	$scope.videoId = 0;
    $scope.commentsList = angular.element(document.querySelector('.list-comments'));
	$scope.video=[];
		$http.get("js/comments.json")
		.then(function(response) {
			$scope.video = response.data;
			$scope.commentsList.html($scope.video[0].comment);
			
			console.log($scope.video);
		}).catch(function (err) {
			console.log(err);
		});
			 
			 
		 
	
	
	$scope.append= function(ev){
		for( var i=0; i<$scope.video.length ;i++){
			var el = angular.element(document.querySelector('#frame'));
			
			var urlArr= $scope.video[i].url;
			console.log(urlArr);
			console.log(ev);
			if( $scope.video[i].id==ev){
                $scope.commentsList.html($scope.video[i].comment);				
				el.attr("src",function() {
                                  return urlArr + '?id=' + $scope.video[i].id;
                              });
			}
		}
		
			
		
	}
	
	$scope.commentSubmit= function(ev){
	    $scope.commentText = angular.element(document.querySelector('#text')).html();
		var commentsList = angular.element(document.querySelector('.list-comments'));
		var el = angular.element(document.querySelector('#frame'));
		var newUrl = el.attr('src');
        function getUrlParameter(param, dummyPath) {
			var sPageURL = dummyPath || window.location.search.substring(1),
			sURLVariables = sPageURL.split(/[&||?]/),
			res;

			for (var i = 0; i < sURLVariables.length; i += 1) {
				var paramName = sURLVariables[i],
					sParameterName = (paramName || '').split('=');

				if (sParameterName[0] === param) {
					res = sParameterName[1];
				}
			}

			return res;
		}
		var videoId = getUrlParameter('id', newUrl);	
			
		for( var i=0; i<$scope.video.length ;i++){
			if ($scope.video[i].id == videoId) {
				
				var videoComment = $scope.video[i].comment + '\n' + '</br><div>' + $scope.commentText + '</div>' ;
				$scope.video[i].comment = videoComment;
				txt = JSON.stringify($scope.video);
				console.log( videoComment);
				// $scope.video = JSON.stringify($scope.video);				
			}
				$.ajax
					({
					  type: "POST",
					  url: "/upload",
					  crossDomain:true, 
					  dataType: "json",
					  data:JSON.stringify($scope.video)
					  
					 }).done(function ( data ) {
						  alert("ajax callback response:"+JSON.stringify(data));
				});
		}		
	}
	
				
				
	
		var formdata = new FormData();
            $scope.getTheFiles = function ($files) {
				console.log($files);
				
                angular.forEach($files, function (value, key) {
                    formdata.append(key, value);
                });
            };

            // NOW UPLOAD THE FILES.
            $scope.uploadFiles = function () {
				console.log("upload running");
			$scope.obj =[{"id" : $scope.id+1 , "url": "https://www.youtube.com/embed/5l5Xn_LOEY4?ecver=1" , "desc" : $scope.comment}];
				$scope.video=$scope.video.concat($scope.obj);	
				
				console.log($scope.video);
                var request = {
                    method: 'POST',
                    url: '/api/fileupload/',
                    data: formdata,
                    headers: {
                        'Content-Type': undefined
                    }
                };

                // SEND THE FILES.
                $http(request)
                    .then(function mySuccess(response) {
						$scope.myWelcome = response.data;
					}, function myError(response) {
						$scope.myWelcome = response.statusText;
				});
            }
});
