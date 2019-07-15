
exports.up = function (connection) {
    return connection.schema.createTable('users', (usersTable) => {
        usersTable.string('username').primary();
        usersTable.unique('username');
        usersTable.string('avatar_url');
        usersTable.string('name');
    });
};

exports.down = function (connection) {
    return connection.schema.dropTable('users');
};
