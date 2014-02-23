/**
 * Created by tobias on 23.02.14.
 */

// if the database is empty on server start, create some sample data.
Meteor.startup(function () {
    if (Nodes.find().count() === 0) {
        var data = prepareLinearTreeData();
        var timestamp = (new Date()).getTime();

        for (var i = 0; i < data.length; i++) {
            var node_id = Meteor.call('createNode', data[i] );
        }
    }
});

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