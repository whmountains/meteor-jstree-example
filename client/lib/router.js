/**
 * Created by tobias on 09.03.14.
 */

Router.configure({
    layoutTemplate:  'layout',
    loadingTemplate: 'loading',
    waitOn: function(){ return Meteor.subscribe('nodes');}
});

Router.map(function(){
    this.route("showtree",{
        path:"/",
        template:"showtree",
        data:function(){
            // this will be used as the current data context in your template
            return '';
        }
    });
});