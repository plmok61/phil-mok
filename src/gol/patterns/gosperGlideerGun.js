import convertTextToMatrix from '../../utils/convertTextToMatrix';

const gosperGliderGunText = `........................O...........\n
......................O.O...........\n
............OO......OO............OO\n
...........O...O....OO............OO\n
OO........O.....O...OO..............\n
OO........O...O.OO....O.O...........\n
..........O.....O.......O...........\n
...........O...O....................\n
............OO......................\n`;

const gosperGliderGun = convertTextToMatrix(gosperGliderGunText);

export default gosperGliderGun;
