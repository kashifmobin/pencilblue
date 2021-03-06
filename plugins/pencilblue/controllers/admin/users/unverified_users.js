/*
    Copyright (C) 2014  PencilBlue, LLC

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * Interface for managing unverified users
 */

function UnverifiedUsers(){}

//inheritance
util.inherits(UnverifiedUsers, pb.BaseController);

//statics
var SUB_NAV_KEY = 'unverified_users';

UnverifiedUsers.prototype.render = function(cb) {
    var self = this;
    var dao  = new pb.DAO();
    dao.query('unverified_user', {}).then(function(users) {
        if(util.isError(users)) {
            self.redirect('/admin', cb);
            return;
        }

        var angularObjects = pb.js.getAngularObjects(
        {
            navigation: pb.AdminNavigation.get(self.session, ['users', 'manage'], self.ls),
            pills: pb.AdminSubnavService.get(SUB_NAV_KEY, self.ls, SUB_NAV_KEY),
            users: users
        });

        self.setPageName(self.ls.get('UNVERIFIED_USERS'));
        self.ts.registerLocal('angular_objects', new pb.TemplateValue(angularObjects, false));
        self.ts.load('admin/users/unverified_users', function(err, result){
            cb({content: result});
        });
    });
};

UnverifiedUsers.getSubNavItems = function(key, ls, data) {
    return [{
        name: SUB_NAV_KEY,
        title: ls.get('UNVERIFIED_USERS'),
        icon: 'chevron-left',
        href: '/admin/users'
    }, {
        name: 'new_user',
        title: '',
        icon: 'plus',
        href: '/admin/users/new'
    }];
};

//register admin sub-nav
pb.AdminSubnavService.registerFor(SUB_NAV_KEY, UnverifiedUsers.getSubNavItems);

//exports
module.exports = UnverifiedUsers;
