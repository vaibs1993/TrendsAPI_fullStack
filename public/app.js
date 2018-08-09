var trends = angular.module('trends', []);
trends.controller('mainController',['$scope','$http', function($scope,$http) {
   // $scope.showLoader= true;
    $scope.searchObj = '';
    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
        console.log(ReportTitle,"inside func");
        var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
        
        var CSV = '';    
        
        CSV += ReportTitle + '\r\n\n';
        if (ShowLabel) {
            var row = "";
            
            for (var index in arrData[0]) {
                row += index + ',';
            }
    
            row = row.slice(0, -1);
            
            CSV += row + '\r\n';
        }
        
        for (var i = 0; i < arrData.length; i++) {
            var row = "";
            
            for (var index in arrData[i]) {
                row += '"' + arrData[i][index] + '",';
            }
    
            row.slice(0, row.length - 1);
            CSV += row + '\r\n';
        }
    
        if (CSV == '') {        
            alert("Invalid data");
            return;
        }   
        
        var fileName = "Trends_";
        fileName += ReportTitle.replace(/ /g,"_");   
        
        var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
         
        
        var link = document.createElement("a");    
        link.href = uri;
        
        link.style = "visibility:hidden";
        link.download = fileName + ".csv";
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    //function to split user input and pass to api. and get the response and prepare xls sheet. 
    $scope.filterData = function(searchObj){
        $scope.showLoader = true;
        console.log('inside func')
        text = searchObj.split(','); //spliting multiple words
        for(var i=0;i<text.length;i++){
            $scope.filename = text[i];
             //call nodejs api 
            $http.post('http://localhost:8080/api/users',{data:  $scope.filename})
            .then(function(data1){
                concatedList = [];
                finalList = []
                responseData = JSON.parse(data1.data.res);
                responseData = responseData.default.rankedList;
                console.log(responseData);

                //form list of all data.
                responseData.forEach(element => {
                concatedList = concatedList.concat(element.rankedKeyword);
                });

                //form new list with query and value keys.
                concatedList.forEach(element=>{
                    obj = {
                        query:element.query,
                        value:element.value
                    }
                    finalList.push(obj);

                })
                console.log( );
                JSONToCSVConvertor(finalList ,data1.data.filename, true);
                $scope.showLoader = false;
    
            });
        }
        
    }
    
  
    
    }]);