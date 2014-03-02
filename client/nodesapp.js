/**
 * Created by tobias on 28.02.14.
 */
NodesApp               = {};
NodesApp.subscriptions = [];
NodesApp.subscriptions['nodes']  = Meteor.subscribe('nodes' );
NodesApp.tree          = {};
NodesApp.search        = {};
NodesApp.data          = [];


// REFRESH TREE ON DATA CHANGES FROM DB (SEE METEOR.DEPS)
NodesApp.refreshTreeData = function(_treeData){
    NodesApp.tree.jstree(true).settings.core.data = _treeData;
    NodesApp.tree.jstree(true).refresh();
}


// REGISTER EVENT HANDLERS FOR TREE OPERATIONS
NodesApp.bindTreeEvents = function(){
    NodesApp.bindNodeSearched ();
    NodesApp.bindNodeChanged  ();
    NodesApp.bindNodeCreated  ();
    NodesApp.bindNodePasted   ();
    NodesApp.bindNodeRenamed  ();
    NodesApp.bindNodeDeleted  ();
    NodesApp.bindNodeMoved    ();
    NodesApp.bindNodeMoveCheck();
}


NodesApp.bindNodeMoveCheck = function(){
    $(document).on('dnd_move.vakata', function (e, data) {
        //console.log(data);
        var t = $(data.event.target);
        console.log(t.closest('.jstree-node').attr('id') );
        if(!t.closest('.jstree').length) {
            if(t.closest('.drop').length) {
                data.helper.find('.jstree-icon').removeClass('jstree-er').addClass('jstree-ok');
            }
            else {
                data.helper.find('.jstree-icon').removeClass('jstree-ok').addClass('jstree-er');
            }
        }
    });
}

// SEARCH FOR NODES IN TREE ON SEARCH FIELD CHANGES
NodesApp.bindNodeSearched = function(){
    var to = false;
    NodesApp.search.keyup(function () {
        if(to) { clearTimeout(to); }
        to = setTimeout(function () {
            var v =NodesApp.search.val();
            NodesApp.tree.jstree(true).search(v);
        }, 250);
    });
}

// UPDATE DB AFTER EACH TREE NODE CREATION
NodesApp.bindNodeCreated = function(){
    NodesApp.tree.on("create_node.jstree", function (node, parent) {
        NodesApp.createNodeDB(
            {
                text:       parent.node.text,
                type:       parent.node.type,
                parent:     parent.parent,
                position:   parent.position,
            });
    });
}

// UPDATE DB AFTER EACH TREE NODE CREATION
NodesApp.bindNodePasted = function(){
    NodesApp.tree.on("paste.jstree", function (node, parent) {
        for (var i = 0; i < parent.node.length; i++){
            NodesApp.createNodeDB(
                {
                    text:       parent.node[i].text,
                    type:       parent.node[i].type,
                    parent:     parent.node[i].parent,
                    children:   parent.node[i].children,
                    position:   parent.node[i].original.position
                }
            );
        }
    });
}

// UPDATE SESSION VARIABLE WITH THE CURRENT TREE ELEMENT(S)
NodesApp.bindNodeChanged = function(){
    NodesApp.tree.on("changed.jstree", function (e, data) {
        var selectedNodes = [];
        for(var i = 0; i < data.selected.length; i++) {
            selectedNodes.push(data.instance.get_node(data.selected[i]).original.id);
        }
        Session.set('selectedNodes', selectedNodes);
    });
}

// UPDATE DB AFTER RENAMING OF NODE
NodesApp.bindNodeRenamed = function(){
    NodesApp.tree.on("rename_node.jstree", function (node, newText, oldText) {
                NodesApp.updateNodesDB(
                    [
                        {
                             id:        newText.node.id,
                            text:       newText.text
                        }
                    ]
                );
    });
}

// UPDATE DB AFTER EACH NODE DRAG AND DROP
NodesApp.bindNodeMoved = function(){
    NodesApp.tree.on("move_node.jstree", function (node, parent) {
        var updateNodes = [];
        // get the right order of parent's child elements
        NodesApp.tree.jstree("get_children_dom", parent.parent)
            .each(function(index){
                  var _node = NodesApp.tree.jstree(true).get_node(this.id);
                  if (this.id != parent.node.id){
                        updateNodes.push({
                              "id":          this.id,
                              "position":    index
                        });
                  }
        });
        // get the right order of former's parent's child elements
        if (parent.parent != parent.old_parent){
            NodesApp.tree.jstree("get_children_dom", parent.old_parent)
                .each(function(index){
                    var _node = NodesApp.tree.jstree(true).get_node(this.id);
                    if (this.id != parent.node.id){
                        updateNodes.push({
                            "id":          this.id,
                            "position":    index
                        });
                    }
            });
        }
        // adjust also the parent of the moved node
        updateNodes.push({
            "id":       parent.node.id,
            "parent":   parent.parent,
            "position": parent.position
        });
        NodesApp.updateNodesDB(updateNodes);
    });
}


// UPDATE DB AFTER TREE ELEMENT WAS DELETED
NodesApp.bindNodeDeleted = function(){
    NodesApp.tree.on("delete_node.jstree", function (node, parent) {
        NodesApp.deleteNodeDB( NodesApp.buildDeleteTree( [parent.node.id] ) );
    });
}

// DELETE LEAF AND BRANCH OF TREE RECURSIVELY
NodesApp.buildDeleteTree = function(_deleteTree){
    var deleteNodes = Nodes.find( {"parent" : {$in: _deleteTree}} ).fetch();     // get all Nodes, whose parent is deleted
    var childrenIds = _.pluck(deleteNodes, 'id');                                // get all Ids of the nodes
    if (childrenIds.length > 0) {
        // if there are, read their childrenIds, and add them to the array
        _deleteTree = _.union(_deleteTree, NodesApp.buildDeleteTree(childrenIds));
    }
    return _deleteTree;
}

// OPERATIONS FROM OUTSIDE...
NodesApp.createNode = function(_evt, _type) {
    var ref = NodesApp.tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    sel = sel[0];
    sel = ref.create_node(sel, {"type": _type});
    if(sel) {
        ref.edit(sel);
    }
}

NodesApp.renameNode = function(evt) {
    var ref = NodesApp.tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    sel = sel[0];
    ref.edit(sel);
}

NodesApp.deleteNode = function(evt) {
    var ref = NodesApp.tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    ref.delete_node(sel);
}


// PERSISTENCE FUNCTIONS...
NodesApp.createNodeDB = function( _node ){
    Meteor.call('createNode', _node, function(error, id) {
        if (error) {
            return alert(error.reason);
        } else {
            if (_node.children){
                for (var child = 0; child < _node.children.length; child++){
                    var childNode =  NodesApp.tree.jstree(true).get_node(_node.children[child]);
                        NodesApp.createNodeDB(
                            {
                                text:       childNode.text,
                                type:       childNode.type,
                                parent:     id,
                                children:   childNode.children,
                                position:   child
                            }
                        );
                }
            }
        }
    });
}

NodesApp.updateNodesDB = function(_nodes){
    Meteor.call('updateNodes', _nodes, function(error, id) {
        if (error) {
            return alert(error.reason);
        }
    });
}

NodesApp.deleteNodeDB = function(_nodes){
    Meteor.call('removeNodes', _nodes, function(error, id) {
        if (error) {
            return alert(error.reason);
        }
    });
}

NodesApp.readNodeDB = function(){
    var _nodes = Nodes.find({},{sort: ["position","asc"] }).fetch();
    return _nodes;
}

// TREE SETTINGS
NodesApp.showTree = function(_treeData){
    NodesApp.tree.jstree({
        "core" : {
            "animation"               : 0,
            "check_callback"          : function(operation, node, parent, position)
            {
                var tree      = NodesApp.tree.jstree(true);
                var selected  = tree.get_selected();
                //console.log(operation, parent.type);
                return true;
            },
            "themes"                  : { "stripes" : true },
            'data'                    : _treeData
        },
        "plugins" : [
            "contextmenu",
            "dnd",
            "search",
            "state",
            "types",
            "wholerow"
        ],
        "types" : {
            "#" : {
                "max_children"      : 1,
                "max_depth"         : 4,
                "valid_children"    : ["root"]
            },
            "root" : {
                "icon"              : "/images/tree_icon.png",
                "valid_children"    : ["default"]
            },
            "default" : {
                "valid_children"    : ["default","file"]
            },
            "file" : {
                "icon"              : "glyphicon glyphicon-file",
                "valid_children"    : []
            }
        },
        dnd: {
            /**
             * Check if item is draggable
             * @param {Object} e
             * @returns {Boolean}
             */
            is_draggable: function(e)
            {
                var not_draggable = ["root", "#"];
                if ($.inArray(e.type, not_draggable))
                {
                    // We can't drag this item
                    console.log("can't drag this: ", e.id);
                    return true;
                }
                return false;
            },
            /**
             * Check move_node only when user drops
             * @returns {Boolean}
             */
            check_while_dragging: true
        },
        "contextmenu" : {
            "items" : function (o, cb) {
                return {
                    "createSubMenu":           {
                        "separator_before"	: false,
                        "separator_after"	: true,
                        "_disabled"			: false,
                        "label"             : "Create...",
                        "action"            : false,
                        "icon"              : "glyphicon glyphicon-asterisk",
                        "submenu"           : {
                            "createFolder":         {
                                "separator_before"	: false,
                                "separator_after"	: false,
                                "_disabled"			: false,
                                "label"             : "Folder",
                                "action"            : function(data){
                                    var inst = $.jstree.reference(data.reference),
                                        obj  = inst.get_node(data.reference);
                                    inst.create_node(obj, {type: 'default'}, "last", function (new_node) {
                                        setTimeout(function () { inst.edit(new_node); },0);
                                    });
                                },
                                "icon"              : "glyphicon glyphicon-asterisk"
                            },
                            "createFile":           {
                                "separator_before"	: false,
                                "separator_after"	: false,
                                "_disabled"			: false,
                                "label"             : "File",
                                "action"            : function(data){
                                    var inst = $.jstree.reference(data.reference),
                                        obj  = inst.get_node(data.reference);
                                    inst.create_node(obj, {type: 'file'}, "last", function (new_node) {
                                        setTimeout(function () { inst.edit(new_node); },0);
                                    });
                                },
                                "icon"              : "glyphicon glyphicon-asterisk"
                            }
                        }
                    },
                    "rename" : {
                        "separator_before"	: false,
                        "separator_after"	: false,
                        "_disabled"			: false,
                        "label"				: "Rename",
                        "shortcut"			: 113,
                        "shortcut_label"	: 'F2',
                        "icon"              : "glyphicon glyphicon-pencil",
                        "action"			: function (data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            inst.edit(obj);
                        }
                    },
                    "remove" : {
                        "separator_before"	: false,
                        "icon"				: false,
                        "separator_after"	: false,
                        "_disabled"			: false,
                        "label"				: "Delete",
                        "action"			: function (data) {
                            var inst = $.jstree.reference(data.reference),
                                obj = inst.get_node(data.reference);
                            if(inst.is_selected(obj)) {
                                inst.delete_node(inst.get_selected());
                            }
                            else {
                                inst.delete_node(obj);
                            }
                        },
                        "icon"              : "glyphicon glyphicon-remove"
                    },
                    "ccp" : {
                        "separator_before"	: true,
                        "icon"				: false,
                        "separator_after"	: false,
                        "label"				: "Edit",
                        "action"			: false,
                        "submenu" : {
                            "cut" : {
                                "separator_before"	: false,
                                "separator_after"	: false,
                                "label"				: "Cut",
                                "action"			: function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    if(inst.is_selected(obj)) {
                                        inst.cut(inst.get_selected());
                                    }
                                    else {
                                        inst.cut(obj);
                                    }
                                }
                            },
                            "copy" : {
                                "separator_before"	: false,
                                "icon"				: false,
                                "separator_after"	: false,
                                "label"				: "Copy",
                                "action"			: function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    if(inst.is_selected(obj)) {
                                        inst.copy(inst.get_selected());
                                    }
                                    else {
                                        inst.copy(obj);
                                    }
                                }
                            },
                            "paste" : {
                                "separator_before"	: false,
                                "icon"				: false,
                                "_disabled"			: function (data) {
                                    return !$.jstree.reference(data.reference).can_paste();
                                },
                                "separator_after"	: false,
                                "label"				: "Paste",
                                "action"			: function (data) {
                                    var inst = $.jstree.reference(data.reference),
                                        obj = inst.get_node(data.reference);
                                    inst.paste(obj);
                                }
                            }
                        }
                    }
                };
            }
        }
    });
}

// DUMMY EXAMPLE FOR A STATIC TREE STRUCTURE BASED ON JSON
// NOT USED HERE - USING NODES COLLECTION INSTEAD -
// COLLECTION NODES RECORDS LOOK SIMILIAR
NodesApp.prepareLinearTreeData = function(){

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

