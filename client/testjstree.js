//
// Name:    meteor-jstree-example
// Author:  tobkle
// Date:    28.02.2014
// Version: 1.0
//

Template.showtree.rendered  = function(){
      var self   = this;
      NodesApp.tree   = $('#tree');
      NodesApp.search = $('#searchNode');
      NodesApp.showTree([]);

      if (!self.handle){
           self.handle = Meteor.autorun(function(){
                NodesApp.subscriptions['nodes']  = Meteor.subscribe('nodes' );
                NodesApp.data = NodesApp.readNodeDB();
                //NodesApp.refreshTreeData( NodesApp.prepareLinearTreeData() );  // example json without collection
                  NodesApp.refreshTreeData( NodesApp.data                    );  // example with collection nodes
      }); //self.handle
    } // if (!self.handle)

    NodesApp.bindTreeEvents();
}

Template.showtree.events({
    'click #createFolder' : function (evt){
        evt.preventDefault();
        NodesApp.createNode(evt, 'default');
    },
    'click #createNode' : function (evt){
          evt.preventDefault();
          NodesApp.createNode(evt, 'file');
    },
    'click #renameNode' : function (evt){
          evt.preventDefault();
          NodesApp.renameNode(evt);
    },
    'click #deleteNode' : function (evt){
          evt.preventDefault();
          NodesApp.deleteNode(evt);
    }
});

