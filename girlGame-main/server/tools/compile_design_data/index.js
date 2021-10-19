const xlsx = require('node-xlsx');
const util = require('util');
const fs = require('fs');
const tables = require('./configs/tables.map');

function getSrcFilename(tblname, minetype)
{
    return util.format("./datas/%s.%s", tblname, minetype);
}

function getDstFilename(tblname)
{
    return util.format("./dist/%s.js", tblname);
}

function dataUnpack(resources)
{
    let data = resources;
    let data_fields = data[1],
        data_types = data[2],
        data_idents = data[3];
    data.splice(0, 1);
    data.splice(0, 1);
    data.splice(0, 1);
    data.splice(0, 1);

    return {
        fields: data_fields,
        types: data_types,
        idents: data_idents,
        data: data,
        size: data_fields.length
    };
}

function getPrimaryKeyPosition(fields, primaryKey)
{
    for (let i = 0; i < fields.length; i++) {
        if (fields[i] === primaryKey) {
            return i;
        }
    }

    return -1;
}

function getIndexName(tblname, fieldname)
{
    return util.format("INDEX_%s_%s", tblname, fieldname);
}

function createObject(filename, tblname, primaryKey, indexs)
{
    let excel = xlsx.parse(filename);
    let data = dataUnpack(excel[0].data);

    let indexObject = null;
    if ("undefined" !== typeof indexs) {
        indexObject = {};
        indexs.forEach(key => { indexObject[key] = {}; });
    }

    let primaryKeyPos = getPrimaryKeyPosition(data.fields, primaryKey);
    if (primaryKeyPos !== -1) {
        const wStream = fs.createWriteStream(getDstFilename(tblname));

        wStream.write(util.format("const %s = {\n", tblname.toUpperCase()));

        data.data.forEach((dataItem, index) => {
            if (dataItem.length > 0) {
                let item = { primary_key: null, results: {} };
                for (let offset = 0; offset < data.size; offset++) {
                    let field_type = data.types[offset],
                        field_name = data.fields[offset];

                    if (offset === primaryKeyPos) {
                        item.primary_key = dataItem[offset];
                    } else {
                        if (data.idents[offset] === "cs" || data.idents[offset] === "s") {
                            // 是服务器需要读取的表字段
                            if (field_type === "int" || field_type === "float") {
                                item.results[field_name] = Number(dataItem[offset]);
                            } else if (field_type === "string") {
                                item.results[field_name] = dataItem[offset];
                            } else if (field_type === "int[]") {
                                let temps = [];
                                if ("undefined" !== typeof dataItem[offset]) {
                                    temps = dataItem[offset].toString().split('|');
                                }
                                temps.forEach((v, index, input) => { input[index] = Number(v); });
                                item.results[field_name] = temps;
                            } else {
                                console.error("Unknown field type: %s", field_type);
                            }
                        }
                    }

                    if (indexObject !== null && "undefined" !== typeof indexObject[field_name] && 
                            "undefined" !== typeof dataItem[offset]) {
                        // 有该字段的索引, 类型只会是int和string
                        let indexValue = dataItem[offset].toString();
                        if (!Array.isArray(indexObject[field_name][indexValue])) {
                            indexObject[field_name][indexValue] = [];
                        }

                        // 索引值(primary key)只会是第一列
                        let indexPrimaryKey = data.types[0] === "int" ? Number(dataItem[0]) : dataItem[0];
                        indexObject[field_name][indexValue].push(indexPrimaryKey);
                    }
                }
                if ("undefined" !== typeof item.primary_key && "string" !== typeof item.primary_key && item.primary_key !== null) {
                    wStream.write(util.format("\t\"%s\": %s", item.primary_key, JSON.stringify(item.results)));

                    if ((index+1) < data.data.length) {
                        wStream.write(",");
                    }

                    wStream.write("\n");
                }
            }
        });

        wStream.write("}\n\n");

        let indexNameLis = [];
        if (null !== indexObject) {
            // 需要写入索引数据
            let indexKeys = Object.keys(indexObject);
            indexKeys.forEach(key => {
                let indexName = getIndexName(tblname.toUpperCase(), key.toUpperCase());
                indexNameLis.push(indexName);
                wStream.write(util.format("const %s = {\n", indexName));
                let indexValKeys = Object.keys(indexObject[key]);
                indexValKeys.forEach((val, index) => {
                    let lis = indexObject[key][val];
                    wStream.write(util.format("\t\"%s\": %s", val, JSON.stringify(lis)));
                    if ((index+1) < indexValKeys.length) {
                        wStream.write(",");
                    }
                    wStream.write("\n");
                });
                wStream.write("}\n");
            });
        }

        wStream.write("module.exports={\n");
        wStream.write(util.format("\t%s", tblname.toUpperCase()));
        if (indexNameLis.length > 0) {
            wStream.write(",");
        }
        wStream.write("\n");
        // 导出索引相关数据
        indexNameLis.forEach((indexName, index) => {
            wStream.write(util.format("\t%s", indexName));
            if ((index+1) < indexNameLis.length) {
                wStream.write(",");
            }
            wStream.write("\n");
        })
        wStream.write("}\n");

        wStream.end();
        wStream.close();

        console.log("%s created success", tblname);
    } else {
        console.error("Cannot find primary key: tblname=%s, primary_key=%s", tblname, primaryKey);
        process.exit(-1);
    }
}

function createList(filename, tblname)
{
    let excel = xlsx.parse(filename);
    let data = dataUnpack(excel[0].data);

    const wStream = fs.createWriteStream(getDstFilename(tblname));

    wStream.write(util.format("const %s = [\n", tblname.toUpperCase()));
    data.data.forEach((dataItem, index) => {
        if (dataItem.length > 0) {
            let itemObject = {};

            for (let offset = 0; offset < data.size; offset++) {
                let field_type = data.types[offset],
                    field_name = data.fields[offset];
                if (data.idents[offset] === "cs" || data.idents[offset] === "s") {
                    // 是服务器需要读取的表字段
                    if (field_type === "int" || field_type === "float") {
                        itemObject[field_name] = Number(dataItem[offset]);
                    } else if (field_type === "string") {
                        itemObject[field_name] = dataItem[offset];
                    } else if (field_type === "int[]") {
                        let temps = [];
                        if ("undefined" !== typeof dataItem[offset]) {
                            temps = dataItem[offset].toString().split('|');
                        }
                        temps.forEach((v, index, input) => { input[index] = Number(v); });
                        itemObject[field_name] = temps;
                    } else {
                        console.error("Unknown field type: %s", field_type);
                    }
                }
            }
            
            wStream.write(util.format("\t%s", JSON.stringify(itemObject)));
            if ((index+1) < data.data.length) {
                wStream.write(",");
            }
            wStream.write("\n");
        }
    });
    wStream.write("]\n\n");
    wStream.write("module.exports={\n");
    wStream.write(util.format("\t%s\n", tblname.toUpperCase()));
    wStream.write("}\n");
    wStream.end();
    wStream.close();
    console.log("%s created success", tblname);
}

tables.forEach(item => {
    if (item.type === "object") {
        createObject(getSrcFilename(item.name, item.minetype), item.name, item.primary_key, item.indexs);
    } else if (item.type === "list") {
        createList(getSrcFilename(item.name, item.minetype), item.name);
    } else {
        console.error("Unknown table type: tblname=%s, type=%s", item.name, item.type);
    }
});