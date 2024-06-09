function scrollToClass(className) {
  const highlightedElements = document.querySelectorAll('.highlight');

  highlightedElements.forEach(element => {
    element.classList.remove('highlight');
  });

  const element = document.querySelector(`.${className}`);

  if (element) {
    element.classList.add('highlight');
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

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

      result[nodeObject.id] = options;
    } else {
      if (
        nodeObject.text ||
        nodeObject.src ||
        nodeObject.href ||
        nodeObject.placeholder ||
        nodeObject.backgroundImage
      ) {
        result[nodeObject.id] = nodeObject.text ||
        nodeObject.src ||
        nodeObject.href ||
        nodeObject.placeholder ||
        nodeObject.backgroundImage;
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
  const mapValueById = (node, parent) => {
    if (flattened[node.id]) {
      if (node.id == 'node_61') {
        node.tag = 'span';
        node.node = 'element'
        console.log(1);
      }
      // console.log("node", node.attr.class);
      if (node.tag == 'img' && node.attr) {
        node.attr.src = flattened[node.id];
      } else if (node.tag == 'a' && node.attr) {
        node.attr.href = flattened[node.id];
      } else if (node.tag == 'input' && node.attr) {
        node.attr.placeholder = flattened[node.id];
      } else if (
        node.attr &&
        node.attr.style &&
        node.attr.style.length == 2 &&
        node.attr.style[0] == 'background-image:'
      ) {
        node.attr.style[1] = flattened[node.id];
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
        node.text = flattened[node.id];
      }

      if (node.node === 'text' && parent && node.id) {
        if (!parent.attr) {
          parent.attr = {};
        }
        if (!parent.attr.class) {
          parent.attr.class = '';
        } 

        parent.attr.class += (parent.attr.class ? ' ' : '') + node.id;
      }

      if (node.node === 'text' && parent && node.id) {
        if (!parent.attr) {
          parent.attr = {};
        }
        if (!parent.attr.class) {
          parent.attr.class = '';
        } 

        parent.attr.class += (parent.attr.class ? ' ' : '') + node.id;
      }

      // map class
      if (node.attr && node.attr.class) {
        node.attr.class += node.attr.class + ',' + node.id;
      } else {
        node.attr = { class: node.id };
      }

      // console.log("node.id", node);
    }

    if (node.child && node.child.length > 0) {
      node.child.forEach(child => mapValueById(child, node));
    }
  };

  mapValueById(json);
console.log(json);
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
  console.log(input, config);
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
  if (event.data && event.data.type === 'scroll-to-element') {
    scrollToClass(event.data.data)
  }
});

window.parent.postMessage({
  type: 'internal-iframe-ready',
  data: properties
});
