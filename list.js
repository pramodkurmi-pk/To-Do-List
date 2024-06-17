const mongoose = require('mongoose');
require('dotenv').config();

const express=require('express');
const bodyParser=require('body-parser');

const app=express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let items1=[];

mongoose.connect(process.env.MONGO_URI);

const itemSchema = new mongoose.Schema({
    name: String
});

const item = mongoose.model("item", itemSchema);

let items = [];



// Homepage
app.get("/", function(req, res){
    let today=new Date();

    let options={
        weekday: "long",
        day: "numeric",
        month: "long"
    }

    let day=today.toLocaleDateString("en-US", options);

    async function myFunction() {
        let curItems = await item.find();
        res.render("index", {
            kindOfDay: day,
            newListItem: curItems
        }); 
        
    }

    myFunction();
 
    
});

// adding items
app.post("/", function(req, res){
    // adding new item into the database
    let itemName=req.body.newItem;

    let newItem = new item({
        name: itemName
    })

    newItem.save()
    // console.log(item);
    res.redirect("/");
})

// delete
app.post("/delete", function(req, res){
    // adding new item into the database
    let itemId=req.body.check;
    // console.log(itemId);

    async function del(){
        await item.findByIdAndDelete(itemId);
    }
    del();
    res.redirect("/"); 
    
})

app.listen(3000, function(req, res){
    console.log("server is running on port 3000");
});
