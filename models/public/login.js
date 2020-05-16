const db = require("../public/db");
const sequelize = db.sequelize;
const DataTypes = db.Sequelize;

module.exports.Login = sequelize.define('login', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    first_name: { type: DataTypes.TEXT },
    last_name: { type: DataTypes.TEXT },
    email: { type: DataTypes.TEXT },
    mobile: { type: DataTypes.TEXT },
    password: { type: DataTypes.TEXT },

    city: { type: DataTypes.TEXT },
    college: { type: DataTypes.TEXT },
    year: { type: DataTypes.TEXT },
    branch: { type: DataTypes.TEXT },
    
    role: { type: DataTypes.TEXT },
    rank: { type: DataTypes.TEXT },
    skill: { type: DataTypes.TEXT },

    // Verifications
    email_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },

    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: DataTypes.DATE,
    deleted_at: DataTypes.DATE
}, {
        underscored: true
});
