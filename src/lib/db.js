/**
 * Created by xushaoping on 17/9/12.
 */

import Datastore from 'nedb'
import path from 'path'
import { remote } from 'electron'

export default class db{
  constructor(){
    this.$db = new Datastore({
        autoload: true,
        filename: path.join(remote.app.getPath('userData'), '/book.db')
    })
  }

  insertBook(path){
    this.$db.find({path:path}, (err, res)=> {
        if(res.length == 0){
          this.$db.insert({
              path: path
              }, function (err) {
              if (err) {
                  alert(err)
              }
          })
        }
    })
  }

  updateLocation(path,cfi){
    this.$db.update({ path: path }, { $set:{ location: cfi }}, {}, function (err,numReplaced) {
      //console.log("replaced---->" + numReplaced)
    })
  }

  findLocation(path,handle){
    this.$db.findOne({path:path}, (err, res)=> {
      if(res)
        handle(res.location)
    })
  }

  updateBookmarks(path,bookmarks){
    this.$db.update({ path: path }, {$set:{ bookmarks: bookmarks }}, {}, function () {
    })
  }

  findBookmarks(path,handle){
    this.$db.findOne({path:path}, (err, res)=> {
      if(res)
        handle(res.bookmarks)
    })
  }

  updateNotes(path,notes){
    this.$db.update({ path: path }, {$set:{ notes: notes }}, {}, function () {
    })
  }

  findNotes(path,handle){
    this.$db.findOne({path:path}, (err, res)=> {
      if(res)
        handle(res.notes)
    })
  }
}
