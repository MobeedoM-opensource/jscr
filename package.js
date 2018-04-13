var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  var request = require('request');
  const cheerio = require('cheerio');

  var id = '';
  var lang = 'en';

  if (req.query.id)
    id = req.query.id;

  if (req.query.lang)
    lang = req.query.lang;

  var url = 'https://play.google.com/store/apps/details?id=' + id + '&hl=' + lang;

  request(url, function (error, response, body) {
    const $ = cheerio.load(body);

    var dto = new Object();
    dto.apiv = '1.0';

    try {
      dto.appIconUrl = $('.ujDFqe').attr('src');
      dto.appAuthor = $('.T32cc:nth-child(1) > a:nth-child(1)').text();
      dto.fullDescription = $('div.PHBdkd:nth-child(4) > div:nth-child(1) > content:nth-child(1) > div:nth-child(1)').html().replace('\n', '<br/>');
      dto.appRating = $('.BHMmbe').text().replace(',', '.');
      dto.changeLog = $('div.PHBdkd:nth-child(2) > div:nth-child(1) > content:nth-child(1)').html().replace('\n', '<br/>');

      dto.datePublished = $('.xyOfqd > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)').text();
      dto.fileSize = $('div.hAyfc:nth-child(2) > div:nth-child(2) > span:nth-child(1)').text();
      dto.numDownloads = $('div.hAyfc:nth-child(3) > div:nth-child(2) > span:nth-child(1)').text();
      dto.softwareVersion = $('div.hAyfc:nth-child(4) > div:nth-child(2) > span:nth-child(1)').text();
      dto.operatingSystems = $('div.hAyfc:nth-child(5) > div:nth-child(2) > span:nth-child(1)').text();
      dto.contentRating = $('div.hAyfc:nth-child(6) > div:nth-child(2) > span:nth-child(1) > div').text();

      var hr1 = $('div.hAyfc:nth-child(10) > div:nth-child(2) > span:nth-child(1) > div:nth-child(1) > a:nth-child(1)').attr('href');
      if (hr1 && hr1.startsWith('http'))
        dto.siteDev = hr1;
      else if (hr1 && hr1.startsWith('mailto'))
        dto.mailDev = hr1;

      var hr2 = $('div.hAyfc:nth-child(10) > div:nth-child(2) > span:nth-child(1) > div:nth-child(2) > a:nth-child(1)').attr('href');
      if (hr2 && hr2.startsWith('http'))
        dto.siteDev = hr2;
      else if (hr2 && hr2.startsWith('mailto'))
        dto.mailDev = hr2;

      dto.appName = id;
    } catch (e) {
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(dto));
  });

});

module.exports = router;
