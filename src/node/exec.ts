import util from 'util';
import { exec as exec_sync } from 'child_process';

const exec = util.promisify(exec_sync);
export default exec;
