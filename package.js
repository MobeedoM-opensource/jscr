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

  var req = request.defaults({
    headers: {'User-Agent':'Mozilla/5.0 (Linux; Android 7.0; SM-G935P Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.92 Mobile Safari/537.36'}
  });

  req(url, function (error, response, body) {
    const $ = cheerio.load(body);

    var dto = new Object();
    dto.apiv = '1.0.2';

    try {
      dto.appIconUrl = $('.ujDFqe').attr('src');

      dto.scrapedCategory = $('span.T32cc:nth-child(2) > a:nth-child(1)').text();
      dto.scrapedCategoryENG = $('span.T32cc:nth-child(2) > a:nth-child(1)').attr('href').substring(44);
      try {
        dto.scrapedcategory2 = $('span.T32cc:nth-child(3) > a:nth-child(1)').text();
        dto.scrapedcategoryENG2 = $('span.T32cc:nth-child(3) > a:nth-child(1)').attr('href').substring(44);
      } catch (e) {
      }

      if (dto.scrapedcategoryENG2 && dto.scrapedcategoryENG2.startsWith('FAMILY')) {
        dto.scrapedcategoryENG2 = "FAMILY";
        dto.scrapedcategory2 = "Family";
      }

      if (dto.scrapedCategoryENG && dto.scrapedCategoryENG.substring(0, 4).indexOf('GAME') != -1)
        dto.gender = 1;
      else
        dto.gender = 0;


      dto.appAuthor = $('.T32cc:nth-child(1) > a:nth-child(1)').text();
      dto.fullDescription = $('div.PHBdkd:nth-child(4) > div:nth-child(1) > content:nth-child(1) > div:nth-child(1)').html().replace('\n', '<br/>');
      dto.appRating = $('.BHMmbe').text().replace(',', '.');
      dto.changeLog = $('div.PHBdkd:nth-child(2) > div:nth-child(1) > content:nth-child(1)').html().replace('\n', '<br/>');

      dto.datePublished = $('.xyOfqd > div:nth-child(1) > span:nth-child(2) > div:nth-child(1) > span:nth-child(1)').text();
      dto.fileSize = $('div.hAyfc:nth-child(2) > span:nth-child(2) > div:nth-child(1) > span:nth-child(1)').text();
      dto.numDownloads = $('div.hAyfc:nth-child(3) > span:nth-child(2) > div:nth-child(1) > span:nth-child(1)').text();
      dto.softwareVersion = $('div.hAyfc:nth-child(4) > span:nth-child(2) > div:nth-child(1) > span:nth-child(1)').text();
      dto.operatingSystems = $('div.hAyfc:nth-child(5) > span:nth-child(2) > div:nth-child(1) > span:nth-child(1)').text();
      dto.contentRating = $('div.hAyfc:nth-child(6) > span:nth-child(2) > div:nth-child(1) > span:nth-child(1) > div:nth-child(1)').text();

      var hr1 = $('div.hAyfc:nth-child(10) > span:nth-child(2) > div:nth-child(1) > span:nth-child(1) > div:nth-child(1) > a:nth-child(1)').attr('href');
      if (hr1 && hr1.startsWith('http'))
        dto.siteDev = hr1;
      else if (hr1 && hr1.startsWith('mailto'))
        dto.mailDev = hr1;

      var hr2 = $('div.hAyfc:nth-child(10) > span:nth-child(2) > div:nth-child(1) > span:nth-child(1) > div:nth-child(2) > a:nth-child(1)').attr('href');
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
