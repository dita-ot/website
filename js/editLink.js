(function() {
        
        var link = document.createElement('a');
        link.textContent = 'Edit this page!';
        link.target = '_blank';
        
        if (!document.querySelector('.generated')) {
            var htmlURL = window.location.pathname;
            var file = htmlURL.endsWith('.html')? 
                htmlURL.slice('/dev/'.length, htmlURL.length - '.html'.length) + '.dita' : 
                htmlURL.slice('/dev/'.length, htmlURL.length) + 'index.dita' ;
            if (file.contains('/build-')) {
                file = file.replace('build-', '');
            }
            link.href=
              'https://www.oxygenxml.com/webapp-demo-aws/app/oxygen.html' + 
              '?url=github%3A%2F%2FgetFileContent%2Fdita-ot%2Fdocs%2Fdevelop%2F' +
              encodeURIComponent(file) + 
              '&ditamap=github%3A%2F%2FgetFileContent%2Fdita-ot%2Fdocs%2Fdevelop%2Fuserguide-book.ditamap';
        }
        
        document.querySelector('footer > .container').appendChild(link); 
}());