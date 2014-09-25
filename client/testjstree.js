//
// Name:    meteor-jstree-example
// Author:  tobkle
// Date:    28.02.2014
// Version: 1.0
//

Nodes1 = {};
Nodes2 = {};
Search1 = {};
Search2 = {};

Template.showtree.rendered  = function(){
    var self  = this;
    var nodes = [];

    Nodes1  = $('#tree1').tree();
    Nodes2  = $('#tree2').tree();

    if (!self.handle){
        self.handle = Tracker.autorun(function(){
            // refresh trees on new data
            nodes = Nodes.find();
            Nodes1.tree('option', 'data', 'Projects');
            Nodes2.tree('option', 'data', 'Contexts');
        }); //self.handle
    } // if (!self.handle)
}

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
    var ok     = callbacks.ok     || function () {};
    var cancel = callbacks.cancel || function () {};

    var events =     {};

    events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
        function (evt) {
            if (evt.type === "keydown" && evt.which === 27) {
                // escape = cancel
                cancel.call(this, evt);

            } else if (evt.type === "keyup" && evt.which === 13 ||
                evt.type === "focusout") {
                // blur/return/enter = ok/submit if non-empty
                var value = String(evt.target.value || "");
                if (value)
                    ok.call(this, value, evt);
                else
                    cancel.call(this, evt);
            }
        };

    return events;
};

var activateInput = function (input) {
    input.focus();
    input.select();
};


Template.showtree.events(

  _.extend(
            {
                'click #createFolder1' : function (evt){
                evt.preventDefault();
                Nodes1.tree('createNode', evt, 'default', 'New Folder', true);
                },
                'click #createNode1' : function (evt){
                    evt.preventDefault();
                    Nodes1.tree('createNode', evt, 'file', 'New File', true);
                },
                'click #renameNode1' : function (evt){
                    evt.preventDefault();
                    Nodes1.tree('renameNode', evt);
                },
                'click #removeNode1' : function (evt){
                    evt.preventDefault();
                    Nodes1.tree('deleteNode', evt);
                },
                'keyup #searchNode1' : function (evt){
                    evt.preventDefault();
                    Nodes1.tree('searchNode', '#searchNode1');
                },


                'click #createFolder2' : function (evt){
                    evt.preventDefault();
                    Nodes2.tree('createNode', evt, 'default', 'New Folder', true);
                },
                'click #createNode2' : function (evt){
                    evt.preventDefault();
                    Nodes2.tree('createNode', evt, 'file', 'New File', true);
                },
                'click #renameNode2' : function (evt){
                    evt.preventDefault();
                    Nodes2.tree('renameNode', evt);
                },
                'click #removeNode2' : function (evt){
                    evt.preventDefault();
                    Nodes2.tree('deleteNode', evt);
                },
                'keyup #searchNode2' : function (evt){
                    evt.preventDefault();
                    Nodes2.tree('searchNode', '#searchNode2');
                }
            }
            ,
            okCancelEvents(
                '#new-project1',
                {
                    ok: function (text, evt) {
                        var parentId = Session.get('selectedNodes')[0] || '#';
                        Nodes1.tree('createNode', evt, 'file', text, false);
                        evt.target.value = "";
                    }
                }
            )
            ,
            okCancelEvents(
                '#new-project2',
                {
                    ok: function (text, evt) {
                        var parentId = Session.get('selectedNodes')[0] || '#';
                        Nodes2.tree('createNode', evt, 'file', text, false);
                        evt.target.value = "";
                    }
                }
            )
  )


);
