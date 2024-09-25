import ExcelJS from 'exceljs'

export const convertJsonToExcel = ( jsonData: []) => {

    const workbook = new ExcelJS.Workbook()

    const worksheet = workbook.addWorksheet('1')

    worksheet.getColumn('A').width=20

    worksheet.getColumn('B').width=20

    worksheet.getColumn('C').width=20

    worksheet.getColumn('D').width=60

    worksheet.getColumn('E').width=20

    worksheet.getColumn('F').width=20

    worksheet.getColumn('G').width=20
    
    jsonData.forEach((row : {pm: string, page: number, it:string, activity: string, post: number, sequence: number, operations: string}) => {
        const rowData = [row.pm, row.page, row.it, row.activity, row.post, row.sequence, row.operations]
        worksheet.addRow(rowData)
    });

    worksheet.getCell('B1').font={ bold: true }
    worksheet.getCell('C1').font={ bold: true }
    worksheet.getCell('D1').font={ bold: true }
    worksheet.getCell('E1').font={ bold: true }
    worksheet.getCell('F1').font={ bold: true }
    worksheet.getCell('G1').font={ bold: true }

    return workbook
}

