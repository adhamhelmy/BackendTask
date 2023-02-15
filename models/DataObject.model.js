const { Sequelize, DataTypes } = require('sequelize');
const DataObject = Sequelize.define('dataobjects', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
      type: DataTypes.STRING
    }    
},
{
    timestamps: false
}
);
module.exports = DataObject;