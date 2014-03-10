///////////////////////////////////////////////////////////////////////////////////////
//    jquery.ui.tree plugin
///////////////////////////////////////////////////////////////////////////////////////
// Author: tobkle
// Date:   08.03.2014
// Version: 1.0
///////////////////////////////////////////////////////////////////////////////////////


;(function($){

    var self;

    $.widget('ui.tree', {
        ///////////////////////////////////////////////////////
        // DEFAULT OPTIONS FOR JSTREE AND THE WIDGET ITSELF
        ///////////////////////////////////////////////////////
        options: {
            className:      'ui.tree',
            tree:           'Projects',
            data:           [],
            search:         {},
            "core" : {
                "animation"               : 0,
                "check_callback"          : true,
                "themes"                  : { "stripes" : true },
                'data'                    : []
            },
            "plugins"                     : [ "contextmenu", "dnd", "search", "state", "types" ],
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
                },
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
                                            inst.create_node(obj, {type: 'default', tree: obj.original.tree, parent: obj.id}, "last", function (new_node) {
                                                setTimeout(function () {
                                                //    new_node.id = Nodes.findOne({parent: new_node.parent},  {sort:{$natural:-1}} ).id;
                                                    inst.edit(new_node);
                                                },500);
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
                                            inst.create_node(obj, {type: 'file', tree: obj.original.tree, parent: obj.id}, "last", function (new_node) {
                                                setTimeout(function () {
                                                   // new_node.id = Nodes.findOne({parent: new_node.parent},  {sort:{$natural:-1}} ).id;
                                                    inst.edit(new_node);
                                                },500);
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
        },

        ///////////////////////////////////////////////////////
        // SET THE OPTIONS OF THE TREE
        ///////////////////////////////////////////////////////
        _setOption: function( key, value ) {
            // Call the base _setOption method
            self = this;

            // Check for a particular option being set
            if ( key === "data") {
                 self.options.tree = value;
                 self._createRoot(value, $(self) );
                 self.element.jstree(true).settings.core.data = self._readNodeDB( value );
                 self.element.jstree(true).refresh();
            }

            this._superApply( arguments );
        },


        // OPERATIONS FROM OUTSIDE...
        createNode: function(_evt, _type, _text, _flagEdit) {
            var ref = this.element.jstree(true),
                sel = ref.get_selected(),
         parentNode = ref.get_node(sel);

            if(!sel.length) { return false; }
            sel = sel[0];
            sel = ref.create_node(sel, {"text": _text, "type": _type, "tree": parentNode.original.tree});
            if(sel && _flagEdit) {
                ref.edit(sel);
            }
        },

        renameNode: function(evt) {
            var ref = this.element.jstree(true),
                sel = ref.get_selected();
            if(!sel.length) { return false; }
            sel = sel[0];
            ref.edit(sel);
        },

        deleteNode:  function(evt) {
            var ref = this.element.jstree(true),
                sel = ref.get_selected();
            if(!sel.length) { return false; }
            ref.delete_node(sel);
        },

        searchNode: function(_search){
            var ref = this.element.jstree(true);
            var to = false;
            if(to) {
                clearTimeout(to);
            }
            to = setTimeout(function () {
                    var v = $(_search).val();
                    ref.search(v);
                }, 250
            );
        },

        ///////////////////////////////////////////////////////
        // CREATE INITIAL ENTRIES
        ///////////////////////////////////////////////////////
        _createRoot: function(_tree, _$this){
            if (Nodes.find({ parent: '#', tree: _tree }).count() == 0) {
                var data    = self._prepareRootData(_tree);
                self._createNodeDB( data, _$this );
            }
        },

        _prepareRootData: function(_tree){
            return {
                    'parent'        : '#',
                    'position'      : 0,
                    'text'          : _tree,
                    'tree'          : _tree,
                    'type'          : 'root',
                   };
        },


        // UPDATE SESSION VARIABLE WITH THE CURRENT TREE ELEMENT(S)
        _bindNodeChanged: function(){
            this.element.on("changed.jstree", function (e, data) {
                var selectedNodes = [];
                var selectedTree  = this.id;
                for(var i = 0; i < data.selected.length; i++) {
                    selectedNodes.push(data.instance.get_node(data.selected[i]).original.id);
                }
                Session.set('selectedNodes', selectedNodes);
                Session.set('selectedTree' , selectedTree );
            });
        },


        // UPDATE DB AFTER EACH TREE NODE CREATION
        _bindNodeCreated: function(){
            this.element.on("create_node.jstree", function (node, parent) {
                self._createNodeDB(
                    {
                        text:       parent.node.text,
                        type:       parent.node.type,
                        parent:     parent.parent,
                        position:   parent.position,
                        tree:       parent.node.original.tree,
                    },
                    $(this)
                );
            });
        },

        // UPDATE DB AFTER RENAMING OF NODE
        _bindNodeRenamed: function(){
            this.element.on("rename_node.jstree", function (node, newText, oldText) {
                        self._updateNodesDB(
                            [
                                {
                                     id:        newText.node.id,
                                    text:       newText.text
                                }
                            ]
                        );
            });
        },

        // UPDATE DB AFTER TREE ELEMENT WAS DELETED
        _bindNodeDeleted: function(){
            this.element.on("delete_node.jstree", function (node, parent) {
                self._deleteNodeDB( self._buildDeleteTree( [parent.node.id] ) );
            });
        },

        // DELETE LEAF AND BRANCH OF TREE RECURSIVELY
        _buildDeleteTree: function(_deleteTree){
            var deleteNodes = Nodes.find( {"parent" : {$in: _deleteTree}} ).fetch();     // get all Nodes, whose parent is deleted
            var childrenIds = _.pluck(deleteNodes, 'id');                                // get all Ids of the nodes
            if (childrenIds.length > 0) {
                // if there are, read their childrenIds, and add them to the array
                _deleteTree = _.union(_deleteTree, self._buildDeleteTree(childrenIds));
            }
            return _deleteTree;
        },

        // UPDATE DB AFTER EACH NODE DRAG AND DROP
        _bindNodeMoved:  function(){
            this.element.on("move_node.jstree", function (node, parent) {
                var updateNodes = [];
                var thisTree    = $(this);
                // get the right order of parent's child elements
                thisTree.jstree("get_children_dom", parent.parent)
                    .each(function(index){
                          var _node = thisTree.jstree(true).get_node(this.id);
                          if (this.id != parent.node.id){
                                updateNodes.push({
                                      "id":          this.id,
                                      "position":    index
                                });
                          }
                });
                // get the right order of former's parent's child elements
                if (parent.parent != parent.old_parent){
                    thisTree.jstree("get_children_dom", parent.old_parent)
                        .each(function(index){
                            var _node = thisTree.jstree(true).get_node(this.id);
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
                self._updateNodesDB(updateNodes);
            });
        },

        // UPDATE DB AFTER EACH TREE NODE CREATION
        _bindNodePasted:  function(){
            this.element.on("paste.jstree", function (node, parent) {
                for (var i = 0; i < parent.node.length; i++){
                    self._createNodeDB(
                        {
                            text:       parent.node[i].text,
                            type:       parent.node[i].type,
                            parent:     parent.node[i].parent,
                            children:   parent.node[i].children,
                            position:   parent.node[i].original.position,
                            tree:       parent.node[i].original.tree
                        },
                        $(this)
                    );
                }
            });
        },

        ///////////////////////////////////////////////////////
        /// PERSISTENCE METHODS FOR CRUD OPERATIONS......
        ///////////////////////////////////////////////////////
        _createNodeDB:  function( _node, _$this ){
            Meteor.call('createNode', _node, function(error, id) {
                if (error) {
                    return alert(error.reason);
                } else {
                    if (_node.children){
                        for (var child = 0; child < _node.children.length; child++){
                            var childNode =  $(_$this).jstree(true).get_node(_node.children[child]);
                            self._createNodeDB(
                                {
                                    text:       childNode.text,
                                    type:       childNode.type,
                                    tree:       childNode.original.tree,
                                    parent:     id,
                                    children:   childNode.children,
                                    position:   child
                                },
                                _$this
                            );
                        }
                    }
                }
            });
        },

        _readNodeDB: function( _tree ){
            var    _nodes = [];
                   _nodes = Nodes.find({ tree: _tree },{sort: ["position","asc"] }).fetch();
            return _nodes;
        },

        _updateNodesDB: function(_nodes){
            Meteor.call('updateNodes', _nodes, function(error, id) {
                  if (error) {
                       return alert(error.reason);
                   }
             });
        },

        _deleteNodeDB: function(_nodes){
              Meteor.call('removeNodes', _nodes, function(error, id) {
                   if (error) {
                       return alert(error.reason);
                    }
              });
        },

        ///////////////////////////////////////////////////////
        /// CONSTRUCTOR
        ///////////////////////////////////////////////////////
        _create: function(){
            self = this;
            // this.element -- a jQuery object of the element the widget was invoked on.
            // this.options --  the merged options hash
            self.element.jstree({
                "core"                        : this.options.core,
                "plugins"                     : this.options.plugins,
                "types"                       : this.options.types,
                "contextmenu"                 : this.options.contextmenu
            });

            self._bindNodeChanged();
            self._bindNodeCreated();
            self._bindNodeRenamed();
            self._bindNodeDeleted();
            self._bindNodeMoved();
            self._bindNodePasted();

        },

        ///////////////////////////////////////////////////////
        /// DESTRUCTOR
        ///////////////////////////////////////////////////////
        _destroy: function(){
            this._super();
        }

    });

})(jQuery);