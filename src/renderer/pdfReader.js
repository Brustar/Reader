const pdf = require('pdfjs-dist')
const electron = require('electron')

export default class pdfReader {
  constructor() {
    this.scale = 2.0
  }

  openPdf(url){
    pdf.GlobalWorkerOptions.workerSrc = '${__dirname}/../../../node_modules/pdfjs-dist/build/pdf.worker.js'
    pdf.getDocument(url).then((doc) => {
      this.doc = doc
      this.renderPage()
    })
  }

  renderPage() {
    var container = document.querySelector(".pdfcontainer")
    while(container.hasChildNodes()){
      container.removeChild(container.lastChild)
    }
    this.pageRendering = true
    for (var i = 1; i <= this.doc.numPages; i++) {
      this.doc.getPage(i).then(page => {
        var canvas = document.createElement('canvas');
        var viewport = page.getViewport(this.scale)
        var h = electron.screen.getPrimaryDisplay().workAreaSize.height * 2
        canvas.height = h
        canvas.width = h*viewport.width/viewport.height
        var ctx = canvas.getContext('2d')

        var renderContext = {
         canvasContext: ctx,
         viewport: viewport
        }
        container.appendChild(canvas);

        var renderTask = page.render(renderContext)
        renderTask.promise.then(() => {
          this.pageRendering = false;
          if (this.pageNumPending) {
            this.pageNum = this.pageNumPending
            this.renderPage();
            this.pageNumPending = undefined;
          }
        })
      })
    }
  }

  next(){
    /*if (this.pageNum >= this.doc.numPages) {
       return
    }
    this.pageNum++
    this.queueRenderPage(this.pageNum)*/
  }

  prev(){
    /*if (this.pageNum <= 1) {
      return
    }
    this.pageNum--
    this.queueRenderPage(this.pageNum)*/
  }

  queueRenderPage() {
    if (this.pageRendering) {
      this.pageNumPending = 1
    } else {
      this.renderPage()
    }
  }

  zoomIn(){
    this.scale += 0.1;
    this.queueRenderPage();
  }

  zoomOut(){
    this.scale -= 0.1;
    this.queueRenderPage();
  }
}
