//server.js
var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
const fs = require("fs");

var list;
start();
async function start() {
  list = ["lista.txt"]
    .map((value) => fs.readFileSync("./" + value, { encoding: "utf-8" }))
    .join("\n")
    .split("\n")
    .map((value) => value.trim())
    .filter((value) => {
      if (value.length < 1) return false;
      if (value.includes("@") == false) return false;
      if (value.includes("@gmail") == true) return false;
      if (value.includes("@ymail") == true) return false;
      if (value.includes("@yahoo") == true) return false;
      if (value.includes("@zipmail") == true) return false;
      if (value.includes("@ig.com") == true) return false;
      if (value.includes("@oi.com") == true) return false;
      if (value.includes("@bol.com") == true) return false;
      if (value.includes("@uol.com") == true) return false;
      if (value.includes("@globo") == true) return false;
      if (value.includes("@terra") == true) return false;
      if (value.includes("@hotmail") == true) return false;
      if (value.includes("@yahoo") == true) return false;
      return true;
    });
    list = await [ ...new Set(list)] 
  if (list.length < 1) {
    console.log("Nenhum item encontrado nas listas selecionadas!", "info");
    console.log("*".repeat(50));
    return;
  }
  console.log(
    `Starting... ${list.length} email${list.length != 1 ? "s" : ""} carredado${
      list.length != 1 ? "s" : ""
    }!`,
    ""
  );

  io.on("connection", function (socket) {
    console.log("connection", socket.id);

    socket.on("FIM", async function (from, msg) {
      console.log(from, msg);
      SalvaRetorno(from + msg + "|" + list.length);
    });

    socket.on("GETEMAIL", async function (from, msg) {
      console.log(from, msg);
      socket.emit("EMAIL", true, await getemails());
      console.log(
        `Restante... ${list.length} da lista email${
          list.length != 1 ? "s" : ""
        }`
      );
    });
  });

  http.listen(3000, function () {
    console.log("listening on *:3000");
  });
}

async function getemails() {
  return new Promise(async (resolve, reject) => {
    let array = [];
    for (let value of list.splice(0, 15000)) {
      array.push(value);
    }
    resolve(array);
  });
}

function SalvaRetorno(texto) {
  try {
    var logger = fs.createWriteStream("./finalizados.txt", {
      flags: "a",
    });
    logger.write(texto + "\r\n");
    logger.end();
  } catch (err) {
    console.log(err);
  }
}
