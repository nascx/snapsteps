import excel2json from 'convert-excel-to-json'

export const convertExcelToJson = (listPath: string, line: string) => {
    try {
        const result = excel2json(
            {
                sourceFile: listPath,
                sheets: [{
                    name: '1',
                    columnToKey: {
                        A: 'pm',
                        B: 'page',
                        C: 'it',
                        D: 'activity',
                        E: 'post',
                        F: 'sequence',
                        G: 'operations'
                    }
                }]
            }
        )
        const jsonData = result['1']
        const model: string = jsonData[0].pm
        const product: string = jsonData[1].pm
        jsonData[2].pm = line
        const content = JSON.stringify(jsonData)        
        return { model, product, content, line }
    } catch (error) {
        console.log({ message: 'Error to convert excel to json', errorMessage: error })
    }
}


export const convertExcelToJsonWithoutAlterLine = (listPath: string) => {
    try {
        const result = excel2json(
            {
                sourceFile: listPath,
                sheets: [{
                    name: '1',
                    columnToKey: {
                        A: 'pm',
                        B: 'page',
                        C: 'it',
                        D: 'activity',
                        E: 'post',
                        F: 'sequence',
                        G: 'operations'
                    }
                }]
            }
        )
        const jsonData = result['1']
        const model: string = jsonData[0].pm
        const product: string = jsonData[1].pm
        const line: string = jsonData[2].pm
        const content = JSON.stringify(jsonData) 
        return { model, product, content, line }
    } catch (error) {
        console.log({ message: 'Error to convert excel to json', errorMessage: error })
    }
}
