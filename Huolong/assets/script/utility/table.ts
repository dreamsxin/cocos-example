let $createData = Symbol("$createData")

export default class Table {
    directors: any[] = []
    data: any

    constructor(){
        this.directors = []
        for(let i=0; i<arguments.length; ++i){
            if(arguments[i] != null){
                this.directors.push(arguments[i])
            }
        }

        this.data = this[$createData](0)
    }

    setData(value){
        let ret = this.data
        for(let i=1; i<arguments.length - 1; ++i){
            if(arguments[i] != null){
                ret = ret[arguments[i]]
            }
        }
        ret[arguments[arguments.length - 1]] = value
    }

    getData(){
        let ret = this.data
        for(let i=0; i<arguments.length; ++i){
            if(!ret){
                return null
            }
            if(arguments[i] != null){
                ret = ret[arguments[i]]
            }
        }
        return ret
    }

    [$createData](index){
        if(index >= this.directors.length)
            return null
        let ret = {}
        for(let i=0; i<this.directors[index].length; ++i){
            ret[this.directors[index][i]] = this[$createData](index+1)
        }
        return ret
    }
}