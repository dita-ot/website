(function() {
        function getEditURL(branch, file) {
            var projectBase = "github%3A%2F%2FgetFileContent%2Fdita-ot%2Fdocs%2F";
            return "https://www.oxygenxml.com/webapp-demo-aws/app/oxygen.html" + 
                "?url=" + projectBase + branch + "%2F" + encodeURIComponent(file) + 
                "&ditamap=" + projectBase + branch + "%2F" + "userguide-book.ditamap";    
        }

        if (!document.querySelector('.generated')) {
            var link = document.createElement('a');
            link.textContent = ' [Edit] ';
            link.target = '_blank';
            var htmlURL = window.location.pathname;
            var file = htmlURL.endsWith('.html')? 
                htmlURL.slice('/dev/'.length, htmlURL.length - '.html'.length) + '.dita' : 
                htmlURL.slice('/dev/'.length, htmlURL.length) + 'index.dita' ;
            if (file.indexOf('/build-') != -1) {
                file = file.replace('build-', '');
            }
            link.href= getEditURL("develop", file);
            document.querySelector('footer > .container').appendChild(link); 
        }
}());