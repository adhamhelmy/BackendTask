
const express = require('express')
const { Sequelize, DataTypes } = require('sequelize');

//models
const sequelize = new Sequelize('dataobjectdb', 'root', 'Dodo2002', {
    host: 'localhost',
    dialect: 'mysql'
    });

const DataObject = sequelize.define('dataobjects', {
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
const Level = sequelize.define('Level', {
    objid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    levelid: {
        type: DataTypes.INTEGER,
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
const Element = sequelize.define('Element', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    levelid: {
        type: DataTypes.INTEGER
    },
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    }
},
{
    timestamps: false
}
);  
const ParentChild = sequelize.define('parentchildren', {
    parent: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    child: {
        type: DataTypes.INTEGER,
        primaryKey: true
    }    
},
{
    timestamps: false
}
); 

const app = express()
app.use(express.json())

app.post('/api/dataobjects', async(req,res) => {

    const data = await DataObject.create({ name: req.body.name});
    for(let i = 0; i < req.body.levels.length; i++)
    {
        console.log(data)
        await Level.create({ objid: data.id, levelid: req.body.levels[i].levelID, name: req.body.levels[i].levelName});
        for(let j = 0; j < req.body.levels[i].elements.length; j++)
        {
            await Element.create({levelid: req.body.levels[i].levelID, name: req.body.levels[i].elements[j].name})
        }
    }
    res.send(data);
})
app.get('/api/dataobjects', async(req,res) =>{
    const objects = await DataObject.findAll();
    let data = [];
    for(let j = 0; j < objects.length; j++)
    {
        let levels = []
        let temp = await Level.findAll({where: {objid: objects[j].id}})
        for(let i = 0; i < temp.length; i++)
        {
            let level = {
                levelid: temp[i].levelid,
                name: temp[i].name,
                elements: await Element.findAll({
                    where: {levelid: temp[i].levelid},
                    attributes: {exclude: ['id','levelid']}
                })
            }
            levels.push(level)
        }
        let object = {
            id: objects[j].id,
            name: objects[j].name,
            levels: levels
        }
        data.push(object)
    }
    res.send( data)
})
app.get('/api/dataobjects/:id', async(req,res) => {
    let object = await DataObject.findOne({where: {id: req.params.id}})
    let levels = []
    let temp = await Level.findAll({where: {objid: req.params.id}})
    for(let i = 0; i < temp.length; i++)
    {
        let level = {
            levelid: temp[i].levelid,
            name: temp[i].name,
            elements: await Element.findAll({
                where: {levelid: temp[i].levelid}, 
                attributes: {exclude: ['id','levelid']}
            })
        }
        levels.push(level)
    }
    let data = {
        id: object.id,
        name: object.name,
        levels: levels
    }
    res.send(data)
})
app.delete('/api/dataobjects/:id', async(req,res) => {
    let levels = await Level.findAll({where: {objid: req.params.id}})
    for(let i = 0; i < levels.length; i++)
    {
       await Element.destroy({where: {levelid: levels[i].levelid}}, {paranoid: true})
    }
    await Level.destroy({where: {objid: req.params.id}}, {paranoid: true})
    await DataObject.destroy({where: {id: req.params.id}}, {paranoid: true}) 
    res.send("deleted")
})
app.post('/api/parentchild/:id1/:id2', async(req,res) => {
    console.log(req.params.id1 + "  "+req.params.id2)
    try{
        await Element.findOne({where:{id:req.params.id1}})
        await Element.findOne({where:{id:req.params.id2}})
    }catch(err){
        res.send('element does not exist')
    }
    const data = await ParentChild.create({parent:req.params.id1, child:req.params.id2})
    res.send(data)
})




const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening on ${port}...`))