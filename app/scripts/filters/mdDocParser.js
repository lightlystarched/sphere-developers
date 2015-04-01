'use strict';

angular.module('developersApp')
.filter('mdDocParser', function () {
  return function (markdown, swagger) {
    var menuList = [],
      //previousLevel = 0,
      splitGroups = markdown.split(/\n/),// break the text based on line breaks
      indexMap = [-1, -1, -1, -1, -1],
      swaggerMenu = {text: 'Sphere API Specs', fullText: '', link: 'sphere-api-specs', subgroup: [], showGroup: false};

    angular.forEach(splitGroups, function (line) {
      var header = line.split(/^(#*)/).length - 1;

      if (header > 0) {//This is a header
        var text = line.split(/^#+/)[1],
          link = text.toLowerCase().replace(/[\s`':’]/g, '');

        switch (line.match(/^#+/)[0].length) {
          case 1://h1
            menuList.push({text: text, fullText: line, link: link, subgroup: [], showGroup: false});
            indexMap[0] += 1;
            break;
          case 2://h2
            menuList[indexMap[0]].subgroup.push({text: text, fullText: line, link: link, subgroup: [], showGroup: false});
            indexMap[1] += 1;
            break;
          /*case 3://h3
            menuList[indexMap[0]].subgroup[indexMap[1]].subgroup.push({text: text, fullText: line, link: link, subgroup: [], showGroup: false});
            indexMap[2] += 1;
            break;
          case 4://h4
            menuList[indexMap[0]].subgroup[indexMap[1]].subgroup[indexMap[2]].subgroup.push({text: text, fullText: line, link: link, subgroup: [], showGroup: false});
            indexMap[3] += 1;
            break;
          case 5://h5
            menuList[indexMap[0]].subgroup[indexMap[1]].subgroup[indexMap[2]].subgroup[indexMap[3]].subgroup.push({text: text, fullText: line, link: link, subgroup: [], showGroup: false});
            indexMap[4] += 1;
            break;*/
        }
      }
    });


    console.log('Swagger: ', swagger);
    // Parse the swagger doc for menu items
    angular.forEach(swagger.tags, function (tag) {
      var link = tag.name.toLowerCase().replace(/\s/g, '-'),
        item = {text: tag.description, fullText: tag.description, link: link, subgroup: [], showGroup: false};

      swaggerMenu.subgroup.push(item);
    });
    menuList.push(swaggerMenu);


    return menuList;
  };
  
});