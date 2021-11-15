const http = require('http');

const todos = [
    {id:1,text:'Todo one'},
    {id:2,text:'Todo two'},
    {id:3,text:'Todo three'}

]

//Takes in a function wiht a request and response object
const server = http.createServer((req,res) => {
    res.setHeader('Content-Type','application/json');
    //Tells you what type of server is node or nginx
    res.setHeader('X-Powered-by','Nodes.js');
    res.write('Hello');
    res.end(JSON.stringify({
        success:true,
        data:todos
    }));
 })

const PORT  = 5000;

server.listen( PORT, () => console.log(`Server running on port ${PORT}`));