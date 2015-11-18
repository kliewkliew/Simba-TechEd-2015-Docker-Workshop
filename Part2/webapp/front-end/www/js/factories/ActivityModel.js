angular.module('app.factories')

.factory('ActivityModel', function () {

    function ActivityModel(data) {
        for (var attr in data) {
            if (data.hasOwnProperty(attr))
                this[attr] = data[attr];
        }
    }

    Job.prototype.getResult = function () {
        if (this.status == 'complete') {
            if (this.passed === null) return "Finished";
            else if (this.passed === true) return "Pass";
            else if (this.passed === false) return "Fail";
        }
        else return "Running";
    };

});
