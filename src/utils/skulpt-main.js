const Sk = window.Sk;
import '../pygame-zero/main'
const PyGameZero = window.PyGameZero;
function outf(text) {
  const mypre = document.getElementById("output");
  console.log(mypre)
  mypre.innerHTML = mypre.innerHTML + text;
}
function builtinRead(file) {
  console.log("Attempting file: " + Sk.ffi.remapToJs(file));
  // 加载模块
  if (PyGameZero.matchModelName(file)) {
    return PyGameZero.load(file)
  }
  //  if (externalLibs[file] !== undefined) {
  //    return Sk.misceval.promiseToSuspension(
  //      fetch(externalLibs[file]).then(
  //        function (resp){ return resp.text(); }
  //      ));
  //  }

  if (
    Sk.builtinFiles === undefined ||
    Sk.builtinFiles.files[file] === undefined
  ) {
    throw "File not found: '" + file + "'";
  }

  return Sk.builtinFiles.files[file];
}
export const runPy = (content) => {
  // 配置海龟容器
  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = "stage";

  // 配置容器
  PyGameZero.setContainer(document.getElementById('stage'))
  const prog = content;
  const mypre = document.getElementById("output");
  mypre.innerHTML = "";
  Sk.pre = "output";
  Sk.configure({
    output: outf,
    read: builtinRead,
    __future__: Sk.python3,
  });

  const myPromise = Sk.misceval.asyncToPromise(function() {
    return Sk.importMainWithBody("<stdin>", false, prog, true);
  });

  myPromise.then(
    function(mod) {
      console.log("success");
    },
    function(err) {
      console.log(err);
    }
  );
};
