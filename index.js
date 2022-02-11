const express = require('express');
const router = express.Router();
const path = require('path');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');

const methodOverride = require('method-override');
const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 8082 });

wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

wss.on("connection", ws => {
    ws.id = wss.getUniqueID();
    console.log(`New client connected with id: ${ws.id}`);

    ws.onmessage = ({data}) => {
        console.log(`Client ${ws.id}: ${data}`);
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(`${data}`);
            }
        });
    };

    ws.onclose = function() {
        console.log(`Client ${ws.id} has disconnected!`);
    };
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static("public/css"));
app.use(express.static("public/images"));
app.use(express.static("public/js"));
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.listen(3000, () => { console.log('Server started at port 3000'); });

app.get("/", (req,res) => {
    // renderizar la vista home.ejs
    res.render("home")
})


app.listen(8082, () => { console.log('Server started at port 3000'); });
app.get("/chat", (req,res) => {
    res.render("chat")

    //gap
// app.get <- dentro de app le hicieron un GET request (que no es lo mismo que un POST request)
// un post se veria como app.post
// un endpoint puede tener tanto get como post, y dependiendo de que se este usando, se puede
// ejecutar una u otra cosa
// app.get("/prueba"..){
    //res.send("hiciste un get a /prueba") <- "res.send" envia un texto al usuario 
//}
// app.post("/prueba"...){
    //res.send("hiciste un post a /prueba") <- "res.send" envia un texto al usuario 
//}

// app.get("/") <- "/"
// en este caso estamos chequeando el endpoint /
// si yo quiero tener una variable, dentro el endpoint, se puede usar :VARIABLE
// por ejemplo: app.get("/login/user/:userID")
// asi se ve en el backend, pero desde la pagina web, se ve como "/login/user/10gnal2jkf892"
// nosotros podemos tomar este id usando req.params.VARIABLE <- o sea req.params.userID
// que en este caso seria 10gnal2jkf892

// (req, res) => {}
// req es de donde viene la informacion, y el res es lo que le enviamos como RESpuesta al req
// por eso yo puedo poner res.send("TEXTO"), le enviamos un texto explicito a la RESpuesta

// req. [send(para enviar texto) | sendFile(para enviar archivos) |
// render(para renderizar una vista por ejemplo ejs)]


/*
IDEAS:
    - upload image and take pos of items with it
    - light dark mode
    - download levels and sublevels, add a pop up to this, give keys to youtubers and other teachers so 
        they have no pop up download
    - challenges y un sistema para compartir las soluciones
    - 
*/
