const nodemailer = require("nodemailer");
var randomstring = require("randomstring");
var io = require("socket.io-client");
var socket = io.connect("http://207.244.230.240:3000", { reconnect: true });
const os = require("os");
const fs = require("fs");

const hostName = os.hostname();
var enviados = 0;
var list;

async function getemails() {
  return new Promise(async (resolve, reject) => {
    // Add a connect listener
    socket.on("connect", function (socket) {
      console.log("Connected!");
    });

    socket.on("EMAIL", function (from, msg) {
      console.log("EMAIL", msg);
      resolve(msg);
    });
    socket.emit("GETEMAIL", "", hostName);
  });
}

(async function () {
  console.log(hostName);

  list = await getemails();

  for (let value of list.splice(0, 5)) {
    sendEmail(value);
  }

  total = list.length;
})();

async function sendEmail(email) {
  let mailarray = email.split("|");
  let INT8 = await randomstring.generate({
    length: 8,
    charset: "numeric",
  });
  let KEY8 = await randomstring.generate(8);

  //captura o html do email
  let html = fs.readFileSync("./html.html", "utf8");

  html = await Change_HTML(html);
  //%emailcliente%
  html = html.replace(/%emailcliente%/g, mailarray[0]);
  html = html.replace(/%cpf%/g, mailarray[1]);
  html = html.replace(/%nome%/g, mailarray[2]);

  //RANDON HTML
  let htmlarry = html.split("\n");
  let novohtml = "";
  htmlarry.forEach(function (item) {
    if (item.includes("<")) {
      novohtml += "\n".repeat(between(50, 250)) + item + "\n";
      item + "\n";
    } else {
      novohtml += item + "\n";
    }
  });

  html = novohtml;
  //RANDON HTML
  let subject = `[${
    mailarray[1]
  }] Aviso de Protesto - ID: ${randomstring.generate(9)}`;
  try {
    let transporter = nodemailer.createTransport({
      service: "postfix",
      host: "localhost",
      secure: false,
      port: 25,
      tls: { rejectUnauthorized: false },
    });

    let info = await transporter.sendMail({
      from: '"Protestos" <' + "adm@" + hostName + ">",
      to: mailarray[0],
      subject: subject,
      html: html,
      headers: {
        "X-Ovh-Tracer-Id":
          between(1000, 999999) +
          between(1000, 999999) +
          between(1000, 999999) +
          between(1000, 999999),
        "X-VADE-SPAMSTATE": "clean",
        "X-VADE-SPAMSCORE": "49",
        "X-VADE-SPAMCAUSE": await randomstring.generate(980),
        "X-VR-SPAMSTATE": "ok",
        "X-VR-SPAMSCORE": "-100",
        "X-VR-SPAMCAUSE": await randomstring.generate(154),
        "Return-Path":
          "bounce-id=D" +
          between(100, 200) +
          "=U" +
          between(1000, 10000) +
          hostName +
          between(1000, 999999) +
          between(1000, 999999) +
          between(1000, 999999) +
          "@" +
          hostName,
      },
      /*  attachments: [
        {
          filename: "Logo_" + INT8 + KEY8 + ".png",
          path: __dirname + "/mailtrap.png",
          cid: "uniq-Logo_" + INT8 + KEY8 + ".png",
        },
      ], */
    });
    enviados++;
    console.log(`Sent: ${info.messageId} - total enviados: ${enviados}`);
  } catch (error) {
    enviados++;
    console.log(`Sent: Error ${error.message}`);
  }
  if (list.length == 0) {
    socket.emit("FIM", "", hostName);
  }
  if (list.length !== 0) sendEmail(list.shift());
}

async function Change_HTML(html) {
  let KEY15 = await randomstring.generate(15);
  let KEY10 = await randomstring.generate(10);
  let KEY9 = await randomstring.generate(9);
  let KEY8 = await randomstring.generate(8);
  let KEY7 = await randomstring.generate(7);
  let KEY6 = await randomstring.generate(6);
  let KEY5 = await randomstring.generate(5);
  let INT15 = await randomstring.generate({
    length: 15,
    charset: "numeric",
  });
  let INT10 = await randomstring.generate({
    length: 10,
    charset: "numeric",
  });
  let INT9 = await randomstring.generate({
    length: 9,
    charset: "numeric",
  });
  let INT8 = await randomstring.generate({
    length: 8,
    charset: "numeric",
  });
  let INT7 = await randomstring.generate({
    length: 7,
    charset: "numeric",
  });
  let INT6 = await randomstring.generate({
    length: 6,
    charset: "numeric",
  });
  let INT5 = await randomstring.generate({
    length: 5,
    charset: "numeric",
  });
  let INT4 = await randomstring.generate({
    length: 4,
    charset: "numeric",
  });
  let INT3 = await randomstring.generate({
    length: 3,
    charset: "numeric",
  });
  let INT2 = await randomstring.generate({
    length: 2,
    charset: "numeric",
  });
  let INT1 = await randomstring.generate({
    length: 2,
    charset: "numeric",
  });

  html = html.replace(/%R15%/g, KEY15);
  html = html.replace(/%R10%/g, KEY10);
  html = html.replace(/%R9%/g, KEY9);
  html = html.replace(/%R8%/g, KEY8);
  html = html.replace(/%R7%/g, KEY7);
  html = html.replace(/%R6%/g, KEY6);
  html = html.replace(/%R5%/g, KEY5);
  html = html.replace(/%RND15%/g, INT15);
  html = html.replace(/%RND10%/g, INT10);
  html = html.replace(/%RND9%/g, INT9);
  html = html.replace(/%RND8%/g, INT8);
  html = html.replace(/%RND7%/g, INT7);
  html = html.replace(/%RND6%/g, INT6);
  html = html.replace(/%RND5%/g, INT5);
  html = html.replace(/%RND4%/g, INT4);
  html = html.replace(/%RND3%/g, INT3);
  html = html.replace(/%RND2%/g, INT2);
  html = html.replace(/%RND1%/g, INT1);

  return html;
}
function between(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
