function addIds(json) {
  let counter = 1;

  const addIdToNode = node => {
    node.id = `node_${counter++}`;

    if (node.child && node.child.length > 0) {
      node.child.forEach(addIdToNode);
    }
  };

  addIdToNode(json);
  return json;
}

function flattenJSON(json) {
  const result = {};

  const flattenNode = node => {
    const nodeObject = {
      id: node.id,
      ...(node.text &&
        !!node.text.trim() && {
          text: node.text
        }),
      ...(node.tag == 'img' &&
        node.attr &&
        node.attr.src && {
          src: node.attr.src
        }),
      ...(node.tag == 'a' &&
        node.attr &&
        node.attr.href &&
        node.attr.href[0] != '#' && {
          href: node.attr.href
        }),
      ...(node.tag == 'input' &&
        node.attr &&
        node.attr.placeholder && {
          placeholder: node.attr.placeholder
        }),
      ...(node.attr &&
        node.attr.style &&
        node.attr.style.length == 2 &&
        node.attr.style[0] == 'background-image:' && {
          backgroundImage: node.attr.style[1]
        })
    };

    if (node.tag === 'select' && node.child) {
      const options = node.child
        .filter(child => child.tag === 'option')
        .map(option => {
          const optionValue = Array.isArray(option.attr.value)
            ? option.attr.value.join(' ')
            : option.attr.value || '';

          return {
            text: option.child.find(child => child.node === 'text')?.text.trim() || '',
            value: optionValue.trim()
          };
        });

      result[nodeObject.id] = { default: options };
    } else {
      if (
        nodeObject.text ||
        nodeObject.src ||
        nodeObject.href ||
        nodeObject.placeholder ||
        nodeObject.backgroundImage
      ) {
        result[nodeObject.id] = {
          default:
            nodeObject.text ||
            nodeObject.src ||
            nodeObject.href ||
            nodeObject.placeholder ||
            nodeObject.backgroundImage
        };
      }

      if (node.child && node.child.length > 0) {
        node.child.forEach(child => flattenNode(child));
      }
    }
  };

  flattenNode(json);

  return result;
}

function remapAndModify(json, flattened) {
  const mapValueById = node => {
    if (flattened[node.id]) {
      if (node.tag == 'img' && node.attr) {
        node.attr.src = flattened[node.id].default || flattened[node.id];
      } else if (node.tag == 'a' && node.attr) {
        node.attr.href = flattened[node.id].default || flattened[node.id];
      } else if (node.tag == 'input' && node.attr) {
        node.attr.placeholder = flattened[node.id].default || flattened[node.id];
      } else if (
        node.attr &&
        node.attr.style &&
        node.attr.style.length == 2 &&
        node.attr.style[0] == 'background-image:'
      ) {
        node.attr.style[1] = flattened[node.id].default || flattened[node.id];
      } else if (node.tag == 'select') {
        node.child = [];
        if (flattened[node.id].length) {
          flattened[node.id].forEach(element => {
            node.child.push({
              node: 'element',
              tag: 'option',
              attr: {
                value: element.value
              },
              child: [
                {
                  node: 'text',
                  text: element.text
                }
              ]
            });
          });
        }
      } else {
        node.text = flattened[node.id].default || flattened[node.id];
      }
    }

    if (node.child && node.child.length > 0) {
      node.child.forEach(mapValueById);
    }
  };

  mapValueById(json);

  return json;
}

function reloadScript(scriptUrl = './js/script.min.js') {
  var newScript = document.createElement('script');
  newScript.type = 'text/javascript';
  newScript.src = scriptUrl;

  var oldScript = document.querySelector('script[src="' + scriptUrl + '"]');

  if (oldScript) {
    oldScript.parentNode.replaceChild(newScript, oldScript);
  } else {
    document.head.appendChild(newScript);
  }
}

function quickView(config) {
  const json = remapAndModify(input, config);
  document.getElementById('content').innerHTML = json2html(json);
  reloadScript('./js/pagetransitions.js');
  reloadScript('./js/easyResponsiveTabs.js');
  reloadScript('./js/menu.js');
  reloadScript('./js/wow.js');
  reloadScript('./js/jquery.validate.min.js');
  reloadScript('./js/formValidation.js');
  reloadScript('./js/function.js');
  setTimeout(() => initSlick(), 800);
}

var content = document.getElementById('content').innerHTML;
var input = html2json(content);
var inputWithIds = addIds(input);
var properties = flattenJSON(inputWithIds);

window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'internal-iframe-pass-inside') {
    if (JSON.stringify(event.data.data) == '{}' || event.data.data == '{}') {
      quickView(properties);
    } else {
      quickView(typeof event.data.data === 'string' ? JSON.parse(event.data.data) : event.data.data);
    }
  }
});

window.parent.postMessage({
  type: 'internal-iframe-ready',
  data: properties
});