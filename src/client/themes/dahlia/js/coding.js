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
  let result = {};

  const flattenNode = (node) => {
    const nodeObject = {
      id: node.id,
      ...(node.text && !!node.text.trim() && {
        text: node.text
      }),
      ...(node.tag == 'img' && !!node.attr.src && {
        src: node.attr.src
      }),
      ...(node.tag == 'a' &&
        !!node.attr.href &&
        node.attr.href[0] != '#' && {
        href: node.attr.href
      }),
      ...(node.tag == 'input' && !!node.attr.placeholder && {
        placeholder: node.attr.placeholder
      })
    };

    if (node.tag === "select" && node.child) {
      const options = node.child
        .filter((child) => child.tag === "option")
        .map((option) => {
          const optionValue = Array.isArray(option.attr.value)
            ? option.attr.value.join(" ")
            : option.attr.value || "";

          return {
            text: option.child.find((child) => child.node === "text")?.text.trim() || "",
            value: optionValue.trim(),
          };
        });

      result[nodeObject.id] = {default: options };
    } else {
      if (nodeObject.text || nodeObject.src || nodeObject.href || nodeObject.placeholder) {
        result[nodeObject.id] = {default: nodeObject.text || nodeObject.src || nodeObject.href || nodeObject.placeholder };
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
      if (node.tag == 'img') {
        node.attr.src = flattened[node.id];
      } else if (node.tag == 'a') {
        node.attr.href = flattened[node.id];
      } else if (node.tag == 'input') {
        node.attr.placeholder = flattened[node.id];
      } else if (node.tag == 'select') {
        node.child = [];
        if (flattened[node.id].length) {
          flattened[node.id].forEach(element => {
            node.child.push({
              "node": "element",
              "tag": "option",
              "attr": {
                "value": element.value
              },
              "child": [
                {
                  "node": "text",
                  "text": element.text
                }
              ]
            });
          });
        }        
      } else {
        node.text = flattened[node.id];
      }
    }

    if (node.child && node.child.length > 0) {
      node.child.forEach(mapValueById);
    }
  };

  mapValueById(json);

  return json;
}


function reloadScript(scriptUrl = "./js/script.min.js") {
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


function saveEditor() {
  document.getElementById("content").innerHTML = json2html(remapAndModify(input, editor.getValue()));
  
  reloadScript();

  window.document.dispatchEvent(new Event("DOMContentLoaded", {
    bubbles: true,
    cancelable: true
  })); 
}

var input = html2json(document.getElementById("content").innerHTML);
var inputWithIds = addIds(input);
var properties = flattenJSON(inputWithIds);
var config = {
  use_name_attributes: false,
  theme: 'bootstrap4',
  disable_edit_json: true,
  disable_properties: true,
  disable_collapse: true,
  schema: {
    'properties': properties
  }
}

var editor = new JSONEditor(document.querySelector('#editor'), config)

