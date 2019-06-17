const pdf = require('pdfjs-dist')

export default class pdfReader {
  constructor() {

  }

  openPdf(url){
    pdf.GlobalWorkerOptions.workerSrc = '${__dirname}/../../node_modules/pdfjs-dist/build/pdf.worker.js';
    pdf.getDocument(url).then(function(doc){
      console.log(doc)
      doc.getPage(1).then(function(page){
        console.log(page)
      })
    })

  }

  next(){

  }

  prev(){

  }

  zoomIn(){

  }

  zoomOut(){

  }
}
