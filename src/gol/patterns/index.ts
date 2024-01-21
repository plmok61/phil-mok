import single from './single';
import blinker from './blinker';
import fireship from './fireship';
import glider from './glider';
import gosperGliderGun from './gosperGlideerGun';
import pulsar from './pulsar';
import vampire from './vampire';
import { Pattern } from '../../types';

export default {
  single,
  blinker,
  fireship,
  glider,
  gosperGliderGun,
  pulsar,
  vampire,
} as Record<string, Pattern>;
