const pdf = require('pdfjs-dist')
const electron = require('electron')
const path = require('path')

export default class pdfReader {
  constructor() {
    this.scale = 2.0
  }

  openPdf(url){
    pdf.GlobalWorkerOptions.workerSrc = '${__dirname}/../../../node_modules/pdfjs-dist/build/pdf.worker.js'
    document.title = path.basename(url)
    pdf.getDocument(url).then((doc) => {
      this.doc = doc
      this.renderPage()
    })
  }

  renderPage() {
    var container = document.querySelector(".pdfcontainer")
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
  }

  prev(){
  }

  process(y){
    var h = electron.screen.getPrimaryDisplay().workAreaSize.height * 2
    return {page:Math.round(y/h)+1,total:this.doc.numPages}
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
