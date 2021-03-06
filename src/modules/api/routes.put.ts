export {};
var express = require("express");
var router = express.Router();

const { handleToken } = require("@utils/handleToken");
const { getModules } = require("@utils/getModules");

const fs = require("fs");

router.put("/api/:key/:key2?", function (req: any, res: any, next: any) {
  let data = handleToken(req, res);

  var key = req.params.key;
  var key2 = req.params.key2;
  console.log(`el usuario '${data.name}' pidio modificar el elemento '${key}'`);
  /* -------------- buscamos los modulos en el directorio ----------------------*/
  let module_name = getModules().find((e: string) => e === `${key}.json`);
  if (!module_name) {
    res.status(500).json({ status: "no se encuentra el json" });
    return;
  }
  /* ahora leemos el json , editamos y devolvemos*/
  const jsonRAW = fs.readFileSync("apis/" + module_name);
  let jsonData = JSON.parse(jsonRAW);

  if (key2) {
    jsonData[key2].map((e: any, index: number) => {
      if (e.id == req.body.id) {
        jsonData[key2][index] = req.body;
      }
    });
  } else {
    jsonData.map((e: any, index: number) => {
      if (e.id == req.body.id) {
        jsonData[index] = req.body;
      }
    });
  }

  try {
    fs.writeFile(
      "apis/" + module_name,
      JSON.stringify(jsonData),
      "utf8",
      (err: any) => {
        if (err)
          res
            .status(500)
            .json({ status: "Error leyendo el modulo", debug: err });
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

module.exports = router;
