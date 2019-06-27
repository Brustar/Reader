const pdf = require('pdfjs-dist')
const electron = require('electron')
const path = require('path')
import { TextLayerBuilder } from 'pdfjs-dist/web/pdf_viewer'
//import 'pdfjs-dist/web/pdf_viewer.css'

export default class pdfReader {
  constructor() {
    this.scale = 2.0
  }

  openPdf(url,progress){
    pdf.GlobalWorkerOptions.workerSrc = '${__dirname}/../../../node_modules/pdfjs-dist/build/pdf.worker.js'
    document.title = path.basename(url)
    pdf.getDocument(url).then((doc) => {
      this.doc = doc
      progress(doc.numPages)
      this.renderPage()
    })
  }

  renderPage() {
    var container = document.querySelector(".pdfcontainer")
    while(container.hasChildNodes()){
      container.removeChild(container.lastChild)
    }
    for (var i = 1; i <= this.doc.numPages; i++) {
      this.doc.getPage(i).then(page => {
        var pageDiv = document.createElement('div')
        pageDiv.setAttribute('id', 'page-' + (page.pageIndex + 1))
        pageDiv.setAttribute('style', 'position: relative')
        container.appendChild(pageDiv)
        var canvas = document.createElement('canvas')
        var viewport = page.getViewport(this.scale)
        var h = electron.screen.getPrimaryDisplay().workAreaSize.height * this.scale
        canvas.height = h
        canvas.width = h*viewport.width/viewport.height
        var ctx = canvas.getContext('2d')

        var renderContext = {
         canvasContext: ctx,
         viewport: viewport
        }
        pageDiv.appendChild(canvas)
        page.render(renderContext).then(() => {
            return page.getTextContent()
        }).then((textContent) => {
            // 创建文本图层div
            const textLayerDiv = document.createElement('div')
            textLayerDiv.setAttribute('class', 'textLayer')
            // 将文本图层div添加至每页pdf的div中
            pageDiv.appendChild(textLayerDiv)
            // 创建新的TextLayerBuilder实例
            var textLayer = new TextLayerBuilder({
                textLayerDiv: textLayerDiv,
                pageIndex: page.pageIndex,
                viewport: viewport
            })
            textLayer.setTextContent(textContent)
            textLayer.render()
        })
      })
    }
  }

  next(){
  }

  prev(){
  }

  process(y){
    var h = electron.screen.getPrimaryDisplay().workAreaSize.height * this.scale
    var page = Math.round(y/h)+1
    if(page>this.doc.numPages) page = this.doc.numPages
    return {page:page,total:this.doc.numPages}
  }

  zoomIn(){
    this.scale += 0.1;
    this.renderPage();
  }

  zoomOut(){
    this.scale -= 0.1;
    this.renderPage();
  }
}
