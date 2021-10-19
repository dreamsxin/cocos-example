module.exports =  {
    TouchLength : 80,
    CatSpeed : 0.2,
    Create2DArray : function(rows,columns) 
    {
        var x = new Array(rows);
        for (var i = 0; i < rows; i++) {
            x[i] = new Array(columns);
        }
        return x;
     },


}