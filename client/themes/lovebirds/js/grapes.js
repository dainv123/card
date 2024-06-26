window.parent.postMessage({
    type: 'internal-iframe-ready'
});

window.addEventListener('message', function(event) {
    // document.addEventListener('DOMContentLoaded', () => {
    //     console.log(111);
    //   });
    //   const event1 = new Event('DOMContentLoaded');

    //   // Dispatch the event1
    //   setTimeout(() => {
    //     console.log(123);
    //     document.dispatchEvent(event1);
    //   }, 6000);

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
                    'css/bootstrap.css',
                    'css/timer.css',
                    'css/animations.css',
                    'css/component.css',
                    'css/slick.css',
                    'css/slick-theme.css',
                    'css/jquery.countdown.css',
                    'css/gridlayout.css',
                    'css/jquery.fancybox.css',
                    'css/materialadmin.css',
                    'css/font-awesome.css',
                    'css/animate.css',
                    'css/hover.css',
                ],
                scripts: [
                    'js/jquery-2.1.4.js',
                    'js/bootstrap.js',
                    'js/slick.js',
                    'js/easyResponsiveTabs.js',
                    'js/timer.js',
                    'js/jquery.final-countdown.js',
                    'js/jquery.dlmenu.js',
                    'js/jquery.countdown.js',
                    'js/jquery.masonarygrid.js',
                    'js/jquery.fancybox.js',
                    'js/modernizr.custom.js',
                    'js/pagetransitions.js',
                    'js/menu.js',
                    'js/wow.js',
                    'js/jquery.validate.min.js',
                    'js/formValidation.js',
                    'js/function.js',
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