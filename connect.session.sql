
--@block
create TABLE DataObjects(
    id int primary key AUTO_INCREMENT,
    name varchar(255)
);
--@block
create TABLE Levels(
    objid int, 
    levelid int primary key,
    name varchar(255),
    FOREIGN KEY (objid) REFERENCES DataObjects(id)
);
--@block
create TABLE Elements(
    id int primary key AUTO_INCREMENT,
    levelid int,
    name varchar(255),
    FOREIGN KEY (levelid) REFERENCES Levels(levelid)  
);
--@block
CREATE TABLE ParentChildren(
    parent int,
    child int,
    FOREIGN KEY (parent) REFERENCES Elements(id),
    FOREIGN KEY (child) REFERENCES Elements(id)
)
--@block
DROP TABLE dataobjects;

--@block
DROP TABLE elements;

--@block
DROP TABLE levels;

--@block
drop table parentchilds;
--insert into element (elementid, name) VALUES (1,"adham")
select * from levels
select * from elements
select * from parentchildren

delete from elements;
delete from levels;
delete from dataobjects;