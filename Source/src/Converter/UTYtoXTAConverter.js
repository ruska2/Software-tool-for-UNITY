import UTYtoXTAParser from "./UTYtoXTAParser";


class UTYtoXTAConverter {

    constructor(code) {
        this.code = code;
    }


    convertToString= () => {
        let toWriteStr = "";
        const utyToXtaParser = new UTYtoXTAParser(this.code);
        utyToXtaParser.parse();
        let variables = utyToXtaParser.getVariables();
        let assignments = utyToXtaParser.getSequential();
        let cycles = utyToXtaParser.getQuantified();
        let paralell = utyToXtaParser.getQuantifiedParalell();
        console.log("paralell");
        console.log(paralell);

        let keys = [];
        Object.keys(variables).forEach(function (key) {
            keys.push(key);
        });


        let counter = assignments.length;
        if (counter !== 0) {
            toWriteStr += "chan ";
        }

        for (let i = 0; i < counter; i++) {
            if (i + 1 < counter) {
                toWriteStr += "ch" + (i + 1) + ", ";
            }
            else {
                toWriteStr += "ch" + (i + 1) + ";\n";
            }
        }
        console.log(keys);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if ((variables[key].includes("true") || variables[key].includes("false")) && !(variables[key] instanceof Array)) {
                toWriteStr += "bool " + key + " = " + variables[key] + ";\n";
            }
            else if (!isNaN(Number(variables[key]))) {
                toWriteStr += "int " + key + " = " + variables[key] + ";\n";
            } else {
                let arry = variables[key];
                let helperString = "{";
                console.log("arry", arry);
                for (let j = 0; j < arry.length; j++) {
                    if (j + 1 < arry.length) {
                        helperString += arry[j] + ","
                    }
                    else {
                        helperString += arry[j] + "};\n"
                    }
                }
                if ((variables[key][0].includes("true") || variables[key][0].includes("false"))) {
                    toWriteStr += "bool " + key + "[" + variables[key].length + "] := " + helperString;
                }
                else if (!isNaN(Number(variables[key][0]))) {
                    toWriteStr += "int " + key + "[" + variables[key].length + "] := " + helperString;
                }
            }
        }

        let cyclecount = cycles.length;

        for (let i = 0; i < cyclecount; i++) {
            //cyclechanesl
            toWriteStr += "chan ";
            for (let j = 0; j < cycles[i].length; j++) {
                if (j + 1 < cycles[i].length) {
                    toWriteStr += "chCycle" + (i + 1) + (j + 1) + ", ";
                }
                else {
                    toWriteStr += "chCycle" + (i + 1) + (j + 1) + ";\n";
                }
            }

            toWriteStr += "\n";
        }

        let paracyclecount = paralell.length;

        for(let i = 0; i < paracyclecount; i++){
            toWriteStr += "chan ";
            for(let j =0; j < paralell[i].length; j++){
                toWriteStr += "chCycleParalell" + (i + 1) + (j + 1) + ", ";
            }
            toWriteStr = toWriteStr.substring(0,toWriteStr.length-2);
            toWriteStr += ";\n";
        }

        toWriteStr += "\n";
        toWriteStr += "\n";

        toWriteStr += "int intvarhelper = 0;\n";
        toWriteStr += "bool boolvarhelper = false;\n";
        toWriteStr += "bool blocker = false;\n";
        toWriteStr += "\n";

        //HELPER

        toWriteStr += "\nprocess Helper(){\n\n";
        toWriteStr += "state \n\tS0;\n";
        toWriteStr += "init S0;\n";
        toWriteStr += "trans\n";

        for (let i = 0; i < counter; i++) {
            if ((i + 1) === counter) {
                toWriteStr += "\tS0 -> S0 { sync ch" + (i + 1) + "?;},\n"
            } else {
                toWriteStr += "\tS0 -> S0 { sync ch" + (i + 1) + "?;},\n"
            }
        }

        for (let i = 0; i < cyclecount; i++) {
            for (let j = 0; j < cycles[i].length; j++) {
                if (j + 1 < cycles[i].length) {
                    toWriteStr += "\tS0 -> S0 { sync chCycle" + (i + 1) + (j + 1) + "?;},\n"
                }
                else {
                    toWriteStr += "\tS0 -> S0 { sync chCycle" + (i + 1) + (j + 1) + "?;},\n"
                }
            }
            if (i + 1 === cyclecount) {
                toWriteStr = toWriteStr.slice(0, toWriteStr.length - 2) + ";\n";
            }
        }

        for (let i = 0; i < paracyclecount; i++){
            for (let j = 0; j < paralell[i].length; j++){
                toWriteStr += "\tS0 -> S0 { sync chCycleParalell" + (i + 1) + (j + 1) + "?;},\n"
            }
            if (i + 1 === paracyclecount) {
                toWriteStr = toWriteStr.slice(0, toWriteStr.length - 2) + ";\n";
            }
        }


        toWriteStr += "}\n\n";


        for (let i = 0; i < assignments.length; i++) {
            toWriteStr += "process Line" + (i + 1) + "() {\n\n";
            toWriteStr += "state\n";
            toWriteStr += "\tS0,\n";
            toWriteStr += "\tS1;\n";
            toWriteStr += "init S0;\n";
            toWriteStr += "trans\n";
            let guard = assignments[i][2];
            let first = assignments[i][0] + " := " + assignments[i][1];


            if (guard === "") {
                toWriteStr += "\tS0 -> S1 {  sync ch" + (i + 1) + "!; assign " + first + ";},\n";
                toWriteStr += "\tS1 -> S0 {  sync ch" + (i + 1) + "!; assign " + first + ";};\n";
            } else {
                toWriteStr += "\tS0 -> S1 { guard !blocker && " + guard + "; sync ch" + (i + 1) + "!; assign " + first + ";},\n";
                toWriteStr += "\tS1 -> S0 { guard !blocker && " + guard + "; sync ch" + (i + 1) + "!; assign " + first + ";};\n";
            }

            toWriteStr += "}\n\n";
        }


        for (let i = 0; i < cyclecount; i++) {

            for (let j = 0; j < cycles[i].length; j++) {

                toWriteStr += "\n";

                toWriteStr += "process Cycle" + (i + 1) + (j + 1) + "() {\n\n";
                toWriteStr += "state\n";
                toWriteStr += "\tS0,\n";
                toWriteStr += "\tS1;\n";
                toWriteStr += "init S0;\n";
                toWriteStr += "trans\n";


                let line = cycles[i][j].split("if");
                let guard = "";
                console.log(line);
                if (line.length > 1) {
                    guard = line[1].trim();
                }
                let con = line[0].trim();
                con = con.split(":=");
                if(con.length > 1){
                    let left = con[0].split(",");
                    let right = con[1].split(",");
                    //alert(left.length + "  " +right.length);
                    //alert(left + "  " +right);
                    if(left.length !== right.length){
                        alert("SYNTAX ERROR!");
                        return;
                    }
                    if(left.length === 1){
                        con = line[0].trim();
                    }else{
                        con = "";
                        for(let k = 0; k < left.length; k+= 1){
                            let leftv = left[k].trim();
                            let rightv = right[k].trim();
                            //alert(k + " " + left.length);
                            if(k === left.length-1){

                                con += left[k].trim() + " :=" + right[k].trim();
                                continue;
                            }
                            let leftv1 = left[k+1].trim();
                            let rightv1 = right[k+1].trim();
                            if(k+1 < left.length && leftv === rightv1 && leftv1 === rightv){
                                if(k+2 < left.length){
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper,"
                                }else{
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper"
                                }
                                k++;
                            }else{
                                if(k+1 < left.length){
                                    con += left[k].trim() + " :=" + right[k].trim()+",\n";
                                }else{
                                    con += left[k].trim() + " :=" + right[k].trim();
                                }
                            }
                        }
                    }

                }else{
                    con = line[0].trim();
                }
                let sync = "chCycle" + (i + 1) + (j + 1);
                if (guard !== "") {
                    toWriteStr += "\tS1 -> S0  {guard !blocker && " + guard + ";  sync " + sync + "!; assign " + con + ";},\n";
                    toWriteStr += "\tS0 -> S1  {guard !blocker && " + guard + ";  sync " + sync + "!; assign " + con + ";};\n";
                } else {
                    toWriteStr += "\tS1 -> S0 {  sync " + sync + "!; assign " + con + ";},\n";
                    toWriteStr += "\tS0 -> S1 {  sync " + sync + "!; assign " + con + ";};\n";
                }

                toWriteStr += "}\n\n";
            }
        }


        toWriteStr += "\n";
        toWriteStr += "\n";


        //paralell
        for(let i = 0; i < paracyclecount; i++){
            toWriteStr += "process ParalellCycle" + (i + 1) + "() {\n\n";
            toWriteStr += "state\n";
            for(let j = 0; j < paralell[i].length-1; j++){
                toWriteStr += "\tS"+ (j) +",\n";
            }

            toWriteStr += "\tS"+ (paralell[i].length -1) +";\n";
            toWriteStr += "init S0;\n";
            toWriteStr += "trans\n";

            for(let j = 0; j < paralell[i].length; j++){
                let line = paralell[i][j].split("if");
                let guard = "";
                console.log(line);
                if (line.length > 1) {
                    guard = line[1].trim();
                }
                let con = line[0].trim();
                con = con.split(":=");
                if(con.length > 1){
                    let left = con[0].split(",");
                    let right = con[1].split(",");
                    //alert(left.length + "  " +right.length);
                    //alert(left + "  " +right);
                    if(left.length !== right.length){
                        alert("SYNTAX ERROR!");
                        return;
                    }
                    if(left.length === 1){
                        con = line[0].trim();
                    }else{
                        con = "";
                        for(let k = 0; k < left.length; k+= 1){
                            let leftv = left[k].trim();
                            let rightv = right[k].trim();
                            //alert(k + " " + left.length);
                            if(k === left.length-1){

                                con += left[k].trim() + " :=" + right[k].trim();
                                continue;
                            }
                            let leftv1 = left[k+1].trim();
                            let rightv1 = right[k+1].trim();
                            if(k+1 < left.length && leftv === rightv1 && leftv1 === rightv){
                                if(k+2 < left.length){
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper,"
                                }else{
                                    con += "intvarhelper := " + leftv + ",\n";
                                    con += leftv + " := " + rightv + ",\n";
                                    con += rightv + " := intvarhelper"
                                }
                                k++;
                            }else{
                                if(k+1 < left.length){
                                    con += left[k].trim() + " :=" + right[k].trim()+",\n";
                                }else{
                                    con += left[k].trim() + " :=" + right[k].trim();
                                }
                            }
                        }
                    }

                }else{
                    con = line[0].trim();
                }
                let sync = "chCycleParalell" + (i + 1) + (j + 1);
                if (guard !== "") {
                    if(j+1 === paralell[i].length){
                        con = con.substring(0,con.length) + ", blocker = false";
                        toWriteStr += "\tS" + (j) +" -> S0 {guard " + guard + ";  sync " + sync + "!; assign " + con + ";};\n";
                    }
                    else{
                        if(j === 0){
                            con = con.substring(0,con.length) + ", blocker = true";
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard !blocker && " + guard + ";  sync " + sync + "!; assign " + con + ";},\n";
                        }else{
                            toWriteStr += "\tS" + (j) +" -> S"+ (j+1) +"  {guard " + guard + ";  sync " + sync + "!; assign " + con + ";},\n";
                        }
                    }

                } else {
                    if(j+1 === paralell[i].length){
                        toWriteStr += "\tS" + (j) + " -> S0{  sync " + sync + "!; assign " + con + ";},\n";
                    }
                    else{
                        toWriteStr += "\tS" + (j) +" -> S" + (j+1) + "{  sync " + sync + "!; assign " + con + ";},\n";
                    }
                }

            }
            toWriteStr += "}\n\n";
        }


        toWriteStr += "\n";
        toWriteStr += "helper = Helper();\n";

        for (let i = 0; i < counter; i++) {
            toWriteStr += "line" + (i + 1) + " = Line" + (i + 1) + "();\n";
        }

        for (let i = 0; i < cyclecount; i++) {
            for (let j = 0; j < cycles[i].length; j++) {
                toWriteStr += "cycle" + (i + 1) + (j + 1) + " = Cycle" + (i + 1) + (j + 1) + "();\n";
            }
        }

        for (let i = 0; i < paracyclecount; i++) {
                toWriteStr += "paralellCycle" + (i + 1) + " = ParalellCycle" + (i + 1) + "();\n";
        }


        toWriteStr += "system helper,";
        for (let i = 0; i < counter; i++) {
            if (i + 1 === counter) {
                toWriteStr += "line" + (i + 1) + ",";
            } else {
                toWriteStr += "line" + (i + 1) + ",";
            }
        }

        for (let i = 0; i < cyclecount; i++) {
            for (let j = 0; j < cycles[i].length; j++) {
                toWriteStr += "cycle" + (i + 1) + (j + 1) + ",";
            }
        }

        for (let i = 0; i < paracyclecount; i++) {
                toWriteStr += "paralellCycle" + (i + 1) + ",";
        }

        toWriteStr = toWriteStr.substring(0,toWriteStr.length-1) + ";";

        return toWriteStr;
    };



}

export default UTYtoXTAConverter;
