window.parent.postMessage({
    type: 'internal-iframe-ready'
});

window.addEventListener('message', function(event) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log(111);
      });
      const event1 = new Event('DOMContentLoaded');

      // Dispatch the event1
      setTimeout(() => {
        console.log(123);
        document.dispatchEvent(event1);
      }, 6000);

    if (!event.data) {
        return;
    }
    
    if (!event.data.loggedIn) {
        if (event.data.data) {
            document.querySelector('#gjs').innerHTML = event.data.data;
        }
        reloadScript('js/script.min.js');
        return;
    }

    if (event.data.type === 'internal-iframe-pass-inside') {
        const editor = grapesjs.init({
            container: '#gjs', 
            plugins: ['grapesjs-preset-webpage', 'grapesjs-blocks-basic'], 
            pluginsOpts: {
                'grapesjs-preset-webpage': {},
                'grapesjs-blocks-basic': {}
            },
            components: event.data.data || document.querySelector('#gjs').innerHTML,
            assetManager: {
                upload: false,
                autoAdd: true,
                dropzone: false,
            },
            storageManager: false,
            canvas: {
                styles: [
                    'css/style.min.css',
                    'css/custom.min.css',
                    // 'https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800&display=swap',
                    // 'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
                    // 'https://fonts.googleapis.com/css2?family=Kristi&display=swap'
                ],
                scripts: [
                    // 'js/jquery.js',
                    // 'js/plugins.js',
                    'js/script.min.js'
                ],
            }
        });

        const visibilityButton = editor.Panels.getButton('options', 'sw-visibility');

        if (visibilityButton) {
            visibilityButton.collection.add([{
                id: 'custom-button',
                className: 'fa fa-floppy-o',
                attributes: { title: 'Save to DB' },
                command(editor) {
                    window.parent.postMessage({
                        type: 'internal-iframe-back-outside',
                        data: editor.getHtml()
                    });
                }
            }]);
        }
    }
});

function reloadScript(scriptUrl, defer = false) {
    const newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = scriptUrl;
    newScript.defer = defer; 
  
    const oldScript = document.querySelector('script[src="' + scriptUrl + '"]');
  
    if (oldScript) {
      oldScript.parentNode.replaceChild(newScript, oldScript);
    } else {
      document.head.appendChild(newScript);
    }
}