window.parent.postMessage({
    type: 'internal-iframe-ready'
});

window.addEventListener('message', function(event) {
    if (!event.data) {
        return;
    }
    
    if (event.data.type === 'internal-iframe-pass-inside') {
        if (!event.data.loggedIn) {
            if (event.data.data) {
                document.querySelector('#gjs').innerHTML = event.data.data;
            }
            reloadScript('js/plugins.js');
            reloadScript('js/init.js');

            return;
        }

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
            storageManager: {
                type: 'local', // Type of storage, e.g., 'local' for localStorage
                autosave: true, // Enable auto save
                autoload: true, // Enable auto load
                stepsBeforeSave: 1 // Number of steps before triggering save
            },
            storageManager: false,
            canvas: {
                styles: [
                    'css/plugins.css',
                    'css/style.css',
                    'https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800&display=swap',
                    'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap',
                    'https://fonts.googleapis.com/css2?family=Kristi&display=swap'
                ],
                scripts: [
                    'js/jquery.js',
                    'js/plugins.js',
                    'js/init.js'
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