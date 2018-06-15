var http = require('http');
var cheerio = require('cheerio');
var url = 'http://www.imooc.com/learn/348';

function filterData (html) {
  var $ = cheerio.load(html);
  var chapters = $('.chapter');
  var data = [];

  chapters.each((index, item) => {
    var _this = $(item);
    var columnTitle = _this.find('h3').text();
    var videos = _this.find('.video li');
    let obj = {
      columnTitle,
      videos: []
    };

    videos.each((index, item) => {
      var video = $(item);
      var title = video.find('.J-media-item').text();
      var id = video.attr('data-media-id');
      var href = video.find('.J-media-item').attr('href');

      obj.videos.push({
        title,
        id,
        href
      })
    });

    data.push(obj);
  });

  return data;
};

function printInfo (list) {
  list.forEach(item => {
    let columnTitle = item.columnTitle;
    console.log(columnTitle);

    item.videos.forEach(video => {
      console.log('[ ' + video.id + video.title + video.href + ' ]');
    });
  });
};

http.get(url, res => {
  var html = '';

  res.on('data', data => {
    html += data;
  });

  res.on('end', () => {
    var list = filterData(html);
    printInfo(list)
  });
}).on('error', function (err) {
  console.log(err);
});
