
// T3 API -- client side
NodesApp         = {};
NodesApp.subscriptions = [];
NodesApp.subscriptions['nodes']  = Meteor.subscribe('nodes' );
NodesApp.tree;
NodesApp.search;
NodesApp.data;

Template.showtree.rendered  = function(){
      NodesApp.self = this;
      NodesApp.tree   = $('#tree');
      NodesApp.search = $('#searchNode');
      //showTree( prepareRecursiveTreeData() );
      //showTree( prepareLinearTreeData()    );
    if (!NodesApp.self.handle){
         NodesApp.self.handle = Meteor.autorun(function(){
             NodesApp.data = Nodes.find().fetch();
              showTree( prepareLinearTreeData()     );
           // showTree( NodesApp.data               );
        }); //self.handle
    } // if (!self.handle)
    bindTreeEvents();
}

Template.showtree.events({
    'click #createNode' : function (evt){
          evt.preventDefault();
          createNode();
    },
    'click #renameNode' : function (evt){
          evt.preventDefault();
          renameNode();
    },
    'click #deleteNode' : function (evt){
          evt.preventDefault();
          deleteNode();
    }
});

function showTree(_treeData){
   NodesApp.tree.jstree({

        "core" : {
            "animation"               : 0,
            "check_callback"          : true,
            "themes"                  : { "stripes" : true },
            'data'                    : _treeData
        },

        "types" : {
            "#" : {
                "max_children"    :  1,
                "max_depth"       : -1,
                "valid_children"  : ["root"],
                "icon"            : "/images/tree_icon.png"
            },
            "root" : {
                "max_children"    : -1,
                "max_depth"       : -1,
                "valid_children"  : ["default","folder","file"],
                "icon"            : "/images/tree_icon.png"
            },
            "folder" : {
                "max_children"    : -1,
                "max_depth"       : -1,
                "valid_children"  : ["default","folder","file"]
            },
            "default" : {
                "max_children"    : -1,
                "max_depth"       : -1,
                "valid_children"  : ["default","folder","file"]
            },
            "file" : {
                "max_children"    :  0,
                "max_depth"       :  0,
                "icon"            : "glyphicon glyphicon-file",
                "valid_children"  : []
            }
        },

        "plugins" : [
            "contextmenu",
            "dnd",
            "search",
            "state",
            "types",
            "wholerow"
        ]

    });
}

function bindTreeEvents(){
    var to = false;

   NodesApp.search.keyup(function () {
        if(to) { clearTimeout(to); }
        to = setTimeout(function () {
            var v =NodesApp.search.val();
           NodesApp.tree.jstree(true).search(v);
        }, 250);
    });

   NodesApp.tree.on("changed.jstree", function (e, data) {
        var i, j, selectedNodes = [];
        for(i = 0, j = data.selected.length; i < j; i++) {
            selectedNodes.push(data.instance.get_node(data.selected[i]).original.id);
        }
        Session.set('selectedNodes', selectedNodes);
        console.log(selectedNodes);
    });

   NodesApp.tree.on("create_node.jstree", function (node, parent) {
        var parentTreeId = parent.parent,
            newTreeId    = parent.node.id,
            newTreeText  = parent.node.text,
            parentId     =NodesApp.tree.jstree()._model.data[parentTreeId].original.id;

            console.log(node, parent);
            console.log('parentId: ', parentTreeId, 'newId: ', newTreeId, 'text: ', newTreeText, 'position: ', parent.position);
    //    if (parentTreeId ==='#'){
//
    //        Meteor.call('createProject', {label: newTreeText, parent: '', sequence: parent.position, children: [] }, function(error, id) {
    //            if (error) {
    //                return alert(error.reason);
    //            }
    //        });
//
    //    } else {
    //        parentId     = projectTree.jstree()._model.data[parentTreeId].original._id;
//
    //        Meteor.call('createProject', {label: newTreeText, parent: parentId, sequence: parent.position, children: [] }, function(error, id) {
    //            if (error) {
    //                return alert(error.reason);
    //            } else {
    //                projectTree.jstree()._model.data[newTreeId].original._id = id;
    //                // Update the parent's children array as well
    //                if (parentId !== '') {
    //                    var parentProject = Projects.findOne({ _id: parentId});
    //                    if (parentProject && id){
    //                        //parentProject.children = _.union(parentProject.children, id );
    //                        parentProject.children.splice(parent.position, 0, id);
    //                        Meteor.call('updateProjects', [ parentProject ], function(error, id) {
    //                            if (error) {
    //                                return alert(error.reason);
    //                            }
    //                        });
    //                    }
    //                }
    //            }
    //        });
    //    }
    });

}

function createNode() {
    var ref = NodesApp.tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    sel = sel[0];
    sel = ref.create_node(sel, {"type":"file"});
    if(sel) {
        ref.edit(sel);
    }
}

function renameNode() {
    var ref = NodesApp.tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    sel = sel[0];
    ref.edit(sel);
}

function deleteNode() {
    var ref = NodesApp.tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    ref.delete_node(sel);
}

function prepareLinearTreeData(){

    return [

        {
            'id'            : '0',
            'parent'        : '#',
            'position'      : 0,
            'text'          : 'Root',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'root',
            'li_attr'       : {},
            'a_attr'        : {},
        },

        {
            'id'            : '1',
            'parent'        : '0',
            'position'      :  0,
            'text'          : 'Folder 1',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'folder',
            'li_attr'       : {_id: 't1'},
            'a_attr'        : {},
        },

        {
            'id'            : '2',
            'parent'        : '0',
            'position'      : 1,
            'text'          : 'Folder 2',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'folder',
            'li_attr'       : {_id: 't2'},
            'a_attr'        : {},
        },

        {
            'id'            : '3',
            'parent'        : '1',
            'position'      : 0,
            'text'          : 'File 1',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'file',
            'li_attr'       : {_id: 't3'},
            'a_attr'        : {},
        },

        {
            'id'            : '4',
            'parent'        : '1',
            'position'      : 1,
            'text'          : 'File 2',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'file',
            'li_attr'       : {_id: 't4'},
            'a_attr'        : {},
        },

        {
            'id'            : '5',
            'parent'        : '2',
            'position'      : 0,
            'text'          : 'File 3',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'file',
            'li_attr'       : {_id: 't5'},
            'a_attr'        : {},
        },

        {
            'id'            : '6',
            'parent'        : '2',
            'position'      : 1,
            'text'          : 'File 4',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'file',
            'li_attr'       : {_id: 't6'},
            'a_attr'        : {},
        },

    ];

}