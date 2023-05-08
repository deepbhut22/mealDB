const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const https = require('https');
const { log } = require("console");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const url1 = "https://www.themealdb.com/api/json/v1/1/categories.php";
app.get("/" , function(req,res){
    https.get(url1 , function(response){
        let data="";
        response.on("data" , function(chunk){
            data+=chunk;
        })
        response.on("end" , function(){
            const obj = JSON.parse(data);
            const result = obj.categories;
            res.render("index" , {data: result});
        })
    })
})

app.get("/:param" , function(req,res){
    const name = req.params.param;
    const url = "https://www.themealdb.com/api/json/v1/1/filter.php?c="+name;
    https.get(url , function(response){
        let data="";
        response.on("data" , function(chunk){
            data+=chunk;
        })
        response.on("end" , function(){
            const obj = JSON.parse(data);
            res.render("category" , {data: obj.meals});
        })
    })
})

app.get("/meal/:param" , function(req,res){
    const name = req.params.param;
    const url2 = "https://www.themealdb.com/api/json/v1/1/search.php?s="+name;
    https.get(url2 , function(response){
        let data="";
        response.on("data" , function(chunk){
            data+=chunk;
        })
        response.on("end" , function(){
            const obj = JSON.parse(data);
            const d = obj.meals[0];
            // console.log(d);
            const temp =[];
            for(key in d){
                temp.push(d[key]);
            }
            // console.log(temp);
            res.render("recipy" , {data: temp});
            // console.log(temp[0]);
            // console.log(d.idMeal);
            res.render("category" , {data: obj.meals});
        })
    })
})



app.listen(3000 , ()=>{
    console.log("server running on port 3000");
})