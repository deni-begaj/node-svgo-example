const fs = require('fs');
const path = require('path');
const svgoPlugin = require('svgo');
const readline = require('readline');
const svgo = new svgoPlugin({
    plugins: [{
          cleanupAttrs: false,
        }, {
          removeDoctype: false,
        },{
          removeXMLProcInst: false,
        },{
          removeComments: false,
        },{
          removeMetadata: false,
        },{
          removeTitle: false,
        },{
          removeDesc: false,
        },{
          removeUselessDefs: false,
        },{
          removeEditorsNSData: false,
        },{
          removeEmptyAttrs: false,
        },{
          removeHiddenElems: false,
        },{
          removeEmptyText: false,
        },{
          removeEmptyContainers: false,
        },{
          removeViewBox: false,
        },{
          cleanupEnableBackground: false,
        },{
          convertStyleToAttrs: false,
        },{
          convertColors: false,
        },{
          convertPathData: false,
        },{
          convertTransform: false,
        },{
          removeUnknownsAndDefaults: false,
        },{
          removeNonInheritableGroupAttrs: false,
        },{
          removeUselessStrokeAndFill: false,
        },{
          removeUnusedNS: false,
        },{
          cleanupIDs: false,
        },{
          cleanupNumericValues: false,
        },{
          moveElemsAttrsToGroup: false,
        },{
          moveGroupAttrsToElems: false,
        },{
          collapseGroups: false,
        },{
          removeRasterImages: false,
        },{
          mergePaths: false,
        },{
          convertShapeToPath: false,
        },{
          sortAttrs: false,
        },{
          removeDimensions: true,
        },{
          removeAttrs: {attrs: '(stroke|fill)'},
        }]
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal:false });
const rl1 = readline.createInterface({ input: process.stdin, output: process.stdout });

let walk = function(dir, ext, done) {
    let results = [];
    fs.readdir(dir, function(err, list) {
        if (err) {
            console.log("Enters error 1: " + err);
            return done(err); 
        }
        let pending = list.length;
        if (!pending) {
            return done(null, results); 
        }
        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, ext, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) done(null, results);
                    });
                } else {
                    if(file.indexOf(ext) > 0) {
                        results.push(file);
                    }
                    if (!--pending) done(null, results);
                }
            });
        });
    });
};

let walkAsync = function(dir, ext)  {
  return new Promise((resolve, reject) => {
    walk(dir, ext, function(err, result) {
          if (err) {
              reject(err);
          } else {
              resolve(result);
          }
      })
  })
}

let questionAsync = function(rl, str)  {
  return new Promise((resolve, reject) => {
      rl.question(str, function(answer) {
          resolve(answer);
      })
  })
}

let mainF = async function() {
    try {

        // C:\Users\XIAOMI\Desktop\Work\Fiverr\nodejs-script-svg\folder
        console.log("\nWelcome to the file cleaner.\n");
        let url = await questionAsync(rl, 'Enter the path you want to start from ? ');
        let results = await walkAsync(url, ".svg");
        
        let ext = await questionAsync(rl, 'Enter the file extension you want to clean from the selected folder ? ');    
        if(!ext.match(/svg/i)) {
          
          let resultsDel = await walkAsync(url, "." + ext);
          let resUppercase = await walkAsync(url, "." + ext.toUpperCase());
          resultsDel.push.apply(resultsDel, resUppercase);   
          
          resultsDel.forEach(function(svgPath){
            fs.unlinkSync(svgPath);
          });
          console.log("\n" + resultsDel.length + " files with extension \"" + ext + "\" were deleted succesfully.");
        }
    
        results.forEach(async function(svgPath){
            let data = fs.readFileSync(svgPath, 'utf8');
            let res = await svgo.optimize(data, {path: svgPath});
            fs.writeFileSync(svgPath, res.data);
        });
        console.log(results.length + " files with extension \"svg\" were modified succesfully.");

        rl.close();
        // rl1.close();


    } catch(ex) {
        console.log(" Error on try/catch mainF: " + ex);
        throw ex;
    }

}

mainF()
  .then(()=>{
      console.log("Finished modifying/cleaning.\n");
  })
  .catch((ex)=>{
      console.log("Error on mainF: " + ex);
  })