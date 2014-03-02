/**
 * Created by tobkle on 23.02.14.
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
        }
    ];

}