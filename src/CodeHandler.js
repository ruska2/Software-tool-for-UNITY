import React, { Component } from 'react';



class CodeHandler extends Component {

    constructor(props) {
        super(props);
        this.state = {


        };

    }

    static staticProperty = {

    };

    render() {
        return null;
    }

    checkStartEnd = (value) => {
        if(value.startsWith("Program ") && value.endsWith("end")){
            return true;
        }
        else{
            return false;
        }
    };

    removeEmptyLinesAtEnd = (value) =>{
        if(value.includes("Program ")) {
            if (value.endsWith("end")) return value;
            let split = value.split("end");
            return split[0] + "\nend";
        }
        return value;
    };

    removeCommas = (value) => {
        for(let i = 0; i < value.length; i++){
            if(i+1 < value.length && value[i] == ";" && value[i+1] == "\n"){
                let counter = 0;
                /*for(let j = i ; j > -1; j--){
                    console.log(value.charCodeAt(j));
                    if(value[j] == "\t" || value.charCodeAt(j) === 32){
                        while(value[j] === "\t" || value.charCodeAt(j) === 32){
                            j--;
                            counter++;
                        }
                        break;
                    }
                }
                let res = "";
                for(let j = 0; j < 0; j++){
                    res += "\t";
                }*/
                return [value.replace(";","\n" ),true];
            }
        }
        return [value,false];
    }







}

export default CodeHandler;
