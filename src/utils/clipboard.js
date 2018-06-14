
/**
 * Copies a specified string into the clipboard
 * I think it only works if it's called as part of an input event handler 'cause execCommand is mean
 */
export default function copyToClipboard(str){
  const ta = document.createElement('textarea');
  ta.value = str;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
};