module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
                unique: true
            },
            username: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            role: {
                type: Sequelize.STRING,
                allowNull: true
            },
            avatar_path: {
                type: Sequelize.STRING,
                allowNull: true
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('users');
    }
};
