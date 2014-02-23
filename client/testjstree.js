var  tree, search;

Template.showtree.rendered  = function(){
      var self = this;
      tree   = $('#tree');
      search = $('#searchNode');
      //showTree( prepareRecursiveTreeData() );
        showTree( prepareLinearTreeData() );
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
    tree.jstree({

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

    search.keyup(function () {
        if(to) { clearTimeout(to); }
        to = setTimeout(function () {
            var v = search.val();
            tree.jstree(true).search(v);
        }, 250);
    });

    tree.on('changed.jstree', function (e, data) {
        console.log(data.selected);
        Session.set('selectedNodes', data.selected);
    });
}

function createNode() {
    var ref = tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    sel = sel[0];
    sel = ref.create_node(sel, {"type":"file"});
    if(sel) {
        ref.edit(sel);
    }
}

function renameNode() {
    var ref = tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    sel = sel[0];
    ref.edit(sel);
}

function deleteNode() {
    var ref = tree.jstree(true),
        sel = ref.get_selected();
    if(!sel.length) { return false; }
    ref.delete_node(sel);
}

function prepareRecursiveTreeData(){
    return [

        {
            'text'          : 'Root node 1',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'root',
            'li_attr'       : {},
            'a_attr'        : {},
            'children'      : [

                {
                    'text'        : 'Folder 1',
                    'type'        : 'folder',
                    'li_attr'     : {},
                    'a_attr'      : {},
                    'children'    : [
                        {
                            'text'        : 'File 1',
                            'type'        : 'file',
                            'li_attr'     : {},
                            'a_attr'      : {},
                            'children'    : []
                        },
                        {
                            'text': 'File 2',
                            'type': 'file',
                            'li_attr'     : {},
                            'a_attr'      : {},
                            'children'    : []
                        }
                    ]
                },

                {
                    'text'        : 'Folder 2',
                    'type'        : 'folder',
                    'li_attr'     : {},
                    'a_attr'      : {},
                    'children'    : [
                        {
                            'text'        : 'File 3',
                            'type'        : 'file',
                            'li_attr'     : {},
                            'a_attr'      : {},
                            'children'    : []
                        },
                        {
                            'text'        : 'File 4',
                            'type'        : 'file',
                            'li_attr'     : {},
                            'a_attr'      : {},
                            'children'    : []
                        }
                    ]
                }

            ]
        }
    ];
}

function prepareLinearTreeData(){

    return [

        {
            'id'            : '0',
            'parent'        : '#',
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
            'text'          : 'Folder 1',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'folder',
            'li_attr'       : {},
            'a_attr'        : {},
        },

        {
            'id'            : '2',
            'parent'        : '0',
            'text'          : 'Folder 2',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'folder',
            'li_attr'       : {},
            'a_attr'        : {},
        },

        {
            'id'            : '3',
            'parent'        : '1',
            'text'          : 'File 1',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'file',
            'li_attr'       : {},
            'a_attr'        : {},
        },

        {
            'id'            : '4',
            'parent'        : '1',
            'text'          : 'File 2',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'file',
            'li_attr'       : {},
            'a_attr'        : {},
        },

        {
            'id'            : '5',
            'parent'        : '2',
            'text'          : 'File 3',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'file',
            'li_attr'       : {},
            'a_attr'        : {},
        },

        {
            'id'            : '6',
            'parent'        : '2',
            'text'          : 'File 4',
            'state'         : {
                'opened'    : true,
                'disabled'  : false,
                'selected'  : true
            },
            'type'          : 'file',
            'li_attr'       : {},
            'a_attr'        : {},
        },

    ];

}

