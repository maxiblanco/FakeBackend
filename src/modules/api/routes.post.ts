export {};
var express = require("express");
var router = express.Router();
const { handleToken } = require("@utils/handleToken");
const { getModules } = require("@utils/getModules");
const fs = require("fs");

router.post("/api/:key/:key2?", function (req: any, res: any, next: any) {
  let data = handleToken(req, res);
  var key = req.params.key;
  var key2 = req.params.key2;
  console.log(`el usuario '${data.name}' insertara elementos en '${key}'`);
  /* -------------- buscamos los modulos en el directorio ----------------------*/
  let module_name = getModules().find((e: string) => e === `${key}.json`);

  if (!module_name) {
    next();
    return;
  }
  try {
    /* ahora leemos el json*/
    const jsonRAW = fs.readFileSync("apis/" + module_name);
    let jsonData = JSON.parse(jsonRAW);
    console.log(req.body);
    /* push furioso:*/
    if(key2){
      jsonData[key2].unshift(req.body);
    }else{
      jsonData.unshift(req.body);
    }
    fs.writeFile(
      "apis/" + module_name,
      JSON.stringify(jsonData),
      "utf8",
      (err: any) => {
        if (err) res.status(500).json(err);
      }
    );

    res
      .status(200) // OK
      .json({ status: "Informacion actualizada correctamente" })
      .end(); // cierra comunicacion
  } catch (ex) {
    res
      .status(500) // OK
      .json({ status: "Error leyendo el modulo", debug: ex })
      .end(); // cierra comunicacion
  }
});

router.post("/error/:key", function (req: any, res: any, next: any) {
  res.status(401).send().end();
});

module.exports = router;
