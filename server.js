const Joi = require('joi');
const express =require("express");
const app = express();
var bodyParser =require('body-parser');
app.use(express.json());
app.use(bodyParser.json())

const articles = [
    {id:1,title:'indias no 1 site',desc:'short desc',authour:'siva'},
    {id:2,title:'indias no 2 site',desc:'short 2 desc',authour:'ashish'},
    {id:3,title:'indias no 3 site',desc:'short 3  desc',authour:'himanshu'},
];

app.get("/",(req, res)=>{
    res.send("Hello siva. how are you.!!");
});

app.get("/api/articles",(req, res)=>{
    res.send(articles);
});

app.get("/api/articles/:id",(req, res)=>{
   const article = articles.find(c=>c.id==parseInt(req.params.id));
   if(!article) res.status(404).send('the course is not listed');
   res.send(article);
});


app.post('/api/articles',(req, res)=>{
   const schema ={
       title :Joi.string().min(3).required()
   };
   const result = Joi.validate(req.body, schema);
  //for error ref// console.log(result);
   if (result.error){
       //joi will give eerror message if there is validation error
    res.status(400).send(result.error.details[0].message)
    return;
   }
    //manuall 400
   /* if(!req.body.title || req.body.title.length<3)
    {
        res.status(400).send('invalid title provide meaning full title')
         return;
    } */
    const article ={
        id:articles.length+1,
        title : req.body.title,
        desc : req.body.desc
    };
    articles.push(article); 
    res.send(article);
})


//updating specfic article based on id using put method
app.put('/api/articles/:id', (req,res) => {
    const article = articles.find(c => c.id === parseInt(req.params.id));
    if(!article) return res.status(404).send('The article with given id not found');
    
    const { error } =  validateArticle(req.body); // result.error
    if(error) return res.status(400).send(error.details[0].message);
    
    article.title = req.body.title, 
    article.desc = req.body.desc,
    article.authour = req.body.authour,                     // UPDATE article
    res.send(article);               // RETURN TO CLIENT
});



app.delete('/api/articles/:id', (req,res)=>{
    // LOOK UP THE article
    const article = articles.find(c=> c.id === parseInt(req.params.id));
    if(!article) return res.status(404).send('The article with given id not found');  

    const index = articles.indexOf(article);
    articles.splice(index, 1);

    res.send(article);
});
function validateArticle(article) {
    const schema = {
        title: Joi.string().min(3).required(),
        desc:Joi.string().min(3).required(),
        authour:Joi.string().min(3).required()
    };

    return Joi.validate(article, schema);
}
  
//PORT  which will update automatically on hosting cpanel
const port =process.env.PORT || 8085;
app.listen(port, ()=> console.log('jarvis is online .. ')); 