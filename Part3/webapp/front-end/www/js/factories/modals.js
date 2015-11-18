angular.module('app.factories')

.factory('$modals', ['$ionicModal', function ($ionicModal) {

    return {

        show: function (view, scope) {

            var service = this;
            scope = scope || null;

            $ionicModal.fromTemplateUrl('templates/' + view + '.html', {
                scope: scope,
                animation: 'slide-in-right',
                controller: view + 'CTRL'
            }).then(function (modal) {
                service.modal = modal;
                service.modal.show();
            });
        },

        hide: function () {
            var service = this;
            service.modal.hide();
        },

        destroy: function () {
            var service = this;
            console.log('modal destroyed!');
            service.modal.remove();
        }
    };
}]);
