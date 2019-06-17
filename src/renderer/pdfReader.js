const pdf = require('pdfjs-dist')
const electron = require('electron')

export default class pdfReader {
  constructor() {
    this.pageNum = 1
  }

  openPdf(url){
    pdf.GlobalWorkerOptions.workerSrc = '${__dirname}/../../../node_modules/pdfjs-dist/build/pdf.worker.js'
    pdf.getDocument(url).then((doc) => {
      this.canvas = document.querySelector("#can")
      this.doc = doc
      this.renderPage()
    })

  }

  renderPage() {
    this.pageRendering = true
    this.doc.getPage(this.pageNum).then(page => {
      var viewport = page.getViewport(2.0)
      var h = electron.screen.getPrimaryDisplay().workAreaSize.height * 2
      this.canvas.height = h
      this.canvas.width = h*viewport.width/viewport.height
      var ctx = this.canvas.getContext('2d')

      var renderContext = {
       canvasContext: ctx,
       viewport: viewport
      }
      var renderTask = page.render(renderContext)
      renderTask.promise.then(() => {
        this.pageRendering = false;
        if (this.pageNumPending) {
          this.pageNum = this.pageNumPending
          this.renderPage();
          this.pageNumPending = null;
        }
      })
    })
  }

  next(){
    if (this.pageNum >= this.doc.numPages) {
       return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  prev(){
    if (this.pageNum <= 1) {
      return
    }
    this.pageNum--
    this.queueRenderPage(this.pageNum)
  }

  queueRenderPage(num) {
    if (this.pageRendering) {
      this.pageNumPending = num
    } else {
      this.renderPage()
    }
  }

  zoomIn(){

  }

  zoomOut(){

  }
}
