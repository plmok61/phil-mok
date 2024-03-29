import { Pattern } from '../types';

function convertTextToMatrix(text: string): Pattern {
  return text.split('\n')
    .map((r) => r.trim())
    .filter((r) => r !== '')
    .map((row) => row.split('').map((cell) => (cell === 'O' ? 1 : 0)));
}

export default convertTextToMatrix;
