// import React, { useRef, useState, useEffect } from 'react';
// import { Route, Redirect } from 'react-router-dom';
// import { connect } from 'react-redux';
// import { Icon, Avatar } from 'antd';
// import PropTypes from 'prop-types';
// import SelectThemeModal from '../../components/SelectThemeModal/SelectThemeModal';
// import config from '../../themes/dahlia/js/config';

// const ReaderPage = ({ loggedIn, user, ...rest }) => {
//   const iframeRef = useRef(null);

//   // const { id } = rest.match.params;

//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const showModal = () => {
//       setIsModalOpen(true);
//   };

//   const handleOk = () => {
//       setIsModalOpen(false);
//   };

//   const handleCancel = () => {
//       setIsModalOpen(false);
//   };

//   const logItemData = (item, parentKey = null) => {
//     if (typeof item === 'object') {
//       if (Array.isArray(item)) {
//           // If it's an array, loop through each element
//           for (let i = 0; i < item.length; i++) {
//               logItemData(item[i], `${parentKey}[${i}]`);
//           }
//       } else {
//           // If it's an object, loop through each key-value pair
//           for (const key in item) {
//               if (item.hasOwnProperty(key)) {
//                   const currentKey = parentKey ? `${parentKey}.${key}` : key;
//                   // const logKey = `#filling-${currentKey.replace(/\./g, '-').replace(/\[/g, '-').replace(/\]/g, '')}`;
//                   logItemData(item[key], currentKey);
//               }
//           }
//       }
//   } else {
//       // If it's a primitive type, log the data
//       const logKey = `filling-${parentKey.replace(/\./g, '-').replace(/\[/g, '-').replace(/\]/g, '')}`;
//       console.log(`${logKey}: ${item}`);
//       //     if (logKey === 'filling-photos-images-3-href') {
//       //   debugger
//       // }
      

//       const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
//       const parts = structuredClone(logKey.split(/-(\d+)/));

      
//       if (iframeDocument && iframeDocument.getElementById(logKey)) {
//         if (parts[2] == '-src') {
//           iframeDocument.getElementById(logKey).src = item;
//         } else if (parts[2] == '-href') {
//           iframeDocument.getElementById(logKey).href = item;
//         } else {
//           iframeDocument.getElementById(logKey).innerHTML = item;
//         }
//       } 
//       else if (/-\d+/.test(logKey)) {
//         const matchingChildNode = iframeDocument.getElementById( parts[0] + '-[INDEX]');

//         if (matchingChildNode) {
//           const clonedNode = matchingChildNode.cloneNode(true).outerHTML.replace(/\[INDEX\]/g, parts[1]);
//           matchingChildNode.insertAdjacentHTML('afterend', clonedNode);
//           iframeDocument.getElementById(parts[0] +'-' +parts[1]).style.display = '';
      
//           if (parts[2] == '-src') {
//             iframeDocument.getElementById(logKey).src = item;
//           } else if (parts[2] == '-href') {
//             iframeDocument.getElementById(logKey).href = item;
//           } else {
//             iframeDocument.getElementById(logKey).innerHTML = item;
//           }
//         }
//       }
//   }
// }
//  // useEffect(() => {
//   //   setTimeout(() => {
//   //     const iframe = iframeRef.current;
//   //     if (iframe) {
//   //       const dataToPass = {
//   //         title: 'Hello from the parent component!',
//   //         message: 'Some additional data.'
//   //       };

//   //       iframe.contentWindow.postMessage(dataToPass, '*');
//   //     }
//   //   }, 2000);
//   // }, []);

//   function reloadScript(scriptUrl = "./js/script.min.js") {
//     // Create a new script element
//     const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

//     var newScript = iframeDocument.createElement('script');
//     newScript.type = 'text/javascript';
//     newScript.src = scriptUrl;

//     // Find the old script element
//     var oldScript = iframeDocument.querySelector('script[src="' + scriptUrl + '"]');

//     // Replace the old script with the new one
//     if (oldScript) {
//         oldScript.parentNode.replaceChild(newScript, oldScript);
//     } else {
//         // If the script was not found, you can append the new script to the iframeDocument head
//         iframeDocument.head.appendChild(newScript);
//     }
// }

// function removeElements() {
//   const iframeDocument = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;

//   const elementsToRemove = iframeDocument.querySelectorAll('[id*="-"][style*="none"]');

//   elementsToRemove.forEach(element => element.remove());
// }


//   useEffect(() => {
//     setTimeout(() => {
//       if (iframeRef.current) {
//         logItemData(config, null);
//         removeElements();
//         setTimeout(() => {
//           reloadScript();
//         }, 1000);

        
//       }
//     }, 5000);
//   }, []);

//   return (
//     <>
//       {
//         loggedIn && (
//         <>              
//           <Avatar 
//             onClick={showModal}
//             size="medium" 
//             icon="setting" 
//             style={{
//               position: 'fixed',
//               zIndex: 2,
//               right: '30px',
//               top: '30px',
//             }}
//           /> 
//           <SelectThemeModal 
//             isModalOpen={isModalOpen} 
//             handleOk={handleOk} 
//             handleCancel={handleCancel}
//           ></SelectThemeModal>
//         </>
//         )
//       }
//       <iframe
//         src="../themes/dahlia/index.html"
//         width="100%"
//         height="100%"
//         frameBorder="0"
//         ref={iframeRef}
//         style={{
//           overflow: 'hidden',
//           overflowX: 'hidden',
//           overflowY: 'hidden',
//           height: '100%',
//           width: '100%',
//           position: 'absolute',
//           top: '0px',
//           left: '0px',
//           right: '0px',
//           bottom: '0px',
//         }}
//       />
//     </>
//   )
// }

// const mapStateToProps = state => {
//   return {
//     user: state.auth.user,
//     loggedIn: state.auth.loggedIn
//   };
// };

// ReaderPage.propTypes = {
//   loggedIn: PropTypes.bool.isRequired,
//   user: PropTypes.object
// };

// const ConnectedReaderPage = connect(mapStateToProps)(ReaderPage);

// export default ConnectedReaderPage;
