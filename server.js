var path = require('path')
var express = require('express')
var app = express()
// var cheerio = require('cheerio');
// var $ = cheerio.load(require('./sourcehtml'))

// const imgList = [];
// $('img').map(function (){
//   // console.log(this)
//   imgList.push($(this).attr('src'));

//   // $(this).attr('src', originSrc.replace('https://uploader.shimo.im/f/', 'https://static.lipten.link/'));
// })
// console.log(imgList)

var port = 8012
app.use(express.static(path.join(__dirname, './')));
// app.use('/public', express.static(path.join(__dirname, './public')));

app.listen(port, function () {
  console.log('listening '+ port)
})
