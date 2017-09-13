angular.module('todo',[])
    .controller('todoCtro',['$scope',function($scope){
        $scope.taskList=[];
        getTasks();
        //获取数据
        function getTasks(){
            if(localStorage.getItem('taskList')){
                $scope.taskList= angular.fromJson(localStorage.getItem('taskList'));
            };
        }

    // 添加任务
    // 1. 获取用户输入的任务
    // 2.准备一个任务列表数组
    // 3. 监听输入框的回撤事件
    // 4. 将任务添加到任务列表
    // 5. 利用ng-repeat 指令将任务列表显示在页面中

    $scope.addTask = function(event){
        //用户按的是回车键，并且文本框有值
           if(event.keyCode == 13 && $scope.task){
               $scope.taskList.push({
                   name:$scope.task,
                   isCompleted:false, //未选中 新添加任务处于未选中状态
                   isEditing:false  //代表当前任务是否处于编辑状态 false 代表未处于编辑状态
               });
               $scope.task='';
               //将数据存储在本地
               //angular.toJson将对象 转化为json字符串
               localStorage.setItem('taskList',angular.toJson($scope.taskList));

           }
    }

    //删除任务
    //1. 给删除按钮添加点击事件
    //2. 把要删除的任务传递进入事件函数中
    //3. 删除任务

    $scope.deleteTask=function(task){
        //从数组里面删除元素splice（）
        //$scope.taskList.indexOf(task);//返回当前任务所在数组中的索引值
        $scope.taskList.splice($scope.taskList.indexOf(task),1);
    }
    //计算未完成任务的数量
    //在模板插值表达式调用函数，目的显示函数返回值
    $scope.unCompletedTaskNum = function(){
        //filter对数组的内容进行过滤，内部会循环遍历数组
        return $scope.taskList.filter(function(item){//item当前循环项
               return !item.isCompleted; //过滤条件 否和条件显示
        }).length;
    }

    // 更改任务状态
    $scope.selected='All';
    $scope.filterData=function(type){
            switch(type){
                case 'All' :
                    $scope.filterType='';
                    $scope.selected='All';
                    break;
                case 'Active' :
                    $scope.filterType=false;
                    $scope.selected='Active';
                    break;
                case 'Completed' :
                    $scope.filterType=true;
                    $scope.selected='Completed';
                    break;
            }
    }
   //批量更改任务状态
    $scope.changeStatus = function(){
        $scope.taskList.forEach(item => item.isCompleted = $scope.status);
    }
   // 只要有一项任务未完成，就取消高亮 第一种写法
    $scope.updataStatus=function(){
        for(var i=0; i<$scope.taskList.length; i++){
            if(!$scope.taskList[i].isCompleted){
                $scope.status=false;
                return;
            }
        }
        $scope.status=true;
    }

    //第二种方法
    //$scope.status = $scope.taskList.filter(item => !item.isCompleted).length==0;
//更改任务名字
    $scope.modifyTaskName=function(task ){
        //$scope.taskList.forEach(item => item.isEditing = false);
        //将所有任务取消编辑状态
        for(var i=0; i<$scope.taskList.length; i++){
            $scope.taskList[i].isEditing=false;
        }
        //将当前双击的任务添加编辑状态
          task.isEditing=true;
    }

    //失去焦点时取消编辑状态
    $scope.cancelEditing=function(){
        for(var i=0; i<$scope.taskList.length; i++){
            $scope.taskList[i].isEditing=false;
        }
    }
        //监听数据一旦改变后，立即添加存储本地中
        $scope.$watch('taskList',function(){
            localStorage.setItem('taskList',angular.toJson($scope.taskList));
        },true)
}])
       //自定义指令 文本框获取焦点
    .directive('inpFocus',['$timeout',function($timeout){
        return {
              restrict:'A',//规定的使用方式 属性指令
              link:function(scope,element,attributes){
                  //scope.$watch监听值改变
                  scope.$watch('item.isEditing',function(newValue){
                      if(newValue){
                          $timeout(function(){
                              //先显示文本框 再获取焦点
                              element[0].focus();//将jqLite对象转化为原生js对象
                          },0)

                      }
                  })
              }
        }
    }])
